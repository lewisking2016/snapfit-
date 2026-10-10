import React from 'react';

interface SwitchAudioModalProps {
  currentDevice: string;
  onSelectDevice: (device: string, latencyMs: number) => void;
  onClose: () => void;
}

export const SwitchAudioModal: React.FC<SwitchAudioModalProps> = ({
  currentDevice,
  onSelectDevice,
  onClose
}) => {
  const devices = [
    { name: 'Beats Powerbeats Pro', type: 'Earbuds', latency: 12, icon: 'headphones', badge: 'Ultra-low latency' },
    { name: 'Apple AirPods Pro 2', type: 'Earbuds', latency: 18, icon: 'headphones', badge: 'Spatial Audio' },
    { name: 'Shokz OpenRun Pro', type: 'Bone Conduction', latency: 22, icon: 'hearing', badge: 'Ambient Aware' },
    { name: 'Phone Speaker', type: 'Internal', latency: 4, icon: 'volume_up', badge: 'Direct Dac' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#111417]/80 backdrop-blur-md flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-[#1d2023] border border-[#323538] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#272a2e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">headphones</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider">
                Sound Routing
              </span>
              <h4 className="font-headline-sm text-[16px] text-[#e1e2e7] font-semibold">
                Switch Audio Output
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

        <div className="flex flex-col gap-2">
          {devices.map((d) => {
            const isSelected = currentDevice === d.name;
            return (
              <button
                key={d.name}
                onClick={() => {
                  onSelectDevice(d.name, d.latency);
                  onClose();
                }}
                className={`p-3 rounded-xl flex items-center justify-between transition-all border text-left ${
                  isSelected
                    ? 'bg-[#272a2e] border-[#c3f400] text-[#e1e2e7]'
                    : 'bg-[#191c1f] border-[#272a2e] text-[#c4c9ac] hover:text-[#e1e2e7] hover:bg-[#272a2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-[#c3f400]/20 text-[#c3f400]' : 'bg-[#272a2e] text-[#4cd7f6]'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{d.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[14px] text-[#e1e2e7]">{d.name}</span>
                    <span className="text-[11px] text-[#c4c9ac]">{d.type} • {d.latency}ms latency</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#111417] text-[#4cd7f6]">
                    {d.badge}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[#c3f400] text-[20px]">
                      check_circle
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
