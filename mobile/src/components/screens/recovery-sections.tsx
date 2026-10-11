import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../ui/text';
import { Icon } from '../ui/icon';
import { Card } from '../ui/card';
import { Switch } from '../ui/toggle';
import { colors, radius, spacing, type } from '../../theme';
import type { SleepData } from '../../types';

// Web: src/components/screens/RecoveryScreen.tsx
// Content sections extracted from the Recovery route to keep routes lean:
// sleep architecture, digital wellness, bio-feedback insight, protocol rows.

export type StageKey = 'deep' | 'rem' | 'light';

const STAGE_TIPS: Record<StageKey, { icon: string; color: string; lead: string; strong: string; tail: string }> = {
  deep: {
    icon: 'verified_user',
    color: colors.accent,
    lead: 'Physical rebuilding peaked at ',
    strong: '01:45 AM',
    tail: ' with steady delta waves.',
  },
  rem: {
    icon: 'psychology',
    color: colors.primary,
    lead: 'Cognitive consolidation active across ',
    strong: '4 cycles',
    tail: ', primarily after 04:00 AM.',
  },
  light: {
    icon: 'bedtime',
    color: colors.text,
    lead: 'Metabolic transition & core cooling: ',
    strong: '3h 37m',
    tail: ' maintaining low muscle tone.',
  },
};

// 7-day sleep duration chart (heights from the web build).
const SLEEP_WEEK = [
  { day: 'F', height: 68, tone: 'line' as const },
  { day: 'S', height: 84, tone: 'line' as const },
  { day: 'S', height: 72, tone: 'line' as const },
  { day: 'M', height: 90, tone: 'cyan' as const },
  { day: 'T', height: 60, tone: 'line' as const },
  { day: 'W', height: 88, tone: 'cyan' as const },
  { day: 'T', height: 96, tone: 'volt' as const },
];

function SectionHeaderRow({
  icon,
  title,
  meta,
  titleColor = colors.text,
}: {
  icon: string;
  title: string;
  meta: string;
  titleColor?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <Icon name={icon} size={20} color={titleColor === colors.primary ? colors.primary : colors.accent} />
        <AppText style={styles.sectionTitle}>{title}</AppText>
      </View>
      <AppText style={[styles.sectionMeta, titleColor === colors.primary && styles.sectionMetaVolt]}>
        {meta}
      </AppText>
    </View>
  );
}

export function SleepArchitectureSection({
  sleep,
  selectedStage,
  onSelectStage,
}: {
  sleep: SleepData;
  selectedStage: StageKey;
  onSelectStage: (stage: StageKey) => void;
}) {
  const tip = STAGE_TIPS[selectedStage];

  return (
    <>
      <SectionHeaderRow icon="bedtime" title="Sleep Architecture" meta="Quality 96%" />

      <Card style={styles.sleepCard}>
        <View style={styles.durationRow}>
          <View>
            <AppText style={styles.miniLabel}>Total Duration</AppText>
            <View style={styles.durationValueRow}>
              <AppText style={styles.durationValue}>{sleep.totalDuration.hours}</AppText>
              <AppText style={styles.durationUnit}>h</AppText>
              <AppText style={[styles.durationValue, { marginLeft: spacing.sm }]}>
                {sleep.totalDuration.minutes}
              </AppText>
              <AppText style={styles.durationUnit}>m</AppText>
            </View>
          </View>
          <View style={styles.windowChip}>
            <Icon name="schedule" size={16} color={colors.accent} />
            <View style={styles.windowTexts}>
              <AppText style={styles.windowLabel}>Asleep / In Bed</AppText>
              <AppText style={styles.windowValue}>{sleep.sleepWindow}</AppText>
            </View>
          </View>
        </View>

        {/* Stacked stage bar */}
        <View style={styles.stackWrap}>
          <View
            style={styles.stackBar}
            accessibilityLabel={`Sleep stages: deep ${sleep.stages.deep.percent} percent, REM ${sleep.stages.rem.percent} percent, light ${sleep.stages.light.percent} percent`}
          >
            <View style={{ width: `${sleep.stages.deep.percent}%`, backgroundColor: colors.accent }} />
            <View style={{ width: `${sleep.stages.rem.percent}%`, backgroundColor: colors.primary }} />
            <View style={{ width: `${sleep.stages.light.percent}%`, backgroundColor: colors.line }} />
          </View>

          <View style={styles.stageRow}>
            {(['deep', 'rem', 'light'] as StageKey[]).map((key) => {
              const stage = sleep.stages[key];
              const selected = selectedStage === key;
              const dotColor =
                key === 'deep' ? colors.accent : key === 'rem' ? colors.primary : colors.line;
              const valueColor =
                key === 'deep'
                  ? colors.accent
                  : key === 'rem'
                    ? colors.primary
                    : colors.textSecondary;
              const suffix = key === 'deep' ? ' (+5%)' : key === 'rem' ? ' (Optimal)' : '';
              return (
                <Pressable
                  key={key}
                  onPress={() => onSelectStage(key)}
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${key} sleep stage detail`}
                  accessibilityState={{ selected }}
                  style={[
                    styles.stageCard,
                    selected && { backgroundColor: colors.cardRaised, borderColor: dotColor },
                  ]}
                >
                  <View style={styles.stageNameRow}>
                    <View style={[styles.stageDot, { backgroundColor: dotColor }]} />
                    <AppText style={styles.stageName}>
                      {key === 'deep' ? 'Deep' : key === 'rem' ? 'REM' : 'Light'}
                    </AppText>
                  </View>
                  <AppText style={styles.stageDuration}>
                    {stage.hours}h {stage.minutes}m
                  </AppText>
                  <AppText style={[styles.stagePercent, { color: valueColor }]}>
                    {stage.percent}%{suffix}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Stage micro-detail tip (strong runs split into styled text) */}
        <View style={styles.tipCard}>
          <Icon name={tip.icon} size={18} color={tip.color} />
          <AppText style={styles.tipText}>
            {tip.lead}
            <AppText style={[styles.tipStrong, { color: tip.color }]}>{tip.strong}</AppText>
            {tip.tail}
          </AppText>
        </View>

        {/* 7-day trajectory vs 8h target */}
        <View style={styles.chartBlock}>
          <View style={styles.chartHead}>
            <AppText style={styles.chartTitle}>7-Day Trajectory vs 8h Target</AppText>
            <View style={styles.legendRow}>
              <View style={styles.legendDash} />
              <AppText style={styles.legendText}>Target (8h)</AppText>
            </View>
          </View>

          <View style={styles.chartArea} accessibilityLabel="Seven day sleep duration chart">
            <View style={styles.targetLine} />
            <View style={styles.chartBars}>
              {SLEEP_WEEK.map((item, idx) => (
                <View key={`${item.day}-${idx}`} style={styles.chartCol}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: `${item.height}%`,
                        backgroundColor:
                          item.tone === 'volt'
                            ? colors.primary
                            : item.tone === 'cyan'
                              ? colors.accent
                              : colors.line,
                      },
                    ]}
                  />
                  <AppText style={[styles.chartDay, item.tone === 'volt' && styles.chartDayActive]}>
                    {item.day}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.chartFooter}>
            <AppText style={styles.chartFooterText}>Avg 7h 41m / night</AppText>
            <AppText style={styles.chartFooterGoal}>6 of 7 Goals Met</AppText>
          </View>
        </View>
      </Card>
    </>
  );
}

export function DigitalWellnessSection({ sleep }: { sleep: SleepData }) {
  return (
    <>
      <SectionHeaderRow icon="screen_lock_portrait" title="Digital Wellness" meta="Lockout System" />

      <View style={styles.wellnessRow}>
        <Card style={styles.wellnessCard}>
          <View style={styles.signalHead}>
            <AppText style={styles.signalLabel}>Screen Time</AppText>
            <Icon name="phonelink_ring" size={18} color={colors.accent} />
          </View>
          <View style={styles.signalValueRow}>
            <AppText style={styles.signalValue}>{sleep.screenTimeHours}</AppText>
            <AppText style={styles.signalUnit}>H</AppText>
            <AppText style={[styles.signalValue, { marginLeft: spacing.sm }]}>
              {sleep.screenTimeMinutes}
            </AppText>
            <AppText style={styles.signalUnit}>M</AppText>
          </View>
          <View style={styles.signalDelta}>
            <Icon name="arrow_downward" size={13} color={colors.primary} />
            <AppText style={styles.signalDeltaText}>
              {sleep.screenTimeDeltaPercent}% vs average
            </AppText>
          </View>
          <AppText style={styles.wellnessNote}>Within target recovery limit (&lt;2h)</AppText>
        </Card>

        <Card style={styles.wellnessCard}>
          <View style={styles.signalHead}>
            <AppText style={styles.signalLabel}>Bedtime Lockout</AppText>
            <Icon name="verified" size={18} color={colors.primary} />
          </View>
          <View style={styles.signalValueRow}>
            <AppText style={styles.signalValue}>{sleep.bedtimeLockoutPercent}</AppText>
            <AppText style={styles.lockoutPercent}>%</AppText>
          </View>
          <View style={styles.signalDelta}>
            <Icon name="check_circle" size={13} color={colors.primary} />
            <AppText style={styles.signalDeltaText}>Honored 30m prior</AppText>
          </View>
          <AppText style={styles.wellnessNote}>Phone parked out of reach at 10:30 PM</AppText>
        </Card>
      </View>
    </>
  );
}

export function BioFeedbackInsight() {
  return (
    <Card style={styles.insightCard}>
      <View style={styles.insightIcon}>
        <Icon name="insights" size={22} color={colors.accent} />
      </View>
      <View style={styles.insightBody}>
        <AppText style={styles.insightLabel}>Bio-Feedback Correlation</AppText>
        <AppText style={styles.insightText}>
          Consistent bedtime lockout improved your deep sleep stage by{' '}
          <AppText style={styles.insightAccent}>+18%</AppText>.
        </AppText>
        <AppText style={styles.insightSub}>
          Latency reduced from 22 minutes to 8 minutes over the last 14 sessions.
        </AppText>
      </View>
    </Card>
  );
}

export function RecoveryProtocolSection({
  sleep,
  onStartWindDown,
  onAddHydration,
  onToggleCircadian,
}: {
  sleep: SleepData;
  onStartWindDown: () => void;
  onAddHydration: () => void;
  onToggleCircadian: () => void;
}) {
  return (
    <>
      <SectionHeaderRow icon="tune" title="Recovery Protocol" meta="Evening Stack" titleColor={colors.primary} />

      <View style={styles.protocolList}>
        <View style={styles.protocolRow}>
          <View style={styles.protocolIcon}>
            <Icon name="self_improvement" size={20} color={colors.text} />
          </View>
          <View style={styles.protocolBody}>
            <AppText style={styles.protocolTitle}>Wind-Down Mobility</AppText>
            <AppText style={styles.protocolSub}>10m Thoracic &amp; Hip Decompression</AppText>
          </View>
          <Pressable
            onPress={onStartWindDown}
            accessibilityRole="button"
            accessibilityLabel="Start Wind-Down Mobility routine"
            style={({ pressed }) => [styles.startBtn, pressed && styles.pressed]}
          >
            <AppText style={styles.startText}>Start</AppText>
          </Pressable>
        </View>

        <View style={styles.protocolRow}>
          <View style={[styles.protocolIcon, { backgroundColor: colors.cardRaised }]}>
            <Icon name="water_drop" size={20} color={colors.accent} />
          </View>
          <View style={styles.protocolBody}>
            <View style={styles.protocolTitleRow}>
              <AppText style={styles.protocolTitle}>Hydration &amp; Electrolytes</AppText>
              <View style={styles.hydrationTag}>
                <AppText style={styles.hydrationText}>{sleep.hydrationLiters}L / 3.0L</AppText>
              </View>
            </View>
            <AppText style={styles.protocolSub}>Optimal baseline reached before 8 PM</AppText>
          </View>
          <Pressable
            onPress={onAddHydration}
            accessibilityRole="button"
            accessibilityLabel="Add 250ml water"
            style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          >
            <Icon name="add" size={18} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.protocolRow}>
          <View style={[styles.protocolIcon, { backgroundColor: colors.cardRaised }]}>
            <Icon name="wb_twilight" size={20} color={colors.accent} />
          </View>
          <View style={styles.protocolBody}>
            <AppText style={styles.protocolTitle}>Circadian Filter</AppText>
            <AppText style={styles.protocolSub}>Auto blue light lockout at 9:30 PM</AppText>
          </View>
          <Switch value={sleep.circadianFilterActive} onValueChange={onToggleCircadian} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionMeta: {
    ...type.label,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  sectionMetaVolt: {
    color: colors.primary,
  },
  signalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  signalLabel: {
    ...type.label,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  signalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  signalValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  signalUnit: {
    ...type.label,
    fontSize: 10,
    color: colors.textSecondary,
  },
  signalDelta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  signalDeltaText: {
    ...type.label,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    flexShrink: 1,
  },
  sleepCard: {
    gap: spacing.md,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  miniLabel: {
    ...type.label,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  durationValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  durationValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  durationUnit: {
    ...type.label,
    fontSize: 13,
    color: colors.textSecondary,
  },
  windowChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
  },
  windowTexts: {
    alignItems: 'flex-end',
    gap: 1,
  },
  windowLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  windowValue: {
    ...type.label,
    fontSize: 11,
    color: colors.text,
    fontWeight: '700',
  },
  stackWrap: {
    gap: spacing.sm,
  },
  stackBar: {
    flexDirection: 'row',
    width: '100%',
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  stageRow: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: spacing.xs,
  },
  stageCard: {
    flex: 1,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: 2,
  },
  stageNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageName: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  stageDuration: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  stagePercent: {
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tipText: {
    ...type.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
    flex: 1,
  },
  tipStrong: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chartBlock: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  chartHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  chartTitle: {
    ...type.label,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 1,
    flexShrink: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDash: {
    width: 12,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  legendText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chartArea: {
    height: 128,
    borderRadius: radius.md,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '26%',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    opacity: 0.4,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 16,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  chartDay: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chartDayActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  chartFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  chartFooterText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chartFooterGoal: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  wellnessRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  wellnessCard: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  lockoutPercent: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '800',
  },
  wellnessNote: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBody: {
    flex: 1,
    gap: 2,
  },
  insightLabel: {
    ...type.overline,
    fontSize: 10,
    color: colors.accent,
    fontWeight: '700',
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  insightAccent: {
    color: colors.primary,
    fontWeight: '800',
  },
  insightSub: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.textSecondary,
    marginTop: 2,
  },
  protocolList: {
    gap: spacing.sm,
  },
  protocolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  protocolIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolBody: {
    flex: 1,
    gap: 2,
  },
  protocolTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  protocolTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  protocolSub: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  startText: {
    ...type.label,
    fontSize: 11,
    color: '#283500',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  hydrationTag: {
    backgroundColor: colors.cardRaised,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hydrationText: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
