import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { colors, spacing } from '@/theme';

/**
 * Terms of Service Screen - Required for App Store submission.
 */
export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="heading">Terms of Service</AppText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <AppText variant="bodySmall" tone="muted">
          Last updated: October 2026
        </AppText>

        <Section title="1. Acceptance of Terms">
          <Paragraph>
            By downloading, installing, or using Kinn, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app.
          </Paragraph>
        </Section>

        <Section title="2. Eligibility">
          <Paragraph>
            To use Kinn, you must:
          </Paragraph>
          <BulletItem>Be at least 18 years old for competition features with stakes</BulletItem>
          <BulletItem>Provide accurate registration information</BulletItem>
          <BulletItem>Maintain the security of your account</BulletItem>
          <BulletItem>Comply with all applicable laws</BulletItem>
        </Section>

        <Section title="3. Account Registration">
          <Paragraph>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
          </Paragraph>
        </Section>

        <Section title="4. User Conduct">
          <Paragraph>
            You agree not to:
          </Paragraph>
          <BulletItem>Use the app for any unlawful purpose</BulletItem>
          <BulletItem>Submit false or misleading fitness data</BulletItem>
          <BulletItem>Cheat or manipulate challenges or competitions</BulletItem>
          <BulletItem>Harass, abuse, or harm other users</BulletItem>
          <BulletItem>Post offensive, illegal, or inappropriate content</BulletItem>
          <BulletItem>Attempt to access other users&apos; accounts or data</BulletItem>
        </Section>

        <Section title="5. Content and Intellectual Property">
          <Paragraph>
            You retain ownership of content you create in the app. By posting content, you grant Kinn a license to use, display, and distribute that content within the app&apos;s features.
          </Paragraph>
        </Section>

        <Section title="6. Challenges and Competitions">
          <Paragraph>
            Point-based challenges and competitions are for entertainment purposes. Any stakes features are governed by additional terms and are subject to age and location restrictions.
          </Paragraph>
        </Section>

        <Section title="7. Health Disclaimer">
          <Paragraph>
            Kinn is a fitness tracking app, not a medical device. Always consult a healthcare professional before starting any exercise program. We make no guarantees about the accuracy of health data.
          </Paragraph>
        </Section>

        <Section title="8. Termination">
          <Paragraph>
            We may suspend or terminate your account for violation of these terms or for any other reason at our discretion. You may delete your account at any time through the app&apos;s Settings.
          </Paragraph>
        </Section>

        <Section title="9. Limitation of Liability">
          <Paragraph>
            To the maximum extent permitted by law, Kinn shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app.
          </Paragraph>
        </Section>

        <Section title="10. Changes to Terms">
          <Paragraph>
            We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.
          </Paragraph>
        </Section>

        <Section title="11. Contact">
          <Paragraph>
            For questions about these terms, contact us at legal@kinn.app
          </Paragraph>
        </Section>

        <View style={styles.footer}>
          <AppText variant="bodySmall" tone="muted" center>
            Kinn Inc. · Kenya
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="title">{title}</AppText>
      {children}
    </View>
  );
}

function Paragraph({ children }: { children: string }) {
  return (
    <AppText variant="body" tone="secondary" style={styles.paragraph}>
      {children}
    </AppText>
  );
}

function BulletItem({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <AppText variant="body" tone="secondary">• </AppText>
      <AppText variant="body" tone="secondary" style={styles.bulletText}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 44,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
  section: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  paragraph: {
    lineHeight: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: spacing.sm,
  },
  bulletText: {
    flex: 1,
  },
  footer: {
    marginTop: spacing.huge,
    paddingTop: spacing.xxl,
  },
});