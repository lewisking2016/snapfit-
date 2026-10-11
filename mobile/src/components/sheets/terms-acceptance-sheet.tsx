import { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { colors, spacing, radius } from '@/theme';

type TermsAcceptanceSheetProps = {
  visible: boolean;
  onAccept: () => void;
  onViewTerms: () => void;
  onViewPrivacy: () => void;
};

/**
 * Terms & Privacy Acceptance Sheet - must be shown before account creation.
 * Required for App Store compliance (Apple 5.1.1, Google Play UGC policy).
 */
export function TermsAcceptanceSheet({
  visible,
  onAccept,
  onViewTerms,
  onViewPrivacy,
}: TermsAcceptanceSheetProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  if (!visible) return null;

  const canProceed = acceptedTerms && acceptedPrivacy;

  const handleAccept = () => {
    if (canProceed) {
      onAccept();
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <AppText variant="heading1">Before you start</AppText>
          <AppText variant="body" tone="secondary">
            Please review and accept our policies to continue.
          </AppText>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <PolicyCheckbox
            checked={acceptedTerms}
            onToggle={() => setAcceptedTerms(!acceptedTerms)}
            title="Terms of Service"
            description="Rules and guidelines for using Kinn"
            onLinkPress={onViewTerms}
          />

          <PolicyCheckbox
            checked={acceptedPrivacy}
            onToggle={() => setAcceptedPrivacy(!acceptedPrivacy)}
            title="Privacy Policy"
            description="How we collect, use, and protect your data"
            onLinkPress={onViewPrivacy}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            label="Accept & Continue" 
            onPress={handleAccept} 
            disabled={!canProceed}
            full 
          />
        </View>
      </View>
    </View>
  );
}

type PolicyCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  onLinkPress: () => void;
};

function PolicyCheckbox({
  checked,
  onToggle,
  title,
  description,
  onLinkPress,
}: PolicyCheckboxProps) {
  return (
    <View style={styles.policyCard}>
      <Pressable onPress={onToggle} style={styles.checkboxRow}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && (
            <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
          )}
        </View>
        <View style={styles.policyContent}>
          <AppText variant="bodyMedium">{title}</AppText>
          <AppText variant="bodySmall" tone="secondary">
            {description}
          </AppText>
        </View>
      </Pressable>
      <Pressable onPress={onLinkPress} style={styles.linkButton}>
        <AppText variant="bodySmall" tone="primary">Read</AppText>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    zIndex: 100,
  },
  sheet: {
    flex: 1,
    padding: spacing.xxl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xxl,
  },
  scroll: {
    flex: 1,
  },
  policyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  policyContent: {
    flex: 1,
    gap: 2,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  footer: {
    paddingTop: spacing.xl,
  },
});