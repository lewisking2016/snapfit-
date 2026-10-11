import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '../ui/text';
import { Button } from '../ui/button';
import { colors, radius, spacing } from '../../theme';

function formatTimer(totalSecs: number): string {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: 'primary' | 'secondary-accent' }) {
  return (
    <View style={styles.row}>
      <AppText variant="caption" tone="secondary">
        {label}
      </AppText>
      <AppText variant="label" tone={tone ?? 'default'} style={styles.rowValue}>
        {value}
      </AppText>
    </View>
  );
}

/** Sheet content shown when a workout finishes. */
export function WorkoutSummarySheet({
  routineTitle,
  elapsedSeconds,
  calories,
  avgHr,
  onSave,
}: {
  routineTitle: string;
  elapsedSeconds: number;
  calories: number;
  avgHr: number;
  onSave: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
        <AppText variant="heading">Workout Completed!</AppText>
      </View>

      <View style={styles.panel}>
        <SummaryRow label="Routine" value={routineTitle} />
        <SummaryRow label="Total Time" value={formatTimer(elapsedSeconds)} />
        <SummaryRow label="Total Energy Burn" value={`${calories} KCAL`} tone="primary" />
        <SummaryRow label="Average HR (Oraimo)" value={`${avgHr} BPM`} tone="secondary-accent" />
      </View>

      <Button
        label="Save & Sync to Samsung Health"
        variant="primary"
        icon="cloud-upload"
        onPress={onSave}
        full
      />
    </View>
  );
}

/** Sheet content for the "End Session?" confirmation. */
export function EndSessionSheet({
  onSave,
  onDiscard,
}: {
  onSave: () => void;
  onDiscard: () => void;
}) {
  return (
    <View style={styles.container}>
      <AppText variant="heading" center>
        End Session?
      </AppText>
      <AppText variant="body" tone="secondary" center>
        You can save this session to your history, or discard it without a trace.
      </AppText>
      <Button label="End & Save Session" variant="primary" icon="cloud-upload" onPress={onSave} full />
      <Button label="End Without Saving" variant="danger" onPress={onDiscard} full />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  panel: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowValue: {
    fontWeight: '600',
  },
});
