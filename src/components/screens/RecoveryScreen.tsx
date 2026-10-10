import React, { useState } from 'react';
import { SleepData } from '../../types';

interface RecoveryScreenProps {
  sleepData: SleepData;
  onUpdateSleepData: (data: Partial<SleepData>) => void;
  onOpenWindDown: () => void;
}

export const RecoveryScreen: React.FC<RecoveryScreenProps> = ({
  sleepData,
  onUpdateSleepData,
  onOpenWindDown
}) => {
  const [selectedStage, setSelectedStage] = useState<'deep' | 'rem' | 'light'>('deep');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashOffset, setDashOffset] = useState(17);
  const [hydrationLiters, setHydrationLiters] = useState(sleepData.hydrationLiters);
  const [circadianFilter, setCircadianFilter] = useState(sleepData.circadianFilterActive);

  const stageInfo = {
    deep: {
      icon: 'verified_user',
      color: 'text-[#4cd7f6]',
      text: 'Physical rebuilding peaked at <strong class="text-[#4cd7f6] uppercase">01:45 AM</strong> with steady delta waves.'
    },
    rem: {
      icon: 'psychology',
      color: 'text-[#c3f400]',
      text: 'Cognitive consolidation active across <strong class="text-[#c3f400] uppercase">4 cycles</strong>, primarily after 04:00 AM.'
    },
    light: {
      icon: 'bedtime',
      color: 'text-[#e1e2e7]',
      text: 'Metabolic transition & core cooling: <strong class="text-[#e1e2e7] uppercase">3h 37m</strong> maintaining low muscle tone.'
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setDashOffset(188.5);
    setTimeout(() => {
      setDashOffset(17);
      setIsRefreshing(false);
    }, 500);
  };

  const handleAddHydration = () => {
    const updated = +(hydrationLiters + 0.25).toFixed(2);
    setHydrationLiters(updated);
    onUpdateSleepData({ hydrationLiters: updated });
  };

  const toggleCircadian = () => {
    const updated = !circadianFilter;
    setCircadianFilter(updated);
    onUpdateSleepData({ circadianFilterActive: updated });
  };

  return (
    <div className="flex flex-col w-full pb-10 gap-5 animate-in fade-in duration-300">
      {/* Subheader with Date Pill and Live Status */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#272a2e] text-[#e1e2e7] border border-[#323538]">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
            <span className="font-label-md text-[10px] uppercase tracking-wider text-[#c3f400] font-bold">
              Telemetry Synced
            </span>
          </span>
          <span className="font-label-md text-[11px] uppercase text-[#c4c9ac] font-semibold">
            Today, Oct 24
          </span>
        </div>

        <button
          onClick={handleRefresh}
          aria-label="Refresh telemetry data"
          className="w-9 h-9 rounded-full bg-[#1d2023] border border-[#272a2e] flex items-center justify-center text-[#e1e2e7] hover:text-[#c3f400] active:scale-90 transition-all"
        >
          <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>
            sync
          </span>
        </button>
      </div>

      {/* Hero: Readiness & Recovery Score Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#191c1f] border border-[#272a2e] p-4 shadow-md">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#4cd7f6]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#c3f400]/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="font-label-md text-[11px] uppercase tracking-wider text-[#c4c9ac] font-semibold">
              Recovery Score
            </span>
            <h2 className="font-headline-md text-[32px] text-[#e1e2e7] tracking-tight flex items-center gap-2 font-extrabold">
              {sleepData.recoveryScore}
              <span className="text-[#4cd7f6] text-[18px] font-normal">%</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#c3f400] text-[#283500] font-label-sm text-[10px] font-bold tracking-wide uppercase">
                Optimal
              </span>
            </h2>
          </div>

          {/* Circular Radial Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
              <circle
                className="text-[#323538]"
                cx="36"
                cy="36"
                fill="none"
                r="30"
                stroke="currentColor"
                strokeWidth="6"
              />
              <circle
                className="transition-all duration-700 ease-out"
                cx="36"
                cy="36"
                fill="none"
                r="30"
                stroke="url(#volt-cyan-grad)"
                strokeDasharray="188.5"
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                strokeWidth="6.5"
              />
              <defs>
                <linearGradient id="volt-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4cd7f6" />
                  <stop offset="100%" stopColor="#c3f400" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">bolt</span>
            </div>
          </div>
        </div>

        {/* Secondary Readiness Signals (HRV & RHR) */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#272a2e]">
          <div className="flex flex-col rounded-lg bg-[#1d2023] p-2.5 border border-[#272a2e]">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac]">
                Resting Heart Rate
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">favorite</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-metric-numeral-sm text-[26px] text-[#e1e2e7] font-bold">
                {sleepData.rhr}
              </span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac]">BPM</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-[#c3f400] font-label-sm text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              <span>-3 bpm vs 30d</span>
            </div>
          </div>

          <div className="flex flex-col rounded-lg bg-[#1d2023] p-2.5 border border-[#272a2e]">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac]">
                HRV Status
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">ecg_heart</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-metric-numeral-sm text-[26px] text-[#e1e2e7] font-bold">
                {sleepData.hrv}
              </span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac]">MS</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-[#c3f400] font-label-sm text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Balanced (Range 68-82)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Architecture Deep-Dive */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">bedtime</span>
            <h3 className="font-headline-sm text-[16px] font-bold text-[#e1e2e7]">
              Sleep Architecture
            </h3>
          </div>
          <span className="font-label-md text-[11px] uppercase text-[#c3f400] tracking-wider font-bold">
            Quality 96%
          </span>
        </div>

        {/* Main Sleep Card */}
        <div className="rounded-xl bg-[#191c1f] border border-[#272a2e] p-4 shadow-md flex flex-col gap-3.5">
          {/* Top Metrics Row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-md text-[10px] uppercase text-[#c4c9ac] font-semibold">
                Total Duration
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-metric-numeral-sm text-[28px] text-[#e1e2e7] font-bold">
                  {sleepData.totalDuration.hours}
                </span>
                <span className="font-label-lg text-[13px] text-[#c4c9ac]">h</span>
                <span className="font-metric-numeral-sm text-[28px] text-[#e1e2e7] font-bold ml-1">
                  {sleepData.totalDuration.minutes}
                </span>
                <span className="font-label-lg text-[13px] text-[#c4c9ac]">m</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1d2023] border border-[#272a2e] rounded-lg px-2.5 py-1.5">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">schedule</span>
              <div className="flex flex-col text-right">
                <span className="font-label-sm text-[9px] uppercase text-[#c4c9ac]">Asleep / In Bed</span>
                <span className="font-label-md text-[11px] text-[#e1e2e7] font-bold">{sleepData.sleepWindow}</span>
              </div>
            </div>
          </div>

          {/* Segmented Stacked Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-3 rounded-full bg-[#1d2023] overflow-hidden flex border border-[#272a2e]">
              <div
                className="h-full bg-[#4cd7f6] transition-all"
                style={{ width: `${sleepData.stages.deep.percent}%` }}
                title={`Deep: ${sleepData.stages.deep.hours}h ${sleepData.stages.deep.minutes}m`}
              />
              <div
                className="h-full bg-[#c3f400] transition-all"
                style={{ width: `${sleepData.stages.rem.percent}%` }}
                title={`REM: ${sleepData.stages.rem.hours}h ${sleepData.stages.rem.minutes}m`}
              />
              <div
                className="h-full bg-[#323538] transition-all"
                style={{ width: `${sleepData.stages.light.percent}%` }}
                title={`Light: ${sleepData.stages.light.hours}h ${sleepData.stages.light.minutes}m`}
              />
            </div>

            {/* Segmented Stage Badges / Selector */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => setSelectedStage('deep')}
                className={`flex flex-col p-2 rounded-lg text-left transition-all active:scale-95 border ${
                  selectedStage === 'deep'
                    ? 'bg-[#272a2e] border-[#4cd7f6]'
                    : 'bg-[#1d2023] border-[#272a2e]'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" />
                  <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac]">Deep</span>
                </div>
                <span className="font-label-lg text-[13px] text-[#e1e2e7] font-bold">
                  {sleepData.stages.deep.hours}h {sleepData.stages.deep.minutes}m
                </span>
                <span className="font-label-sm text-[10px] text-[#4cd7f6]">
                  {sleepData.stages.deep.percent}% (+5%)
                </span>
              </button>

              <button
                onClick={() => setSelectedStage('rem')}
                className={`flex flex-col p-2 rounded-lg text-left transition-all active:scale-95 border ${
                  selectedStage === 'rem'
                    ? 'bg-[#272a2e] border-[#c3f400]'
                    : 'bg-[#1d2023] border-[#272a2e]'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#c3f400]" />
                  <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac]">REM</span>
                </div>
                <span className="font-label-lg text-[13px] text-[#e1e2e7] font-bold">
                  {sleepData.stages.rem.hours}h {sleepData.stages.rem.minutes}m
                </span>
                <span className="font-label-sm text-[10px] text-[#c3f400]">
                  {sleepData.stages.rem.percent}% (Optimal)
                </span>
              </button>

              <button
                onClick={() => setSelectedStage('light')}
                className={`flex flex-col p-2 rounded-lg text-left transition-all active:scale-95 border ${
                  selectedStage === 'light'
                    ? 'bg-[#272a2e] border-[#e1e2e7]'
                    : 'bg-[#1d2023] border-[#272a2e]'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#37393d]" />
                  <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac]">Light</span>
                </div>
                <span className="font-label-lg text-[13px] text-[#e1e2e7] font-bold">
                  {sleepData.stages.light.hours}h {sleepData.stages.light.minutes}m
                </span>
                <span className="font-label-sm text-[10px] text-[#c4c9ac]">
                  {sleepData.stages.light.percent}%
                </span>
              </button>
            </div>
          </div>

          {/* Stage Micro-Detail Tip */}
          <div className="rounded-lg bg-[#1d2023] border border-[#272a2e] px-3 py-2 flex items-center gap-2">
            <span className={`material-symbols-outlined text-[18px] ${stageInfo[selectedStage].color}`}>
              {stageInfo[selectedStage].icon}
            </span>
            <p
              className="font-body-sm text-[12px] text-[#e1e2e7] leading-tight"
              dangerouslySetInnerHTML={{ __html: stageInfo[selectedStage].text }}
            />
          </div>

          {/* 7-Day Sleep Duration Chart with 8h Target Baseline */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac] tracking-wider font-semibold">
                7-Day Trajectory vs 8h Target
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-[#c3f400]" />
                <span className="font-label-sm text-[10px] text-[#c4c9ac]">Target (8h)</span>
              </div>
            </div>

            <div className="relative w-full h-32 rounded-lg bg-[#1d2023] border border-[#272a2e] p-3 flex flex-col justify-end">
              {/* Target 8h Horizontal Dashed Line */}
              <div className="absolute left-0 right-0 top-[26%] border-t border-dashed border-[#c3f400]/40 pointer-events-none" />

              {/* Vertical Bars for 7 Days */}
              <div className="w-full h-full flex items-end justify-between z-10 pt-2 pb-5">
                {[
                  { day: 'F', height: '68%', active: false },
                  { day: 'S', height: '84%', active: false },
                  { day: 'S', height: '72%', active: false },
                  { day: 'M', height: '90%', active: true, cyan: true },
                  { day: 'T', height: '60%', active: false },
                  { day: 'W', height: '88%', active: true, cyan: true },
                  { day: 'T', height: '96%', active: true, volt: true, isToday: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 group">
                    <div
                      style={{ height: item.height }}
                      className={`w-4.5 rounded-t-sm transition-all ${
                        item.isToday
                          ? 'bg-[#c3f400] shadow-md shadow-[#c3f400]/20'
                          : item.cyan
                          ? 'bg-[#4cd7f6]'
                          : 'bg-[#323538] group-hover:bg-[#4cd7f6]'
                      }`}
                    />
                    <span
                      className={`font-label-sm text-[10px] mt-1.5 ${
                        item.isToday ? 'font-bold text-[#c3f400]' : 'text-[#c4c9ac]'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[#c4c9ac] font-label-sm text-[10px] -mt-2">
                <span>Avg 7h 41m / night</span>
                <span className="text-[#c3f400] font-bold">6 of 7 Goals Met</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Wellness & Mobile Screen Time */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              screen_lock_portrait
            </span>
            <h3 className="font-headline-sm text-[16px] font-bold text-[#e1e2e7]">
              Digital Wellness
            </h3>
          </div>
          <span className="font-label-md text-[10px] uppercase text-[#c4c9ac] font-semibold">
            Lockout System
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Metric 1: Daily Usage */}
          <div className="rounded-xl bg-[#191c1f] border border-[#272a2e] p-3 flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac]">
                Screen Time
              </span>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                phonelink_ring
              </span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-metric-numeral-sm text-[26px] font-bold text-[#e1e2e7]">
                  {sleepData.screenTimeHours}
                </span>
                <span className="font-label-sm text-[10px] text-[#c4c9ac]">H</span>
                <span className="font-metric-numeral-sm text-[26px] font-bold text-[#e1e2e7] ml-1">
                  {sleepData.screenTimeMinutes}
                </span>
                <span className="font-label-sm text-[10px] text-[#c4c9ac]">M</span>
              </div>
              <div className="flex items-center gap-1 text-[#c3f400] font-label-sm text-[10px] mt-0.5">
                <span className="material-symbols-outlined text-[13px]">arrow_downward</span>
                <span>{sleepData.screenTimeDeltaPercent}% vs average</span>
              </div>
            </div>
            <span className="font-body-sm text-[11px] text-[#c4c9ac] leading-tight">
              Within target recovery limit (&lt;2h)
            </span>
          </div>

          {/* Metric 2: Lockout Adherence */}
          <div className="rounded-xl bg-[#191c1f] border border-[#272a2e] p-3 flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[10px] uppercase text-[#c4c9ac]">
                Bedtime Lockout
              </span>
              <span className="material-symbols-outlined text-[#c3f400] text-[18px]">
                verified
              </span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-metric-numeral-sm text-[26px] font-bold text-[#e1e2e7]">
                  {sleepData.bedtimeLockoutPercent}
                </span>
                <span className="font-label-md text-[13px] text-[#c3f400] font-bold">%</span>
              </div>
              <div className="flex items-center gap-1 text-[#c3f400] font-label-sm text-[10px] mt-0.5">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>Honored 30m prior</span>
              </div>
            </div>
            <span className="font-body-sm text-[11px] text-[#c4c9ac] leading-tight">
              Phone parked out of reach at 10:30 PM
            </span>
          </div>
        </div>

        {/* Latency Impact Insight Card */}
        <div className="rounded-xl bg-[#191c1f] border border-[#272a2e] p-3.5 shadow-md flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1d2023] border border-[#272a2e] flex items-center justify-center shrink-0 text-[#4cd7f6]">
            <span className="material-symbols-outlined text-[22px]">insights</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-label-md text-[10px] uppercase text-[#4cd7f6] font-bold tracking-wider">
              Bio-Feedback Correlation
            </span>
            <p className="font-body-md text-[13px] text-[#e1e2e7] font-semibold">
              Consistent bedtime lockout improved your deep sleep stage by{' '}
              <span className="text-[#c3f400]">+18%</span>.
            </p>
            <span className="font-body-sm text-[11px] text-[#c4c9ac]">
              Latency reduced from 22 minutes to 8 minutes over the last 14 sessions.
            </span>
          </div>
        </div>
      </div>

      {/* Recovery Action Protocol */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#c3f400] text-[20px]">tune</span>
            <h3 className="font-headline-sm text-[16px] font-bold text-[#e1e2e7]">
              Recovery Protocol
            </h3>
          </div>
          <span className="font-label-md text-[10px] uppercase text-[#c4c9ac] font-semibold">
            Evening Stack
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Action 1: Wind-down routine */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#1d2023] flex items-center justify-center shrink-0 text-[#e1e2e7] border border-[#272a2e]">
                <span className="material-symbols-outlined text-[20px]">self_improvement</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-label-lg text-[13px] font-bold text-[#e1e2e7] truncate">
                  Wind-Down Mobility
                </h4>
                <span className="font-body-sm text-[11px] text-[#c4c9ac]">
                  10m Thoracic & Hip Decompression
                </span>
              </div>
            </div>
            <button
              onClick={onOpenWindDown}
              className="px-4 py-2 rounded-lg bg-[#c3f400] text-[#283500] font-label-md text-[11px] font-extrabold uppercase tracking-wider shrink-0 hover:bg-[#abd600] active:scale-95 transition-all shadow-sm"
            >
              Start
            </button>
          </div>

          {/* Action 2: Hydration status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#1d2023] flex items-center justify-center shrink-0 text-[#4cd7f6] border border-[#272a2e]">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-label-lg text-[13px] font-bold text-[#e1e2e7] truncate">
                    Hydration & Electrolytes
                  </h4>
                  <span className="inline-flex px-1.5 py-0.5 rounded bg-[#1d2023] text-[#4cd7f6] font-label-sm text-[10px] font-bold font-mono">
                    {hydrationLiters}L / 3.0L
                  </span>
                </div>
                <span className="font-body-sm text-[11px] text-[#c4c9ac]">
                  Optimal baseline reached before 8 PM
                </span>
              </div>
            </div>
            <button
              onClick={handleAddHydration}
              aria-label="Add 250ml water"
              className="w-9 h-9 rounded-lg bg-[#1d2023] border border-[#272a2e] flex items-center justify-center text-[#e1e2e7] hover:text-[#4cd7f6] active:scale-90 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Action 3: Blue Light Cut-off Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#191c1f] border border-[#272a2e] shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#1d2023] flex items-center justify-center shrink-0 text-[#4cd7f6] border border-[#272a2e]">
                <span className="material-symbols-outlined text-[20px]">wb_twilight</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-label-lg text-[13px] font-bold text-[#e1e2e7] truncate">
                  Circadian Filter
                </h4>
                <span className="font-body-sm text-[11px] text-[#c4c9ac]">
                  Auto blue light lockout at 9:30 PM
                </span>
              </div>
            </div>

            <div
              onClick={toggleCircadian}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                circadianFilter ? 'bg-[#4cd7f6]' : 'bg-[#323538]'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full transition-transform ${
                  circadianFilter ? 'translate-x-4.5 bg-[#003640]' : 'translate-x-0 bg-[#e1e2e7]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
