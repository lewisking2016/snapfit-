import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useWorkoutStore } from '@/store/workout-store';
import { colors, spacing } from '@/theme';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/toggle';
import { AppText } from '@/components/ui/text';
import { PrGrid, SessionLogRow, TonnageCard } from '@/components/screens/progress-sections';

type FilterValue = 'all' | 'week' | 'prs';

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All logs' },
  { value: 'week', label: 'This week' },
  { value: 'prs', label: 'PRs only' },
];

/** Dates attached to the four tracked PRs (matches the PR grid exactly). */
const PR_DATES = ['Oct 22, 2025', 'Oct 19, 2025', 'Oct 24, 2025', 'Oct 17, 2025'];

function parseLogDate(date: string): number | null {
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? null : parsed;
}

export default function ProgressScreen() {
  const router = useRouter();
  const logs = useWorkoutStore((s) => s.logs);
  const [filter, setFilter] = useState<FilterValue>('all');

  const filteredLogs = useMemo(() => {
    if (filter === 'prs') {
      return logs.filter((log) => PR_DATES.includes(log.date));
    }
    if (filter === 'week') {
      const reference = logs.reduce<number | null>((latest, log) => {
        const stamp = parseLogDate(log.date);
        if (stamp === null) return latest;
        return latest === null ? stamp : Math.max(latest, stamp);
      }, null);
      if (reference === null) return logs;
      const weekAgo = reference - 7 * 24 * 60 * 60 * 1000;
      return logs.filter((log) => {
        const stamp = parseLogDate(log.date);
        return stamp === null ? false : stamp >= weekAgo;
      });
    }
    return logs;
  }, [filter, logs]);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.xl, paddingBottom: 110 }}
      >
        <View style={styles.banner}>
          <View style={styles.bannerRow}>
            <AppText variant="overline" tone="muted">
              SCREEN 04 • ANALYTICS
            </AppText>
            <View style={styles.deltaTag}>
              <Icon name="arrow-upward" size={12} color={colors.accent} />
              <AppText variant="caption" tone="primary" style={styles.deltaText}>
                Cycle Delta +12%
              </AppText>
            </View>
          </View>
          <AppText variant="title">Progress &amp; Logs</AppText>
          <AppText variant="body" tone="secondary">
            Tonnage, PR Benchmarks &amp; Biometric Volume Aggregation
          </AppText>
        </View>

        <TonnageCard />

        <PrGrid />

        <View style={styles.historyBlock}>
          <View style={styles.historyHeader}>
            <View style={styles.historyTitle}>
              <Icon name="history" size={16} color={colors.textSecondary} />
              <AppText variant="heading">Session History</AppText>
            </View>
            <View style={styles.countTag}>
              <AppText variant="caption" tone="secondary">
                {logs.length} Logged
              </AppText>
            </View>
          </View>

          <SegmentedControl
            options={FILTER_OPTIONS}
            value={filter}
            onChange={(next) => setFilter(next as FilterValue)}
          />

          {filteredLogs.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="hourglass-empty" size={22} color={colors.textTertiary} />
              <AppText variant="bodyMedium" tone="secondary" center>
                No sessions match this filter yet.
              </AppText>
              <AppText variant="caption" tone="muted" center>
                Finish a workout to populate your biometric history.
              </AppText>
            </View>
          ) : (
            <View style={styles.logList}>
              {filteredLogs.map((log) => (
                <SessionLogRow key={log.id} log={log} />
              ))}
            </View>
          )}
        </View>

        <Button
          label="Launch New Routine"
          icon="play"
          onPress={() => router.push('/tracker')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  bannerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deltaTag: {
    alignItems: 'center',
    backgroundColor: colors.cardRaised,
    borderRadius: 999,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  deltaText: {
    letterSpacing: 0.4,
  },
  historyBlock: {
    gap: spacing.md,
  },
  historyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  countTag: {
    backgroundColor: colors.cardRaised,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  logList: {
    gap: spacing.md,
  },
  empty: {
    alignItems: 'center',
    backgroundColor: colors.cardRaised,
    borderRadius: 16,
    gap: spacing.sm,
    padding: spacing.xl,
  },
});
