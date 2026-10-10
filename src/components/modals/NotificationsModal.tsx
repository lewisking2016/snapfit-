import React from 'react';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const notifications = [
    {
      id: '1',
      title: 'Oraimo BLE Sync Complete',
      desc: 'Resting HR 68 BPM & 99% SpO2 synced to daily biometric baseline.',
      time: '12m ago',
      icon: 'sync',
      color: 'text-[#c3f400]'
    },
    {
      id: '2',
      title: 'Target Sleep Goal Met (96%)',
      desc: '7h 52m total duration logged. Deep sleep reached +18% peak.',
      time: '6h ago',
      icon: 'bedtime',
      color: 'text-[#4cd7f6]'
    },
    {
      id: '3',
      title: 'Marcus Coach Pacing Calibration',
      desc: 'Optimal 140 BPM playlist aligned with Single DB Unilateral Shred.',
      time: 'Yesterday',
      icon: 'graphic_eq',
      color: 'text-[#c3f400]'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#111417]/80 backdrop-blur-md flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-[#1d2023] border border-[#323538] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#272a2e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">notifications</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider">
                System Telemetry Logs
              </span>
              <h4 className="font-headline-sm text-[16px] text-[#e1e2e7] font-semibold">
                Notifications
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

        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto no-scrollbar">
          {notifications.map((n) => (
            <div key={n.id} className="bg-[#191c1f] p-3 rounded-xl border border-[#272a2e] flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg bg-[#272a2e] flex items-center justify-center shrink-0 ${n.color}`}>
                <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[13px] text-[#e1e2e7] truncate">{n.title}</span>
                  <span className="text-[10px] text-[#c4c9ac]">{n.time}</span>
                </div>
                <p className="text-[11px] text-[#c4c9ac] mt-0.5 leading-snug">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
