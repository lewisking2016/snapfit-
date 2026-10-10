import React, { useState, useEffect } from 'react';

interface WindDownModalProps {
  onClose: () => void;
}

export const WindDownModal: React.FC<WindDownModalProps> = ({ onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes
  const [isActive, setIsActive] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { title: 'Cat-Cow Breathing', duration: '2 min', cue: 'Inhale arch, exhale round spine. Deep diaphragmatic breathing.' },
    { title: '90/90 Hip Flow', duration: '3 min', cue: 'Slowly transition between internal & external hip rotations.' },
    { title: 'Thread the Needle', duration: '2 min', cue: 'Decompress upper thoracic spine, 1 min per side.' },
    { title: 'Lying Spinal Twist & Savasana', duration: '3 min', cue: 'Rest eyes, parasympathetic nervous system activation.' }
  ];

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && secondsLeft > 0) {
      interval = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#111417]/85 backdrop-blur-md flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-[#1d2023] border border-[#323538] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#272a2e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">self_improvement</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider">
                Evening Recovery Protocol
              </span>
              <h4 className="font-headline-sm text-[16px] text-[#e1e2e7] font-semibold">
                Wind-Down Mobility
              </h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#272a2e] flex items-center justify-center text-[#e1e2e7] hover:text-[#c3f400]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Big countdown clock */}
        <div className="flex flex-col items-center justify-center py-4 bg-[#191c1f] rounded-xl border border-[#272a2e]">
          <span className="font-metric-numeral text-[44px] text-[#c3f400] tracking-tight font-bold">
            {timeFormatted}
          </span>
          <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider mt-1">
            Parasympathetic Sync Active
          </span>
        </div>

        {/* Current movement cue */}
        <div className="bg-[#272a2e] p-3 rounded-xl border border-[#323538]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#4cd7f6] uppercase tracking-wider">
              Step {stepIndex + 1} of {steps.length}: {steps[stepIndex].duration}
            </span>
            <span className="text-[11px] text-[#c4c9ac]">Slow Cadence</span>
          </div>
          <h5 className="text-[15px] font-bold text-[#e1e2e7] mt-1">
            {steps[stepIndex].title}
          </h5>
          <p className="text-[12px] text-[#c4c9ac] mt-1 leading-relaxed">
            {steps[stepIndex].cue}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex-1 h-11 rounded-lg bg-[#c3f400] text-[#283500] font-label-md text-[12px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isActive ? 'pause' : 'play_arrow'}
            </span>
            {isActive ? 'Pause Flow' : 'Resume Flow'}
          </button>
          <button
            onClick={() => setStepIndex((prev) => (prev + 1) % steps.length)}
            className="h-11 px-4 rounded-lg bg-[#272a2e] text-[#e1e2e7] hover:bg-[#323538] font-label-md text-[12px] font-bold uppercase tracking-wider"
          >
            Next Move
          </button>
        </div>
      </div>
    </div>
  );
};
