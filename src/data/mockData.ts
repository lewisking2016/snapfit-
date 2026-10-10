import { Routine, AudioSettings, TelemetryWatch, SamsungHealthState, SleepData } from '../types';

export const FEATURED_ROUTINE: Routine = {
  id: 'single-db-unilateral-shred',
  title: 'Single Dumbbell Unilateral Shred',
  badge: '1X DB • 15-22 KG',
  badgeColor: 'volt',
  duration: 30,
  category: 'Single Dumbbell Only',
  intensity: 'INTERMEDIATE',
  calories: 340,
  tags: ['Unilateral Balance', 'Core Stability', 'Hypertrophy'],
  equipmentBadge: 'FEATURED PROGRAM',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS-s-6mvYOMKzEPjQ_ThgSAYiGyKXREOtqJtKRs-4HZRWC1g-Sbx6caniLl0ZtWauhJGW8iKlx1L-nh4nGkKwMTVKF8Mq1iqofoQemF6W1lUlFzCL2OBpKVB_lvEHjgbujUo-3aapmJGodOV7vY4afNz7bbolMtd2feK6eBmsaJ-253Cr0q9r5qBXnaV4KEuxkko9G6iTqEia4BO4UXBV5a-fgf6Bs-ku4pyETGH7aiSBUSL2loa8KOQ',
  altText: 'A focused male and female athlete training inside a moody minimalist industrial garage gym with dark graphite walls. In the foreground sits a single matte-black cast iron hex dumbbell glowing softly under neon-volt chartreuse key lights.',
  summary: '5 blocks of unilateral hypertrophy and anti-rotational core stability, auto-scaled to single dumbbell load.',
  targetSets: '5 Blocks',
  asymmetryRatio: '1:1 Ratio',
  restInterval: '45s Tempo',
  subHighlight: {
    icon: 'bolt',
    text: 'Auto-scaling volume: 12-15 Reps / side',
    pillText: 'Active Sync',
    pillColor: 'primary-container'
  },
  sets: [
    { movement: '1. Single-Arm Floor Press', detail: '4 sets × 10 reps/side • 45s rest', repsTarget: 10, weightDefault: 15 },
    { movement: '2. Hang Snatch to Overhead Hold', detail: '3 sets × 8 reps/side • 60s rest', repsTarget: 8, weightDefault: 15 },
    { movement: '3. Offset Stance Bent Row', detail: '4 sets × 12 reps/side • 45s rest', repsTarget: 12, weightDefault: 15 },
    { movement: '4. Kettlebell / DB Windmill', detail: '3 sets × 6 reps/side (Tempo 3-0-1)', repsTarget: 6, weightDefault: 15 },
    { movement: '5. Single-Arm Suitcase Carry Hold', detail: '3 sets × 45s per side', repsTarget: 45, weightDefault: 15 }
  ]
};

export const ROUTINE_LIBRARY: Routine[] = [
  {
    id: 'unilateral-push-pull',
    title: 'Unilateral Upper Push & Pull',
    badge: 'DB',
    badgeColor: 'volt',
    duration: 25,
    category: 'Single Dumbbell Only',
    intensity: '4 MOVEMENTS',
    calories: 285,
    tags: ['Upper Body', 'Single DB', 'Offset Balance'],
    equipmentBadge: 'DB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgkrfJGRBu45JOXU9nl3OqruSV-REYawwivxsiHkbRa3ym6hLf2RIguHmFstdVnK_U2yMRJMp3ihHeURImnJgL3oNVff4-jral3hvn-EmlV49H4CGBTWPbhgcv98E8SRyl3cE5EEXAcC7TJReop9dt3BOcH5WZVTmmBmJzbbaLwIMPsi6OnWNCWuHlYu6qLMRCPP6xXy9dlb8t1qDeHWpCnPq8g8CiH75xAC6vZsb0nbQqpxsgk6k7og',
    altText: 'Athletic man executing a powerful single-arm dumbbell floor press inside a dark modern studio.',
    summary: 'Floor press, single-arm snatch, bent row, windmill',
    targetSets: '4 Blocks',
    asymmetryRatio: '1:1 Ratio',
    restInterval: '45s Tempo',
    subHighlight: {
      icon: 'sync_alt',
      text: 'Switch every 8-10 reps',
      pillText: 'No Bench Needed',
      pillColor: 'primary-container'
    },
    sets: [
      { movement: '1. Single-Arm Floor Press', detail: '4 sets × 10 reps/side • 45s rest', repsTarget: 10, weightDefault: 15 },
      { movement: '2. Hang Snatch to Overhead Hold', detail: '3 sets × 8 reps/side • 60s rest', repsTarget: 8, weightDefault: 15 },
      { movement: '3. Offset Stance Bent Row', detail: '4 sets × 12 reps/side • 45s rest', repsTarget: 12, weightDefault: 15 },
      { movement: '4. Kettlebell/DB Windmill', detail: '3 sets × 6 reps/side (Tempo 3-0-1)', repsTarget: 6, weightDefault: 15 }
    ]
  },
  {
    id: 'jump-rope-db-metcon',
    title: 'Jump Rope & Dumbbell Metcon',
    badge: 'HIIT',
    badgeColor: 'cyan',
    duration: 20,
    category: 'Jump Rope HIIT',
    intensity: 'HIGH INTENSITY',
    calories: 320,
    tags: ['Cadence Lock', 'Metabolic', 'Single DB Thruster'],
    equipmentBadge: 'HIIT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZLHZIYHiJWL0gRHNa7aQWhyB9NjXJ3uOCDnwnJZpauM9K8MVbjCGOKlSv3_1H0jEt_w43uLdvFTT_l1bPzSQwJEm5p4IU5959vD3bh12VMI5bAIKgIPY9UaOlSoQ8MCxNG3AKuEBVL0TF26ZaezHVBX-LWt0l5YX_RG0bwVcfUsuMhBHEQo1eRa-JXQat9LSxugS-ysSxGxay8kpICGEfTuntcQNiv_8fkbS6nztLYiLy0iHY2uQyVg',
    altText: 'High-speed motion photograph of an athlete performing speed jump rope intervals beside a heavy single dumbbell.',
    summary: '3 min skipping intervals paired with single-dumbbell thrusters',
    targetSets: '5 Rounds',
    asymmetryRatio: 'High Cadence',
    restInterval: '30s Burst',
    subHighlight: {
      icon: 'speed',
      text: 'Target Cadence: 140 RPM',
      pillText: 'Metabolic Spike',
      pillColor: 'secondary'
    },
    sets: [
      { movement: '1. Speed Rope Boxer Skip', detail: '5 rounds × 3 mins @ 140 RPM', repsTarget: 140, weightDefault: 0 },
      { movement: '2. Single DB Thrusters', detail: '5 rounds × 12 reps (6/side)', repsTarget: 12, weightDefault: 15 },
      { movement: '3. DB Lateral Hop Overs', detail: '5 rounds × 20 reps continuous', repsTarget: 20, weightDefault: 0 },
      { movement: '4. Plank DB Drag-Through', detail: '4 rounds × 10 reps/side', repsTarget: 10, weightDefault: 15 }
    ]
  },
  {
    id: 'living-room-calisthenics',
    title: 'Living Room Calisthenics & Abs',
    badge: 'BODY',
    badgeColor: 'gray',
    duration: 18,
    category: 'Bodyweight Calisthenics',
    intensity: 'CALISTHENICS',
    calories: 195,
    tags: ['Zero Gear', 'Joint Friendly', 'Core Hollow'],
    equipmentBadge: 'BODY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArA2dqYmgkUlRbtYGcNU_UgxEl0KJji1M2oDDZ3I4Hs1cCB4f7nTG5AJDyoOqdrdnKU7iMWzO6ddP-iSR1QTt26oDCIn9QYcnLgrphFYinAT6nsYdMnLR8KuztLPvc_3gsO6rPLl9hJJ5jdf5xkBICRXdGmt2F45D0n5NQLMmmHTfzZqCc3JXi5NsdRGa4aL4eiexOyvEPvg7_nNn99AGEhTw36Kkk4f8HnbFQOY_sIEqtXtTkWjj2DQ',
    altText: 'Athletic female athlete holding a strict hollow body hold position on a dark gym mat in an apartment loft.',
    summary: 'Push-up variations, Bulgarian split squats, hollow holds',
    targetSets: '3 Circuits',
    asymmetryRatio: 'Bodyweight',
    restInterval: '30s Pause',
    subHighlight: {
      icon: 'fitness_center',
      text: 'Zero equipment needed',
      pillText: 'Joint Friendly',
      pillColor: 'on-surface'
    },
    sets: [
      { movement: '1. Tempo Deficit Push-Ups', detail: '3 sets × 12-15 reps (3s eccentric)', repsTarget: 14, weightDefault: 0 },
      { movement: '2. Bulgarian Split Squats', detail: '3 sets × 12 reps/leg (Strict torso)', repsTarget: 12, weightDefault: 0 },
      { movement: '3. Hollow Body Rockers', detail: '3 sets × 45s sustained isometric', repsTarget: 45, weightDefault: 0 },
      { movement: '4. Pike Push-Up Shoulder Press', detail: '3 sets × 8-10 reps', repsTarget: 10, weightDefault: 0 }
    ]
  },
  {
    id: 'interval-jog-rope-warmup',
    title: 'Interval Jog & Rope Warmup',
    badge: 'PREP',
    badgeColor: 'volt',
    duration: 15,
    category: 'Hybrid Combos',
    intensity: 'MOBILITY & ACTIVATION',
    calories: 140,
    tags: ['Zone 2 HR', 'Dynamic Prep', 'Joint Prep'],
    equipmentBadge: 'PREP',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV3Qs5kI4HjO5WaS4KGEQWIuOWTrdWcZhj3fcvxG-xAafTXvh8LwZOYFL9NvgW5Pmrw-phKyY4lIv5hbI5GWkuQR5duC5DHAnFWjnyhDR-1NQUJVVWq3dEFoWljXpsvxtdSsOMkEYCxtNC0q0uMS0VTUeoY9FAlms5elNlL7EoH-t2yxXZ3R5C0C2tYbeX0ypZX10ess_ZPuae9c4H3jeKmTj7REVWCVi28SaIK3XuL0TxBTKcwQQymQ',
    altText: 'Athletic runner performing high knee skips and dynamic warm-up drills on an indoor running track with neon digital telemetry lines.',
    summary: 'Low-impact dynamic prep and tempo builder',
    targetSets: '2 Waves',
    asymmetryRatio: 'Bilateral',
    restInterval: 'Active Rest',
    subHighlight: {
      icon: 'favorite',
      text: 'HR Zone 2 Elevation',
      pillText: 'Dynamic Flow',
      pillColor: 'primary-container'
    },
    sets: [
      { movement: '1. High Knee Skips & Arm Swings', detail: '2 sets × 90s fluid pacing', repsTarget: 90, weightDefault: 0 },
      { movement: '2. Light Jump Rope Rhythm Sync', detail: '3 sets × 2 mins @ 110 RPM', repsTarget: 120, weightDefault: 0 },
      { movement: '3. World’s Greatest Stretch Flow', detail: '2 sets × 5 reps/side', repsTarget: 5, weightDefault: 0 },
      { movement: '4. Pogo Hops & Ankle Pre-load', detail: '2 sets × 40 reps', repsTarget: 40, weightDefault: 0 }
    ]
  }
];

export const SPOTIFY_PLAYLISTS = [
  {
    id: 'bassline-sprint',
    title: '140 BPM Bassline Sprint',
    bpm: '140 BPM',
    genre: 'Drum & Bass / Grime • Current Workout Sync',
    tag: 'Tempo Match',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr6uq0Ww3nGp5uaVmvR5ntSQavMsjGU9JsqJkyObS5fbCGiMnEaH2TgSWPc6JPgsDawkmRIbzWKPaZD9ddMuPuD_Ly568tU6dR4ZBUmn_T8eGrQZg2mswbcsIgRBPmaeULGvdN39esFz9Vk9G3qZLDEkaaYG6YRpsf00WLMgsUHIMUmQhe73IAlNw23tjcclAzuypvt6GSGzvhFCDVunbHdz_ha2LvegfSGkBNzWKxl4--sKW8rI-e4A',
    tempoColor: 'primary-container',
    bpmNum: 140
  },
  {
    id: 'heavy-grime-drill',
    title: 'Heavy Dumbbell Grime & Drill',
    bpm: '118-124 BPM',
    genre: 'Aggressive 808s, Sub-bass cadence',
    tag: 'Strength Split',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoK-Hpg4fD1Bp0QNRgm15ZH3NKF4xmRhgxCtDL5X5M4p6YXK59eXjmHkXIzFlMnfSCXcxACiTbyY_VuVeo3nYufxI1beorgkASiL_VKshZQvG2Dl-bATSHKa-YSi7s6uAK2OtbidspI-mA5FmazzAVsPAkaChcVFJviRJEOS1AXPZvIXRlSZjh_Y6Zv_8XCYOoE5iT25ynkuVDbrQJOvg-tNSkUu-zrZ-HhIcPaWP18HoU8t56MQamhQ',
    tempoColor: 'surface-container-highest',
    bpmNum: 122
  },
  {
    id: 'steady-jump-rope',
    title: 'Steady State & Jump Rope',
    bpm: '132 BPM',
    genre: 'Continuous metronomic electronic beats',
    tag: 'Cadence Locked',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT_p2ovoHfBo_LV12JvoZavGDqrH0lITyhaf57rGQckkbx33sUn-NA8sCgf5wd6QiYChT2xNR0UKjXuXI0R2Q1ZgmpBLlnKxnotolyCHF2AqFcTqbsbe9bqPCyTxPQFPiK0HoCojfS7AeWVm8xM_AkAufPqgDVz15gJf8gZlOmwtzDBmDZFEUwL3dSEwLqA-tTg-nCF-hNK3m0oO5zEuJQ1j_EyOp7tfiQVEoXmwwWLnzreFgHZkwOCA',
    tempoColor: 'surface-container-highest',
    bpmNum: 132
  }
];

export const INITIAL_AUDIO_SETTINGS: AudioSettings = {
  device: 'Beats Powerbeats Pro',
  latencyMs: 12,
  coachName: 'Marcus',
  coachRegion: 'UK SOUTH',
  coachDescription: 'Motivational, energetic British cadence & grit',
  coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNapgSbk1Q0M6RqNTAHbuyDMI54ecRKEe4C265Kr5rSl-_Oy4uYhzSaj5sRVVG3MbGlvZ1b7__N8T3_sype4zTkjjgNlqQOSjD1bcPonUHF7qEX5zB02hyjHuXQlSEao7GqyrNpCQ2cS5aTfPuFdi5RLeqBABexDpGthlSCivd-TMtEazDqxG4LAXEMMaLChBZdTjgPHGQFLMQHi_C68N1_80RzAJvsY5v3lpNOsr8tIIJe-ZnNUhZSA',
  cueIntensity: 'balanced',
  triggers: {
    countdown: true,
    formCorrection: true,
    hrAlerts: true,
    finisherHype: true
  },
  duckingRatio: 65,
  activePlaylistId: 'bassline-sprint'
};

export const INITIAL_WATCH_STATE: TelemetryWatch = {
  name: 'Oraimo Watch 4 Pro',
  model: 'BLE 5.3',
  mac: '4A:9C:12:F0',
  charge: 84,
  linkDbm: -58,
  restingHr: 68,
  continuousSpo2: 99,
  firmware: 'FW v2.14 (LATEST)',
  streaming: true,
  autoSync: true
};

export const INITIAL_SAMSUNG_HEALTH: SamsungHealthState = {
  connected: true,
  lastHandshake: '2 mins ago',
  streams: {
    steps: true,
    sleep: true,
    activeBurn: true
  }
};

export const INITIAL_SLEEP_DATA: SleepData = {
  recoveryScore: 91,
  rhr: 54,
  hrv: 78,
  totalDuration: { hours: 7, minutes: 52 },
  sleepWindow: '11:12 PM – 7:04 AM',
  stages: {
    deep: { hours: 2, minutes: 10, percent: 27 },
    rem: { hours: 2, minutes: 5, percent: 26 },
    light: { hours: 3, minutes: 37, percent: 47 }
  },
  screenTimeHours: 1,
  screenTimeMinutes: 40,
  screenTimeDeltaPercent: -24,
  bedtimeLockoutPercent: 94,
  hydrationLiters: 2.4,
  circadianFilterActive: true
};
