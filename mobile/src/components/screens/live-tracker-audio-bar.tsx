import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppText } from '../ui/text';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { colors, radius, spacing } from '../../theme';

/** Tappable Spotify/Audio-Coach mini bar. */
export function AudioMiniBar({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open Audio Coach settings"
      style={({ pressed }) => [pressed && styles.pressed]}>
      <Card style={styles.audioBar}>
        <View style={styles.audioIcon}>
          <MaterialIcons name="headphones" size={20} color={colors.secondary} />
        </View>
        <View style={styles.audioCopy}>
          <AppText variant="label" style={styles.audioTitle}>
            Marcus British Coaching Active
          </AppText>
          <AppText variant="caption" tone="secondary">
            140 BPM Bassline Sprint • Ducking -18dB
          </AppText>
        </View>
        <MaterialIcons name="tune" size={18} color={colors.textSecondary} />
      </Card>
    </Pressable>
  );
}

/** Pause / Resume + End Session controls. */
export function SessionControls({
  isPaused,
  onTogglePause,
  onEndSession,
}: {
  isPaused: boolean;
  onTogglePause: () => void;
  onEndSession: () => void;
}) {
  return (
    <View style={styles.controls}>
      <Button
        label={isPaused ? 'Resume Session' : 'Pause Workout'}
        variant="secondary"
        icon={isPaused ? 'play' : 'pause'}
        onPress={onTogglePause}
        style={styles.pauseBtn}
      />
      <Button label="End Session" variant="danger" onPress={onEndSession} style={styles.endBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  audioBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  audioIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.cardRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioCopy: {
    flex: 1,
    gap: 2,
  },
  audioTitle: {
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pauseBtn: {
    flex: 1,
  },
  endBtn: {
    paddingHorizontal: spacing.xl,
  },
});
