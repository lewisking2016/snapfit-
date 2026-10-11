import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';

export function Card({
  children,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  return <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
}

export function SectionHeader({
  title,
  action,
  onAction,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <AppText variant="overline" tone="muted">
        {title}
      </AppText>
      {action ? (
        <AppText variant="label" tone="primary" onPress={onAction} accessibilityRole="button">
          {action}
        </AppText>
      ) : null}
    </View>
  );
}

/** A labelled telemetry figure — big number with a unit and caption. */
export function Stat({
  value,
  unit,
  label,
  tone = 'default',
  style,
}: {
  value: string | number;
  unit?: string;
  label: string;
  tone?: 'default' | 'primary' | 'secondary-accent';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.stat, style]}>
      <View style={styles.statRow}>
        <AppText variant="metricSm" tone={tone}>
          {String(value)}
        </AppText>
        {unit ? (
          <AppText variant="label" tone="secondary" style={styles.statUnit}>
            {unit}
          </AppText>
        ) : null}
      </View>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  padded: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  statUnit: {
    marginBottom: 3,
  },
});
