import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../ui/text';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { colors, spacing, radius, type } from '../../theme';

interface RestCardProps {
  routineTitle: string;
  nextSet: number;
  totalSets: number;
  secondsLeft: number;
  onSkip: () => void;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/** In-flow rest interval card (rests never overlay the tracker on mobile). */
export function RestCard({ routineTitle, nextSet, totalSets, secondsLeft, onSkip }: RestCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.badge}>
        <AppText variant="overline" tone="primary">
          Rest Interval In Progress
        </AppText>
      </View>

      <AppText variant="title" center style={styles.timer}>
        {formatTimer(secondsLeft)}
      </AppText>

      <AppText variant="body" tone="secondary" center>
        Tempo recovery • Next: Set {nextSet} of {totalSets}
      </AppText>
      <AppText variant="caption" tone="muted" center style={styles.routine}>
        {routineTitle}
      </AppText>

      <Button
        label="Skip Rest Period"
        variant="secondary"
        icon="play-skip-forward"
        onPress={onSkip}
        full
        style={styles.skip}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.cardRaised,
    padding: spacing.lg,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  timer: {
    ...type.metric,
    marginTop: spacing.xs,
    fontVariant: ['tabular-nums'],
  },
  routine: {
    marginBottom: spacing.sm,
  },
  skip: {
    marginTop: spacing.xs,
  },
});
