import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { Chip } from '@/components/ui/pill';
import { colors, radius, spacing } from '@/theme';
import { FEATURED_ROUTINE, ROUTINE_LIBRARY } from '@/data/mockData';
import { useWorkoutStore } from '@/store/workout-store';
import { PreviewSetsSheet } from '@/components/sheets/preview-sets-sheet';
import {
  CalibrationCard,
  FeaturedRoutineCard,
  RoutineCard,
  WeightDialInSheet,
} from '@/components/screens/routine-sections';
import type { Routine } from '@/types';

const CATEGORIES = [
  'ALL',
  'SINGLE DUMBBELL ONLY',
  'JUMP ROPE HIIT',
  'BODYWEIGHT CALISTHENICS',
  'HYBRID COMBOS',
];

/**
 * Move tab — workout catalog / start session (Kinn Phase 1).
 * Weight selection persists via the workout store; starting a routine
 * launches the live tracker.
 */
export default function MoveScreen() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [dialInOpen, setDialInOpen] = useState(false);
  const [previewRoutine, setPreviewRoutine] = useState<Routine | null>(null);

  const filteredRoutines = ROUTINE_LIBRARY.filter((r) => {
    if (activeFilter === 'ALL') return true;
    return r.category.toUpperCase() === activeFilter;
  });

  const startRoutine = (routine: Routine) => {
    const { activeWeightKg, startWorkout } = useWorkoutStore.getState();
    startWorkout(routine, activeWeightKg);
    router.push('/tracker');
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <CalibrationCard onAdjust={() => setDialInOpen(true)} />

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat === 'ALL' ? 'All' : cat}
              selected={activeFilter === cat}
              onPress={() => setActiveFilter(cat)}
            />
          ))}
        </ScrollView>

        {(activeFilter === 'ALL' || activeFilter === 'SINGLE DUMBBELL ONLY') && (
          <FeaturedRoutineCard
            routine={FEATURED_ROUTINE}
            weightKg={useWorkoutStore.getState().activeWeightKg}
            onStart={() => startRoutine(FEATURED_ROUTINE)}
            onPreview={() => setPreviewRoutine(FEATURED_ROUTINE)}
          />
        )}

        <View style={styles.libraryHead}>
          <View style={styles.libraryTitles}>
            <AppText variant="overline" tone="muted">
              Structured Programs
            </AppText>
            <AppText variant="heading">Precision Routine Library</AppText>
          </View>
          <View style={styles.countBadge}>
            <AppText variant="caption" tone="secondary">
              {filteredRoutines.length} Available
            </AppText>
          </View>
        </View>

        <View style={styles.routineList}>
          {filteredRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onStart={() => startRoutine(routine)}
              onPreview={() => setPreviewRoutine(routine)}
            />
          ))}
        </View>
      </ScrollView>

      <WeightDialInSheet visible={dialInOpen} onClose={() => setDialInOpen(false)} />
      <PreviewSetsSheet
        visible={previewRoutine !== null}
        routine={previewRoutine}
        onClose={() => setPreviewRoutine(null)}
        onStartWorkout={startRoutine}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: spacing.xl,
    paddingBottom: 110,
  },
  chipRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  libraryHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  libraryTitles: {
    gap: 2,
  },
  countBadge: {
    backgroundColor: colors.cardRaised,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  routineList: {
    gap: spacing.md,
  },
});

