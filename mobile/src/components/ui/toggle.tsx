import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';

/** iOS/Android-native switch styled to the volt accent. */
export function Switch({
  value,
  onValueChange,
  disabled,
  style,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      style={[
        styles.track,
        value && styles.trackOn,
        disabled && styles.disabled,
        style,
      ]}>
      <View style={[styles.thumb, value && styles.thumbOn]} />
    </Pressable>
  );
}

/** A labelled setting row with a trailing switch. */
export function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  disabled,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyMedium">{label}</AppText>
        {description ? (
          <AppText variant="caption" tone="muted">
            {description}
          </AppText>
        ) : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
    </View>
  );
}

/**
 * Segmented control — the mobile equivalent of the prototype's pill filter
 * groups. Renders as a single track with an active segment.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.segment, style]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.segmentItem, active && styles.segmentItemActive]}>
            <AppText variant="label" tone={active ? 'inverse' : 'secondary'}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.cardRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.4,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.textSecondary,
  },
  thumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.textInverse,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: colors.primary,
  },
});
