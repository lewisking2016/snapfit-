import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/components/ui/screen';
import { RouteHeader } from '@/components/ui/header';
import { Sheet } from '@/components/ui/sheet';
import { AppText } from '@/components/ui/text';
import { TelemetryHUD } from '@/components/screens/live-tracker-hud';
import { RestCard } from '@/components/screens/live-tracker-rest';
import { MovementCard } from '@/components/screens/live-tracker-movement';
import { AudioMiniBar, SessionControls } from '@/components/screens/live-tracker-audio-bar';
import { EndSessionSheet, WorkoutSummarySheet } from '@/components/screens/live-tracker-summary';
import { useWorkoutStore } from '@/store/workout-store';
import { useSettingsStore } from '@/store/settings-store';
import { FEATURED_ROUTINE } from '@/data/mockData';
import { celebrate, speakCue, stopAllCues } from '@/utils/audioCoach';
import { spacing } from '@/theme';

const REST_SECONDS = 45;
const HYPE_QUOTES = [
  "Marcus: 'Final three reps, let's smash through the plateau!'",
  "Marcus: 'Keep that shoulder packed, don't let it drift!'",
  "Marcus: 'Drive through the heel, smooth tempo!'",
];

/** Parse the per-exercise set count out of the detail string ("4 sets ..."). */
function parseSetCount(detail: string): number {
  const match = /(\d+)\s*sets?/i.exec(detail);
  const parsed = match ? Number.parseInt(match[1], 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 4;
}

/** Deterministic-ish PRNG so the simulated HR walk never repeats a pattern. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatTimer(totalSecs: number): string {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function TrackerScreen() {
  const routine = useWorkoutStore((s) => s.activeRoutine) ?? FEATURED_ROUTINE;
  const activeWeightKg = useWorkoutStore((s) => s.activeWeightKg);
  const isWorkoutActive = useWorkoutStore((s) => s.isWorkoutActive);
  const { startWorkout, setWeight, finishWorkout, abandonWorkout } = useWorkoutStore();
  const audio = useSettingsStore((s) => s.audio);

  const coachOptions = useMemo(
    () => ({
      intensity: audio.cueIntensity,
      triggers: audio.triggers,
      duckingRatio: audio.duckingRatio,
    }),
    [audio.cueIntensity, audio.triggers, audio.duckingRatio],
  );

  // In-flight session state is route-local — the store only ever receives
  // start/weight/finish/abandon (its persist partialize drops live state).
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(1);
  const [completedSets, setCompletedSets] = useState(0);
  const [repsDone, setRepsDone] = useState(routine.sets[0]?.repsTarget || 10);
  const [weightKg, setWeightKg] = useState(activeWeightKg);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(REST_SECONDS);
  const [heartRate, setHeartRate] = useState(144);
  const [caloriesBurned, setCaloriesBurned] = useState(48);
  const [voiceBanner, setVoiceBanner] = useState("Marcus: 'Lock your core on the floor press!'");
  const [isPaused, setIsPaused] = useState(false);
  const [showFinishSheet, setShowFinishSheet] = useState(false);
  const [showEndSheet, setShowEndSheet] = useState(false);

  const randRef = useRef(mulberry32(20261010));
  const optionsRef = useRef(coachOptions);
  useEffect(() => {
    optionsRef.current = coachOptions;
  }, [coachOptions]);

  const currentExercise = routine.sets[currentExerciseIndex] ?? routine.sets[0];
  const totalMovements = routine.sets.length;
  const setsForExercise = parseSetCount(currentExercise?.detail ?? '');

  // Register the session once per mount (resuming keeps the queued routine).
  useEffect(() => {
    if (!isWorkoutActive) startWorkout(routine, activeWeightKg);
    return () => stopAllCues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Elapsed timer + simulated HR / calorie walk (paused sessions freeze).
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      const rnd = randRef.current;
      setElapsedSeconds((prev) => prev + 1);
      if (rnd() > 0.6) {
        const step = rnd() > 0.5 ? 1 : -1;
        setHeartRate((prev) => Math.min(178, Math.max(128, prev + step)));
      }
      if (rnd() > 0.8) setCaloriesBurned((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isPaused]);

  // Rest countdown — functional decrement, clamped at 0. The final tick hands
  // off to a timeout so completion side effects stay out of the effect body.
  useEffect(() => {
    if (!isResting || isPaused || restSecondsLeft <= 0) return;

    if (restSecondsLeft === 1) {
      const timeout = setTimeout(() => {
        setIsResting(false);
        setRestSecondsLeft(REST_SECONDS);
        setVoiceBanner(`Marcus: 'Rest period complete! Get ready for set ${currentSetIndex}'`);
        speakCue('countdown', `Rest complete. Lock in for set ${currentSetIndex}!`, coachOptions);
      }, 1000);
      return () => clearTimeout(timeout);
    }

    const id = setInterval(() => {
      setRestSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isResting, isPaused, restSecondsLeft, currentSetIndex, coachOptions]);

  const handleCompleteSet = useCallback(() => {
    setIsResting(true);
    setRestSecondsLeft(REST_SECONDS);
    setCompletedSets((prev) => prev + 1);
    setVoiceBanner("Marcus: 'Strong set! 45 seconds rest active.'");
    speakCue('countdown', 'Good work. Breathe, 45 seconds rest.', optionsRef.current);

    if (currentSetIndex < setsForExercise) {
      setCurrentSetIndex((prev) => prev + 1);
    } else if (currentExerciseIndex < totalMovements - 1) {
      const next = currentExerciseIndex + 1;
      setCurrentExerciseIndex(next);
      setCurrentSetIndex(1);
      setRepsDone(routine.sets[next]?.repsTarget || 10);
    } else {
      setShowFinishSheet(true);
    }
  }, [currentSetIndex, setsForExercise, currentExerciseIndex, totalMovements, routine.sets]);

  const handleSkipRest = useCallback(() => {
    setIsResting(false);
    setRestSecondsLeft(REST_SECONDS);
    setVoiceBanner('Rest skipped. Cadence locked!');
  }, []);

  const handleCueVoice = useCallback(() => {
    const quote = HYPE_QUOTES[Math.floor(randRef.current() * HYPE_QUOTES.length)];
    setVoiceBanner(quote);
    speakCue(
      'finisherHype',
      quote.replace("Marcus: '", '').replace(/'$/, ''),
      optionsRef.current,
    );
  }, []);

  const handleFinish = useCallback(() => {
    celebrate(optionsRef.current);
    finishWorkout({
      routineTitle: routine.title,
      durationMins: Math.max(1, Math.round(elapsedSeconds / 60)),
      calories: caloriesBurned,
      setsCompleted: completedSets,
      avgHr: heartRate,
    });
    setShowFinishSheet(false);
    router.back();
  }, [finishWorkout, routine.title, elapsedSeconds, caloriesBurned, completedSets, heartRate]);

  const handleAbandon = useCallback(() => {
    abandonWorkout();
    setShowEndSheet(false);
    router.back();
  }, [abandonWorkout]);

  return (
    <Screen>
      <RouteHeader title="Live Session" subtitle={routine.title} onClose={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <TelemetryHUD
          routineTitle={routine.title}
          durationLabel={formatTimer(elapsedSeconds)}
          heartRate={heartRate}
          calories={caloriesBurned}
        />

        {voiceBanner ? (
          <AppText variant="caption" tone="secondary" style={styles.banner}>
            {voiceBanner}
          </AppText>
        ) : null}

        {isResting ? (
          <RestCard
            routineTitle={routine.title}
            nextSet={currentSetIndex}
            totalSets={setsForExercise}
            secondsLeft={restSecondsLeft}
            onSkip={handleSkipRest}
          />
        ) : (
          <MovementCard
            exercise={currentExercise}
            movementIndex={currentExerciseIndex}
            totalMovements={totalMovements}
            setNumber={currentSetIndex}
            totalSets={setsForExercise}
            weightKg={weightKg}
            repsDone={repsDone}
            restSeconds={REST_SECONDS}
            disabled={isPaused}
            onWeightChange={(kg) => {
              setWeightKg(kg);
              setWeight(kg);
            }}
            onRepsChange={setRepsDone}
            onCompleteSet={handleCompleteSet}
          />
        )}

        <AudioMiniBar onPress={handleCueVoice} />

        <SessionControls
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((prev) => !prev)}
          onEndSession={() => setShowEndSheet(true)}
        />
      </ScrollView>

      <Sheet
        visible={showFinishSheet}
        onClose={() => setShowFinishSheet(false)}
        scroll={false}>
        <WorkoutSummarySheet
          routineTitle={routine.title}
          elapsedSeconds={elapsedSeconds}
          calories={caloriesBurned}
          avgHr={heartRate}
          onSave={handleFinish}
        />
      </Sheet>

      <Sheet visible={showEndSheet} onClose={() => setShowEndSheet(false)} scroll={false}>
        <EndSessionSheet
          onSave={() => {
            setShowEndSheet(false);
            setShowFinishSheet(true);
          }}
          onDiscard={handleAbandon}
        />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingBottom: 40,
  },
  banner: {
    fontStyle: 'italic',
    marginTop: -spacing.md,
  },
});
