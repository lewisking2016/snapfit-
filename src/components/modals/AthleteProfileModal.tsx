import React from 'react';

interface AthleteProfileModalProps {
  onClose: () => void;
  onNavigate: (screen: 'recovery' | 'audio' | 'devices') => void;
}

export const AthleteProfileModal: React.FC<AthleteProfileModalProps> = ({ onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#111417]/80 backdrop-blur-md flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-[#1d2023] border border-[#323538] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#272a2e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">person</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider">
                Athlete Diagnostics
              </span>
              <h4 className="font-headline-sm text-[16px] text-[#e1e2e7] font-semibold">
                User Profile
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

        <div className="flex items-center gap-3 p-3 bg-[#191c1f] rounded-xl border border-[#272a2e]">
          <img
            alt="Profile"
            className="w-14 h-14 rounded-xl object-cover border border-[#323538]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh1xHsZmkc7w0sj0NHoeSvHIF030F6I_ITx2cGzWkdPMZsHcKg6kAr94M3Dg4PTnkGq3yRACjN8iW-Rp-7ysdk0g_IgU-5RYGKNtML57OsFiLJ0Tv9sveVR8PN1gjJTJrRWp_bojWAqVwU1sXbutOGdPm4Wd3KPE6Yx_F9VcQz_wJEBXaZErHL-mkKI0-JGsGXGdZkIii-JvMmYOGHGG9WDXs7oS1FOwpoTvMtWG4rwBxRyG5mQRhRHg"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[16px] font-bold text-[#e1e2e7]">Alex Mercer</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c3f400] text-[#283500] font-bold uppercase">
                PRO SYNC
              </span>
            </div>
            <span className="text-[11px] text-[#c4c9ac]">High-Performance Unilateral Split</span>
            <span className="text-[10px] text-[#4cd7f6] mt-0.5 font-mono">ID: AT-9842-COR</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#191c1f] p-2.5 rounded-lg border border-[#272a2e]">
            <span className="text-[10px] uppercase text-[#c4c9ac] block">Weight</span>
            <span className="text-[15px] font-bold text-[#e1e2e7]">78.4 KG</span>
          </div>
          <div className="bg-[#191c1f] p-2.5 rounded-lg border border-[#272a2e]">
            <span className="text-[10px] uppercase text-[#c4c9ac] block">Max HR</span>
            <span className="text-[15px] font-bold text-[#4cd7f6]">188 BPM</span>
          </div>
          <div className="bg-[#191c1f] p-2.5 rounded-lg border border-[#272a2e]">
            <span className="text-[10px] uppercase text-[#c4c9ac] block">Load Baseline</span>
            <span className="text-[15px] font-bold text-[#c3f400]">20 KG DB</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[10px] uppercase tracking-wider text-[#c4c9ac] font-semibold">
            Deep Hub Bridges
          </span>
          <button
            onClick={() => {
              onClose();
              onNavigate('recovery');
            }}
            className="flex items-center justify-between p-2.5 bg-[#191c1f] hover:bg-[#272a2e] rounded-lg border border-[#272a2e] transition-colors"
          >
            <div className="flex items-center gap-2 text-[12px] text-[#e1e2e7]">
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">bedtime</span>
              <span>Recovery & Sleep Architecture</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#c4c9ac]">chevron_right</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigate('audio');
            }}
            className="flex items-center justify-between p-2.5 bg-[#191c1f] hover:bg-[#272a2e] rounded-lg border border-[#272a2e] transition-colors"
          >
            <div className="flex items-center gap-2 text-[12px] text-[#e1e2e7]">
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">headphones</span>
              <span>Audio Companion & Spotify</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#c4c9ac]">chevron_right</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigate('devices');
            }}
            className="flex items-center justify-between p-2.5 bg-[#191c1f] hover:bg-[#272a2e] rounded-lg border border-[#272a2e] transition-colors"
          >
            <div className="flex items-center gap-2 text-[12px] text-[#e1e2e7]">
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">devices_wearables</span>
              <span>Connected Devices & Samsung Health</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#c4c9ac]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
