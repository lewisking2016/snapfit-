/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId, Routine, AudioSettings, TelemetryWatch, SamsungHealthState, SleepData } from './types';
import {
  FEATURED_ROUTINE,
  INITIAL_AUDIO_SETTINGS,
  INITIAL_WATCH_STATE,
  INITIAL_SAMSUNG_HEALTH,
  INITIAL_SLEEP_DATA
} from './data/mockData';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { RoutinesScreen } from './components/screens/RoutinesScreen';
import { LiveTrackerScreen } from './components/screens/LiveTrackerScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { RecoveryScreen } from './components/screens/RecoveryScreen';
import { AudioCompanionScreen } from './components/screens/AudioCompanionScreen';
import { ConnectedDevicesScreen } from './components/screens/ConnectedDevicesScreen';

import { PreviewSetsModal } from './components/modals/PreviewSetsModal';
import { SwitchAudioModal } from './components/modals/SwitchAudioModal';
import { PairDeviceModal } from './components/modals/PairDeviceModal';
import { WindDownModal } from './components/modals/WindDownModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { AthleteProfileModal } from './components/modals/AthleteProfileModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activeRoutine, setActiveRoutine] = useState<Routine>(FEATURED_ROUTINE);
  const [activeWeightKg, setActiveWeightKg] = useState<number>(15);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);

  // Core telemetry states
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(INITIAL_AUDIO_SETTINGS);
  const [watchState, setWatchState] = useState<TelemetryWatch>(INITIAL_WATCH_STATE);
  const [samsungHealth, setSamsungHealth] = useState<SamsungHealthState>(INITIAL_SAMSUNG_HEALTH);
  const [sleepData, setSleepData] = useState<SleepData>(INITIAL_SLEEP_DATA);

  // Modals
  const [previewRoutine, setPreviewRoutine] = useState<Routine | null>(null);
  const [showSwitchAudio, setShowSwitchAudio] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);
  const [showWindDown, setShowWindDown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Workout History
  const [workoutLogs, setWorkoutLogs] = useState([
    {
      id: 'log-1',
      routineTitle: 'Single Dumbbell Unilateral Shred',
      date: 'Today, 08:30 AM',
      durationMins: 32,
      calories: 340,
      setsCompleted: 20,
      avgHr: 148
    },
    {
      id: 'log-2',
      routineTitle: 'Jump Rope & Dumbbell Metcon',
      date: 'Yesterday, 07:15 AM',
      durationMins: 22,
      calories: 310,
      setsCompleted: 16,
      avgHr: 162
    },
    {
      id: 'log-3',
      routineTitle: 'Unilateral Upper Push & Pull',
      date: 'Oct 22, 06:45 PM',
      durationMins: 28,
      calories: 280,
      setsCompleted: 18,
      avgHr: 142
    }
  ]);

  const handleStartWorkout = (routineToStart?: Routine, weight = 15) => {
    if (routineToStart) {
      setActiveRoutine(routineToStart);
    }
    setActiveWeightKg(weight);
    setIsWorkoutActive(true);
    setCurrentScreen('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishWorkout = (summary: {
    routineTitle: string;
    durationMins: number;
    calories: number;
    setsCompleted: number;
    avgHr: number;
  }) => {
    setIsWorkoutActive(false);
    const newLog = {
      id: `log-${Date.now()}`,
      routineTitle: summary.routineTitle,
      date: 'Just now',
      durationMins: summary.durationMins,
      calories: summary.calories,
      setsCompleted: summary.setsCompleted,
      avgHr: summary.avgHr
    };
    setWorkoutLogs([newLog, ...workoutLogs]);
    setCurrentScreen('progress');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#111417] text-[#e1e2e7] flex flex-col font-['Inter',sans-serif]">
      {/* Fixed Sticky Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Main Container Viewport (Centered max-w-md for mobile telemetry presentation) */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-18 pb-20 relative">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onStartWorkout={() => handleStartWorkout(FEATURED_ROUTINE, activeWeightKg)}
          />
        )}

        {currentScreen === 'routines' && (
          <RoutinesScreen
            onStartWorkout={(r, w) => handleStartWorkout(r, w)}
            onPreviewRoutine={(r) => setPreviewRoutine(r)}
          />
        )}

        {currentScreen === 'tracker' && (
          <LiveTrackerScreen
            routine={activeRoutine}
            weightKg={activeWeightKg}
            onFinishWorkout={handleFinishWorkout}
            onNavigateToAudio={() => handleNavigate('audio')}
          />
        )}

        {currentScreen === 'progress' && (
          <ProgressScreen
            logs={workoutLogs}
            onStartNewWorkout={() => handleNavigate('routines')}
          />
        )}

        {currentScreen === 'recovery' && (
          <RecoveryScreen
            sleepData={sleepData}
            onUpdateSleepData={(data) => setSleepData({ ...sleepData, ...data })}
            onOpenWindDown={() => setShowWindDown(true)}
          />
        )}

        {currentScreen === 'audio' && (
          <AudioCompanionScreen
            settings={audioSettings}
            onUpdateSettings={(newSettings) => setAudioSettings({ ...audioSettings, ...newSettings })}
            onOpenSwitchAudio={() => setShowSwitchAudio(true)}
          />
        )}

        {currentScreen === 'devices' && (
          <ConnectedDevicesScreen
            watchState={watchState}
            samsungHealth={samsungHealth}
            onUpdateWatch={(w) => setWatchState({ ...watchState, ...w })}
            onUpdateSamsung={(sh) => setSamsungHealth({ ...samsungHealth, ...sh })}
            onOpenPairModal={() => setShowPairModal(true)}
          />
        )}
      </main>

      {/* Global Persistent Bottom Dock */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        isWorkoutActive={isWorkoutActive}
      />

      {/* Modals & Dialog Drawers */}
      <PreviewSetsModal
        routine={previewRoutine}
        onClose={() => setPreviewRoutine(null)}
        onStartWorkout={(r) => handleStartWorkout(r, activeWeightKg)}
      />

      {showSwitchAudio && (
        <SwitchAudioModal
          currentDevice={audioSettings.device}
          onSelectDevice={(device, latency) =>
            setAudioSettings((prev) => ({ ...prev, device, latencyMs: latency }))
          }
          onClose={() => setShowSwitchAudio(false)}
        />
      )}

      {showPairModal && (
        <PairDeviceModal
          onClose={() => setShowPairModal(false)}
          onDevicePaired={(devName) => {
            alert(`Connected to ${devName}. Real-time telemetry streaming active.`);
          }}
        />
      )}

      {showWindDown && (
        <WindDownModal onClose={() => setShowWindDown(false)} />
      )}

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {showProfile && (
        <AthleteProfileModal
          onClose={() => setShowProfile(false)}
          onNavigate={(screen) => handleNavigate(screen)}
        />
      )}
    </div>
  );
}
