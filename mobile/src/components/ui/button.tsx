import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/text';
import { colors, radius, shadow, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  full,
  style,
}: ButtonProps) {
  const v = variants[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      style={({ pressed }) => [
        styles.base,
        v.container,
        full && styles.full,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled && shadow.card,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.text.color} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={v.text.color} /> : null}
          <AppText variant="bodyMedium" style={[v.text, styles.label]}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const variants: Record<Variant, { container: ViewStyle; text: { color: string } }> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.textInverse },
  },
  secondary: {
    container: {
      backgroundColor: colors.cardRaised,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.line,
    },
    text: { color: colors.text },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
  },
  danger: {
    container: { backgroundColor: '#3a1416' },
    text: { color: colors.danger },
  },
};

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  full: {
    width: '100%',
  },
  label: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
