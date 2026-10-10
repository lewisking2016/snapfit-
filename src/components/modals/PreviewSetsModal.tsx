import React from 'react';
import { Routine } from '../../types';

interface PreviewSetsModalProps {
  routine: Routine | null;
  onClose: () => void;
  onStartWorkout: (routine: Routine) => void;
}

export const PreviewSetsModal: React.FC<PreviewSetsModalProps> = ({
  routine,
  onClose,
  onStartWorkout
}) => {
  if (!routine) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#111417]/80 backdrop-blur-md flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-[#1d2023] border border-[#323538] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#272a2e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">
              fitness_center
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider">
                Exercise Protocol
              </span>
              <h4 className="font-headline-sm text-[17px] text-[#e1e2e7] font-semibold truncate max-w-[240px]">
                {routine.title}
              </h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#272a2e] flex items-center justify-center text-[#e1e2e7] hover:text-[#c3f400] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Routine Quick Telemetry Specs */}
        <div className="grid grid-cols-3 gap-2 bg-[#191c1f] p-2.5 rounded-lg text-center">
          <div>
            <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase block">Target Sets</span>
            <span className="font-headline-sm text-[15px] text-[#e1e2e7] font-bold">{routine.targetSets}</span>
          </div>
          <div>
            <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase block">Asymmetry</span>
            <span className="font-headline-sm text-[15px] text-[#4cd7f6] font-bold">{routine.asymmetryRatio}</span>
          </div>
          <div>
            <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase block">Rest Tempo</span>
            <span className="font-headline-sm text-[15px] text-[#c3f400] font-bold">{routine.restInterval}</span>
          </div>
        </div>

        {/* Set list */}
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto no-scrollbar py-1">
          {routine.sets.map((s, idx) => (
            <div
              key={idx}
              className="bg-[#191c1f] p-2.5 rounded-lg flex items-center justify-between border border-[#272a2e]"
            >
              <div className="flex flex-col pr-2">
                <span className="text-[#e1e2e7] font-semibold text-[13px] leading-tight">
                  {s.movement}
                </span>
                <span className="text-[#c4c9ac] text-[11px] mt-0.5">
                  Target: {s.repsTarget} reps/side
                </span>
              </div>
              <span className="text-[#4cd7f6] font-label-sm text-[11px] bg-[#1d2023] px-2 py-1 rounded text-right whitespace-nowrap">
                {s.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            onClose();
            onStartWorkout(routine);
          }}
          className="w-full h-12 bg-[#c3f400] text-[#283500] hover:bg-[#abd600] active:scale-[0.98] rounded-xl font-label-lg text-[14px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#c3f400]/20 transition-all mt-1"
        >
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          <span>Lock In & Launch</span>
        </button>
      </div>
    </div>
  );
};
