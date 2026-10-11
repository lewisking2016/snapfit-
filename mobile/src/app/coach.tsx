import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { ScreenHeading } from '@/components/ui/header';
import { colors, spacing } from '@/theme';
import { useSettingsStore } from '@/store/settings-store';
import { AUDIO_DEVICES, SwitchAudioSheet } from '@/components/sheets/switch-audio-sheet';
import {
  AskMarcusCard,
  AudioPreviewCard,
  PlaylistsCard,
  RoutingCard,
  VoiceProfileCard,
} from '@/components/screens/audio-coach';
import {
  startDuckedPreview,
  stopAllCues,
  type AudioCoachOptions,
} from '@/utils/audioCoach';

const SAMPLE_QUOTE =
  'Lock your core. Final three reps, let’s smash through the plateau!';

export default function CoachScreen() {
  const audio = useSettingsStore((s) => s.audio);
  const updateAudio = useSettingsStore((s) => s.updateAudio);

  const [isPlaying, setIsPlaying] = useState(false);
  const [switchAudioOpen, setSwitchAudioOpen] = useState(false);
  const cancelPreview = useRef<(() => void) | null>(null);

  const device = AUDIO_DEVICES.find((d) => d.name === audio.device) ?? AUDIO_DEVICES[0];

  const coachOptions: AudioCoachOptions = {
    intensity: audio.cueIntensity,
    triggers: audio.triggers,
    duckingRatio: audio.duckingRatio,
  };

  const handleTogglePreview = useCallback(() => {
    if (isPlaying) {
      cancelPreview.current?.();
      cancelPreview.current = null;
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    cancelPreview.current = startDuckedPreview(SAMPLE_QUOTE, coachOptions, (active) => {
      setIsPlaying(active);
      if (!active) cancelPreview.current = null;
    });
  }, [isPlaying, coachOptions]);

  // Stop speech + cancel timers on unmount.
  useEffect(() => {
    return () => {
      cancelPreview.current?.();
      stopAllCues();
    };
  }, []);

  return (
    <Screen>
      <ScreenHeading
        overline="AUDIO COMPANION"
        title="Coach"
        trailing={
          <View style={styles.headingDot} />
        }
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <RoutingCard
          audio={audio}
          device={device}
          onSwitch={() => setSwitchAudioOpen(true)}
        />

        <VoiceProfileCard
          audio={audio}
          onIntensity={(v) => updateAudio({ cueIntensity: v })}
          onToggle={(key, value) =>
            updateAudio({ triggers: { ...audio.triggers, [key]: value } })
          }
          duckingPercent={audio.duckingRatio}
          onDuckingChange={(v) => updateAudio({ duckingRatio: v })}
        />

        <PlaylistsCard
          activePlaylistId={audio.activePlaylistId}
          onSelect={(id) => updateAudio({ activePlaylistId: id })}
        />

        <AudioPreviewCard
          playing={isPlaying}
          duckingPercent={audio.duckingRatio}
          onToggle={handleTogglePreview}
        />

        <AskMarcusCard audio={audio} />
      </ScrollView>

      <SwitchAudioSheet
        visible={switchAudioOpen}
        onClose={() => setSwitchAudioOpen(false)}
        activeId={device.id}
        onSelect={(d) => {
          updateAudio({ device: d.name, latencyMs: d.latencyMs });
          setSwitchAudioOpen(false);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: spacing.xl,
    paddingBottom: 110,
  },
  headingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
