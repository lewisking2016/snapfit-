import { StyleSheet, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { getPermissionCopy } from '@/data/permission-copy';
import { colors, spacing, radius } from '@/theme';

type HealthPermissionSheetProps = {
  visible: boolean;
  onClose: () => void;
  onAllow: () => void;
  onSkip: () => void;
};

/**
 * Health Permission Sheet - explains why Kinn needs health data access.
 * Shows contextual rationale before requesting HealthKit/Health Connect permissions.
 * Required for App Store compliance (Apple 5.1.3).
 */
export function HealthPermissionSheet({
  visible,
  onClose,
  onAllow,
  onSkip,
}: HealthPermissionSheetProps) {
  if (!visible) return null;

  const platformName = Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit';
  const iconName: keyof typeof Ionicons.glyphMap = Platform.OS === 'ios' ? 'heart' : 'fitness';
  const copy = getPermissionCopy('health');

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={48} color={colors.primary} />
        </View>

        <AppText variant="heading1" center style={styles.title}>
          Connect {platformName}
        </AppText>

        <AppText variant="body" tone="secondary" center style={styles.description}>
          {copy.rationale} Connect {platformName} to continue.
        </AppText>

        <View style={styles.benefits}>
          <BenefitItem 
            icon="footsteps" 
            text="Daily steps and distance" 
          />
          <BenefitItem 
            icon="timer-outline" 
            text="Active minutes and calories" 
          />
          <BenefitItem 
            icon="barbell-outline" 
            text="Workout sessions and exercises" 
          />
          <BenefitItem 
            icon="trending-up-outline" 
            text="Progress insights over time" 
          />
        </View>

        <View style={styles.privacyNote}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.textTertiary} />
          <AppText variant="bodySmall" tone="muted">
            {copy.privacyNote}
          </AppText>
        </View>

        <View style={styles.actions}>
          <Button label={`Connect ${platformName}`} onPress={onAllow} full />
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <AppText variant="bodySmall" tone="secondary">
              Skip for now
            </AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function BenefitItem({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <AppText variant="body">{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  sheet: {
    backgroundColor: colors.cardRaised,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xxl,
    paddingBottom: spacing.huge,
    gap: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    marginTop: spacing.sm,
  },
  description: {
    maxWidth: 300,
    alignSelf: 'center',
  },
  benefits: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  actions: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  skipButton: {
    alignSelf: 'center',
    padding: spacing.sm,
  },
});