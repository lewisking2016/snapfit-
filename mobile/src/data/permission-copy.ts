export type PermissionKind = 'health' | 'notifications' | 'contacts' | 'camera';

type PermissionCopy = {
  title: string;
  rationale: string;
  privacyNote: string;
  requestOnColdLaunch: false;
};

const PERMISSION_COPY: Record<PermissionKind, PermissionCopy> = {
  health: {
    title: 'Connect health data',
    rationale: 'Use steps, active minutes, and workouts to make your training progress easier to understand.',
    privacyNote: 'Health data is only for fitness features. It is never used for advertising.',
    requestOnColdLaunch: false,
  },
  notifications: {
    title: 'Choose workout notifications',
    rationale: 'Get reminders and friend activity updates that you choose to receive.',
    privacyNote: 'Marketing notifications stay optional and separate from workout updates.',
    requestOnColdLaunch: false,
  },
  contacts: {
    title: 'Find people you know',
    rationale: 'Use contacts only when you choose to look for friends already using Kinn.',
    privacyNote: 'Your contact list is not shown to other members.',
    requestOnColdLaunch: false,
  },
  camera: {
    title: 'Capture a workout moment',
    rationale: 'Use your camera only when you choose to capture a moment for your circle.',
    privacyNote: 'Nothing is captured or shared until you choose it in the app.',
    requestOnColdLaunch: false,
  },
};

export function getPermissionCopy(kind: PermissionKind): PermissionCopy {
  return PERMISSION_COPY[kind];
}