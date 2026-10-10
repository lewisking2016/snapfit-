export type ScreenId = 
  | 'home'
  | 'tracker'
  | 'routines'
  | 'progress'
  | 'recovery'
  | 'audio'
  | 'devices';

export interface ExerciseSet {
  movement: string;
  detail: string;
  repsTarget?: number;
  weightDefault?: number;
}

export interface Routine {
  id: string;
  title: string;
  badge: string;
  badgeColor?: 'volt' | 'cyan' | 'gray';
  duration: number; // in mins
  category: string;
  intensity: string;
  calories: number;
  tags: string[];
  equipmentBadge: string;
  image: string;
  altText: string;
  summary: string;
  targetSets: string;
  asymmetryRatio: string;
  restInterval: string;
  subHighlight: {
    icon: string;
    text: string;
    pillText: string;
    pillColor?: string;
  };
  sets: ExerciseSet[];
}

export interface AudioSettings {
  device: string;
  latencyMs: number;
  coachName: string;
  coachRegion: string;
  coachDescription: string;
  coachAvatar: string;
  cueIntensity: 'minimal' | 'balanced' | 'high';
  triggers: {
    countdown: boolean;
    formCorrection: boolean;
    hrAlerts: boolean;
    finisherHype: boolean;
  };
  duckingRatio: number; // 10 to 90
  activePlaylistId: string;
}

export interface TelemetryWatch {
  name: string;
  model: string;
  mac: string;
  charge: number;
  linkDbm: number;
  restingHr: number;
  continuousSpo2: number;
  firmware: string;
  streaming: boolean;
  autoSync: boolean;
}

export interface SamsungHealthState {
  connected: boolean;
  lastHandshake: string;
  streams: {
    steps: boolean;
    sleep: boolean;
    activeBurn: boolean;
  };
}

export interface SleepData {
  recoveryScore: number;
  rhr: number;
  hrv: number;
  totalDuration: { hours: number; minutes: number };
  sleepWindow: string;
  stages: {
    deep: { hours: number; minutes: number; percent: number };
    rem: { hours: number; minutes: number; percent: number };
    light: { hours: number; minutes: number; percent: number };
  };
  screenTimeHours: number;
  screenTimeMinutes: number;
  screenTimeDeltaPercent: number;
  bedtimeLockoutPercent: number;
  hydrationLiters: number;
  circadianFilterActive: boolean;
}

export interface ActiveWorkoutState {
  routine: Routine;
  currentExerciseIndex: number;
  currentSetIndex: number;
  currentReps: number;
  weightKg: number;
  isResting: boolean;
  restTimeRemaining: number;
  elapsedSeconds: number;
  currentHr: number;
  caloriesBurned: number;
  isActive: boolean;
}
