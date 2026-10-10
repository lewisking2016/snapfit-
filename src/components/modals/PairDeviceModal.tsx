import React, { useState, useEffect } from 'react';

interface PairDeviceModalProps {
  onClose: () => void;
  onDevicePaired: (deviceName: string) => void;
}

export const PairDeviceModal: React.FC<PairDeviceModalProps> = ({
  onClose,
  onDevicePaired
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [devices, setDevices] = useState<{ id: string; name: string; type: string; rssi: number }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDevices([
        { id: 'dev-1', name: 'Polar H10 Chest Strap', type: 'ECG Heart Rate', rssi: -42 },
        { id: 'dev-2', name: 'Garmin HRM-Pro Plus', type: 'Dual Protocol BLE/ANT+', rssi: -58 },
        { id: 'dev-3', name: 'Withings Body Smart Scale', type: 'Bioimpedance Scale', rssi: -71 }
      ]);
      setIsScanning(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#111417]/80 backdrop-blur-md flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-[#1d2023] border border-[#323538] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#272a2e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">bluetooth_searching</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider">
                BLE Peripheral Discovery
              </span>
              <h4 className="font-headline-sm text-[16px] text-[#e1e2e7] font-semibold">
                Pair Telemetry Sensor
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

        {isScanning ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-[#c3f400] animate-spin">
              progress_activity
            </span>
            <span className="text-[13px] text-[#c4c9ac] uppercase tracking-wider font-semibold">
              Scanning for BLE Peripherals...
            </span>
            <span className="text-[11px] text-[#8e9379]">Make sure your strap or scale is in pairing mode.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#c4c9ac] font-semibold">
              Discovered Devices ({devices.length})
            </span>
            {devices.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  onDevicePaired(d.name);
                  onClose();
                }}
                className="bg-[#191c1f] hover:bg-[#272a2e] border border-[#272a2e] p-3 rounded-xl flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#272a2e] flex items-center justify-center text-[#c3f400]">
                    <span className="material-symbols-outlined text-[20px]">
                      {d.type.includes('Scale') ? 'monitor_weight' : 'ecg_heart'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[13px] text-[#e1e2e7]">{d.name}</span>
                    <span className="text-[11px] text-[#c4c9ac]">{d.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#4cd7f6] bg-[#111417] px-2 py-0.5 rounded font-mono">
                    {d.rssi} dBm
                  </span>
                  <span className="text-[#c3f400] text-[12px] font-bold uppercase tracking-wider bg-[#c3f400]/15 px-2 py-1 rounded">
                    Connect
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
