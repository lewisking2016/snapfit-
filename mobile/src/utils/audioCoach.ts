/**
 * Native audio-coach cue engine.
 *
 * Port of the web prototype's `src/utils/audioCoach.ts`, rebuilt on the Expo
 * SDK 57 modules verified in `mobile/node_modules`:
 *  - Web SpeechSynthesis    -> `expo-speech` (`Speech.speak/stop`)
 *  - Web Audio kick synth   -> `expo-haptics` impact/notification feedback
 *  - Web Audio gain node    -> the `volume` setter on `expo-audio`'s
 *    `AudioPlayer` (confirmed in `AudioModule.types.d.ts`), reached through
 *    `registerMusicVolumeSetter` because SnapFit streams music from the
 *    external Spotify app — there is no in-app player to duck by default.
 *
 * The engine never fabricates playback: without a registered music volume
 * setter the ducking API still tracks and returns the *effective* level, it
 * just has nothing to apply it to (see `registerMusicVolumeSetter`).
 */

import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

export type CueIntensity = 'minimal' | 'balanced' | 'high';

export type CueTrigger = 'countdown' | 'formCorrection' | 'hrAlerts' | 'finisherHype';

export type CueType = CueTrigger | 'finish';

export interface AudioCoachOptions {
  intensity: CueIntensity;
  triggers: Record<CueTrigger, boolean>;
  /** 10–90. Share of the music level removed while a cue is speaking. */
  duckingRatio: number;
  /** BCP-47 code. iOS matches a British voice when one is installed. */
  voiceLanguage?: string;
}

/** Low-priority cues are dropped entirely at `minimal` intensity. */
const LOW_PRIORITY_CUES: ReadonlySet<CueType> = new Set<CueType>(['formCorrection', 'hrAlerts']);

/** Minimum gap between spoken cues so sentences never overlap. */
const MIN_SPEAK_INTERVAL_MS = 3500;

let lastSpokeAt = 0;
let currentDuckingRatio = 0.65;
let musicVolume = 1;
let ducked = false;
let musicVolumeSetter: ((volume: number) => void) | null = null;

const timers = new Set<ReturnType<typeof setTimeout>>();

/* -------------------------------------------------------------------------- */
/* Haptics                                                                     */
/* -------------------------------------------------------------------------- */

/** Haptics reject on devices without an engine (simulators) — never throw. */
function impact(style: Haptics.ImpactFeedbackStyle) {
  Haptics.impactAsync(style).catch(() => {});
}

function notification(type: Haptics.NotificationFeedbackType) {
  Haptics.notificationAsync(type).catch(() => {});
}

/* -------------------------------------------------------------------------- */
/* Music volume / ducking                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Wire the engine to a real audio player. Pass the player itself — the
 * `expo-audio` `AudioPlayer.volume` setter is confirmed in the type defs — or
 * any function that applies a 0–1 level. Pass `null` to detach.
 */
export function registerMusicVolumeSetter(
  setter: ((volume: number) => void) | null,
): void {
  musicVolumeSetter = setter;
  if (setter) setter(effectiveVolume());
}

function effectiveVolume(): number {
  return ducked ? musicVolume * (1 - currentDuckingRatio) : musicVolume;
}

/** Sets the base music level (0–1). Returns the effective (possibly ducked) level. */
export function setMusicVolume(volume: number): number {
  musicVolume = Math.min(1, Math.max(0, volume));
  musicVolumeSetter?.(effectiveVolume());
  return effectiveVolume();
}

/** Current base music level (0–1), regardless of ducking. */
export function getMusicVolume(): number {
  return musicVolume;
}

/**
 * Ducks (or restores) the music. `active: true` lowers the level by the
 * configured ducking ratio. Returns the effective level so callers can show
 * it in the UI even when no player is registered (external Spotify playback).
 */
export function duckMusic(active: boolean, ratio?: number): number {
  if (typeof ratio === 'number') {
    currentDuckingRatio = Math.min(0.9, Math.max(0.1, ratio / 100));
  }
  ducked = active;
  musicVolumeSetter?.(effectiveVolume());
  return effectiveVolume();
}

/** Effective music level right now (0–1). */
export function getEffectiveMusicVolume(): number {
  return effectiveVolume();
}

/* -------------------------------------------------------------------------- */
/* Speech                                                                      */
/* -------------------------------------------------------------------------- */

function speechOptions(options: AudioCoachOptions): Speech.SpeechOptions {
  return {
    language: options.voiceLanguage ?? 'en-GB',
    rate: 1.05,
    pitch: 0.95,
  };
}

function speakNow(text: string, options: AudioCoachOptions) {
  try {
    Speech.speak(text, speechOptions(options));
    lastSpokeAt = Date.now();
  } catch {
    // TTS unavailable on this device — haptics already carry the cue.
  }
}

function trackTimer(id: ReturnType<typeof setTimeout>) {
  timers.add(id);
  return id;
}

/* -------------------------------------------------------------------------- */
/* Public cue surface                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Speaks a coaching cue when the user's settings allow it.
 * Returns `true` when the cue was actually spoken.
 *
 * Gating order: trigger toggle -> intensity priority -> throttle.
 * Every cue also lands a haptic tick so the feedback survives muted audio.
 */
export function speakCue(
  cue: CueType,
  text: string,
  options: AudioCoachOptions,
): boolean {
  const trigger: CueTrigger = cue === 'finish' ? 'finisherHype' : cue;

  // Light haptic always fires so the athlete still feels the cue.
  if (cue === 'finish') impact(Haptics.ImpactFeedbackStyle.Heavy);
  else impact(Haptics.ImpactFeedbackStyle.Light);

  if (!options.triggers[trigger]) return false;
  if (options.intensity === 'minimal' && LOW_PRIORITY_CUES.has(cue)) return false;

  const now = Date.now();
  if (now - lastSpokeAt < MIN_SPEAK_INTERVAL_MS) return false;

  currentDuckingRatio = Math.min(0.9, Math.max(0.1, options.duckingRatio / 100));
  speakNow(text, options);
  return true;
}

/**
 * One second of a rep countdown. Haptic tick every call; the spoken number
 * follows the `countdown` trigger and is suppressed at `minimal` intensity,
 * except the `0` → "Go!" milestone which always speaks when enabled.
 */
export function playCountdownTick(remaining: number, options: AudioCoachOptions): boolean {
  Haptics.selectionAsync().catch(() => {});

  if (!options.triggers.countdown) return false;
  if (remaining > 0 && options.intensity === 'minimal') return false;

  const now = Date.now();
  if (now - lastSpokeAt < 900) return false;

  speakNow(remaining > 0 ? String(remaining) : 'Go!', options);
  return true;
}

/**
 * Runs a 3-2-1-Go countdown on a one-second cadence. Returns a cancel fn.
 */
export function startCountdown(options: AudioCoachOptions, onEnd?: () => void): () => void {
  const steps = [3, 2, 1, 0];
  steps.forEach((step, index) => {
    trackTimer(
      setTimeout(() => {
        playCountdownTick(step, options);
        if (index === steps.length - 1) onEnd?.();
      }, index * 1000),
    );
  });
  return stopAllCues;
}

/** Finisher celebration: heavy haptic + success notification + hype line. */
export function celebrate(options: AudioCoachOptions, text?: string): boolean {
  impact(Haptics.ImpactFeedbackStyle.Heavy);
  notification(Haptics.NotificationFeedbackType.Success);

  if (!options.triggers.finisherHype) return false;

  const now = Date.now();
  if (now - lastSpokeAt < MIN_SPEAK_INTERVAL_MS) return false;

  currentDuckingRatio = Math.min(0.9, Math.max(0.1, options.duckingRatio / 100));
  speakNow(text ?? 'Great job. That is a strong session.', options);
  return true;
}

/**
 * Speaks the sample preview cue while ducking the music by the configured
 * ratio, then restores the level. `onEnd(false)` fires when the cue finishes
 * (or immediately if the trigger is disabled). Returns a cancel function.
 */
export function startDuckedPreview(
  text: string,
  options: AudioCoachOptions,
  onEnd?: (active: boolean) => void,
): () => void {
  currentDuckingRatio = Math.min(0.9, Math.max(0.1, options.duckingRatio / 100));
  duckMusic(true);

  let settled = false;
  const finish = (spoken: boolean) => {
    if (settled) return;
    settled = true;
    duckMusic(false);
    lastSpokeAt = 0; // previews are user-initiated — never throttled
    onEnd?.(spoken);
  };

  try {
    Speech.speak(text, {
      ...speechOptions(options),
      onDone: () => finish(true),
      onStopped: () => finish(true),
      onError: () => finish(true),
    });
    lastSpokeAt = Date.now();
  } catch {
    finish(true);
  }

  return () => {
    // Interrupting fires `onStopped`, so silence the callback first.
    try {
      void Speech.stop();
    } catch {
      // Speech engine already torn down.
    }
    finish(false);
  };
}

/** Stops speech, cancels every pending timer, and restores the music level. */
export function stopAllCues(): void {
  timers.forEach((id) => clearTimeout(id));
  timers.clear();
  duckMusic(false);
  try {
    void Speech.stop();
  } catch {
    // Speech engine already torn down.
  }
}
