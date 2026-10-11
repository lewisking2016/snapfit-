import { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { AthleteProfileSheet } from '@/components/sheets/athlete-profile-sheet';
import { NotificationsSheet } from '@/components/sheets/notifications-sheet';
import { FEATURED_ROUTINE } from '@/data/mockData';
import { useSettingsStore } from '@/store/settings-store';
import { useWorkoutStore } from '@/store/workout-store';
import { colors, radius, spacing, type } from '@/theme';

interface OverviewModule {
  label: string;
  value: string;
  helper: string;
  accent?: 'lime' | 'soft' | 'neutral';
  onPress?: () => void;
}

/**
 * Kinn Home — Samsung-inspired overview with full-width health panels and clear
 * source-state labels so the dashboard never misrepresents live data.
 */
export default function HomeScreen() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const samsungHealth = useSettingsStore((s) => s.samsungHealth);
  const sleep = useSettingsStore((s) => s.sleep);
  const watch = useSettingsStore((s) => s.watch);

  const sourceState = samsungHealth.connected ? 'Connected · preview sync' : 'Permission required';

  const metrics = useMemo(
    () => [
      { label: 'Steps', value: '6,420', helper: samsungHealth.streams.steps ? 'Synced' : 'Unavailable' },
      { label: 'Active', value: '42m', helper: 'Today' },
      { label: 'Distance', value: '4.1 km', helper: 'Logged' },
      { label: 'Calories', value: '380', helper: 'Burned' },
    ],
    [samsungHealth.streams.steps],
  );

  const modules: OverviewModule[] = [
    { label: 'Activity', value: 'Upper push', helper: 'Gym • 42 min', accent: 'lime', onPress: () => router.push('/move') },
    { label: 'Sleep', value: `${sleep.totalDuration.hours}h ${sleep.totalDuration.minutes}m`, helper: `${sleep.recoveryScore}% recovery`, accent: 'soft', onPress: () => router.push('/recovery') },
    { label: 'Heart', value: `${watch.restingHr} bpm`, helper: 'Resting HR', accent: 'neutral', onPress: () => router.push('/recovery') },
    { label: 'Mind', value: '14 min', helper: 'Breathwork', accent: 'neutral', onPress: () => router.push('/settings') },
    { label: 'Nutrition', value: '2.4 L', helper: 'Hydration target', accent: 'soft', onPress: () => router.push('/settings') },
  ];

  const startFeatured = () => {
    const { activeWeightKg, startWorkout } = useWorkoutStore.getState();
    startWorkout(FEATURED_ROUTINE, activeWeightKg);
    router.push('/tracker');
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/kinn-wordmark-dark.png')}
            style={styles.wordmark}
            contentFit="contain"
            accessibilityLabel="Kinn"
          />
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              style={styles.iconBtn}>
              <Ionicons name="settings-outline" size={24} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={() => setNotificationsOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={() => setProfileOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Profile"
              style={styles.avatar}>
              <AppText variant="caption" tone="inverse">
                You
              </AppText>
            </Pressable>
          </View>
        </View>

        <View style={styles.overviewHeader}>
          <View>
            <AppText variant="label" tone="muted">
              Overview
            </AppText>
            <AppText variant="heading1" style={styles.overviewTitle}>
              Today
            </AppText>
          </View>
          <View style={[styles.syncPill, !samsungHealth.connected && styles.syncPillMuted]}>
            <View
              style={[
                styles.syncDot,
                samsungHealth.connected ? styles.syncDotLive : styles.syncDotMuted,
              ]}
            />
            <AppText variant="caption" tone={samsungHealth.connected ? 'primary' : 'secondary'}>
              {sourceState}
            </AppText>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={startFeatured}
          style={({ pressed }) => [styles.featuredPanel, pressed && styles.pressed]}>
          <Image
            source={{ uri: FEATURED_ROUTINE.image }}
            style={styles.featuredImage}
            contentFit="cover"
            accessibilityLabel={FEATURED_ROUTINE.altText}
          />
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredContent}>
            <View style={styles.featuredPillRow}>
              <View style={styles.featuredPill}>
                <AppText variant="label" tone="primary">
                  Featured move
                </AppText>
              </View>
              <View style={styles.featuredMeta}>
                <Ionicons name="flash" size={12} color={colors.primary} />
                <AppText variant="caption" tone="primary">
                  {FEATURED_ROUTINE.duration} min
                </AppText>
              </View>
            </View>
            <AppText variant="heading2" style={styles.featuredTitle}>
              {FEATURED_ROUTINE.title}
            </AppText>
            <AppText variant="bodySmall" tone="secondary" style={styles.featuredSummary}>
              {FEATURED_ROUTINE.summary}
            </AppText>
            <View style={styles.featuredMetrics}>
              <View style={styles.featuredMetric}>
                <AppText variant="label" tone="muted">
                  kcal
                </AppText>
                <AppText variant="title">340</AppText>
              </View>
              <View style={styles.featuredMetric}>
                <AppText variant="label" tone="muted">
                  steps
                </AppText>
                <AppText variant="title">6.4k</AppText>
              </View>
            </View>
          </View>
        </Pressable>

        <View style={styles.metrics}>
          {metrics.map((metric) => (
            <View key={metric.label} style={styles.metricCard}>
              <AppText variant="label" tone="muted">
                {metric.label}
              </AppText>
              <AppText style={styles.metricValue}>{metric.value}</AppText>
              <AppText variant="caption" tone="secondary">
                {metric.helper}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.moduleStack}>
          {modules.map((module) => (
            <Pressable
              key={module.label}
              style={({ pressed }) => [
                styles.moduleCard,
                module.accent === 'lime' && styles.moduleCardLime,
                module.accent === 'soft' && styles.moduleCardSoft,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              onPress={module.onPress}
            >
              <AppText variant="label" tone={module.accent === 'lime' ? 'primary' : 'muted'}>
                {module.label}
              </AppText>
              <AppText variant="title" style={styles.moduleValue}>
                {module.value}
              </AppText>
              <AppText variant="bodySmall" tone={module.accent === 'lime' ? 'primary' : 'secondary'}>
                {module.helper}
              </AppText>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <NotificationsSheet
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <AthleteProfileSheet
        visible={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  wordmark: {
    width: 76,
    height: 34,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  overviewTitle: {
    marginTop: spacing.xs,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryContainer,
  },
  syncPillMuted: {
    backgroundColor: colors.secondaryContainer,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  syncDotLive: {
    backgroundColor: colors.primary,
  },
  syncDotMuted: {
    backgroundColor: colors.secondary,
  },
  featuredPanel: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 260,
    backgroundColor: colors.card,
    borderRadius: radius.xxl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
  },
  featuredImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(13, 16, 20, 0.38)',
  },
  featuredContent: {
    position: 'relative',
    padding: spacing.xl,
    justifyContent: 'flex-end',
    minHeight: 260,
  },
  featuredPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featuredPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(198, 242, 78, 0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(198, 242, 78, 0.4)',
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(10, 13, 17, 0.35)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  featuredTitle: {
    marginBottom: spacing.sm,
    maxWidth: '75%',
  },
  featuredSummary: {
    marginBottom: spacing.lg,
    maxWidth: '82%',
  },
  featuredMetrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  featuredMetric: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(10, 13, 17, 0.28)',
    minWidth: 92,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  metricCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.line,
  },
  metricValue: {
    ...type.metricSm,
    color: colors.text,
  },
  moduleStack: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  moduleCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    minHeight: 94,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  moduleCardLime: {
    backgroundColor: colors.primaryContainer,
    borderColor: 'rgba(198, 242, 78, 0.2)',
  },
  moduleCardSoft: {
    backgroundColor: '#1E242C',
  },
  moduleValue: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  pressed: {
    opacity: 0.88,
  },
});
