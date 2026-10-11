import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  INITIAL_AUDIO_SETTINGS,
  INITIAL_SAMSUNG_HEALTH,
  INITIAL_SLEEP_DATA,
  INITIAL_WATCH_STATE,
} from '@/data/mockData';
import type { AudioSettings, SamsungHealthState, SleepData, TelemetryWatch } from '@/types';

export interface PrivacySettings {
  showActivity: boolean;
  allowNudges: boolean;
  showOnLeaderboard: boolean;
}

interface SettingsState {
  audio: AudioSettings;
  watch: TelemetryWatch;
  samsungHealth: SamsungHealthState;
  sleep: SleepData;
  privacy: PrivacySettings;
  updateAudio: (patch: Partial<AudioSettings>) => void;
  updateWatch: (patch: Partial<TelemetryWatch>) => void;
  updateSamsungHealth: (patch: Partial<SamsungHealthState>) => void;
  updateSleep: (patch: Partial<SleepData>) => void;
  updatePrivacy: (patch: Partial<PrivacySettings>) => void;
  reset: () => void;
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  showActivity: true,
  allowNudges: true,
  showOnLeaderboard: true,
};

const initialState = {
  audio: INITIAL_AUDIO_SETTINGS,
  watch: INITIAL_WATCH_STATE,
  samsungHealth: INITIAL_SAMSUNG_HEALTH,
  sleep: INITIAL_SLEEP_DATA,
  privacy: DEFAULT_PRIVACY_SETTINGS,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      updateAudio: (patch) => set((s) => ({ audio: { ...s.audio, ...patch } })),
      updateWatch: (patch) => set((s) => ({ watch: { ...s.watch, ...patch } })),
      updateSamsungHealth: (patch) =>
        set((s) => ({ samsungHealth: { ...s.samsungHealth, ...patch } })),
      updateSleep: (patch) => set((s) => ({ sleep: { ...s.sleep, ...patch } })),
      updatePrivacy: (patch) => set((s) => ({ privacy: { ...s.privacy, ...patch } })),
      reset: () => set(initialState),
    }),
    {
      name: 'snapfit-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
