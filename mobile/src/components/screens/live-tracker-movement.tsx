import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '../ui/text';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { colors, radius, spacing, type } from '../../theme';
import type { ExerciseSet } from '../../types';

interface MovementCardProps {
  exercise: ExerciseSet;
  movementIndex: number;
  totalMovements: number;
  setNumber: number;
  totalSets: number;
  weightKg: number;
  repsDone: number;
  restSeconds: number;
  disabled?: boolean;
  onWeightChange: (kg: number) => void;
  onRepsChange: (reps: number) => void;
  onCompleteSet: () => void;
}

function Stepper({
  label,
  accent,
  children,
  onDecrement,
  incrementLabel,
  onIncrement,
  disabled,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
  onDecrement: () => void;
  incrementLabel: string;
  onIncrement: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.stepper}>
      <AppText variant="caption" tone="secondary" style={styles.stepperLabel}>
        {label}
      </AppText>
      <View style={styles.stepperRow}>
        <Pressable
          onPress={onDecrement}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}>
          <Ionicons name="remove" size={18} color={colors.text} />
        </Pressable>
        <View style={styles.stepValue}>{children}</View>
        <Pressable
          onPress={onIncrement}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={incrementLabel}
          style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}>
          <Ionicons name="add" size={18} color={accent === colors.primary ? colors.text : accent} />
        </Pressable>
      </View>
    </View>
  );
}

/** Active movement logging card — steppers + "Complete Set" action. */
export function MovementCard({
  exercise,
  movementIndex,
  totalMovements,
  setNumber,
  totalSets,
  weightKg,
  repsDone,
  restSeconds,
  disabled,
  onWeightChange,
  onRepsChange,
  onCompleteSet,
}: MovementCardProps) {
  const targetReps = exercise.repsTarget || 10;

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.movementBadge}>
          <AppText variant="overline" tone="secondary-accent">
            Movement {movementIndex + 1} of {totalMovements}
          </AppText>
        </View>
        <AppText variant="label" tone="primary">
          Set {setNumber} of {totalSets}
        </AppText>
      </View>

      <AppText variant="title">{exercise.movement}</AppText>
      <AppText variant="caption" tone="secondary">
        {exercise.detail}
      </AppText>

      <View style={styles.divider} />

      <View style={styles.stepperGrid}>
        <Stepper
          label="Load (Dumbbell)"
          accent={colors.text}
          onDecrement={() => onWeightChange(Math.max(0, weightKg - 2))}
          incrementLabel="Increase load by 2 kg"
          onIncrement={() => onWeightChange(weightKg + 2)}
          disabled={disabled}>
          <View style={styles.valueRow}>
            <AppText variant="metricSm">{weightKg}</AppText>
            <AppText variant="caption" tone="secondary" style={styles.unit}>
              KG
            </AppText>
          </View>
        </Stepper>

        <Stepper
          label="Reps / Side"
          accent={colors.primary}
          onDecrement={() => onRepsChange(Math.max(1, repsDone - 1))}
          incrementLabel="Increase reps by 1"
          onIncrement={() => onRepsChange(repsDone + 1)}
          disabled={disabled}>
          <View style={styles.valueRow}>
            <AppText variant="metricSm" tone="primary">
              {repsDone}
            </AppText>
            <AppText variant="caption" tone="secondary" style={styles.unit}>
              / {targetReps}
            </AppText>
          </View>
        </Stepper>
      </View>

      <Button
        label={`Complete Set & Start Rest (${restSeconds}s)`}
        variant="primary"
        icon="checkmark-circle"
        onPress={onCompleteSet}
        disabled={disabled}
        full
        style={styles.complete}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  movementBadge: {
    backgroundColor: colors.cardRaised,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
    marginTop: spacing.xs,
  },
  stepperGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  stepperLabel: {
    ...type.caption,
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.cardRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  stepValue: {
    minWidth: 56,
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  unit: {
    marginBottom: 3,
  },
  complete: {
    marginTop: spacing.xs,
  },
});
