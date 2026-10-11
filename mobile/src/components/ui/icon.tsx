import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { colors } from '@/theme';

export type IconName = ComponentProps<typeof MaterialIcons>['name'];

/**
 * Renders a Material icon. Accepts the web prototype's underscore icon names
 * (`fitness_center`) and normalises them to the kebab-case glyph names
 * (`fitness-center`) that @expo/vector-icons uses.
 */
export function Icon({
  name,
  size = 20,
  color = colors.text,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: ComponentProps<typeof MaterialIcons>['style'];
}) {
  const glyph = name.replace(/_/g, '-') as IconName;
  return <MaterialIcons name={glyph} size={size} color={color} style={style} />;
}
