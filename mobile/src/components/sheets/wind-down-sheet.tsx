import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Sheet } from '../ui/sheet';
import { AppText } from '../ui/text';
import { colors, radius, spacing } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

interface WindDownStep {
  title: string;
  duration: string;
  cue: string;
}

const STEPS: WindDownStep[] = [
  {
    title: 'Cat-Cow Breathing',
    duration: '2 min',
    cue: 'Inhale arch, exhale round spine. Deep diaphragmatic breathing.',
  },
  {
    title: '90/90 Hip Flow',
    duration: '3 min',
    cue: 'Slowly transition between internal & external hip rotations.',
  },
  {
    title: 'Thread the Needle',
    duration: '2 min',
    cue: 'Decompress upper thoracic spine, 1 min per side.',
  },
  {
    title: 'Lying Spinal Twist & Savasana',
    duration: '3 min',
    cue: 'Rest eyes, parasympathetic nervous system activation.',
  },
];

export function WindDownSheet({ visible, onClose }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes
  const [isActive, setIsActive] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  // Fresh protocol run every time the sheet opens. Reset during render
  // (React's "adjust state when a prop changes" pattern) rather than in an
  // effect, to avoid a cascading re-render on open.
  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setSecondsLeft(600);
      setIsActive(true);
      setStepIndex(0);
    }
  }

  useEffect(() => {
    if (!visible || !isActive || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, isActive, secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const step = STEPS[stepIndex];

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Wind-Down Mobility"
      subtitle="EVENING RECOVERY PROTOCOL"
      footer={
        <View style={styles.footer}>
          <View style={styles.pauseWrap}>
            <Button
              label={isActive ? 'Pause Flow' : 'Resume Flow'}
              icon={isActive ? 'pause' : 'play'}
              onPress={() => setIsActive((prev) => !prev)}
            />
          </View>
          <Button
            label="Next Move"
            variant="secondary"
            onPress={() => setStepIndex((prev) => (prev + 1) % STEPS.length)}
          />
        </View>
      }>
      <View style={styles.headerIcon}>
        <Icon name="self_improvement" size={22} color={colors.primary} />
      </View>

      {/* Big countdown clock */}
      <View style={styles.clock}>
        <AppText style={styles.clockTime}>{timeFormatted}</AppText>
        <AppText variant="overline" tone="secondary" style={styles.clockLabel}>
          Parasympathetic Sync Active
        </AppText>
      </View>

      {/* Current movement cue */}
      <View style={styles.cueCard}>
        <View style={styles.cueRow}>
          <AppText variant="overline" style={styles.stepLabel}>
            Step {stepIndex + 1} of {STEPS.length}: {step.duration}
          </AppText>
          <AppText variant="caption" tone="secondary">
            Slow Cadence
          </AppText>
        </View>
        <AppText variant="label" style={styles.cueTitle}>
          {step.title}
        </AppText>
        <AppText variant="caption" tone="secondary" style={styles.cueText}>
          {step.cue}
        </AppText>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  clock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    gap: spacing.xs,
  },
  clockTime: {
    color: colors.primary,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  clockLabel: {
    letterSpacing: 1,
  },
  cueCard: {
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  stepLabel: {
    color: colors.secondary,
    flexShrink: 1,
  },
  cueTitle: {
    color: colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  cueText: {
    lineHeight: 18,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  pauseWrap: {
    flex: 1,
  },
});
