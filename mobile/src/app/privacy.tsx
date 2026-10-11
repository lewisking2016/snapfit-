import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { Pressable } from 'react-native';
import { colors, spacing } from '@/theme';

/**
 * Privacy Policy Screen - Required for App Store submission.
 * Apple 5.1.1 / Google Play Data Safety compliance.
 */
export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="heading">Privacy Policy</AppText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <AppText variant="bodySmall" tone="muted">
          Last updated: October 2026
        </AppText>

        <Section title="1. Information We Collect">
          <Paragraph>
            Kinn collects the following information to provide our fitness tracking and social features:
          </Paragraph>
          <BulletItem>Account information (name, email, phone number)</BulletItem>
          <BulletItem>Fitness data from Apple Health or Google Fit (steps, workouts, active minutes)</BulletItem>
          <BulletItem>Workout logs and exercise history</BulletItem>
          <BulletItem>Friend connections and social interactions</BulletItem>
          <BulletItem>Device information for app functionality</BulletItem>
        </Section>

        <Section title="2. How We Use Your Information">
          <Paragraph>
            We use your information to:
          </Paragraph>
          <BulletItem>Track and display your fitness progress</BulletItem>
          <BulletItem>Connect you with friends for social fitness features</BulletItem>
          <BulletItem>Enable challenges and competitions</BulletItem>
          <BulletItem>Improve our app and develop new features</BulletItem>
          <BulletItem>Communicate with you about your account</BulletItem>
        </Section>

        <Section title="3. Health Data">
          <Paragraph>
            Health and fitness data from Apple Health or Google Fit is used solely for fitness tracking purposes. We do not:
          </Paragraph>
          <BulletItem>Sell your health data to third parties</BulletItem>
          <BulletItem>Use health data for advertising purposes</BulletItem>
          <BulletItem>Share health data without your explicit consent</BulletItem>
        </Section>

        <Section title="4. Data Sharing">
          <Paragraph>
            We may share your information with:
          </Paragraph>
          <BulletItem>Friends you connect with (limited to activity data you choose to share)</BulletItem>
          <BulletItem>Service providers who assist in operating our app</BulletItem>
          <BulletItem>Legal authorities when required by law</BulletItem>
        </Section>

        <Section title="5. Data Retention">
          <Paragraph>
            We retain your data while your account is active. You can request deletion of your account and associated data at any time through the app&apos;s Settings.
          </Paragraph>
        </Section>

        <Section title="6. Your Rights">
          <Paragraph>
            You have the right to:
          </Paragraph>
          <BulletItem>Access your personal data</BulletItem>
          <BulletItem>Request correction of inaccurate data</BulletItem>
          <BulletItem>Request deletion of your data</BulletItem>
          <BulletItem>Export your data in a portable format</BulletItem>
          <BulletItem>Withdraw consent at any time</BulletItem>
        </Section>

        <Section title="7. Security">
          <Paragraph>
            We implement industry-standard security measures to protect your data, including encryption in transit and at rest.
          </Paragraph>
        </Section>

        <Section title="8. Children's Privacy">
          <Paragraph>
            Kinn is not intended for children under 18. For competition features involving stakes, users must be 18 or older.
          </Paragraph>
        </Section>

        <Section title="9. Contact">
          <Paragraph>
            For privacy-related inquiries or to exercise your rights, contact us at privacy@kinn.app
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