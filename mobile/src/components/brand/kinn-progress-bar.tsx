import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/text';
import { colors, palette, radius, spacing, type } from '@/theme';

type Tone = 'dark' | 'light';

const LOADING_MESSAGES = [
  'Connecting your watch',
  'Syncing workouts',
  'Finding your friends',
  'Almost ready',
] as const;

export function loadingMessageForProgress(pct: number): string {
  return LOADING_MESSAGES[Math.min(3, Math.floor(pct / 26))];
}

/** Determinate 8px progress bar — Lime on dark, Ink on light. */
export function KinnProgressBar({
  progress,
  message,
  tone = 'dark',
  showPercent = true,
}: {
  progress: number;
  message?: string;
  tone?: Tone;
  showPercent?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  const label = message ?? loadingMessageForProgress(pct);
  const isDark = tone === 'dark';
  const shine = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled || reduce) return;
      shine.value = withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.linear }),
        -1,
        false,
      );
    });
    return () => {
      cancelled = true;
    };
  }, [shine]);

  const shineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (shine.value * 2 - 1) * 200 }],
  }));

  return (
    <View>
      <View style={styles.top}>
        <AppText
          variant="bodySmall"
          style={{ color: isDark ? colors.text : palette.ink, flex: 1, marginRight: spacing.md }}>
          {label}
        </AppText>
        {showPercent ? (
          <AppText
            style={[
              type.metricSm,
              { fontSize: 28, lineHeight: 32, color: isDark ? colors.text : palette.ink },
            ]}>
            {pct}%
          </AppText>
        ) : null}
      </View>
      <View
        style={[styles.track, { backgroundColor: isDark ? palette.graphite : palette.line }]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: pct }}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              backgroundColor: isDark ? colors.primary : palette.ink,
            },
          ]}>
          <Animated.View style={[styles.shine, shineStyle]} pointerEvents="none" />
        </View>
      </View>
    </View>
  );
}

/** Indeterminate sliding bar for unknown waits. */
export function KinnIndeterminateBar({
  message = 'Finding your friends',
  tone = 'dark',
}: {
  message?: string;
  tone?: Tone;
}) {
  const slide = useSharedValue(0);
  const isDark = tone === 'dark';

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled || reduce) return;
      slide.value = withRepeat(
        withTiming(1, { duration: 1300, easing: Easing.bezier(0.65, 0, 0.35, 1) }),
        -1,
        false,
      );
    });
    return () => {
      cancelled = true;
    };
  }, [slide]);

  const indStyle = useAnimatedStyle(() => ({
    left: `${slide.value * 140 - 40}%`,
  }));

  return (
    <View>
      <AppText
        variant="bodySmall"
        style={{ color: isDark ? colors.text : palette.ink, marginBottom: spacing.md }}>
        {message}
      </AppText>
      <View
        style={[styles.track, { backgroundColor: isDark ? palette.graphite : palette.line }]}
        accessibilityRole="progressbar"
        accessibilityLabel={message}>
        <Animated.View
          style={[
            styles.ind,
            { backgroundColor: isDark ? colors.primary : palette.ink },
            indStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  track: {
    height: 8,
    borderRadius: radius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  shine: {
    ...StyleSheet.absoluteFill,
    width: '40%',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  ind: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '38%',
    borderRadius: radius.sm,
  },
});
