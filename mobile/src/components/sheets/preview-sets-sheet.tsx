import { StyleSheet, View } from 'react-native';
import { Sheet } from '../ui/sheet';
import { AppText } from '../ui/text';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { colors, radius, spacing } from '@/theme';
import type { Routine } from '@/types';

type Props = {
  visible: boolean;
  routine: Routine | null;
  onClose: () => void;
  onStartWorkout: (routine: Routine) => void;
};

const TELEMETRY: Array<{ label: string; key: 'targetSets' | 'asymmetryRatio' | 'restInterval'; color: string }> = [
  { label: 'TARGET SETS', key: 'targetSets', color: colors.text },
  { label: 'ASYMMETRY', key: 'asymmetryRatio', color: colors.secondary },
  { label: 'REST TEMPO', key: 'restInterval', color: colors.primary },
];

export function PreviewSetsSheet({ visible, routine, onClose, onStartWorkout }: Props) {
  if (!routine) return null;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={routine.title}
      subtitle="EXERCISE PROTOCOL"
      scroll
      footer={
        <Button
          label="Lock In & Launch"
          icon="flash"
          variant="primary"
          onPress={() => {
            onClose();
            onStartWorkout(routine);
          }}
        />
      }
    >
      <View style={styles.headerIcon}>
        <Icon name="fitness-center" size={22} color={colors.primary} />
      </View>

      <View style={styles.telemetry}>
        {TELEMETRY.map((item) => (
          <View key={item.key} style={styles.telemetryCell}>
            <AppText variant="caption" tone="secondary" style={styles.telemetryLabel}>
              {item.label}
            </AppText>
            <AppText variant="heading" style={{ color: item.color }}>
              {routine[item.key]}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.setList}>
        {routine.sets.map((set, index) => (
          <View key={`${set.movement}-${index}`} style={styles.setRow}>
            <View style={styles.setInfo}>
              <AppText variant="caption" style={styles.movement}>
                {set.movement}
              </AppText>
              <AppText variant="caption" tone="secondary" style={styles.reps}>
                Target: {set.repsTarget} reps/side
              </AppText>
            </View>
            <View style={styles.detailChip}>
              <AppText variant="caption" style={styles.detailText}>
                {set.detail}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  telemetry: {
    flexDirection: 'row',
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  telemetryCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  telemetryLabel: {
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  setList: {
    gap: spacing.sm,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  setInfo: {
    flex: 1,
    gap: 2,
  },
  movement: {
    color: colors.text,
    fontWeight: '700',
  },
  reps: {
    color: colors.textMuted,
  },
  detailChip: {
    backgroundColor: colors.chip,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  detailText: {
    color: colors.secondary,
    fontWeight: '700',
    textAlign: 'right',
  },
});
