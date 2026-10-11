import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { colors, spacing, radius, type } from '@/theme';

/**
 * Telemetry HUD: pulsing routine title + BLE status, Duration / Heart Rate /
 * Active Burn metrics, and a plain-View heart-rate progress line (ported from
 * the web LiveTrackerScreen telemetry panel).
 */
export function TelemetryHUD({
  routineTitle,
  durationLabel,
  heartRate,
  calories,
}: {
  routineTitle: string;
  durationLabel: string;
  heartRate: number;
  calories: number;
}) {
  const hrProgress = Math.min(1, Math.max(0, (heartRate - 100) / 90));
  const hrZone =
    heartRate >= 172 ? 'Peak Zone' : heartRate >= 154 ? 'Cardio Zone' : 'Warm Zone';

  return (
    <Card style={styles.panel}>
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <View style={styles.pulseDot} />
          <AppText variant="label" style={styles.routineTitle} numberOfLines={1}>
            {routineTitle}
          </AppText>
        </View>
        <View style={styles.liveTag}>
          <Icon name="bluetooth" size={12} color={colors.primary} />
          <AppText variant="caption" tone="primary">
            BLE LIVE
          </AppText>
        </View>
      </View>

      <View style={styles.metricRow}>
        <MetricBlock label="Duration" value={durationLabel} />
        <View style={styles.divider} />
        <MetricBlock label="Heart Rate" value={heartRate} unit="BPM" accent />
        <View style={styles.divider} />
        <MetricBlock label="Active Burn" value={calories} unit="KCAL" />
      </View>

      <View style={styles.hrBarTrack}>
        <View style={[styles.hrBarFill, { width: `${hrProgress * 100}%` }]} />
      </View>
      <AppText variant="caption" tone="muted" style={styles.hrZone}>
        {hrZone} · Target 128–178 BPM · Continuous telemetry via Oraimo band
      </AppText>
    </Card>
  );
}

function MetricBlock({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.metricBlock}>
      <AppText variant="label" tone="muted">
        {label}
      </AppText>
      <View style={styles.metricValueRow}>
        <AppText
          variant="metricSm"
          tone={accent ? 'primary' : 'default'}
          style={styles.metricValue}
        >
          {value}
        </AppText>
        {unit ? (
          <AppText variant="caption" tone="muted" style={styles.metricUnit}>
            {unit}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderColor: colors.line, borderWidth: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  routineTitle: { color: colors.text, flexShrink: 1 },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  metricRow: { flexDirection: 'row', alignItems: 'stretch' },
  metricBlock: { flex: 1, gap: 2 },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  metricValue: { ...type.metricSm, fontVariant: ['tabular-nums'] },
  metricUnit: { letterSpacing: 0.6 },
  divider: { width: 1, backgroundColor: colors.lineSoft, marginHorizontal: spacing.sm },
  hrBarTrack: {
    height: 4,
    backgroundColor: colors.lineSoft,
    borderRadius: 2,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  hrBarFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  hrZone: { marginTop: spacing.xs },
});
