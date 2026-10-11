import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, type } from '@/theme';

type Variant = keyof typeof type;

export interface AppTextProps extends TextProps {
  variant?: Variant;
  /** Convenience color shorthands; falls back to the app text color. */
  tone?: 'default' | 'secondary' | 'muted' | 'primary' | 'secondary-accent' | 'inverse';
  center?: boolean;
}

const toneColor: Record<NonNullable<AppTextProps['tone']>, string> = {
  default: colors.text,
  secondary: colors.textSecondary,
  muted: colors.textTertiary,
  primary: colors.primary,
  'secondary-accent': colors.secondary,
  inverse: colors.textInverse,
};

export function AppText({
  variant = 'body',
  tone = 'default',
  center,
  style,
  ...rest
}: AppTextProps) {
  const base = type[variant] as TextStyle;
  return (
    <Text
      style={[base, { color: toneColor[tone] }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
