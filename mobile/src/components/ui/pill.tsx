import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { badgeColors, colors, radius, spacing } from '@/theme';

export type BadgeTone = keyof typeof badgeColors;

/** Static status badge (routine badges, tags, firmware flags). */
export function Pill({
  label,
  tone = 'gray',
  style,
}: {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}) {
  const c = badgeColors[tone];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }, style]}>
      <AppText variant="overline" style={{ color: c.fg }}>
        {label}
      </AppText>
    </View>
  );
}

/** Selectable filter chip. */
export function Chip({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
        style,
      ]}>
      <AppText variant="label" tone={selected ? 'inverse' : 'secondary'}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** Small inline telemetry tag used inside cards. */
export function Tag({ label, color = colors.textSecondary }: { label: string; color?: string }) {
  return (
    <View style={[styles.tag, { borderColor: colors.line }]}>
      <AppText variant="caption" style={{ color }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.chip,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipPressed: {
    opacity: 0.75,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
});
