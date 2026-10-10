import React, { useState } from 'react';
import { ScreenId, Routine } from '../../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onStartWorkout: (routine?: Routine) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onStartWorkout }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleJump = (screen: ScreenId, label: string) => {
    triggerToast(`Routing to ${label}...`);
    setTimeout(() => {
      onNavigate(screen);
    }, 350);
  };

  return (
    <div className="flex flex-col w-full pb-8 gap-6 animate-in fade-in duration-300">
      {/* System Architecture Header */}
      <div className="flex flex-col gap-1.5 pt-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#272a2e] text-[#e1e2e7]">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#c3f400] font-semibold">
              7 Active Modules Connected
            </span>
          </div>
          <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-widest font-mono">
            v2.4 Core Sync
          </span>
        </div>

        <h2 className="font-headline-lg-mobile text-[26px] sm:text-[30px] font-bold text-[#e1e2e7] tracking-tight mt-1">
          Ecosystem Architecture
        </h2>
        <p className="font-body-md text-[13px] text-[#c4c9ac] leading-snug">
          Kinetic minimalist telemetry blueprint & multi-screen data pathways.
        </p>
      </div>

      {/* Interactive Hierarchy & Topology Map */}
      <div className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#c3f400]">schema</span>
            <span className="font-label-md text-[11px] uppercase tracking-wider text-[#e1e2e7] font-bold">
              System Topology
            </span>
          </div>
          <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#1d2023] text-[#4cd7f6] font-semibold">
            DUAL TIER
          </span>
        </div>

        {/* Hierarchy Nodes Diagram */}
        <div className="flex flex-col gap-3 p-3 rounded-lg bg-[#0b0e11] border border-[#272a2e]">
          {/* Tier 1: Primary Dock */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac] font-semibold">
                Tier 01: Global Bottom Dock (Persistent)
              </span>
              <span className="font-label-sm text-[10px] text-[#c3f400] font-bold">4 Anchors</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => handleJump('home', "Today's Dashboard")}
                className="flex flex-col items-center justify-center p-2 rounded bg-[#272a2e] border border-[#323538] text-center hover:border-[#c3f400] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#c3f400]">grid_view</span>
                <span className="font-label-sm text-[10px] text-[#e1e2e7] mt-0.5">Home</span>
              </button>
              <button
                onClick={() => handleJump('tracker', 'Live In-Workout Tracker')}
                className="flex flex-col items-center justify-center p-2 rounded bg-[#1d2023] border border-[#272a2e] text-center hover:border-[#4cd7f6] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">play_circle</span>
                <span className="font-label-sm text-[10px] text-[#e1e2e7] mt-0.5">Tracker</span>
              </button>
              <button
                onClick={() => handleJump('routines', 'Workout Routines Library')}
                className="flex flex-col items-center justify-center p-2 rounded bg-[#1d2023] border border-[#272a2e] text-center hover:border-[#e1e2e7] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#e1e2e7]">fitness_center</span>
                <span className="font-label-sm text-[10px] text-[#e1e2e7] mt-0.5">Routines</span>
              </button>
              <button
                onClick={() => handleJump('progress', 'Progress & Logs')}
                className="flex flex-col items-center justify-center p-2 rounded bg-[#1d2023] border border-[#272a2e] text-center hover:border-[#e1e2e7] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#e1e2e7]">monitoring</span>
                <span className="font-label-sm text-[10px] text-[#e1e2e7] mt-0.5">Progress</span>
              </button>
            </div>
          </div>

          {/* Connecting Telemetry Pipes */}
          <div className="flex items-center justify-around px-4 py-1">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-0.5 h-3 bg-[#c3f400]/40" />
              <span className="material-symbols-outlined text-[12px] text-[#c3f400]">arrow_downward</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-0.5 h-3 bg-[#4cd7f6]/40" />
              <span className="material-symbols-outlined text-[12px] text-[#4cd7f6]">arrow_downward</span>
            </div>
          </div>

          {/* Tier 2: Deep Link Sub-Hubs */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac] font-semibold">
              Tier 02: Contextual Drawers & Deep Bridges
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => handleJump('devices', 'Connected Devices & Samsung Health')}
                className="flex flex-col p-2 rounded bg-[#1d2023] gap-1 cursor-pointer hover:bg-[#272a2e] border border-[#272a2e] transition-colors"
              >
                <span className="font-label-sm text-[10px] text-[#c3f400] font-bold">Via Dashboard</span>
                <div className="flex items-center gap-1.5 text-[#e1e2e7]">
                  <span className="material-symbols-outlined text-[14px]">watch</span>
                  <span className="font-body-sm text-[11px] truncate">Oraimo & Samsung Health</span>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJump('recovery', 'Recovery & Sleep');
                  }}
                  className="flex items-center gap-1.5 text-[#e1e2e7] hover:text-[#4cd7f6]"
                >
                  <span className="material-symbols-outlined text-[14px]">bedtime</span>
                  <span className="font-body-sm text-[11px] truncate">Recovery & Sleep Lock</span>
                </div>
              </div>

              <div
                onClick={() => handleJump('audio', 'Audio & Spotify Companion')}
                className="flex flex-col p-2 rounded bg-[#1d2023] gap-1 cursor-pointer hover:bg-[#272a2e] border border-[#272a2e] transition-colors"
              >
                <span className="font-label-sm text-[10px] text-[#4cd7f6] font-bold">Via Live Session</span>
                <div className="flex items-center gap-1.5 text-[#e1e2e7]">
                  <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                  <span className="font-body-sm text-[11px] truncate">Marcus Spotify Coach</span>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJump('tracker', 'Sub-Second HR Stream');
                  }}
                  className="flex items-center gap-1.5 text-[#e1e2e7] hover:text-[#c3f400]"
                >
                  <span className="material-symbols-outlined text-[14px]">ecg_heart</span>
                  <span className="font-body-sm text-[11px] truncate">Sub-Second HR Stream</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GROUP 1: Core Execution */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" />
            <h3 className="font-headline-sm text-[17px] font-bold text-[#e1e2e7]">Core Execution</h3>
          </div>
          <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider">
            Primary Shell Elements
          </span>
        </div>

        {/* Node 1: Dashboard */}
        <div className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#c3f400]">
                <span className="material-symbols-outlined text-[22px]">grid_view</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded bg-[#323538] text-[#c4c9ac] font-bold">
                    SCREEN 01
                  </span>
                  <span className="font-headline-sm text-[16px] text-[#e1e2e7] font-bold">
                    Today's Dashboard
                  </span>
                </div>
                <span className="font-label-md text-[11px] text-[#c4c9ac]">
                  Command Center & Quick-Launch
                </span>
              </div>
            </div>
            <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#c3f400]/15 text-[#c3f400] font-bold">
              Primary Tab
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#c4c9ac] leading-relaxed">
            Unified glanceable rings for daily burn, fast-entry tiles for single dumbbell, jump rope cadence, and outdoor jogging telemetry.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-[#272a2e]">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase">Key Outlets:</span>
              <button
                onClick={() => onStartWorkout()}
                className="font-label-sm text-[10px] px-2 py-1 rounded bg-[#1d2023] text-[#e1e2e7] hover:bg-[#272a2e] transition-colors"
              >
                1-Tap Live Session
              </button>
              <button
                onClick={() => onNavigate('routines')}
                className="font-label-sm text-[10px] px-2 py-1 rounded bg-[#1d2023] text-[#e1e2e7] hover:bg-[#272a2e] transition-colors"
              >
                Catalog Browser
              </button>
            </div>
            <button
              onClick={() => onNavigate('routines')}
              className="w-8 h-8 rounded-full bg-[#1d2023] flex items-center justify-center text-[#e1e2e7] hover:bg-[#272a2e] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Node 2: Live Tracker */}
        <div className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#4cd7f6]">
                <span className="material-symbols-outlined text-[22px]">play_circle</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded bg-[#323538] text-[#c4c9ac] font-bold">
                    SCREEN 02
                  </span>
                  <span className="font-headline-sm text-[16px] text-[#e1e2e7] font-bold">
                    Live Tracker
                  </span>
                </div>
                <span className="font-label-md text-[11px] text-[#c4c9ac]">
                  In-Workout Telemetry Engine
                </span>
              </div>
            </div>
            <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#4cd7f6]/15 text-[#4cd7f6] font-bold">
              Real-Time Core
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#c4c9ac] leading-relaxed">
            Sub-second reps tracker, haptic rest countdown timer, current load telemetry, and live Bluetooth heart-rate pulse streams from watch.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-[#272a2e]">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase">Feeds:</span>
              <button
                onClick={() => onNavigate('audio')}
                className="font-label-sm text-[10px] px-2 py-1 rounded bg-[#1d2023] text-[#4cd7f6] hover:bg-[#272a2e]"
              >
                Marcus Spotify Ducking
              </button>
              <button
                onClick={() => onNavigate('devices')}
                className="font-label-sm text-[10px] px-2 py-1 rounded bg-[#1d2023] text-[#e1e2e7] hover:bg-[#272a2e]"
              >
                Watch BLE Pulse
              </button>
            </div>
            <button
              onClick={() => onNavigate('tracker')}
              className="w-8 h-8 rounded-full bg-[#1d2023] flex items-center justify-center text-[#e1e2e7] hover:bg-[#272a2e] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Node 3: Workout Routines */}
        <div className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#e1e2e7]">
                <span className="material-symbols-outlined text-[22px]">fitness_center</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded bg-[#323538] text-[#c4c9ac] font-bold">
                    SCREEN 03
                  </span>
                  <span className="font-headline-sm text-[16px] text-[#e1e2e7] font-bold">
                    Workout Routines
                  </span>
                </div>
                <span className="font-label-md text-[11px] text-[#c4c9ac]">
                  Curated Catalog & Custom Splits
                </span>
              </div>
            </div>
            <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#323538] text-[#c4c9ac] font-bold">
              Primary Tab
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#c4c9ac] leading-relaxed">
            Specialized protocols for minimal gear: Single-Dumbbell Complexes, Jump Rope Cadence Intervals, Tactical Calisthenics, and Zone 2 Walks.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-[#272a2e]">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase">Action:</span>
              <button
                onClick={() => onNavigate('routines')}
                className="font-label-sm text-[10px] px-2 py-1 rounded bg-[#1d2023] text-[#e1e2e7] hover:bg-[#272a2e]"
              >
                Load & Launch into Live Tracker
              </button>
            </div>
            <button
              onClick={() => onNavigate('routines')}
              className="w-8 h-8 rounded-full bg-[#1d2023] flex items-center justify-center text-[#e1e2e7] hover:bg-[#272a2e] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Node 4: Progress & Logs */}
        <div className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#e1e2e7]">
                <span className="material-symbols-outlined text-[22px]">monitoring</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded bg-[#323538] text-[#c4c9ac] font-bold">
                    SCREEN 04
                  </span>
                  <span className="font-headline-sm text-[16px] text-[#e1e2e7] font-bold">
                    Progress & Logs
                  </span>
                </div>
                <span className="font-label-md text-[11px] text-[#c4c9ac]">
                  Tonnage, PR Benchmarks & Volume
                </span>
              </div>
            </div>
            <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#323538] text-[#c4c9ac] font-bold">
              Primary Tab
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#c4c9ac] leading-relaxed">
            Macro analytics, 7-day movement arcs, load delta vs previous cycle, and personal record recognition metrics.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-[#272a2e]">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase">Sync:</span>
              <span className="font-label-sm text-[10px] px-2 py-1 rounded bg-[#1d2023] text-[#e1e2e7]">
                Aggregates all Live Sessions
              </span>
            </div>
            <button
              onClick={() => onNavigate('progress')}
              className="w-8 h-8 rounded-full bg-[#1d2023] flex items-center justify-center text-[#e1e2e7] hover:bg-[#272a2e] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* GROUP 2: Sensors & Hardware System Hubs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]" />
            <h3 className="font-headline-sm text-[17px] font-bold text-[#e1e2e7]">Sensors & Context Hubs</h3>
          </div>
          <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider">
            Dedicated Modular Sub-Screens
          </span>
        </div>

        {/* Visual Banner Asset */}
        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-[#191c1f] border border-[#272a2e] shadow-sm">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4YV8ulk8j8hN5RGQth9-Vynaqu-yhgPaOwLEE6L-zph43IrSkX2Y1O4YWkrao9MaF_TifCZAcSU-TuLv9clLab4x9Drz5Z7CbeaxopRS01WX3llvcj192wvZKZZCVIqsY-_O5MGyWDJlduwk2eguoJhUL5AtfIVMVCeRPRaa_zepuxdt1YOGOKtUZigNnEIpGIek1YA64JO2B4aVfNQKT6M9cDR2ecS2lfaDkFbZe1ITF4BPVNwrA1Q"
            alt="Hardware Interlock BLE Pipeline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e11] via-[#0b0e11]/60 to-transparent flex items-end p-4">
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="font-label-sm text-[10px] text-[#4cd7f6] uppercase tracking-widest font-bold">
                  Hardware Interlock
                </span>
                <p className="font-label-lg text-[14px] text-[#e1e2e7] font-semibold">
                  BLE Sensor Pipeline & Audio Telemetry
                </p>
              </div>
              <span className="material-symbols-outlined text-[20px] text-[#c3f400]">hub</span>
            </div>
          </div>
        </div>

        {/* Node 5: Recovery & Sleep */}
        <div
          onClick={() => onNavigate('recovery')}
          className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-2.5 cursor-pointer hover:border-[#4cd7f6] transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#c3f400]">
                <span className="material-symbols-outlined text-[22px]">nights_stay</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded bg-[#323538] text-[#c4c9ac] font-bold">
                    SCREEN 05
                  </span>
                  <span className="font-headline-sm text-[16px] text-[#e1e2e7] font-bold">
                    Recovery & Sleep
                  </span>
                </div>
                <span className="font-label-md text-[11px] text-[#c4c9ac]">
                  Sleep Architecture & Screen Lockout
                </span>
              </div>
            </div>
            <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#1d2023] text-[#c4c9ac]">
              Hub Module
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#c4c9ac] leading-relaxed">
            Stage breakdown (Deep, REM, Light), readiness index calculations, and automated nighttime screen-time intervention to enforce rest.
          </p>

          <div className="flex items-center gap-1.5 text-[#c4c9ac] font-label-sm text-[10px]">
            <span className="material-symbols-outlined text-[14px] text-[#c3f400]">arrow_forward</span>
            <span>Feeds Readiness score into Screen 01 Home prior to morning training</span>
          </div>
        </div>

        {/* Node 6: Audio & Spotify Companion */}
        <div
          onClick={() => onNavigate('audio')}
          className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-2.5 cursor-pointer hover:border-[#c3f400] transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#4cd7f6]">
                <span className="material-symbols-outlined text-[22px]">headphones</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded bg-[#323538] text-[#c4c9ac] font-bold">
                    SCREEN 06
                  </span>
                  <span className="font-headline-sm text-[16px] text-[#e1e2e7] font-bold">
                    Audio & Spotify Companion
                  </span>
                </div>
                <span className="font-label-md text-[11px] text-[#c4c9ac]">
                  Coach Marcus & BPM Pace Lock
                </span>
              </div>
            </div>
            <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#1d2023] text-[#c4c9ac]">
              Hub Module
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#c4c9ac] leading-relaxed">
            Adaptive pacing soundtrack locked to 140-160 BPM, automatic Spotify volume ducking during Marcus vocal coaching cues & split alerts.
          </p>

          <div className="flex items-center gap-1.5 text-[#c4c9ac] font-label-sm text-[10px]">
            <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">arrow_forward</span>
            <span>Directly coupled to Screen 02 Live Tracker active timer states</span>
          </div>
        </div>

        {/* Node 7: Connected Devices & Health */}
        <div
          onClick={() => onNavigate('devices')}
          className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-2.5 cursor-pointer hover:border-[#c3f400] transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#c3f400]">
                <span className="material-symbols-outlined text-[22px]">devices_wearables</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded bg-[#323538] text-[#c4c9ac] font-bold">
                    SCREEN 07
                  </span>
                  <span className="font-headline-sm text-[16px] text-[#e1e2e7] font-bold">
                    Connected Devices & Health
                  </span>
                </div>
                <span className="font-label-md text-[11px] text-[#c4c9ac]">
                  Oraimo Watch 4 Pro & Samsung Health
                </span>
              </div>
            </div>
            <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#1d2023] text-[#c4c9ac]">
              Hardware Bridge
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#c4c9ac] leading-relaxed">
            Low-latency BLE telemetry pipeline, bidirectional Samsung Health sync for calorie burn, active minutes, and continuous watch battery status.
          </p>

          <div className="flex items-center gap-1.5 text-[#c4c9ac] font-label-sm text-[10px]">
            <span className="material-symbols-outlined text-[14px] text-[#c3f400]">arrow_forward</span>
            <span>Feeds hardware diagnostics to Screen 01 and biometric telemetry to Screen 02</span>
          </div>
        </div>
      </div>

      {/* End-to-End User Flow Timeline */}
      <div className="flex flex-col p-4 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#c3f400]">timeline</span>
            <h3 className="font-headline-sm text-[16px] font-bold text-[#e1e2e7]">Daily Flow Pathways</h3>
          </div>
          <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#1d2023] text-[#c4c9ac]">
            3 Phases
          </span>
        </div>

        {/* Phase 1 */}
        <div className="flex gap-3 items-start">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#c3f400] flex items-center justify-center text-[#283500] font-bold text-[11px]">
              01
            </div>
            <div className="w-0.5 h-12 bg-[#323538] my-1" />
          </div>
          <div className="flex flex-col gap-0.5 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-label-lg text-[13px] font-bold text-[#e1e2e7]">
                Morning / Pre-Workout
              </span>
              <span className="font-label-sm text-[10px] text-[#c3f400] font-semibold">Phase 1</span>
            </div>
            <p className="font-body-sm text-[11px] text-[#c4c9ac] leading-snug">
              User checks Recovery Score (<span className="text-[#e1e2e7] font-semibold">Screen 05</span>) → Verifies Oraimo Watch BLE link (<span className="text-[#e1e2e7] font-semibold">Screen 07</span>) → Selects Single-Dumbbell session from Routines (<span className="text-[#e1e2e7] font-semibold">Screen 03</span>).
            </p>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="flex gap-3 items-start">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#4cd7f6] flex items-center justify-center text-[#003640] font-bold text-[11px]">
              02
            </div>
            <div className="w-0.5 h-12 bg-[#323538] my-1" />
          </div>
          <div className="flex flex-col gap-0.5 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-label-lg text-[13px] font-bold text-[#e1e2e7]">
                During Workout Session
              </span>
              <span className="font-label-sm text-[10px] text-[#4cd7f6] font-semibold">Phase 2</span>
            </div>
            <p className="font-body-sm text-[11px] text-[#c4c9ac] leading-snug">
              Executes reps in Live Tracker (<span className="text-[#e1e2e7] font-semibold">Screen 02</span>) → Listens to Trainer Marcus audio cues & 140 BPM cadence (<span className="text-[#e1e2e7] font-semibold">Screen 06</span>) → Heart rate streams direct from Oraimo sensor.
            </p>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="flex gap-3 items-start">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#323538] flex items-center justify-center text-[#e1e2e7] font-bold text-[11px]">
              03
            </div>
          </div>
          <div className="flex flex-col gap-0.5 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-label-lg text-[13px] font-bold text-[#e1e2e7]">
                Post-Workout & Night Lockout
              </span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] font-semibold">Phase 3</span>
            </div>
            <p className="font-body-sm text-[11px] text-[#c4c9ac] leading-snug">
              Session volume commits to Progress Records (<span className="text-[#e1e2e7] font-semibold">Screen 04</span>) & syncs with Samsung Health (<span className="text-[#e1e2e7] font-semibold">Screen 07</span>) → Night bedtime screen lockout activates (<span className="text-[#e1e2e7] font-semibold">Screen 05</span>).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Quick-Jump Navigation Index */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">
            Quick Jump Index
          </span>
          <span className="font-label-sm text-[10px] text-[#c3f400] font-semibold">Interactive Nodes</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleJump('home', "01. Today's Dashboard")}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1d2023] border border-[#272a2e] text-left hover:bg-[#272a2e] hover:border-[#c3f400] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#c3f400]">grid_view</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[11px] text-[#e1e2e7] truncate font-bold">01. Dashboard</span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] truncate">Command Home</span>
            </div>
          </button>

          <button
            onClick={() => handleJump('tracker', '02. Live Tracker')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1d2023] border border-[#272a2e] text-left hover:bg-[#272a2e] hover:border-[#4cd7f6] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">play_circle</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[11px] text-[#e1e2e7] truncate font-bold">02. Live Tracker</span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] truncate">Reps & Telemetry</span>
            </div>
          </button>

          <button
            onClick={() => handleJump('routines', '03. Workout Routines')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1d2023] border border-[#272a2e] text-left hover:bg-[#272a2e] hover:border-[#e1e2e7] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#e1e2e7]">fitness_center</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[11px] text-[#e1e2e7] truncate font-bold">03. Routines</span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] truncate">Catalog Splits</span>
            </div>
          </button>

          <button
            onClick={() => handleJump('progress', '04. Progress & Logs')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1d2023] border border-[#272a2e] text-left hover:bg-[#272a2e] hover:border-[#e1e2e7] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#e1e2e7]">monitoring</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[11px] text-[#e1e2e7] truncate font-bold">04. Progress</span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] truncate">Volume & PRs</span>
            </div>
          </button>

          <button
            onClick={() => handleJump('recovery', '05. Recovery & Sleep')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1d2023] border border-[#272a2e] text-left hover:bg-[#272a2e] hover:border-[#c3f400] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#c3f400]">nights_stay</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[11px] text-[#e1e2e7] truncate font-bold">05. Sleep & Lock</span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] truncate">Recovery Hub</span>
            </div>
          </button>

          <button
            onClick={() => handleJump('audio', '06. Marcus Audio & Spotify')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1d2023] border border-[#272a2e] text-left hover:bg-[#272a2e] hover:border-[#4cd7f6] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">headphones</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[11px] text-[#e1e2e7] truncate font-bold">06. Marcus Audio</span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] truncate">Spotify Companion</span>
            </div>
          </button>

          <button
            onClick={() => handleJump('devices', '07. Connected Devices & Health')}
            className="col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-[#1d2023] border border-[#272a2e] hover:bg-[#272a2e] hover:border-[#c3f400] transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#c3f400]">devices_wearables</span>
              <div className="flex flex-col">
                <span className="font-label-md text-[11px] text-[#e1e2e7] font-bold">
                  07. Connected Devices & Health Bridge
                </span>
                <span className="font-label-sm text-[10px] text-[#c4c9ac]">
                  Oraimo Watch 4 Pro BLE • Samsung Health 2-Way Pipeline
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#c4c9ac]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40 p-3 rounded-xl bg-[#272a2e] border border-[#c3f400]/40 text-[#e1e2e7] flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
            <span className="font-label-sm text-[11px] font-semibold">{toastMessage}</span>
          </div>
          <span className="font-label-sm text-[9px] text-[#c4c9ac] uppercase tracking-wider font-mono">
            Ecosystem Synced
          </span>
        </div>
      )}
    </div>
  );
};
