import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';

/**
 * Header for pushed routes (tracker, devices, …) — back chevron + title and
 * optional trailing action. Tab screens use their own `ScreenHeading`.
 */
export function RouteHeader({
  title,
  subtitle,
  onClose,
  trailing,
  closeIcon = 'close',
}: {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  trailing?: React.ReactNode;
  closeIcon?: string;
}) {
  const handleBack = () => {
    if (onClose) onClose();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.root}>
      <Pressable
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={12}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
        <Icon name={closeIcon} size={22} color={colors.text} />
      </Pressable>

      <View style={styles.titles}>
        <AppText variant="heading" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={styles.trailing}>{trailing ?? <View style={styles.iconBtn} />}</View>
    </View>
  );
}

/** Large title block used at the top of each tab screen. */
export function ScreenHeading({
  overline,
  title,
  trailing,
}: {
  overline?: string;
  title: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View style={styles.heading}>
      <View style={{ flex: 1, gap: 2 }}>
        {overline ? (
          <AppText variant="overline" tone="primary">
            {overline}
          </AppText>
        ) : null}
        <AppText variant="display">{title}</AppText>
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  titles: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
  },
  trailing: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
});
