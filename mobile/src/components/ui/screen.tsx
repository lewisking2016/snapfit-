import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

/**
 * Standard screen canvas: graphite background, safe-area aware, with
 * consistent horizontal gutters. Use `scroll` from the caller for content
 * that exceeds the viewport (tab screens supply their own ScrollView so the
 * tab bar insets stay under their control).
 */
export function Screen({
  children,
  style,
  edges = { top: true, bottom: false },
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: { top?: boolean; bottom?: boolean };
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: edges.top ? insets.top + spacing.sm : 0,
          paddingBottom: edges.bottom ? insets.bottom + spacing.lg : 0,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
  },
});
