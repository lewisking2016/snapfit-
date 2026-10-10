import React, { useState, useEffect } from 'react';
import { Routine } from '../../types';
import { audioCoach } from '../../utils/audioCoach';

interface LiveTrackerScreenProps {
  routine: Routine;
  weightKg: number;
  onFinishWorkout: (summary: { routineTitle: string; durationMins: number; calories: number; setsCompleted: number; avgHr: number }) => void;
  onNavigateToAudio: () => void;
}

export const LiveTrackerScreen: React.FC<LiveTrackerScreenProps> = ({
  routine,
  weightKg: initialWeightKg,
  onFinishWorkout,
  onNavigateToAudio
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(1);
  const [repsDone, setRepsDone] = useState(10);
  const [weightKg, setWeightKg] = useState(initialWeightKg);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(45);
  const [heartRate, setHeartRate] = useState(144);
  const [caloriesBurned, setCaloriesBurned] = useState(48);
  const [voiceBanner, setVoiceBanner] = useState<string | null>("Marcus: 'Lock your core on the floor press!'");
  const [isPaused, setIsPaused] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const currentExercise = routine.sets[currentExerciseIndex] || routine.sets[0];
  const totalExercises = routine.sets.length;
  const targetReps = currentExercise.repsTarget || 10;

  // Elapsed timer loop
  useEffect(() => {
    let interval: number | null = null;
    if (!isPaused) {
      interval = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        
        // Slightly simulate dynamic HR and Calories
        if (Math.random() > 0.6) {
          setHeartRate((prev) => Math.min(178, Math.max(128, prev + (Math.random() > 0.5 ? 1 : -1))));
        }
        if (Math.random() > 0.8) {
          setCaloriesBurned((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused]);

  // Rest countdown loop
  useEffect(() => {
    let restInterval: number | null = null;
    if (isResting && restSecondsLeft > 0 && !isPaused) {
      restInterval = window.setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            setVoiceBanner("Marcus: 'Rest period complete! Get ready for set " + (currentSetIndex + 1) + "'");
            audioCoach.speakCue(`Rest complete. Lock in for set ${currentSetIndex + 1}!`);
            return 45;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [isResting, restSecondsLeft, isPaused, currentSetIndex]);

  const handleCompleteSet = () => {
    // Start rest period
    setIsResting(true);
    setRestSecondsLeft(45);
    setVoiceBanner(`Marcus: 'Strong set! 45 seconds rest active.'`);
    audioCoach.speakCue("Good work. Breathe, 45 seconds rest.");

    if (currentSetIndex < 4) {
      setCurrentSetIndex((prev) => prev + 1);
    } else {
      // Advance to next exercise if available
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSetIndex(1);
        setRepsDone(routine.sets[currentExerciseIndex + 1]?.repsTarget || 10);
      } else {
        setShowFinishModal(true);
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestSecondsLeft(45);
    setVoiceBanner("Rest skipped. Cadence locked!");
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const triggerVoiceHype = () => {
    const quotes = [
      "Marcus: 'Final three reps, let's smash through the plateau!'",
      "Marcus: 'Keep that shoulder packed, don't let it drift!'",
      "Marcus: 'Drive through the heel, smooth tempo!'"
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    setVoiceBanner(q);
    audioCoach.speakCue(q.replace("Marcus: '", "").replace("'", ""));
  };

  return (
    <div className="flex flex-col w-full pb-10 gap-4 animate-in fade-in duration-300">
      {/* Top Session Telemetry HUD */}
      <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-3.5 shadow-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
            <h2 className="font-headline-sm text-[15px] font-bold text-[#e1e2e7] truncate">
              {routine.title}
            </h2>
          </div>
          <span className="bg-[#272a2e] text-[#4cd7f6] font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-[#323538]">
            BLE LIVE
          </span>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 text-center bg-[#191c1f] p-2 rounded-lg border border-[#272a2e]">
          <div className="flex flex-col">
            <span className="font-label-sm text-[9px] uppercase text-[#c4c9ac]">Duration</span>
            <span className="font-metric-numeral-sm text-[22px] font-bold text-[#e1e2e7] font-mono">
              {formatTimer(elapsedSeconds)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-[9px] uppercase text-[#c4c9ac] flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-[#ffb4ab] animate-pulse">
                favorite
              </span>
              Heart Rate
            </span>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="font-metric-numeral-sm text-[22px] font-bold text-[#ffb4ab]">
                {heartRate}
              </span>
              <span className="text-[10px] text-[#c4c9ac]">BPM</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-[9px] uppercase text-[#c4c9ac]">Active Burn</span>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="font-metric-numeral-sm text-[22px] font-bold text-[#c3f400]">
                {caloriesBurned}
              </span>
              <span className="text-[10px] text-[#c4c9ac]">KCAL</span>
            </div>
          </div>
        </div>

        {/* Marcus Audio Coach Banner */}
        {voiceBanner && (
          <div className="bg-[#272a2e] border border-[#323538] px-3 py-2 rounded-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#c3f400] text-[18px] shrink-0">
                graphic_eq
              </span>
              <span className="text-[11px] text-[#e1e2e7] truncate italic">
                {voiceBanner}
              </span>
            </div>
            <button
              onClick={triggerVoiceHype}
              className="px-2 py-0.5 rounded bg-[#1d2023] hover:bg-[#323538] text-[#c3f400] text-[10px] uppercase font-bold shrink-0 border border-[#c3f400]/30"
            >
              Cue Voice
            </button>
          </div>
        )}
      </div>

      {/* In-Workout Rest Timer Overlay if resting */}
      {isResting && (
        <div className="bg-[#191c1f] border-2 border-[#c3f400] rounded-xl p-4 shadow-xl flex flex-col items-center gap-2 animate-in zoom-in-95 duration-150">
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#c3f400] font-bold">
            Rest Interval In Progress
          </span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-metric-numeral text-[54px] font-bold text-[#c3f400] font-mono leading-none">
              {restSecondsLeft}
            </span>
            <span className="text-[18px] text-[#c4c9ac] font-bold">S</span>
          </div>
          <span className="text-[11px] text-[#c4c9ac]">
            Tempo recovery • Next: Set {currentSetIndex} of 4
          </span>
          <button
            onClick={handleSkipRest}
            className="mt-1 px-5 py-2 rounded-lg bg-[#272a2e] hover:bg-[#323538] text-[#e1e2e7] text-[12px] font-bold uppercase tracking-wider border border-[#323538]"
          >
            Skip Rest Period
          </button>
        </div>
      )}

      {/* Active Movement Logging Card */}
      <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4cd7f6] bg-[#272a2e] px-2.5 py-1 rounded">
            Movement {currentExerciseIndex + 1} of {totalExercises}
          </span>
          <span className="text-[11px] font-bold text-[#c3f400]">
            Set {currentSetIndex} of 4
          </span>
        </div>

        <h3 className="font-headline-md text-[20px] font-bold text-[#e1e2e7] leading-tight">
          {currentExercise.movement}
        </h3>
        <p className="font-body-sm text-[12px] text-[#c4c9ac]">
          {currentExercise.detail}
        </p>

        {/* Load & Reps Counter Steppers */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#272a2e]">
          {/* Weight Stepper */}
          <div className="flex flex-col items-center bg-[#191c1f] p-3 rounded-xl border border-[#272a2e]">
            <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase font-bold">
              Load (Dumbbell)
            </span>
            <div className="flex items-center gap-3 my-2">
              <button
                onClick={() => setWeightKg((prev) => Math.max(0, prev - 2))}
                className="w-9 h-9 rounded-lg bg-[#272a2e] hover:bg-[#323538] text-[#e1e2e7] font-bold flex items-center justify-center text-[18px]"
              >
                -
              </button>
              <div className="flex items-baseline gap-0.5">
                <span className="font-metric-numeral-sm text-[26px] font-bold text-[#e1e2e7]">
                  {weightKg}
                </span>
                <span className="text-[11px] text-[#c4c9ac] font-bold">KG</span>
              </div>
              <button
                onClick={() => setWeightKg((prev) => prev + 2)}
                className="w-9 h-9 rounded-lg bg-[#272a2e] hover:bg-[#323538] text-[#e1e2e7] font-bold flex items-center justify-center text-[18px]"
              >
                +
              </button>
            </div>
          </div>

          {/* Reps Stepper */}
          <div className="flex flex-col items-center bg-[#191c1f] p-3 rounded-xl border border-[#272a2e]">
            <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase font-bold">
              Reps / Side
            </span>
            <div className="flex items-center gap-3 my-2">
              <button
                onClick={() => setRepsDone((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 rounded-lg bg-[#272a2e] hover:bg-[#323538] text-[#e1e2e7] font-bold flex items-center justify-center text-[18px]"
              >
                -
              </button>
              <div className="flex items-baseline gap-0.5">
                <span className="font-metric-numeral-sm text-[26px] font-bold text-[#c3f400]">
                  {repsDone}
                </span>
                <span className="text-[11px] text-[#c4c9ac]">/ {targetReps}</span>
              </div>
              <button
                onClick={() => setRepsDone((prev) => prev + 1)}
                className="w-9 h-9 rounded-lg bg-[#272a2e] hover:bg-[#323538] text-[#e1e2e7] font-bold flex items-center justify-center text-[18px]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Button: Finish Set */}
        <button
          onClick={handleCompleteSet}
          className="w-full h-13 bg-[#c3f400] text-[#283500] hover:bg-[#abd600] active:scale-[0.98] rounded-xl font-label-lg text-[14px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#c3f400]/20 transition-all mt-1"
        >
          <span className="material-symbols-outlined text-[22px]">check_circle</span>
          <span>Complete Set & Start Rest (45s)</span>
        </button>
      </div>

      {/* Spotify & Audio Coach mini bar */}
      <div
        onClick={onNavigateToAudio}
        className="bg-[#1d2023] hover:bg-[#272a2e] border border-[#272a2e] rounded-xl p-3 flex items-center justify-between cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#4cd7f6] shrink-0 border border-[#323538]">
            <span className="material-symbols-outlined text-[20px]">headphones</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[13px] text-[#e1e2e7]">
              Marcus British Coaching Active
            </span>
            <span className="text-[11px] text-[#c4c9ac]">
              140 BPM Bassline Sprint • Ducking -18dB
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[18px] text-[#c4c9ac]">tune</span>
      </div>

      {/* Session Controls: Pause / Finish */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex-1 h-11 rounded-xl bg-[#272a2e] hover:bg-[#323538] text-[#e1e2e7] font-label-md text-[12px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 border border-[#323538]"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isPaused ? 'play_arrow' : 'pause'}
          </span>
          <span>{isPaused ? 'Resume Session' : 'Pause Workout'}</span>
        </button>

        <button
          onClick={() => setShowFinishModal(true)}
          className="px-5 h-11 rounded-xl bg-[#93000a] hover:bg-[#ba1a1a] text-[#ffdad6] font-label-md text-[12px] uppercase font-bold tracking-wider flex items-center justify-center gap-1"
        >
          End Session
        </button>
      </div>

      {/* Completion Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-[#111417]/85 backdrop-blur-md flex items-end justify-center p-4">
          <div className="w-full max-w-md bg-[#1d2023] border border-[#323538] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-2 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 pb-2 border-b border-[#272a2e]">
              <span className="material-symbols-outlined text-[#c3f400] text-[24px]">verified</span>
              <h4 className="font-headline-sm text-[17px] font-bold text-[#e1e2e7]">
                Workout Completed!
              </h4>
            </div>

            <div className="flex flex-col gap-2 bg-[#191c1f] p-3 rounded-xl border border-[#272a2e]">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#c4c9ac]">Routine</span>
                <span className="text-[#e1e2e7] font-semibold">{routine.title}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#c4c9ac]">Total Time</span>
                <span className="text-[#e1e2e7] font-semibold">{formatTimer(elapsedSeconds)}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#c4c9ac]">Total Energy Burn</span>
                <span className="text-[#c3f400] font-bold font-mono">{caloriesBurned} KCAL</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#c4c9ac]">Average HR (Oraimo)</span>
                <span className="text-[#ffb4ab] font-bold font-mono">{heartRate} BPM</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowFinishModal(false);
                onFinishWorkout({
                  routineTitle: routine.title,
                  durationMins: Math.max(1, Math.round(elapsedSeconds / 60)),
                  calories: caloriesBurned,
                  setsCompleted: (currentExerciseIndex * 4) + currentSetIndex,
                  avgHr: heartRate
                });
              }}
              className="w-full h-12 bg-[#c3f400] text-[#283500] hover:bg-[#abd600] rounded-xl font-label-lg text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#c3f400]/20"
            >
              <span>Save & Sync to Samsung Health</span>
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
