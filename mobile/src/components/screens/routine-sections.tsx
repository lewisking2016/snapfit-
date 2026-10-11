import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Sheet } from '@/components/ui/sheet';
import { Tag } from '@/components/ui/pill';
import { colors, radius, spacing } from '@/theme';
import { useWorkoutStore } from '@/store/workout-store';
import { resolveExerciseArt } from '@/utils/exercise-art';
import type { Routine } from '@/types';

/**
 * Presentational sections for the Routines tab — ported from the web
 * prototype's RoutinesScreen (src/components/screens/RoutinesScreen.tsx).
 * Weight selection is wired to the persisted workout store.
 */

/** Auto-scaling volume copy per calibration profile (web: calibrationProfiles). */
function calibrationProfile(weightKg: number): string {
  if (weightKg === 15) return '12-15 Reps / side (Hypertrophy Pace)';
  if (weightKg === 20) return '8-10 Reps / side (Power & Density)';
  if (weightKg === 24) return '5-6 Reps / side (Max Force Control)';
  return `${weightKg} KG: Auto-scaled to 9-11 Reps / side`;
}

const WEIGHT_SEGMENTS: { kg: number; label: string; sub: string }[] = [
  { kg: 15, label: '15 KG', sub: 'High Rep' },
  { kg: 20, label: '20 KG', sub: 'Balanced' },
  { kg: 24, label: '24 KG', sub: 'Heavy Str' },
];

/** Auto-calculated rep range shown in the dial-in sheet (web formula). */
function autoReps(weightKg: number): string {
  const lo = Math.max(6, Math.round(240 / weightKg));
  const hi = Math.max(8, Math.round(300 / weightKg));
  return `${lo}-${hi} reps/side`;
}

/** Calibration / telemetry quick bar with the weight segment controller. */
export function CalibrationCard({ onAdjust }: { onAdjust: () => void }) {
  const weightKg = useWorkoutStore((s) => s.activeWeightKg);
  const setWeight = useWorkoutStore((s) => s.setWeight);
  const isPreset = WEIGHT_SEGMENTS.some((s) => s.kg === weightKg);

  return (
    <Card style={styles.calibration}>
      <View style={styles.calibrationHead}>
        <View style={styles.calibrationIcon}>
          <Icon name="tune" size={20} color={colors.primary} />
        </View>
        <View style={styles.calibrationTitles}>
          <AppText variant="overline" tone="muted">
            Auto-Calibration Matrix
          </AppText>
          <AppText variant="heading" numberOfLines={1}>
            Custom Load Setup
          </AppText>
        </View>
        <View style={styles.syncBadge}>
          <AppText variant="caption" tone="primary">
            Active Sync
          </AppText>
        </View>
      </View>

      <AppText variant="caption" tone="secondary">
        Calibrate sets &amp; interval targets to your physical dumbbell weight.
      </AppText>

      <View style={styles.segmentTrack}>
        {WEIGHT_SEGMENTS.map((segment) => {
          const active = weightKg === segment.kg;
          return (
            <Pressable
              key={segment.kg}
              onPress={() => setWeight(segment.kg)}
              accessibilityRole="button"
              accessibilityLabel={`Set weight ${segment.label}`}
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                styles.segment,
                active && styles.segmentActive,
                pressed && styles.pressed,
              ]}>
              <AppText variant="label" tone={active ? 'primary' : 'secondary'}>
                {segment.label}
              </AppText>
              <AppText variant="caption" tone={active ? 'primary' : 'muted'}>
                {segment.sub}
              </AppText>
            </Pressable>
          );
        })}
        <Pressable
          onPress={onAdjust}
          accessibilityRole="button"
          accessibilityLabel="Adjust custom weight"
          accessibilityState={{ selected: !isPreset }}
          style={({ pressed }) => [
            styles.segment,
            !isPreset && styles.segmentActive,
            pressed && styles.pressed,
          ]}>
          <AppText variant="label" tone={!isPreset ? 'primary' : 'secondary'}>
            {isPreset ? 'ADJUST' : `${weightKg} KG`}
          </AppText>
          <AppText variant="caption" tone={!isPreset ? 'primary' : 'muted'}>
            Dial-in
          </AppText>
        </Pressable>
      </View>

      <View style={styles.calibrationFoot}>
        <View style={styles.calibrationFootLeft}>
          <View style={styles.footDot} />
          <AppText variant="caption" tone="muted">
            Auto-scaling volume:{' '}
          </AppText>
          <AppText variant="caption" tone="default" style={styles.footProfile}>
            {calibrationProfile(weightKg)}
          </AppText>
        </View>
        <Icon name="bolt" size={16} color={colors.primary} />
      </View>
    </Card>
  );
}

/** Equipment badge overlay for routine thumbnails (web color roles). */
function equipmentBadgeStyle(equipmentBadge: string): { bg: string; fg: string } {
  if (equipmentBadge === 'HIIT') return { bg: colors.secondary, fg: '#003640' };
  if (equipmentBadge === 'BODY') return { bg: colors.chip, fg: colors.text };
  return { bg: colors.primary, fg: colors.textInverse };
}

/** Featured program card with image backdrop, telemetry breakdown and actions. */
export function FeaturedRoutineCard({
  routine,
  weightKg,
  onStart,
  onPreview,
}: {
  routine: Routine;
  weightKg: number;
  onStart: () => void;
  onPreview: () => void;
}) {
  return (
    <Card style={styles.featured} padded={false}>
      <View style={styles.featuredMedia}>
        <Image
          source={resolveExerciseArt(routine.title, routine.category)}
          style={styles.featuredImage}
          accessibilityLabel={routine.altText}
        />
        <View style={styles.featuredScrim} />
        <View style={styles.featuredBadgeLeft}>
          <View style={styles.featuredDot} />
          <AppText variant="caption" tone="primary">
            Featured Program
          </AppText>
        </View>
        <View style={styles.featuredBadgeRight}>
          <AppText variant="caption" tone="default">
            1x DB • {weightKg} KG
          </AppText>
        </View>
      </View>

      <View style={styles.featuredBody}>
        <View style={styles.featuredMetaRow}>
          <View style={styles.featuredMetaLeft}>
            <Icon name="timer" size={16} color={colors.secondary} />
            <AppText variant="caption" tone="secondary-accent">
              {routine.duration} MIN
            </AppText>
            <AppText variant="caption" tone="muted">
              •
            </AppText>
            <AppText variant="caption" tone="secondary-accent">
              {routine.intensity}
            </AppText>
          </View>
          <View style={styles.featuredMetaRight}>
            <Icon name="local-fire-department" size={16} color={colors.primary} />
            <AppText variant="caption" tone="default">
              {routine.calories} KCAL
            </AppText>
          </View>
        </View>

        <AppText variant="title">{routine.title}</AppText>

        <View style={styles.tagRow}>
          {routine.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>

        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryCell}>
            <AppText variant="caption" tone="muted">
              Target Sets
            </AppText>
            <AppText variant="bodyMedium">{routine.targetSets}</AppText>
          </View>
          <View style={styles.telemetryCell}>
            <AppText variant="caption" tone="muted">
              Asymmetry Guard
            </AppText>
            <AppText variant="bodyMedium" tone="secondary-accent">
              {routine.asymmetryRatio}
            </AppText>
          </View>
          <View style={styles.telemetryCell}>
            <AppText variant="caption" tone="muted">
              Rest Interval
            </AppText>
            <AppText variant="bodyMedium" tone="primary">
              {routine.restInterval}
            </AppText>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Button label="Start Workout" icon="play" onPress={onStart} style={styles.actionPrimary} />
          <Button
            label="Preview Sets"
            icon="list"
            variant="secondary"
            onPress={onPreview}
            style={styles.actionSecondary}
          />
        </View>
      </View>
    </Card>
  );
}

/** Library routine card — thumbnail, sub-highlight bar and start/preview actions. */
export function RoutineCard({
  routine,
  onStart,
  onPreview,
}: {
  routine: Routine;
  onStart: () => void;
  onPreview: () => void;
}) {
  const badge = equipmentBadgeStyle(routine.equipmentBadge);
  const pillTone = routine.subHighlight.pillColor === 'secondary' ? colors.secondary : colors.primary;

  return (
    <Card style={styles.routineCard}>
      <View style={styles.routineHead}>
        <View style={styles.routineThumb}>
          <Image
            source={resolveExerciseArt(routine.title, routine.category)}
            style={styles.routineThumbImage}
            accessibilityLabel={routine.altText}
          />
          <View style={[styles.routineBadge, { backgroundColor: badge.bg }]}>
            <AppText variant="caption" style={{ color: badge.fg }}>
              {routine.equipmentBadge}
            </AppText>
          </View>
        </View>

        <View style={styles.routineHeadText}>
          <AppText variant="caption" tone="secondary-accent">
            {routine.duration} MIN • {routine.intensity}
          </AppText>
          <AppText variant="heading" numberOfLines={1}>
            {routine.title}
          </AppText>
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {routine.summary}
          </AppText>
        </View>
      </View>

      <View style={styles.subBar}>
        <Icon name={routine.subHighlight.icon} size={15} color={colors.primary} />
        <AppText variant="caption" tone="secondary" style={styles.subBarText} numberOfLines={1}>
          {routine.subHighlight.text}
        </AppText>
        <AppText variant="caption" style={[styles.subBarPill, { color: pillTone }]}>
          {routine.subHighlight.pillText}
        </AppText>
      </View>

      <View style={styles.actionRow}>
        <Button label="Start Workout" icon="play" onPress={onStart} style={styles.actionPrimary} />
        <Button
          label="Preview Sets"
          icon="list"
          variant="secondary"
          onPress={onPreview}
          style={styles.actionSecondary}
        />
      </View>
    </Card>
  );
}

/** Dial-in physical load sheet — stepper replaces the web range slider. */
export function WeightDialInSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const weightKg = useWorkoutStore((s) => s.activeWeightKg);
  const setWeight = useWorkoutStore((s) => s.setWeight);
  const [draftValue, setDraftValue] = React.useState<number | null>(null);
  const draft = draftValue ?? weightKg;
  const closeSheet = () => {
    setDraftValue(null);
    onClose();
  };

  const clamp = (v: number) => Math.min(36, Math.max(8, v));

  return (
    <Sheet
      visible={visible}
      onClose={closeSheet}
      footer={
        <Button
          label="Save Custom Calibration"
          icon="checkmark"
          full
          onPress={() => {
            setWeight(draft);
            closeSheet();
          }}
        />
      }>
      <View style={styles.dialHeader}>
        <Icon name="tune" size={20} color={colors.primary} />
        <AppText variant="heading">Dial-in Physical Load</AppText>
      </View>

      <View style={styles.dialPanel}>
        <AppText variant="caption" tone="muted">
          Target Dumbbell
        </AppText>
        <View style={styles.dialValueRow}>
          <AppText variant="metric" tone="primary">
            {draft}
          </AppText>
          <AppText variant="bodyMedium" tone="secondary">
            KG
          </AppText>
        </View>
        <AppText variant="caption" tone="secondary-accent">
          Auto-calculated reps: {autoReps(draft)}
        </AppText>

        <View style={styles.stepper}>
          <Pressable
            onPress={() => setDraftValue((value) => clamp((value ?? weightKg) - 1))}
            disabled={draft <= 8}
            accessibilityRole="button"
            accessibilityLabel="Decrease weight"
            style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressed, draft <= 8 && styles.disabled]}>
            <Icon name="remove" size={20} color={colors.text} />
          </Pressable>
          <AppText variant="metricSm" style={styles.stepperValue}>
            {draft} KG
          </AppText>
          <Pressable
            onPress={() => setDraftValue((value) => clamp((value ?? weightKg) + 1))}
            disabled={draft >= 36}
            accessibilityRole="button"
            accessibilityLabel="Increase weight"
            style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressed, draft >= 36 && styles.disabled]}>
            <Icon name="add" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.dialScale}>
        <AppText variant="caption" tone="muted">
          8 KG (Light)
        </AppText>
        <AppText variant="caption" tone="muted">
          20 KG
        </AppText>
        <AppText variant="caption" tone="muted">
          36 KG (Heavy)
        </AppText>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  calibration: {
    gap: spacing.md,
  },
  calibrationHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  calibrationIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  calibrationTitles: {
    flex: 1,
    gap: 2,
  },
  syncBadge: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  segmentTrack: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  calibrationFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  calibrationFootLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  footDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  footProfile: {
    flex: 1,
  },
  featured: {
    overflow: 'hidden',
  },
  featuredMedia: {
    height: 192,
    backgroundColor: colors.chip,
  },
  featuredImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  featuredScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(29,32,35,0.35)',
  },
  featuredBadgeLeft: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(17,20,23,0.85)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  featuredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  featuredBadgeRight: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(11,14,17,0.85)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  featuredBody: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  featuredMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.sm,
  },
  telemetryCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionPrimary: {
    flex: 1,
  },
  actionSecondary: {
    paddingHorizontal: spacing.lg,
  },
  routineCard: {
    gap: spacing.md,
  },
  routineHead: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  routineThumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  routineThumbImage: {
    width: '100%',
    height: '100%',
  },
  routineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  routineHeadText: {
    flex: 1,
    gap: 2,
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  subBarText: {
    flex: 1,
  },
  subBarPill: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lineSoft,
  },
  dialPanel: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.lg,
  },
  dialValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  stepperValue: {
    minWidth: 88,
    textAlign: 'center',
  },
  dialScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
