/**
 * Audio Companion / Coach tab sections — ported from web `src/components/screens/AudioCompanionScreen.tsx`
 * and `src/components/SwitchAudioModal.tsx`. Pure presentational sections: routing card, voice
 * profile, Spotify hub, audio feed preview, and the "Ask Marcus" AI coach chat.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/text';
import { Card, SectionHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Pill } from '../ui/pill';
import { Icon } from '../ui/icon';
import { SegmentedControl, ToggleRow } from '../ui/toggle';
import { ListGroup, ListRow } from '../ui/list';
import type { AudioSettings, SpotifyPlaylist } from '../../types';
import type { AudioDevice } from '../sheets/switch-audio-sheet';
import { SPOTIFY_PLAYLISTS } from '../../data/mockData';
import { askCoach } from '../../services/coach';

// ── Routing card (web: "Live Sound Output" / "Studio Routing Active") ──────────

export function RoutingCard({
  audio,
  device,
  onSwitch,
}: {
  audio: AudioSettings;
  device: AudioDevice;
  onSwitch: () => void;
}) {
  const connected = audio.device !== 'Phone Speaker';

  return (
    <Card>
      <View style={s.rowBetween}>
        <AppText variant="caption" tone="secondary">
          {connected ? 'Studio Routing Active' : 'Live Sound Output'}
        </AppText>
        <Pill label={connected ? 'Live' : 'Standby'} tone={connected ? 'volt' : 'gray'} />
      </View>
      <View style={s.routingRow}>
        <View style={s.deviceIcon}>
          <Icon name="headphones" size={20} color={colors.primary} />
        </View>
        <View style={s.flex1}>
          <AppText variant="label">{device.name}</AppText>
          <AppText variant="caption" tone="secondary">
            Ultra-low latency audio buffer ({audio.latencyMs}ms)
          </AppText>
        </View>
        <Button label="SWITCH" variant="secondary" onPress={onSwitch} />
      </View>
    </Card>
  );
}

// ── Voice profile card (web: "Active Voice Profile" / "Sync: Real-Time") ───────

export function VoiceProfileCard({
  audio,
  onIntensity,
  onToggle,
  duckingPercent,
  onDuckingChange,
}: {
  audio: AudioSettings;
  onIntensity: (v: AudioSettings['cueIntensity']) => void;
  onToggle: (key: keyof AudioSettings['triggers'], value: boolean) => void;
  duckingPercent: number;
  onDuckingChange: (v: number) => void;
}) {
  const duckingDb = -Math.round(duckingPercent * 0.28);

  return (
    <Card>
      <View style={s.rowBetween}>
        <AppText variant="caption" tone="secondary">
          Active Voice Profile
        </AppText>
        <View style={s.syncPill}>
          <View style={s.liveDot} />
          <AppText variant="caption" style={s.syncText}>
            Sync: Real-Time
          </AppText>
        </View>
      </View>

      {/* Coach identity */}
      <View style={s.identityRow}>
        <View style={s.avatar}>
          <MaterialIcons name="record-voice-over" size={28} color={colors.primary} />
        </View>
        <View style={s.flex1}>
          <View style={s.nameRow}>
            <AppText variant="body" style={s.bold}>
              {audio.coachName}
            </AppText>
            <MaterialIcons name="verified" size={16} color={colors.primary} />
          </View>
          <AppText variant="caption" tone="secondary">
            {audio.coachRegion} • {audio.coachDescription}
          </AppText>
        </View>
        <Pill label={audio.cueIntensity.toUpperCase()} tone="volt" />
      </View>

      <View style={s.divider} />

      {/* Cue intensity */}
      <AppText variant="label" style={s.blockLabel}>
        Cue Intensity
      </AppText>
      <SegmentedControl
        options={[
          { value: 'minimal', label: 'Minimal\nMilestones' },
          { value: 'balanced', label: 'Balanced\nTempo sync' },
          { value: 'high', label: 'High\nCadence lock' },
        ]}
        value={audio.cueIntensity}
        onChange={(v) => onIntensity(v)}
      />

      <View style={s.divider} />

      {/* Trigger permissions */}
      <AppText variant="label" style={s.blockLabel}>
        Voice Trigger Permissions
      </AppText>
      <View style={s.triggerRow}>
        <MaterialIcons name="timer-10" size={20} color={colors.primary} />
        <View style={s.flex1}>
          <AppText variant="label">Countdown Timer</AppText>
          <AppText variant="caption" tone="muted">
            3-2-1 GO before sets
          </AppText>
        </View>
        <ToggleRow
          label=""
          value={audio.triggers.countdown}
          onValueChange={(v) => onToggle('countdown', v)}
        />
      </View>
      <View style={s.triggerRow}>
        <MaterialIcons name="accessibility-new" size={20} color={colors.secondary} />
        <View style={s.flex1}>
          <AppText variant="label">Form Correction</AppText>
          <AppText variant="caption" tone="muted">
            Posture analysis triggers
          </AppText>
        </View>
        <ToggleRow
          label=""
          value={audio.triggers.formCorrection}
          onValueChange={(v) => onToggle('formCorrection', v)}
        />
      </View>
      <View style={s.triggerRow}>
        <MaterialIcons name="favorite" size={20} color="#ffb4ab" />
        <View style={s.flex1}>
          <AppText variant="label">HR Zone Alerts</AppText>
          <AppText variant="caption" tone="muted">
            Intensity zone shifts
          </AppText>
        </View>
        <ToggleRow
          label=""
          value={audio.triggers.hrAlerts}
          onValueChange={(v) => onToggle('hrAlerts', v)}
        />
      </View>
      <View style={s.triggerRow}>
        <MaterialIcons name="local-fire-department" size={20} color={colors.primary} />
        <View style={s.flex1}>
          <AppText variant="label">Finisher Hype</AppText>
          <AppText variant="caption" tone="muted">
            All-out finish blocks
          </AppText>
        </View>
        <ToggleRow
          label=""
          value={audio.triggers.finisherHype}
          onValueChange={(v) => onToggle('finisherHype', v)}
        />
      </View>

      <View style={s.divider} />

      {/* Spotify ducking */}
      <View style={s.rowBetween}>
        <AppText variant="label">Spotify Ducking Ratio</AppText>
        <AppText variant="caption" tone="primary" style={s.bold}>
          {duckingDb} dB ({duckingPercent}%)
        </AppText>
      </View>
      <AppText variant="caption" tone="muted" style={s.captionBlock}>
        Smoothly lowers track level when Marcus speaks cues.
      </AppText>
      <DuckingSlider value={duckingPercent} onChange={onDuckingChange} />
    </Card>
  );
}

/** Lightweight custom slider (no external deps) for the ducking ratio 10–90. */
function DuckingSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [width, setWidth] = useState(0);
  const lastHaptic = useRef(0);

  const clamp = (v: number) => Math.max(10, Math.min(90, Math.round(v)));

  const handleLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handleTouch = (locationX: number) => {
    if (width <= 0) return;
    const next = clamp((locationX / width) * 100);
    if (Math.abs(next - lastHaptic.current) >= 5) {
      lastHaptic.current = next;
      Haptics.selectionAsync().catch(() => {});
    }
    onChange(next);
  };

  const pct = (value - 10) / 80;
  const fillPct = Math.max(0, Math.min(100, pct * 100));

  return (
    <View
      style={s.sliderTrack}
      onLayout={handleLayout}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(e) => handleTouch(e.nativeEvent.locationX)}
      onResponderMove={(e) => handleTouch(e.nativeEvent.locationX)}
      accessibilityRole="adjustable"
      accessibilityLabel={`Spotify ducking ratio, ${value} percent`}
      accessibilityValue={{ min: 10, max: 90, now: value }}
    >
      <View style={[s.sliderFill, { width: `${fillPct}%` as `${number}%` }]} />
      <View style={[s.sliderThumb, { left: `${fillPct}%` as `${number}%` }]} />
    </View>
  );
}

// ── Spotify integration hub (web: "Spotify Integration Hub" / "Premium Active") ─

export function PlaylistsCard({
  activePlaylistId,
  onSelect,
}: {
  activePlaylistId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Card padded={false}>
      <View style={s.cardHeader}>
        <View style={s.rowBetween}>
          <AppText variant="label">Spotify Integration Hub</AppText>
          <View style={s.premiumRow}>
            <MaterialIcons name="check-circle" size={14} color="#1DB954" />
            <AppText variant="caption" style={s.premiumText}>
              Premium Active
            </AppText>
          </View>
        </View>
        <AppText variant="caption" tone="muted">
          Dynamic Cadence Match Playlists
        </AppText>
      </View>
      <ListGroup>
        {SPOTIFY_PLAYLISTS.map((p: SpotifyPlaylist) => (
          <ListRow
            key={p.id}
            icon={p.id === activePlaylistId ? 'volume-up' : 'graphic-eq'}
            iconColor={p.id === activePlaylistId ? colors.primary : colors.textTertiary}
            title={p.title}
            subtitle={`${p.bpm} BPM • ${p.genre}`}
            right={<Pill label={p.tag} tone={p.id === activePlaylistId ? 'volt' : 'gray'} />}
            onPress={() => onSelect(p.id)}
          />
        ))}
      </ListGroup>
    </Card>
  );
}

// ── Audio feed preview (web: "Audio Feed Preview" + DuckAudioPreview) ─────────

const IDLE_BARS = [12, 20, 8, 28, 16, 32, 12, 24, 8, 20, 28, 16, 8, 24, 16, 32, 12, 20];
const QUOTE = 'Lock your core. Final three reps, let’s smash through the plateau!';

export function AudioPreviewCard({
  playing,
  duckingPercent,
  onToggle,
}: {
  playing: boolean;
  duckingPercent: number;
  onToggle: () => void;
}) {
  const [bars, setBars] = useState<number[]>(IDLE_BARS);
  const mounted = useRef(true);
  const duckingDb = -Math.round(duckingPercent * 0.28);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const id = setInterval(() => {
      if (mounted.current) setBars(IDLE_BARS.map(() => Math.floor(Math.random() * 28) + 6));
    }, 120);
    return () => clearInterval(id);
  }, [playing]);

  const displayedBars = playing ? bars : IDLE_BARS;

  return (
    <Card>
      <AppText variant="label">Audio Feed Preview</AppText>
      <View style={s.waveform}>
        {displayedBars.map((h, i) => (
          <View
            key={i}
            style={[s.waveBar, { height: h, backgroundColor: playing ? colors.primary : colors.textTertiary }]}
          />
        ))}
      </View>
      <View style={s.previewMeta}>
        <MaterialIcons name="format-quote" size={16} color={colors.textTertiary} />
        <AppText variant="caption" tone="secondary" style={s.flex1}>
          “{QUOTE}”
        </AppText>
      </View>
      <AppText variant="caption" tone={playing ? 'primary' : 'muted'}>
        {playing ? `Ducking ${duckingDb}dB • Marcus Voice Active` : 'Ready to test'}
      </AppText>
      <Button
        label={playing ? 'STOP AUDIO SIMULATION' : 'TEST MARCUS + DUCKED SPOTIFY MIX'}
        variant={playing ? 'secondary' : 'primary'}
        onPress={onToggle}
        style={s.previewButton}
      />
    </Card>
  );
}

// ── Ask Marcus chat (new — no direct web equivalent) ──────────────────────────

type ChatMessage = {
  id: string;
  role: 'user' | 'coach';
  text: string;
  source?: 'gemini' | 'fallback';
};

const QUICK_PROMPTS = [
  'Adjust music volume for sprints',
  'Explain my cue settings',
  'Best playlist for 160 BPM',
];

let chatIdCounter = 0;
const nextChatId = () => `msg-${Date.now()}-${(chatIdCounter += 1)}`;

export function AskMarcusCard({ audio }: { audio: AudioSettings }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [awaiting, setAwaiting] = useState(false);

  const activePlaylistTitle =
    SPOTIFY_PLAYLISTS.find((p: SpotifyPlaylist) => p.id === audio.activePlaylistId)?.title ?? '—';

  const send = async (raw?: string) => {
    const question = (raw ?? input).trim();
    if (!question || awaiting) return;
    setInput('');
    setAwaiting(true);
    setMessages((prev) => [...prev, { id: nextChatId(), role: 'user', text: question }]);
    try {
      const reply = await askCoach({
        question,
        context: `Cue intensity: ${audio.cueIntensity}. Ducked music by ${audio.duckingRatio}%. Active playlist: ${activePlaylistTitle}.`,
      });
      setMessages((prev) => [...prev, { id: nextChatId(), role: 'coach', text: reply.text, source: reply.source }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextChatId(), role: 'coach', text: 'I could not process that request. Try again.', source: 'fallback' },
      ]);
    } finally {
      setAwaiting(false);
    }
  };

  return (
    <Card>
      <View style={s.rowBetween}>
        <AppText variant="label">Ask Marcus</AppText>
        <Pill label="AI VOICE COACH" tone="volt" />
      </View>
      <AppText variant="caption" tone="muted">
        Get advice on music levels, cues, playlists, and pacing — powered by your Gemini key.
      </AppText>

      {messages.map((m) => (
        <View key={m.id} style={[s.bubble, m.role === 'user' ? s.bubbleUser : s.bubbleCoach]}>
          <AppText variant={m.role === 'user' ? 'label' : 'caption'} tone={m.role === 'user' ? 'default' : 'secondary'}>
            {m.text}
          </AppText>
          {m.role === 'coach' && m.source ? (
            <Pill label={m.source === 'gemini' ? 'GEMINI' : 'OFFLINE'} tone={m.source === 'gemini' ? 'volt' : 'gray'} />
          ) : null}
        </View>
      ))}

      {awaiting ? (
        <View style={s.bubble}>
          <AppText variant="caption" tone="muted">
            Marcus is analyzing your request…
          </AppText>
        </View>
      ) : null}

      <View style={s.promptRow}>
        {QUICK_PROMPTS.map((q) => (
          <View key={q} style={s.promptChip}>
            <AppText variant="caption" tone="primary" onPress={() => send(q)}>
              {q}
            </AppText>
          </View>
        ))}
      </View>

      <View style={s.inputRow}>
        <TextInput
          style={s.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about BPM, cues, or volume…"
          placeholderTextColor={colors.textTertiary}
          editable={!awaiting}
          onSubmitEditing={() => send()}
          accessibilityLabel="Message Marcus"
        />
        <Button label="SEND" onPress={() => send()} disabled={!input.trim() || awaiting} />
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  flex1: { flex: 1 },
  bold: { fontWeight: '600' as const },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.md },
  blockLabel: { marginBottom: spacing.xs },

  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },

  syncPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  syncText: { color: colors.primary },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  triggerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  captionBlock: { marginBottom: spacing.xs },

  sliderTrack: {
    height: 28,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  sliderThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.bg,
    borderWidth: 2,
    borderColor: colors.primary,
    marginLeft: -9,
  },

  cardHeader: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm, gap: 2 },
  premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  premiumText: { color: '#1DB954', fontWeight: '600' as const },

  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 36,
    marginVertical: spacing.sm,
    gap: 3,
  },
  waveBar: { flex: 1, borderRadius: 2 },
  previewMeta: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, marginBottom: spacing.xs },
  previewButton: { marginTop: spacing.sm },

  bubble: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.sm,
    marginTop: spacing.sm,
    gap: 4,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  bubbleUser: { backgroundColor: colors.primaryContainer, alignSelf: 'flex-end' },
  bubbleCoach: { backgroundColor: colors.bg },
  promptRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  promptChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: 15,
    backgroundColor: colors.bg,
  },
});
