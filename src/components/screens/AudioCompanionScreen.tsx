import React, { useState, useEffect } from 'react';
import { AudioSettings } from '../../types';
import { SPOTIFY_PLAYLISTS } from '../../data/mockData';
import { audioCoach } from '../../utils/audioCoach';

interface AudioCompanionScreenProps {
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
  onOpenSwitchAudio: () => void;
}

export const AudioCompanionScreen: React.FC<AudioCompanionScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenSwitchAudio
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlaylistId, setActivePlaylistId] = useState(settings.activePlaylistId);
  const [duckingPercent, setDuckingPercent] = useState(settings.duckingRatio);
  const [cueIntensity, setCueIntensity] = useState(settings.cueIntensity);
  const [waveHeights, setWaveHeights] = useState<number[]>([
    12, 20, 8, 28, 16, 32, 12, 24, 8, 20, 28, 16, 8, 24, 16, 32, 12, 20
  ]);
  const [triggers, setTriggers] = useState(settings.triggers);

  const sampleQuote = `"Lock your core. Final three reps, let's smash through the plateau!"`;

  const duckingDb = -Math.round(duckingPercent * 0.28);

  const toggleTrigger = (key: keyof typeof triggers) => {
    const updated = { ...triggers, [key]: !triggers[key] };
    setTriggers(updated);
    onUpdateSettings({ triggers: updated });
  };

  const handleIntensityChange = (level: 'minimal' | 'balanced' | 'high') => {
    setCueIntensity(level);
    onUpdateSettings({ cueIntensity: level });
  };

  const handleDuckingChange = (val: number) => {
    setDuckingPercent(val);
    onUpdateSettings({ duckingRatio: val });
  };

  const toggleSimulation = () => {
    if (isPlaying) {
      audioCoach.stopSimulation();
      setIsPlaying(false);
      setWaveHeights([12, 20, 8, 28, 16, 32, 12, 24, 8, 20, 28, 16, 8, 24, 16, 32, 12, 20]);
    } else {
      setIsPlaying(true);
      audioCoach.startDuckedSimulation(sampleQuote, duckingPercent, (active) => {
        setIsPlaying(active);
        if (!active) {
          setWaveHeights([12, 20, 8, 28, 16, 32, 12, 24, 8, 20, 28, 16, 8, 24, 16, 32, 12, 20]);
        }
      });
    }
  };

  // Waveform animation loop when playing
  useEffect(() => {
    let animInterval: number | null = null;
    if (isPlaying) {
      animInterval = window.setInterval(() => {
        setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 28) + 6));
      }, 120);
    }
    return () => {
      if (animInterval) clearInterval(animInterval);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col w-full pb-10 gap-5 animate-in fade-in duration-300">
      {/* Live Sound Output Section */}
      <section className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-[11px] uppercase tracking-wider text-[#c4c9ac] font-semibold">
            Live Sound Output
          </span>
          <div className="flex items-center gap-1.5 bg-[#272a2e] px-2.5 py-1 rounded-full border border-[#323538]">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
            <span className="font-label-sm text-[10px] text-[#e1e2e7] uppercase font-bold tracking-wide">
              Studio Routing Active
            </span>
          </div>
        </div>

        {/* Active Routing Device Card */}
        <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-lg bg-[#272a2e] flex items-center justify-center shrink-0 text-[#4cd7f6] border border-[#323538]">
              <span className="material-symbols-outlined text-[24px]">headphones</span>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="font-headline-sm text-[15px] font-bold text-[#e1e2e7] truncate">
                {settings.device}
              </p>
              <p className="font-body-sm text-[11px] text-[#c4c9ac] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#c3f400]">bolt</span>
                Ultra-low latency audio buffer ({settings.latencyMs}ms)
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSwitchAudio}
            className="shrink-0 px-3 py-1.5 bg-[#272a2e] hover:bg-[#323538] active:scale-95 text-[#e1e2e7] rounded-lg font-label-sm text-[11px] font-bold tracking-wider transition-all border border-[#323538]"
          >
            SWITCH
          </button>
        </div>
      </section>

      {/* Marcus: Active Audio Coach Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-label-md text-[11px] uppercase tracking-wider text-[#c4c9ac] font-semibold">
            Active Voice Profile
          </h2>
          <span className="font-label-sm text-[10px] text-[#c3f400] uppercase tracking-wider font-bold">
            Sync: Real-Time
          </span>
        </div>

        {/* Coach Identity Card */}
        <div className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-md">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <img
                src={settings.coachAvatar}
                alt="Marcus Coach"
                className="w-16 h-16 rounded-xl object-cover bg-[#323538] border border-[#323538]"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#c3f400] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[#283500] text-[13px] font-bold">
                  verified
                </span>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-headline-md text-[18px] font-bold text-[#e1e2e7] truncate">
                  {settings.coachName}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#323538] font-label-sm text-[10px] text-[#4cd7f6] uppercase font-bold border border-[#444933]">
                  {settings.coachRegion}
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#c4c9ac] line-clamp-1 mt-0.5">
                {settings.coachDescription}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#c3f400]">speed</span>
                  <span className="font-label-sm text-[10px] text-[#e1e2e7]">Dynamic Pacing</span>
                </div>
                <span className="text-[#323538] text-[10px]">•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">graphic_eq</span>
                  <span className="font-label-sm text-[10px] text-[#e1e2e7]">Neural Synthesizer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cue Intensity Selector */}
          <div className="flex flex-col gap-1.5 bg-[#191c1f] p-2.5 rounded-lg border border-[#272a2e]">
            <label className="font-label-sm text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">
              Cue Intensity
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#323538] rounded-lg">
              <button
                onClick={() => handleIntensityChange('minimal')}
                className={`py-1.5 px-1 rounded flex flex-col items-center justify-center transition-all ${
                  cueIntensity === 'minimal'
                    ? 'bg-[#c3f400] text-[#283500] font-bold shadow-sm'
                    : 'bg-[#1d2023] text-[#c4c9ac] hover:text-[#e1e2e7]'
                }`}
              >
                <span className="font-label-lg text-[13px] leading-tight font-bold">Minimal</span>
                <span className="font-label-sm text-[9px] opacity-80">Milestones</span>
              </button>

              <button
                onClick={() => handleIntensityChange('balanced')}
                className={`py-1.5 px-1 rounded flex flex-col items-center justify-center transition-all ${
                  cueIntensity === 'balanced'
                    ? 'bg-[#c3f400] text-[#283500] font-bold shadow-sm'
                    : 'bg-[#1d2023] text-[#c4c9ac] hover:text-[#e1e2e7]'
                }`}
              >
                <span className="font-label-lg text-[13px] leading-tight font-bold">Balanced</span>
                <span className="font-label-sm text-[9px] opacity-90">Tempo sync</span>
              </button>

              <button
                onClick={() => handleIntensityChange('high')}
                className={`py-1.5 px-1 rounded flex flex-col items-center justify-center transition-all ${
                  cueIntensity === 'high'
                    ? 'bg-[#c3f400] text-[#283500] font-bold shadow-sm'
                    : 'bg-[#1d2023] text-[#c4c9ac] hover:text-[#e1e2e7]'
                }`}
              >
                <span className="font-label-lg text-[13px] leading-tight font-bold">High</span>
                <span className="font-label-sm text-[9px] opacity-80">Cadence lock</span>
              </button>
            </div>
          </div>

          {/* Toggles Grid */}
          <div className="flex flex-col gap-1 pt-1">
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#c4c9ac] font-bold">
              Voice Trigger Permissions
            </span>

            {/* Rep Countdown */}
            <div
              onClick={() => toggleTrigger('countdown')}
              className="flex items-center justify-between py-2 px-1 cursor-pointer select-none border-b border-[#272a2e]/50"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-[#c3f400]">timer_10</span>
                <span className="font-body-md text-[13px] text-[#e1e2e7]">Rep Countdown & Cadence</span>
              </div>
              <div className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                triggers.countdown ? 'bg-[#c3f400]' : 'bg-[#323538]'
              }`}>
                <div className={`w-4.5 h-4.5 rounded-full transition-transform ${
                  triggers.countdown ? 'translate-x-4.5 bg-[#283500]' : 'translate-x-0 bg-[#e1e2e7]'
                }`} />
              </div>
            </div>

            {/* Form Corrections */}
            <div
              onClick={() => toggleTrigger('formCorrection')}
              className="flex items-center justify-between py-2 px-1 cursor-pointer select-none border-b border-[#272a2e]/50"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-[#4cd7f6]">accessibility_new</span>
                <span className="font-body-md text-[13px] text-[#e1e2e7]">Form Correction Reminders</span>
              </div>
              <div className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                triggers.formCorrection ? 'bg-[#c3f400]' : 'bg-[#323538]'
              }`}>
                <div className={`w-4.5 h-4.5 rounded-full transition-transform ${
                  triggers.formCorrection ? 'translate-x-4.5 bg-[#283500]' : 'translate-x-0 bg-[#e1e2e7]'
                }`} />
              </div>
            </div>

            {/* Heart Rate Zone Alerts */}
            <div
              onClick={() => toggleTrigger('hrAlerts')}
              className="flex items-center justify-between py-2 px-1 cursor-pointer select-none border-b border-[#272a2e]/50"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-[#ffb4ab]">favorite</span>
                <span className="font-body-md text-[13px] text-[#e1e2e7]">Heart Rate Zone Alerts</span>
              </div>
              <div className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                triggers.hrAlerts ? 'bg-[#c3f400]' : 'bg-[#323538]'
              }`}>
                <div className={`w-4.5 h-4.5 rounded-full transition-transform ${
                  triggers.hrAlerts ? 'translate-x-4.5 bg-[#283500]' : 'translate-x-0 bg-[#e1e2e7]'
                }`} />
              </div>
            </div>

            {/* Finisher Hype Callouts */}
            <div
              onClick={() => toggleTrigger('finisherHype')}
              className="flex items-center justify-between py-2 px-1 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-[#c3f400]">local_fire_department</span>
                <span className="font-body-md text-[13px] text-[#e1e2e7]">Finisher Hype Callouts</span>
              </div>
              <div className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                triggers.finisherHype ? 'bg-[#c3f400]' : 'bg-[#323538]'
              }`}>
                <div className={`w-4.5 h-4.5 rounded-full transition-transform ${
                  triggers.finisherHype ? 'translate-x-4.5 bg-[#283500]' : 'translate-x-0 bg-[#e1e2e7]'
                }`} />
              </div>
            </div>
          </div>

          {/* Smart Ducking Slider */}
          <div className="bg-[#191c1f] p-3 rounded-lg flex flex-col gap-2 border border-[#272a2e]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">volume_down</span>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#e1e2e7] font-semibold">
                  Spotify Ducking Ratio
                </span>
              </div>
              <span className="font-label-lg text-[13px] font-bold text-[#c3f400]">
                {duckingDb} dB ({duckingPercent}%)
              </span>
            </div>

            <p className="font-body-sm text-[11px] text-[#c4c9ac]">
              Smoothly lowers track level when Marcus speaks cues.
            </p>

            <input
              type="range"
              min="10"
              max="90"
              value={duckingPercent}
              onChange={(e) => handleDuckingChange(Number(e.target.value))}
              className="w-full h-1.5 bg-[#323538] rounded-lg appearance-none cursor-pointer accent-[#c3f400]"
            />
          </div>
        </div>
      </section>

      {/* Spotify Integration Hub */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 fill-[#1DB954]" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.306c-.218.358-.683.473-1.041.254-2.856-1.745-6.452-2.14-10.686-1.173-.41.094-.816-.164-.91-.573-.094-.41.164-.816.573-.91 4.636-1.06 8.608-.614 11.81 1.344.358.218.473.683.254 1.058zm1.47-3.266c-.275.448-.86.59-1.308.315-3.268-2.008-8.25-2.592-12.116-1.418-.503.153-1.036-.134-1.189-.637-.153-.503.134-1.036.637-1.189 4.417-1.34 9.91-.69 13.66 1.62.449.276.59.86.316 1.309zm.127-3.41c-3.918-2.327-10.377-2.542-14.116-1.407-.6.182-1.236-.16-1.418-.76-.182-.6.16-1.236.76-1.418 4.301-1.306 11.43-1.054 15.938 1.621.54.32.715 1.02.395 1.56-.32.54-1.02.715-1.559.395z" />
            </svg>
            <h2 className="font-label-md text-[11px] uppercase tracking-wider text-[#c4c9ac] font-semibold">
              Spotify Integration Hub
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 font-label-sm text-[10px] text-[#1DB954] bg-[#272a2e] px-2 py-0.5 rounded border border-[#1DB954]/20 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" /> Premium Active
          </span>
        </div>

        {/* Cadence Match Playlist Grid */}
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-[10px] text-[#c4c9ac] uppercase tracking-wider font-semibold">
            Dynamic Cadence Match Playlists
          </span>

          {SPOTIFY_PLAYLISTS.map((pl) => {
            const isSelected = activePlaylistId === pl.id;
            return (
              <div
                key={pl.id}
                onClick={() => {
                  setActivePlaylistId(pl.id);
                  onUpdateSettings({ activePlaylistId: pl.id });
                }}
                className={`bg-[#1d2023] hover:bg-[#272a2e] transition-colors rounded-xl p-2.5 flex items-center justify-between group cursor-pointer border ${
                  isSelected ? 'border-[#c3f400]/50' : 'border-[#272a2e]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#272a2e]">
                    <img
                      src={pl.image}
                      alt={pl.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#111417]/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#ffffff] text-[22px] group-hover:scale-110 transition-transform">
                        {isSelected ? 'play_arrow' : 'play_arrow'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded font-label-sm text-[9px] uppercase tracking-wide font-bold ${
                        isSelected ? 'bg-[#c3f400] text-[#283500]' : 'bg-[#323538] text-[#e1e2e7]'
                      }`}>
                        {pl.bpm}
                      </span>
                      <span className="font-label-sm text-[10px] text-[#4cd7f6] font-semibold">
                        {pl.tag}
                      </span>
                    </div>
                    <p className="font-headline-sm text-[14px] font-bold text-[#e1e2e7] truncate mt-0.5">
                      {pl.title}
                    </p>
                    <p className="font-body-sm text-[11px] text-[#c4c9ac] truncate">
                      {pl.genre}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isSelected ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] block animate-pulse" />
                  ) : (
                    <span className="material-symbols-outlined text-[#c4c9ac] group-hover:text-[#e1e2e7] text-[20px]">
                      add_circle
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sound Check & Voice Preview Sandbox */}
      <section className="bg-[#1d2023] border border-[#272a2e] rounded-xl p-4 flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#c3f400] text-[20px]">hearing</span>
            <span className="font-label-md text-[11px] uppercase tracking-wider text-[#e1e2e7] font-bold">
              Audio Feed Preview
            </span>
          </div>
          <span className={`font-label-sm text-[10px] font-semibold ${
            isPlaying ? 'text-[#c3f400] animate-pulse' : 'text-[#c4c9ac]'
          }`}>
            {isPlaying ? `Ducking ${duckingDb}dB • Marcus Voice Active` : 'Ready to test'}
          </span>
        </div>

        {/* Visualizer Waveform Animation */}
        <div className="w-full h-12 bg-[#191c1f] rounded-lg flex items-center justify-center px-4 gap-1 overflow-hidden border border-[#272a2e]">
          {waveHeights.map((h, idx) => (
            <span
              key={idx}
              style={{ height: `${h}px` }}
              className={`w-1 rounded-full transition-all duration-100 ${
                isPlaying ? 'bg-[#c3f400]' : 'bg-[#323538]'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <p className="font-body-sm text-[12px] text-[#c4c9ac] italic text-center leading-snug px-2">
            {sampleQuote}
          </p>

          <button
            onClick={toggleSimulation}
            className={`w-full h-12 active:scale-[0.98] transition-all rounded-xl font-label-lg text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-md ${
              isPlaying
                ? 'bg-[#93000a] text-[#ffdad6] hover:bg-[#ba1a1a]'
                : 'bg-[#c3f400] text-[#283500] hover:bg-[#abd600]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isPlaying ? 'stop_circle' : 'play_circle'}
            </span>
            <span>
              {isPlaying ? 'STOP AUDIO SIMULATION' : 'TEST MARCUS + DUCKED SPOTIFY MIX'}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
