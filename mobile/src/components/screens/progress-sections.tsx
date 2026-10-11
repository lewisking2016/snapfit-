import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../ui/text';
import { Card } from '../ui/card';
import { Icon } from '../ui/icon';
import { Tag } from '../ui/pill';
import { colors, radius, spacing } from '../../theme';
import type { WorkoutSessionLog } from '../../types';

// Web: src/components/screens/ProgressScreen.tsx
// Macro tonnage card, PR benchmark grid, session history rows.
// Bar chart is drawn with plain Views — the web SVG/percent bars map
// directly onto fixed-height columns.

const WEEK: {
  day: string;
  vol: number;
  height: `${number}%`;
  isPeak?: boolean;
}[] = [
  { day: 'Mon', vol: 2400, height: '60%' },
  { day: 'Tue', vol: 3200, height: '80%' },
  { day: 'Wed', vol: 0, height: '10%' },
  { day: 'Thu', vol: 4100, height: '95%', isPeak: true },
  { day: 'Fri', vol: 2800, height: '70%' },
  { day: 'Sat', vol: 2320, height: '58%' },
  { day: 'Sun', vol: 0, height: '10%' },
];

export function TonnageCard() {
  return (
    <Card style={styles.tonnageCard}>
      <View style={styles.tonnageHead}>
        <AppText variant="overline" tone="secondary">
          Weekly Accumulated Tonnage
        </AppText>
        <Tag label="4-Day Split" color={colors.secondary} />
      </View>

      <View style={styles.tonnageRow}>
        <AppText style={styles.tonnageValue}>14,820</AppText>
        <AppText style={styles.tonnageUnit}>KG</AppText>
        <View style={styles.deltaRow}>
          <Icon name="arrow_upward" size={14} color={colors.primary} />
          <AppText variant="label" tone="primary">
            +1,420 KG vs last week
          </AppText>
        </View>
      </View>

      {/* 7-day tonnage sparkline bars */}
      <View
        style={styles.bars}
        accessibilityLabel="Weekly tonnage: Monday 2400, Tuesday 3200, Wednesday rest, Thursday 4100 peak, Friday 2800, Saturday 2320, Sunday rest, in kilograms"
      >
        {WEEK.map((bar) => (
          <View key={bar.day} style={styles.barCol}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: bar.height,
                    backgroundColor: bar.isPeak
                      ? colors.primary
                      : bar.vol > 0
                        ? colors.secondary
                        : colors.line,
                  },
                ]}
              />
            </View>
            <AppText variant="caption" tone="muted" style={styles.barLabel}>
              {bar.day}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const PRS = [
  { movement: 'Single DB Floor Press', weight: '24 KG', date: 'Oct 22', change: '+2 KG PR', icon: 'fitness_center' },
  { movement: 'Hang Snatch (Single DB)', weight: '20 KG', date: 'Oct 19', change: '+4 reps', icon: 'bolt' },
  { movement: 'Jump Rope Peak Cadence', weight: '156 RPM', date: 'Oct 24', change: 'Zone 4 Lock', icon: 'speed' },
  { movement: 'Bulgarian Split Squat Volume', weight: '1,920 KG', date: 'Oct 17', change: '+12% Vol', icon: 'trending_up' },
] as const;

export function PrGrid() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionHeadLeft}>
          <Icon name="trophy" size={18} color={colors.primary} />
          <AppText variant="heading">Personal Records</AppText>
        </View>
        <AppText variant="caption" tone="muted">
          All-Time Bests
        </AppText>
      </View>

      <View style={styles.prGrid}>
        {PRS.map((pr) => (
          <View key={pr.movement} style={styles.prCell}>
            <View style={styles.prCellTop}>
              <Icon name={pr.icon} size={18} color={colors.primary} />
              <View style={styles.prDate}>
                <AppText variant="caption" tone="secondary-accent" style={styles.prDateText}>
                  {pr.date}
                </AppText>
              </View>
            </View>
            <AppText style={styles.prWeight}>{pr.weight}</AppText>
            <AppText variant="caption" tone="secondary" numberOfLines={1}>
              {pr.movement}
            </AppText>
            <AppText variant="caption" tone="primary" style={styles.prChange}>
              {pr.change}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

/** One row of the session history list. */
export function SessionLogRow({ log }: { log: WorkoutSessionLog }) {
  return (
    <View style={styles.logRow}>
      <View style={styles.logIcon}>
        <Icon name="fitness_center" size={20} color={colors.primary} />
      </View>

      <View style={styles.logMain}>
        <AppText variant="label" numberOfLines={1}>
          {log.routineTitle}
        </AppText>
        <View style={styles.logMeta}>
          <AppText variant="caption" tone="muted">
            {log.date}
          </AppText>
          <AppText variant="caption" tone="muted">
            •
          </AppText>
          <AppText variant="caption" tone="muted">
            {log.durationMins} min
          </AppText>
          <AppText variant="caption" tone="muted">
            •
          </AppText>
          <AppText variant="caption" tone="primary">
            {log.calories} kcal
          </AppText>
        </View>
      </View>

      <View style={styles.logHr}>
        <AppText variant="label" style={styles.logHrValue}>
          {log.avgHr} BPM
        </AppText>
        <AppText variant="caption" tone="secondary-accent" style={styles.logSynced}>
          Synced
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tonnageCard: {
    gap: spacing.md,
  },
  tonnageHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  tonnageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  tonnageValue: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  tonnageUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 96,
    gap: spacing.xs,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  barTrack: {
    width: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionHeadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  prCell: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 2,
    justifyContent: 'space-between',
  },
  prCellTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  prDate: {
    backgroundColor: colors.cardRaised,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  prDateText: {
    fontSize: 9,
  },
  prWeight: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  prChange: {
    marginTop: 2,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.chip,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logMain: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  logMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  logHr: {
    alignItems: 'flex-end',
    gap: 2,
  },
  logHrValue: {
    color: colors.danger,
    fontVariant: ['tabular-nums'],
  },
  logSynced: {
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});
