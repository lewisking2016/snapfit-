import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';

/** Determinate horizontal meter used for charge, hydration, recovery, etc. */
export function ProgressBar({
  value,
  max = 100,
  color = colors.primary,
  trackColor = colors.cardRaised,
  height = 8,
  style,
}: {
  value: number;
  max?: number;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const pct = Math.max(0, Math.min(1, max === 0 ? 0 : value / max));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: Math.round(max), now: Math.round(value) }}
      style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

/** Horizontal meter with a label and value on either side. */
export function MeterRow({
  label,
  value,
  displayValue,
  max = 100,
  color = colors.primary,
}: {
  label: string;
  value: number;
  displayValue?: string;
  max?: number;
  color?: string;
}) {
  return (
    <View style={styles.meterRow}>
      <View style={styles.meterHead}>
        <AppText variant="caption" tone="secondary">
          {label}
        </AppText>
        <AppText variant="caption" tone="default">
          {displayValue ?? `${Math.round(value)}`}
        </AppText>
      </View>
      <ProgressBar value={value} max={max} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  meterRow: {
    gap: spacing.xs,
  },
  meterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
