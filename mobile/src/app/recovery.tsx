import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/ui/screen';
import { AppText } from '../components/ui/text';
import { Icon } from '../components/ui/icon';
import { Card } from '../components/ui/card';
import { WindDownSheet } from '../components/sheets/wind-down-sheet';
import {
  BioFeedbackInsight,
  DigitalWellnessSection,
  RecoveryProtocolSection,
  SleepArchitectureSection,
  type StageKey,
} from '../components/screens/recovery-sections';
import { useSettingsStore } from '../store/settings-store';
import { colors, radius, spacing, type } from '../theme';

// Web: src/components/screens/RecoveryScreen.tsx
// Readiness hero, sleep architecture, digital wellness, evening protocol.

export default function RecoveryScreen() {
  const sleep = useSettingsStore((state) => state.sleep);
  const samsungHealth = useSettingsStore((state) => state.samsungHealth);
  const updateSleep = useSettingsStore((state) => state.updateSleep);

  const [selectedStage, setSelectedStage] = useState<StageKey>('deep');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [windDownOpen, setWindDownOpen] = useState(false);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleAddHydration = () => {
    const updated = +(sleep.hydrationLiters + 0.25).toFixed(2);
    updateSleep({ hydrationLiters: updated });
  };

  const toggleCircadian = () => {
    updateSleep({ circadianFilterActive: !sleep.circadianFilterActive });
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.xl, paddingBottom: 110 }}
      >
        <View style={styles.headingBlock}>
          <View>
            <AppText variant="label" tone="muted">
              Recovery
            </AppText>
            <AppText variant="heading1" style={styles.headingTitle}>
              Recovery Score
            </AppText>
          </View>
          <View style={[styles.statusPill, !samsungHealth.connected && styles.statusPillMuted]}>
            <View style={[styles.statusDot, samsungHealth.connected ? styles.statusDotLive : styles.statusDotMuted]} />
            <AppText style={styles.statusText}>
              {samsungHealth.connected ? 'Live from Health Connect' : 'Permission required'}
            </AppText>
          </View>
        </View>

        {/* Subheader: status pill + date + refresh */}
        <View style={styles.subheader}>
          <View style={styles.subheaderLeft}>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <AppText style={styles.statusText}>Telemetry Synced</AppText>
            </View>
            <AppText style={styles.dateText}>Today, Oct 24</AppText>
          </View>
          <Pressable
            onPress={handleRefresh}
            accessibilityRole="button"
            accessibilityLabel="Refresh telemetry data"
            style={({ pressed }) => [styles.refreshBtn, pressed && styles.pressed]}
          >
            <Icon
              name="sync"
              size={18}
              color={isRefreshing ? colors.primary : colors.text}
            />
          </Pressable>
        </View>

        {/* Hero: readiness score */}
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroScore}>
              <AppText style={styles.heroLabel}>Recovery Score</AppText>
              <View style={styles.scoreRow}>
                <AppText style={styles.scoreValue}>{sleep.recoveryScore}</AppText>
                <AppText style={styles.scoreUnit}>%</AppText>
                <View style={styles.optimalTag}>
                  <AppText style={styles.optimalText}>Optimal</AppText>
                </View>
              </View>
            </View>

            {/* Radial gauge approximated with plain Views (no SVG allowed). */}
            <View
              style={styles.gaugeTrack}
              accessibilityLabel={`Recovery score gauge at ${sleep.recoveryScore} percent`}
            >
              <View style={styles.gaugeArc} />
              <Icon name="bolt" size={20} color={colors.accent} />
            </View>
          </View>

          <View style={styles.signalsRow}>
            <View style={styles.signalCard}>
              <View style={styles.signalHead}>
                <AppText style={styles.signalLabel}>Resting Heart Rate</AppText>
                <Icon name="favorite" size={16} color={colors.accent} />
              </View>
              <View style={styles.signalValueRow}>
                <AppText style={styles.signalValue}>{sleep.rhr}</AppText>
                <AppText style={styles.signalUnit}>BPM</AppText>
              </View>
              <View style={styles.signalDelta}>
                <Icon name="trending_down" size={14} color={colors.primary} />
                <AppText style={styles.signalDeltaText}>-3 bpm vs 30d</AppText>
              </View>
            </View>

            <View style={styles.signalCard}>
              <View style={styles.signalHead}>
                <AppText style={styles.signalLabel}>HRV Status</AppText>
                <Icon name="ecg_heart" size={16} color={colors.primary} />
              </View>
              <View style={styles.signalValueRow}>
                <AppText style={styles.signalValue}>{sleep.hrv}</AppText>
                <AppText style={styles.signalUnit}>MS</AppText>
              </View>
              <View style={styles.signalDelta}>
                <Icon name="verified" size={14} color={colors.primary} />
                <AppText style={styles.signalDeltaText}>Balanced (Range 68-82)</AppText>
              </View>
            </View>
          </View>
        </Card>

        {/* Sleep architecture */}
        <SleepArchitectureSection
          sleep={sleep}
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
        />

        {/* Digital wellness */}
        <DigitalWellnessSection sleep={sleep} />

        {/* Bio-feedback insight */}
        <BioFeedbackInsight />

        {/* Recovery protocol */}
        <RecoveryProtocolSection
          sleep={sleep}
          onStartWindDown={() => setWindDownOpen(true)}
          onAddHydration={handleAddHydration}
          onToggleCircadian={toggleCircadian}
        />
      </ScrollView>

      <WindDownSheet visible={windDownOpen} onClose={() => setWindDownOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headingBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  headingTitle: {
    marginTop: spacing.xs,
  },
  subheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  subheaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
  },
  statusPillMuted: {
    backgroundColor: colors.secondaryContainer,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  statusDotLive: {
    backgroundColor: colors.primary,
  },
  statusDotMuted: {
    backgroundColor: colors.secondary,
  },
  statusText: {
    ...type.label,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateText: {
    ...type.label,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  hero: {
    gap: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heroScore: {
    flex: 1,
    gap: 2,
  },
  heroLabel: {
    ...type.overline,
    color: colors.textSecondary,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  scoreValue: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  scoreUnit: {
    fontSize: 18,
    color: colors.accent,
    marginRight: spacing.xs,
  },
  optimalTag: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  optimalText: {
    ...type.label,
    fontSize: 10,
    color: '#283500',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  gaugeTrack: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    // Progress arc faked with a rotated ring segment (no SVG).
    overflow: 'visible',
  },
  gaugeArc: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 46,
    borderWidth: 6,
    borderColor: colors.accent,
    borderRightColor: colors.primary,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  signalsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.md,
  },
  signalCard: {
    flex: 1,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    gap: 2,
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
});
