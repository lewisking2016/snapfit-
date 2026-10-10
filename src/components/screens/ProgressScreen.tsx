import React from 'react';

interface WorkoutSessionLog {
  id: string;
  routineTitle: string;
  date: string;
  durationMins: number;
  calories: number;
  setsCompleted: number;
  avgHr: number;
}

interface ProgressScreenProps {
  logs: WorkoutSessionLog[];
  onStartNewWorkout: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ logs, onStartNewWorkout }) => {
  const prs = [
    { movement: 'Single DB Floor Press', weight: '24 KG', date: 'Oct 22', change: '+2 KG PR', icon: 'fitness_center' },
    { movement: 'Hang Snatch (Single DB)', weight: '20 KG', date: 'Oct 19', change: '+4 reps', icon: 'bolt' },
    { movement: 'Jump Rope Peak Cadence', weight: '156 RPM', date: 'Oct 24', change: 'Zone 4 Lock', icon: 'speed' },
    { movement: 'Bulgarian Split Squat Volume', weight: '1,920 KG', date: 'Oct 17', change: '+12% Vol', icon: 'trending_up' }
  ];

  return (
    <div className="flex flex-col w-full pb-10 gap-5 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider font-semibold">
            SCREEN 04 • ANALYTICS
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#c3f400] bg-[#272a2e] px-2 py-0.5 rounded border border-[#323538]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" /> Cycle Delta +12%
          </span>
        </div>
        <h2 className="font-headline-lg-mobile text-[24px] font-bold text-[#e1e2e7] tracking-tight">
          Progress & Logs
        </h2>
        <p className="font-body-sm text-[12px] text-[#c4c9ac]">
          Tonnage, PR Benchmarks & Biometric Volume Aggregation
        </p>
      </div>

      {/* Macro Tonnage Card */}
      <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-[11px] uppercase tracking-wider text-[#c4c9ac] font-bold">
            Weekly Accumulated Tonnage
          </span>
          <span className="text-[10px] text-[#4cd7f6] bg-[#191c1f] px-2 py-0.5 rounded border border-[#272a2e] font-mono">
            4-Day Split
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-metric-numeral text-[40px] font-extrabold text-[#e1e2e7] tracking-tight">
            14,820
          </span>
          <span className="text-[16px] text-[#c4c9ac] font-bold">KG</span>
          <span className="text-[#c3f400] text-[12px] font-bold flex items-center gap-0.5 ml-2">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            +1,420 KG vs last week
          </span>
        </div>

        {/* 7-Day Tonnage Sparkline Bars */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="h-24 w-full flex items-end justify-between pt-2">
            {[
              { day: 'Mon', vol: 2400, height: '60%' },
              { day: 'Tue', vol: 3200, height: '80%' },
              { day: 'Wed', vol: 0, height: '10%' },
              { day: 'Thu', vol: 4100, height: '95%', isPeak: true },
              { day: 'Fri', vol: 2800, height: '70%' },
              { day: 'Sat', vol: 2320, height: '58%' },
              { day: 'Sun', vol: 0, height: '10%' }
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div
                  style={{ height: bar.height }}
                  className={`w-5 rounded-t-sm transition-all ${
                    bar.isPeak ? 'bg-[#c3f400]' : bar.vol > 0 ? 'bg-[#4cd7f6]' : 'bg-[#272a2e]'
                  }`}
                />
                <span className="text-[9px] text-[#c4c9ac] mt-1 font-mono">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PR Benchmarks Grid */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#c3f400] text-[18px]">trophy</span>
            <h3 className="font-headline-sm text-[16px] font-bold text-[#e1e2e7]">
              Personal Records
            </h3>
          </div>
          <span className="font-label-sm text-[10px] text-[#c4c9ac]">All-Time Bests</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {prs.map((pr, idx) => (
            <div key={idx} className="bg-[#191c1f] border border-[#272a2e] p-3 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="material-symbols-outlined text-[#c3f400] text-[18px]">{pr.icon}</span>
                <span className="text-[9px] text-[#4cd7f6] bg-[#1d2023] px-1.5 py-0.5 rounded font-mono">
                  {pr.date}
                </span>
              </div>
              <span className="font-headline-sm text-[17px] font-bold text-[#e1e2e7]">
                {pr.weight}
              </span>
              <span className="text-[11px] text-[#c4c9ac] font-medium truncate mt-0.5">
                {pr.movement}
              </span>
              <span className="text-[10px] text-[#c3f400] font-semibold mt-1">
                {pr.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workout Logs */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">history</span>
            <h3 className="font-headline-sm text-[16px] font-bold text-[#e1e2e7]">
              Session History
            </h3>
          </div>
          <span className="text-[11px] text-[#c4c9ac]">{logs.length} Logged</span>
        </div>

        <div className="flex flex-col gap-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-[#1d2023] border border-[#272a2e] p-3 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#c3f400] shrink-0 border border-[#323538]">
                  <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[13px] text-[#e1e2e7] truncate max-w-[190px]">
                    {log.routineTitle}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#c4c9ac] mt-0.5">
                    <span>{log.date}</span>
                    <span>•</span>
                    <span>{log.durationMins} min</span>
                    <span>•</span>
                    <span className="text-[#c3f400] font-semibold">{log.calories} kcal</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[12px] font-bold text-[#ffb4ab] font-mono">
                  {log.avgHr} BPM
                </span>
                <span className="text-[9px] text-[#4cd7f6] uppercase tracking-wider font-semibold">
                  Synced
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Session CTA */}
      <button
        onClick={onStartNewWorkout}
        className="w-full h-12 bg-[#c3f400] text-[#283500] hover:bg-[#abd600] active:scale-[0.98] rounded-xl font-label-lg text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#c3f400]/20"
      >
        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
        <span>Launch New Routine</span>
      </button>
    </div>
  );
};
