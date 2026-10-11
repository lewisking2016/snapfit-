import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { INITIAL_WORKOUT_LOGS } from '@/data/mockData';
import type { Routine, WorkoutSessionLog } from '@/types';

export interface WorkoutSummary {
  routineTitle: string;
  durationMins: number;
  calories: number;
  setsCompleted: number;
  avgHr: number;
}

interface WorkoutState {
  /** Routine queued for the next session (defaults to the featured program). */
  activeRoutine: Routine | null;
  activeWeightKg: number;
  /** True while a session is in flight — drives the "resume" affordances. */
  isWorkoutActive: boolean;
  logs: WorkoutSessionLog[];

  startWorkout: (routine: Routine, weightKg: number) => void;
  setWeight: (weightKg: number) => void;
  finishWorkout: (summary: WorkoutSummary) => void;
  abandonWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeRoutine: null,
      activeWeightKg: 15,
      isWorkoutActive: false,
      logs: INITIAL_WORKOUT_LOGS,

      startWorkout: (routine, weightKg) =>
        set({ activeRoutine: routine, activeWeightKg: weightKg, isWorkoutActive: true }),

      setWeight: (weightKg) => set({ activeWeightKg: weightKg }),

      finishWorkout: (summary) => {
        const newLog: WorkoutSessionLog = {
          id: `log-${Date.now()}`,
          routineTitle: summary.routineTitle,
          date: 'Just now',
          durationMins: summary.durationMins,
          calories: summary.calories,
          setsCompleted: summary.setsCompleted,
          avgHr: summary.avgHr,
        };
        set({ isWorkoutActive: false, logs: [newLog, ...get().logs] });
      },

      abandonWorkout: () => set({ isWorkoutActive: false }),
    }),
    {
      name: 'snapfit-workout',
      storage: createJSONStorage(() => AsyncStorage),
      // A half-finished session shouldn't survive an app restart — only
      // history and preferences are restored.
      partialize: (s) => ({
        activeWeightKg: s.activeWeightKg,
        logs: s.logs,
      }),
    },
  ),
);
