import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText } from '@/components/ui/text';
import { colors, motion, palette, spacing } from '@/theme';

type Props = {
  /** Called when splash sequence finishes (or immediately if reduce-motion). */
  onFinished?: () => void;
  /** If app is ready early, parent can set this to fade after lens (~1.55s). */
  readyEarly?: boolean;
};

/**
 * Brand splash from kinn-splash-and-loader.html.
 * Rings → lime lens → letter draw → "Move together."
 */
export function KinnSplash({ onFinished, readyEarly }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const opacity = useSharedValue(1);
  const ringL = useSharedValue(reduceMotion ? 0 : -34);
  const ringR = useSharedValue(reduceMotion ? 0 : 34);
  const ringOp = useSharedValue(reduceMotion ? 1 : 0);
  const lens = useSharedValue(reduceMotion ? 1 : 0);
  const letters = useSharedValue(reduceMotion ? 1 : 0);
  const tag = useSharedValue(reduceMotion ? 1 : 0);
  const glow = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      setReduceMotion(reduce);
      if (reduce) {
        onFinished?.();
        return;
      }

      const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
      const bounce = Easing.bezier(0.3, 1.6, 0.5, 1);

      ringOp.value = withDelay(200, withTiming(1, { duration: 900, easing: ease }));
      ringL.value = withDelay(200, withTiming(0, { duration: 900, easing: ease }));
      ringR.value = withDelay(200, withTiming(0, { duration: 900, easing: ease }));
      lens.value = withDelay(950, withTiming(1, { duration: 600, easing: bounce }));
      glow.value = withDelay(1000, withTiming(1, { duration: 1200 }));
      letters.value = withDelay(1200, withTiming(1, { duration: 950, easing: Easing.out(Easing.ease) }));
      tag.value = withDelay(2100, withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }));

      const endAt = readyEarly ? 1600 : motion.splashTotal;
      opacity.value = withDelay(
        endAt,
        withTiming(0, { duration: 320 }, (finished) => {
          if (finished && onFinished) runOnJS(onFinished)();
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [glow, lens, letters, onFinished, opacity, readyEarly, ringL, ringOp, ringR, tag]);

  const rootStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value * 0.16 }));
  const ringLStyle = useAnimatedStyle(() => ({
    opacity: ringOp.value,
    transform: [{ translateX: ringL.value }],
  }));
  const ringRStyle = useAnimatedStyle(() => ({
    opacity: ringOp.value,
    transform: [{ translateX: ringR.value }],
  }));
  const lensStyle = useAnimatedStyle(() => ({
    opacity: lens.value,
    transform: [{ scale: lens.value }],
  }));
  const lettersStyle = useAnimatedStyle(() => ({ opacity: letters.value }));
  const tagStyle = useAnimatedStyle(() => ({
    opacity: tag.value,
    transform: [{ translateY: (1 - tag.value) * 8 }],
  }));

  return (
    <Animated.View
      style={[styles.root, rootStyle]}
      accessibilityLabel="Kinn"
      accessibilityRole="image">
      <Animated.View style={[styles.glow, glowStyle]} />
      <View style={styles.markWrap}>
        <View style={styles.ringsRow}>
          <Animated.View style={lensStyle}>
            <Svg width={72} height={72} viewBox="0 0 100 100">
              <Path
                d="M50 26.94A26 26 0 0 0 50 73.06A26 26 0 0 0 50 26.94Z"
                fill={colors.primary}
              />
            </Svg>
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, ringLStyle, { alignItems: 'center', justifyContent: 'center' }]}>
            <Svg width={72} height={72} viewBox="0 0 100 100">
              <Circle cx="38" cy="50" r="26" fill="none" stroke={palette.paper} strokeWidth="7" />
            </Svg>
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, ringRStyle, { alignItems: 'center', justifyContent: 'center' }]}>
            <Svg width={72} height={72} viewBox="0 0 100 100">
              <Circle cx="62" cy="50" r="26" fill="none" stroke={palette.paper} strokeWidth="7" />
            </Svg>
          </Animated.View>
        </View>
        <Animated.View style={lettersStyle}>
          <Image
            source={require('../../../assets/images/kinn-wordmark-dark.png')}
            style={styles.wordmark}
            contentFit="contain"
            accessibilityLabel="Kinn"
          />
        </Animated.View>
        <Animated.View style={tagStyle}>
          <AppText style={styles.tagline}>Move together.</AppText>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primary,
    top: '28%',
  },
  markWrap: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  ringsRow: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    width: 128,
    height: 56,
  },
  tagline: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: colors.primary,
    letterSpacing: -0.17,
  },
});
