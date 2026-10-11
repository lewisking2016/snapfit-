import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/theme';

/** Mini dual-ring spinner — pull-to-refresh / buttons. Spec: kinn-splash-and-loader.html */
export function KinnSpinner({ size = 64 }: { size?: number }) {
  const spin = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled || reduce) return;
      spin.value = withRepeat(
        withTiming(360, { duration: 1800, easing: Easing.bezier(0.65, 0, 0.35, 1) }),
        -1,
        false,
      );
    });
    return () => {
      cancelled = true;
    };
  }, [spin]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  return (
    <Animated.View
      style={[{ width: size, height: size }, rotateStyle]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M50 26.94A26 26 0 0 0 50 73.06A26 26 0 0 0 50 26.94Z"
          fill={colors.primary}
        />
        <Circle cx="38" cy="50" r="26" fill="none" stroke={colors.text} strokeWidth="7" />
        <Circle cx="62" cy="50" r="26" fill="none" stroke={colors.text} strokeWidth="7" />
      </Svg>
    </Animated.View>
  );
}
