import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';

/** A tappable settings/detail row with leading icon and chevron. */
export function ListRow({
  icon,
  iconColor = colors.primary,
  title,
  subtitle,
  value,
  onPress,
  right,
  style,
}: {
  icon?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  /** Right-aligned summary text (e.g. "84%", "Connected"). */
  value?: string;
  valueColor?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const content = (
    <View style={[styles.row, style]}>
      {icon ? (
        <View style={[styles.iconWrap, { backgroundColor: colors.cardRaised }]}>
          <Icon name={icon} size={18} color={iconColor} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyMedium" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="label" tone="secondary">
          {value}
        </AppText>
      ) : null}
      {right}
      {onPress && !right ? <Icon name="chevron-right" size={20} color={colors.textTertiary} /> : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
      {content}
    </Pressable>
  );
}

/** Groups ListRows inside a single card with hairline separators. */
export function ListGroup({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.group, style]}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <View key={i}>
              {i > 0 ? <View style={styles.separator} /> : null}
              {child}
            </View>
          ))
        : children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
    marginLeft: spacing.lg + 34 + spacing.md,
  },
});
