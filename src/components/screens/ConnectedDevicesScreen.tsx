import React, { useState } from 'react';
import { TelemetryWatch, SamsungHealthState } from '../../types';

interface ConnectedDevicesScreenProps {
  watchState: TelemetryWatch;
  samsungHealth: SamsungHealthState;
  onUpdateWatch: (watch: Partial<TelemetryWatch>) => void;
  onUpdateSamsung: (sh: Partial<SamsungHealthState>) => void;
  onOpenPairModal: () => void;
}

export const ConnectedDevicesScreen: React.FC<ConnectedDevicesScreenProps> = ({
  watchState,
  samsungHealth,
  onUpdateWatch,
  onUpdateSamsung,
  onOpenPairModal
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [liveBpm, setLiveBpm] = useState(watchState.restingHr);
  const [lastSyncLabel, setLastSyncLabel] = useState('2 mins ago');
  const [streams, setStreams] = useState(samsungHealth.streams);
  const [autoSync, setAutoSync] = useState(watchState.autoSync);

  const handleSyncWatch = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncLabel('Just now');
      const randomizedBpm = 67 + Math.floor(Math.random() * 5);
      setLiveBpm(randomizedBpm);
      onUpdateWatch({ restingHr: randomizedBpm });
    }, 1200);
  };

  const toggleStream = (streamKey: keyof typeof streams) => {
    const updated = { ...streams, [streamKey]: !streams[streamKey] };
    setStreams(updated);
    onUpdateSamsung({ streams: updated });
  };

  const toggleAutoSync = () => {
    const updated = !autoSync;
    setAutoSync(updated);
    onUpdateWatch({ autoSync: updated });
  };

  return (
    <div className="flex flex-col w-full pb-10 gap-5 animate-in fade-in duration-300">
      {/* Status Scrim & Glance Banner */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f400] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c3f400]" />
          </span>
          <span className="font-label-md text-[10px] uppercase tracking-wider text-[#c3f400] font-bold">
            Telemetry Pipeline Active
          </span>
        </div>

        <div className="bg-[#272a2e] px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[#323538]">
          <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">sync</span>
          <span className="font-label-sm text-[10px] text-[#c4c9ac] font-mono">Live BLE Link</span>
        </div>
      </div>

      {/* Primary Wearable Card */}
      <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-4 shadow-md relative overflow-hidden flex flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-lg bg-[#272a2e] border border-[#323538] flex items-center justify-center text-[#c3f400]">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                watch
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline-sm text-[16px] font-bold text-[#e1e2e7]">
                  {watchState.name}
                </h2>
              </div>
              <p className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider font-mono">
                {watchState.model} • MAC: {watchState.mac}
              </p>
            </div>
          </div>

          <span className="bg-[#272a2e] border border-[#323538] text-[#c3f400] font-label-sm text-[9px] px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[12px]">wifi_tethering</span>
            <span>Streaming</span>
          </span>
        </div>

        {/* Battery & Signal Pill Cluster */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#191c1f] rounded-lg p-2.5 flex items-center justify-between border border-[#272a2e]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px]">battery_5_bar</span>
              <span className="font-label-md text-[10px] text-[#c4c9ac] uppercase">Charge</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-metric-numeral-sm text-[20px] font-bold text-[#e1e2e7]">
                {watchState.charge}
              </span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac]">%</span>
            </div>
          </div>

          <div className="bg-[#191c1f] rounded-lg p-2.5 flex items-center justify-between border border-[#272a2e]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                signal_cellular_alt
              </span>
              <span className="font-label-md text-[10px] text-[#c4c9ac] uppercase">Link</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-metric-numeral-sm text-[20px] font-bold text-[#e1e2e7]">
                {watchState.linkDbm}
              </span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] font-mono">dBm</span>
            </div>
          </div>
        </div>

        {/* Realtime Telemetry Grid */}
        <div className="bg-[#0b0e11] rounded-lg p-3 flex flex-col gap-2 border border-[#272a2e]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="font-label-md text-[10px] uppercase text-[#c4c9ac] font-semibold">
                Resting Heart Rate
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-metric-numeral text-[36px] font-extrabold text-[#e1e2e7] tracking-tight">
                {liveBpm}
              </span>
              <span className="font-label-md text-[10px] text-[#c4c9ac] uppercase font-bold">
                BPM
              </span>
            </div>
          </div>

          {/* Realtime Heart Rate Mini Sparkline */}
          <div className="w-full h-8 flex items-end">
            <svg className="w-full h-full text-[#4cd7f6]" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0,18 L12,18 L16,10 L20,22 L24,6 L28,20 L32,18 L48,18 L52,8 L56,22 L60,12 L64,18 L80,18 L84,10 L88,20 L92,14 L96,18 L100,18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#1d2023]">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">bloodtype</span>
              <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase">Continuous SpO2</span>
            </div>
            <span className="font-label-lg text-[13px] font-bold text-[#c3f400]">
              {watchState.continuousSpo2}% Normal
            </span>
          </div>
        </div>

        {/* Watch Quick Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#c4c9ac] text-[16px]">verified</span>
            <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase font-mono">
              {watchState.firmware}
            </span>
          </div>
          <button
            onClick={handleSyncWatch}
            disabled={isSyncing}
            className="bg-[#c3f400] text-[#283500] hover:bg-[#abd600] px-4 py-2 rounded-lg font-label-lg text-[12px] uppercase tracking-wide flex items-center gap-1.5 active:scale-95 transition-all shadow-sm font-extrabold"
          >
            <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        {/* Background Auto-Sync Row */}
        <div className="flex items-center justify-between bg-[#272a2e] p-2.5 rounded-lg border border-[#323538]">
          <div className="flex flex-col">
            <span className="font-body-md text-[13px] text-[#e1e2e7] font-semibold">Background Auto-Sync</span>
            <span className="font-body-sm text-[11px] text-[#c4c9ac]">Update telemetry every 60 seconds</span>
          </div>
          <div
            onClick={toggleAutoSync}
            className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
              autoSync ? 'bg-[#c3f400]' : 'bg-[#323538]'
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full transition-transform ${
                autoSync ? 'translate-x-4.5 bg-[#283500]' : 'translate-x-0 bg-[#e1e2e7]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Samsung Health Platform Card */}
      <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-4 shadow-md flex flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-lg bg-[#272a2e] border border-[#323538] flex items-center justify-center text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                health_metrics
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline-sm text-[16px] font-bold text-[#e1e2e7]">
                  Samsung Health
                </h2>
              </div>
              <p className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider font-mono">
                Health Connect SDK • 2-Way Sync
              </p>
            </div>
          </div>

          <span className="bg-[#272a2e] border border-[#323538] text-[#4cd7f6] font-label-sm text-[9px] px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[12px]">cloud_done</span>
            <span>Connected</span>
          </span>
        </div>

        {/* Sync Log & Time Pill */}
        <div className="bg-[#191c1f] rounded-lg p-2.5 flex items-center justify-between border border-[#272a2e]">
          <span className="font-body-sm text-[11px] text-[#c4c9ac]">Latest Cloud Handshake</span>
          <span className="font-label-md text-[11px] text-[#e1e2e7] font-semibold">{lastSyncLabel}</span>
        </div>

        {/* Data Stream Permissions */}
        <div className="flex flex-col gap-2">
          <span className="font-label-md text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">
            Active Read/Write Streams
          </span>

          {/* Stream 1 */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#272a2e] border border-[#323538]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px]">
                directions_walk
              </span>
              <div className="flex flex-col">
                <span className="font-body-md text-[12px] text-[#e1e2e7] font-semibold">
                  Steps & Walking Distance
                </span>
                <span className="font-body-sm text-[10px] text-[#c4c9ac]">
                  Continuous all-day motion vectors
                </span>
              </div>
            </div>
            <div
              onClick={() => toggleStream('steps')}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                streams.steps ? 'bg-[#4cd7f6]' : 'bg-[#323538]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  streams.steps ? 'translate-x-4 bg-[#003640]' : 'translate-x-0 bg-[#e1e2e7]'
                }`}
              />
            </div>
          </div>

          {/* Stream 2 */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#272a2e] border border-[#323538]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">bedtime</span>
              <div className="flex flex-col">
                <span className="font-body-md text-[12px] text-[#e1e2e7] font-semibold">
                  Sleep Stages & Architecture
                </span>
                <span className="font-body-sm text-[10px] text-[#c4c9ac]">
                  Deep, REM, and recovery index
                </span>
              </div>
            </div>
            <div
              onClick={() => toggleStream('sleep')}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                streams.sleep ? 'bg-[#4cd7f6]' : 'bg-[#323538]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  streams.sleep ? 'translate-x-4 bg-[#003640]' : 'translate-x-0 bg-[#e1e2e7]'
                }`}
              />
            </div>
          </div>

          {/* Stream 3 */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#272a2e] border border-[#323538]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px]">
                local_fire_department
              </span>
              <div className="flex flex-col">
                <span className="font-body-md text-[12px] text-[#e1e2e7] font-semibold">
                  Active Burn & Heart Rate
                </span>
                <span className="font-body-sm text-[10px] text-[#c4c9ac]">
                  Caloric burn and peak HR zones
                </span>
              </div>
            </div>
            <div
              onClick={() => toggleStream('activeBurn')}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                streams.activeBurn ? 'bg-[#4cd7f6]' : 'bg-[#323538]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  streams.activeBurn ? 'translate-x-4 bg-[#003640]' : 'translate-x-0 bg-[#e1e2e7]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Priority Calibration Matrix */}
      <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-4 shadow-md flex flex-col gap-3">
        <div className="flex flex-col">
          <h3 className="font-headline-sm text-[15px] font-bold text-[#e1e2e7]">
            Data Source Conflict Resolution
          </h3>
          <p className="font-body-sm text-[11px] text-[#c4c9ac]">
            Hardware priority for real-time workout tracking vs ambient logs.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {/* Item 1 */}
          <div className="bg-[#191c1f] p-2.5 rounded-lg flex items-center justify-between border border-[#272a2e]">
            <div className="flex flex-col">
              <span className="font-label-md text-[10px] uppercase text-[#c4c9ac]">
                Heart Rate & Live Sets
              </span>
              <span className="font-body-md text-[13px] text-[#e1e2e7] font-semibold">
                Oraimo Watch 4 Pro
              </span>
            </div>
            <span className="bg-[#272a2e] border border-[#c3f400]/40 text-[#c3f400] font-label-sm text-[10px] px-2 py-0.5 rounded uppercase font-bold">
              Master
            </span>
          </div>

          {/* Item 2 */}
          <div className="bg-[#191c1f] p-2.5 rounded-lg flex items-center justify-between border border-[#272a2e]">
            <div className="flex flex-col">
              <span className="font-label-md text-[10px] uppercase text-[#c4c9ac]">
                All-day Steps & Sleep Aggregation
              </span>
              <span className="font-body-md text-[13px] text-[#e1e2e7] font-semibold">
                Samsung Health
              </span>
            </div>
            <span className="bg-[#272a2e] border border-[#4cd7f6]/40 text-[#4cd7f6] font-label-sm text-[10px] px-2 py-0.5 rounded uppercase font-bold">
              Master
            </span>
          </div>
        </div>
      </div>

      {/* Pair New Sensor CTA */}
      <button
        onClick={onOpenPairModal}
        className="w-full bg-[#272a2e] hover:bg-[#323538] text-[#e1e2e7] py-3.5 rounded-xl font-label-lg text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md border border-[#323538] font-bold"
      >
        <span className="material-symbols-outlined text-[#c3f400] text-[20px]">add_circle</span>
        <span>Pair Chest Strap or Smart Scale</span>
      </button>
    </div>
  );
};
