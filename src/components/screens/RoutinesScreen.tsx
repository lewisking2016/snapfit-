import React, { useState } from 'react';
import { Routine } from '../../types';
import { FEATURED_ROUTINE, ROUTINE_LIBRARY } from '../../data/mockData';

interface RoutinesScreenProps {
  onStartWorkout: (routine: Routine, weightKg: number) => void;
  onPreviewRoutine: (routine: Routine) => void;
}

export const RoutinesScreen: React.FC<RoutinesScreenProps> = ({
  onStartWorkout,
  onPreviewRoutine
}) => {
  const [selectedWeight, setSelectedWeight] = useState<'15kg' | '20kg' | '24kg' | 'Adj'>('15kg');
  const [customWeightKg, setCustomWeightKg] = useState<number>(18);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const calibrationProfiles: Record<string, string> = {
    '15kg': '12-15 Reps / side (Hypertrophy Pace)',
    '20kg': '8-10 Reps / side (Power & Density)',
    '24kg': '5-6 Reps / side (Max Force Control)',
    'Adj': `${customWeightKg} KG: Auto-scaled to 9-11 Reps / side`
  };

  const getWeightNumber = () => {
    if (selectedWeight === '15kg') return 15;
    if (selectedWeight === '20kg') return 20;
    if (selectedWeight === '24kg') return 24;
    return customWeightKg;
  };

  const categories = [
    'ALL',
    'SINGLE DUMBBELL ONLY',
    'JUMP ROPE HIIT',
    'BODYWEIGHT CALISTHENICS',
    'HYBRID COMBOS'
  ];

  const filteredRoutines = ROUTINE_LIBRARY.filter((r) => {
    if (activeFilter === 'ALL') return true;
    return r.category.toUpperCase() === activeFilter;
  });

  return (
    <div className="flex flex-col w-full pb-10 gap-4 animate-in fade-in duration-300">
      {/* Calibration / Telemetry Quick Bar */}
      <section className="pt-2">
        <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#c3f400] shrink-0">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <div className="min-w-0">
                <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider block">
                  Auto-Calibration Matrix
                </span>
                <h2 className="font-headline-sm text-[16px] text-[#e1e2e7] font-bold truncate">
                  Custom Load Setup
                </h2>
              </div>
            </div>
            <span className="bg-[#c3f400]/15 text-[#c3f400] font-label-sm text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
              Active Sync
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#c4c9ac] mb-3 leading-snug">
            Calibrate sets & interval targets to your physical dumbbell weight.
          </p>

          {/* Weight Segment Controller */}
          <div className="grid grid-cols-4 gap-1.5 bg-[#191c1f] p-1 rounded-lg border border-[#272a2e]">
            <button
              onClick={() => setSelectedWeight('15kg')}
              className={`py-2 px-1 rounded font-label-md text-[11px] flex flex-col items-center justify-center transition-all ${
                selectedWeight === '15kg'
                  ? 'bg-[#323538] text-[#c3f400] shadow-sm font-bold border border-[#c3f400]/30'
                  : 'bg-transparent text-[#c4c9ac] hover:text-[#e1e2e7]'
              }`}
            >
              <span>15 KG</span>
              <span className="font-label-sm text-[9px] opacity-80 mt-0.5">High Rep</span>
            </button>

            <button
              onClick={() => setSelectedWeight('20kg')}
              className={`py-2 px-1 rounded font-label-md text-[11px] flex flex-col items-center justify-center transition-all ${
                selectedWeight === '20kg'
                  ? 'bg-[#323538] text-[#c3f400] shadow-sm font-bold border border-[#c3f400]/30'
                  : 'bg-transparent text-[#c4c9ac] hover:text-[#e1e2e7]'
              }`}
            >
              <span>20 KG</span>
              <span className="font-label-sm text-[9px] opacity-80 mt-0.5">Balanced</span>
            </button>

            <button
              onClick={() => setSelectedWeight('24kg')}
              className={`py-2 px-1 rounded font-label-md text-[11px] flex flex-col items-center justify-center transition-all ${
                selectedWeight === '24kg'
                  ? 'bg-[#323538] text-[#c3f400] shadow-sm font-bold border border-[#c3f400]/30'
                  : 'bg-transparent text-[#c4c9ac] hover:text-[#e1e2e7]'
              }`}
            >
              <span>24 KG</span>
              <span className="font-label-sm text-[9px] opacity-80 mt-0.5">Heavy Str</span>
            </button>

            <button
              onClick={() => {
                setSelectedWeight('Adj');
                setShowAdjustDialog(true);
              }}
              className={`py-2 px-1 rounded font-label-md text-[11px] flex flex-col items-center justify-center transition-all ${
                selectedWeight === 'Adj'
                  ? 'bg-[#323538] text-[#c3f400] shadow-sm font-bold border border-[#c3f400]/30'
                  : 'bg-transparent text-[#c4c9ac] hover:text-[#e1e2e7]'
              }`}
            >
              <span>{selectedWeight === 'Adj' ? `${customWeightKg} KG` : 'ADJUST'}</span>
              <span className="font-label-sm text-[9px] opacity-80 mt-0.5">Dial-in</span>
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-[#272a2e] flex items-center justify-between text-[#c4c9ac]">
            <span className="font-label-sm text-[11px] uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" />
              Auto-scaling volume:{' '}
              <span className="text-[#e1e2e7] font-semibold">
                {calibrationProfiles[selectedWeight]}
              </span>
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#c3f400]">bolt</span>
          </div>
        </div>
      </section>

      {/* Filter Chips (Horizontal Scroll) */}
      <section className="py-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isCurrent = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`shrink-0 px-4 py-2 rounded-full font-label-md text-[11px] tracking-wide uppercase transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#c3f400] text-[#283500] font-extrabold shadow-sm'
                    : 'bg-[#1d2023] border border-[#272a2e] text-[#c4c9ac] hover:text-[#e1e2e7]'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Routine Card (Image 5.png) */}
      {(activeFilter === 'ALL' || activeFilter === 'SINGLE DUMBBELL ONLY') && (
        <section className="py-1">
          <div className="relative overflow-hidden rounded-xl bg-[#1d2023] border border-[#272a2e] shadow-xl">
            {/* Media Backdrop with Scrim */}
            <div className="relative w-full h-48 bg-[#272a2e]">
              <img
                src={FEATURED_ROUTINE.image}
                alt={FEATURED_ROUTINE.altText}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d2023] via-[#1d2023]/60 to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#111417]/85 backdrop-blur-md px-2.5 py-1 rounded font-label-sm text-[10px] text-[#c3f400] font-semibold uppercase tracking-wider border border-[#c3f400]/20">
                <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
                Featured Program
              </div>

              <div className="absolute top-3 right-3 bg-[#0b0e11]/85 backdrop-blur-md px-2.5 py-1 rounded font-label-sm text-[10px] text-[#e1e2e7] uppercase tracking-wider border border-[#323538]">
                1x DB • {getWeightNumber()} KG
              </div>
            </div>

            {/* Card Body Content */}
            <div className="p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[#4cd7f6] font-label-sm text-[11px] uppercase tracking-wider font-semibold">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  <span>{FEATURED_ROUTINE.duration} MIN</span>
                  <span className="text-[#c4c9ac]">•</span>
                  <span>{FEATURED_ROUTINE.intensity}</span>
                </div>
                <div className="flex items-center gap-1 text-[#c4c9ac] font-label-sm text-[11px]">
                  <span className="material-symbols-outlined text-[16px] text-[#c3f400]">local_fire_department</span>
                  <span className="text-[#e1e2e7] font-semibold">{FEATURED_ROUTINE.calories} KCAL</span>
                </div>
              </div>

              <h3 className="font-headline-md text-[19px] sm:text-[22px] text-[#e1e2e7] leading-snug font-bold">
                {FEATURED_ROUTINE.title}
              </h3>

              {/* Tags List */}
              <div className="flex flex-wrap gap-1.5">
                {FEATURED_ROUTINE.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#272a2e] text-[#c4c9ac] font-label-sm text-[10px] px-2 py-0.5 rounded border border-[#323538]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Telemetry Breakdown Sub-bar */}
              <div className="grid grid-cols-3 gap-1 bg-[#191c1f] p-2 rounded-lg mt-1 text-center border border-[#272a2e]">
                <div>
                  <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase block">Target Sets</span>
                  <span className="font-headline-sm text-[15px] text-[#e1e2e7] font-bold">
                    {FEATURED_ROUTINE.targetSets}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase block">Asymmetry Guard</span>
                  <span className="font-headline-sm text-[15px] text-[#4cd7f6] font-bold">
                    {FEATURED_ROUTINE.asymmetryRatio}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase block">Rest Interval</span>
                  <span className="font-headline-sm text-[15px] text-[#c3f400] font-bold">
                    {FEATURED_ROUTINE.restInterval}
                  </span>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => onStartWorkout(FEATURED_ROUTINE, getWeightNumber())}
                  className="flex-1 h-[52px] bg-[#c3f400] text-[#283500] rounded-xl font-label-lg text-[13px] sm:text-[14px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 hover:bg-[#abd600] active:scale-[0.98] transition-all shadow-lg shadow-[#c3f400]/20"
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  Start Workout
                </button>
                <button
                  onClick={() => onPreviewRoutine(FEATURED_ROUTINE)}
                  className="h-[52px] px-4 bg-[#272a2e] text-[#e1e2e7] rounded-xl font-label-md text-[12px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 hover:bg-[#323538] active:scale-[0.98] transition-all border border-[#323538]"
                >
                  <span className="material-symbols-outlined text-[18px]">list_alt</span>
                  Preview Sets
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Header */}
      <div className="pt-3 pb-1 flex items-center justify-between">
        <div>
          <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider block font-semibold">
            Structured Programs
          </span>
          <h3 className="font-headline-sm text-[17px] text-[#e1e2e7] font-bold">
            Precision Routine Library
          </h3>
        </div>
        <span className="bg-[#1d2023] border border-[#272a2e] text-[#c4c9ac] font-label-sm text-[10px] px-2 py-1 rounded">
          {filteredRoutines.length} Available
        </span>
      </div>

      {/* Routine Cards List */}
      <section className="flex flex-col gap-3">
        {filteredRoutines.map((routine) => (
          <div
            key={routine.id}
            className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-3.5 shadow-md flex flex-col gap-2.5 transition-all hover:border-[#323538]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 min-w-0">
                <div className="relative w-16 h-16 rounded-lg bg-[#191c1f] shrink-0 overflow-hidden border border-[#272a2e]">
                  <img
                    src={routine.image}
                    alt={routine.altText}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 font-label-sm text-[9px] px-1 rounded-tl font-bold ${
                      routine.equipmentBadge === 'DB'
                        ? 'bg-[#c3f400] text-[#283500]'
                        : routine.equipmentBadge === 'HIIT'
                        ? 'bg-[#4cd7f6] text-[#003640]'
                        : routine.equipmentBadge === 'BODY'
                        ? 'bg-[#323538] text-[#e1e2e7]'
                        : 'bg-[#c3f400] text-[#283500]'
                    }`}
                  >
                    {routine.equipmentBadge}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[#4cd7f6] font-label-sm text-[10px] uppercase font-semibold">
                    <span>{routine.duration} MIN</span>
                    <span>•</span>
                    <span>{routine.intensity}</span>
                  </div>
                  <h4 className="font-headline-sm text-[15px] font-bold text-[#e1e2e7] truncate mt-0.5">
                    {routine.title}
                  </h4>
                  <p className="font-body-sm text-[11px] text-[#c4c9ac] truncate mt-0.5">
                    {routine.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Sub Bar with metric sync */}
            <div className="flex items-center justify-between bg-[#191c1f] px-2.5 py-1.5 rounded-lg font-label-sm text-[11px] text-[#c4c9ac] border border-[#272a2e]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#c3f400]">
                  {routine.subHighlight.icon}
                </span>
                <span className="truncate">{routine.subHighlight.text}</span>
              </div>
              <span className={`font-semibold uppercase tracking-wider shrink-0 ${
                routine.subHighlight.pillColor === 'secondary' ? 'text-[#4cd7f6]' : 'text-[#c3f400]'
              }`}>
                {routine.subHighlight.pillText}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={() => onStartWorkout(routine, getWeightNumber())}
                className="flex-1 h-11 bg-[#c3f400] text-[#283500] rounded-lg font-label-md text-[12px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform hover:bg-[#abd600]"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                Start Workout
              </button>
              <button
                onClick={() => onPreviewRoutine(routine)}
                className="h-11 px-3 bg-[#272a2e] text-[#e1e2e7] rounded-lg font-label-md text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1 active:scale-[0.98] transition-all hover:bg-[#323538] border border-[#323538]"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Preview Sets
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Adjust Weight Dial-in Modal */}
      {showAdjustDialog && (
        <div className="fixed inset-0 z-50 bg-[#111417]/80 backdrop-blur-md flex items-end justify-center p-4">
          <div className="w-full max-w-md bg-[#1d2023] border border-[#323538] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#272a2e]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[20px]">tune</span>
                <h4 className="font-headline-sm text-[16px] text-[#e1e2e7] font-semibold">
                  Dial-in Physical Load
                </h4>
              </div>
              <button
                onClick={() => setShowAdjustDialog(false)}
                className="w-8 h-8 rounded-full bg-[#272a2e] flex items-center justify-center text-[#e1e2e7]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center py-4 bg-[#191c1f] rounded-xl border border-[#272a2e]">
              <span className="text-[11px] uppercase text-[#c4c9ac] tracking-wider">Target Dumbbell</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="font-metric-numeral text-[48px] text-[#c3f400] font-bold">
                  {customWeightKg}
                </span>
                <span className="text-[18px] text-[#c4c9ac] font-bold">KG</span>
              </div>
              <span className="text-[11px] text-[#4cd7f6]">
                Auto-calculated reps: {Math.max(6, Math.round(240 / customWeightKg))}-{Math.max(8, Math.round(300 / customWeightKg))} reps/side
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="8"
              max="36"
              step="1"
              value={customWeightKg}
              onChange={(e) => setCustomWeightKg(Number(e.target.value))}
              className="w-full h-2 bg-[#272a2e] rounded-lg appearance-none cursor-pointer accent-[#c3f400]"
            />

            <div className="flex items-center justify-between text-[11px] text-[#c4c9ac] font-mono">
              <span>8 KG (Light)</span>
              <span>20 KG</span>
              <span>36 KG (Heavy)</span>
            </div>

            <button
              onClick={() => setShowAdjustDialog(false)}
              className="w-full h-12 bg-[#c3f400] text-[#283500] rounded-xl font-label-lg text-[13px] uppercase tracking-wider font-extrabold mt-2 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Save Custom Calibration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
