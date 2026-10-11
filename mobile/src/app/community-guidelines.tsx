import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { useCommunityStore } from '@/store/community-store';
import { colors, spacing } from '@/theme';

/**
 * Community Guidelines Screen - Required for UGC features.
 * Apple 1.2 / Google Play UGC policy compliance.
 */
export default function CommunityGuidelinesScreen() {
  const router = useRouter();
  const acceptCommunityGuidelines = useCommunityStore((state) => state.acceptCommunityGuidelines);

  const handleAccept = () => {
    acceptCommunityGuidelines();
    router.back();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="heading">Community Guidelines</AppText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <AppText variant="body" tone="secondary">
          Kinn is a community of people who move together. These guidelines help keep our community safe, supportive, and fun.
        </AppText>

        <Section title="Be Respectful">
          <Paragraph>
            Treat others as you&apos;d like to be treated. We don&apos;t tolerate:
          </Paragraph>
          <BulletItem>Harassment, bullying, or intimidation</BulletItem>
          <BulletItem>Hate speech or discrimination</BulletItem>
          <BulletItem>Threats of violence or harm</BulletItem>
          <BulletItem>Sharing others&apos; private information</BulletItem>
        </Section>

        <Section title="Be Honest">
          <Paragraph>
            Fitness is about real progress. Don&apos;t:
          </Paragraph>
          <BulletItem>Falsify workout data or achievements</BulletItem>
          <BulletItem>Use multiple accounts to manipulate challenges</BulletItem>
          <BulletItem>Cheat in competitions or on leaderboards</BulletItem>
          <BulletItem>Share or sell your account</BulletItem>
        </Section>

        <Section title="Be Supportive">
          <Paragraph>
            We&apos;re all here to improve. Please:
          </Paragraph>
          <BulletItem>Celebrate others&apos; wins</BulletItem>
          <BulletItem>Offer encouragement, not criticism</BulletItem>
          <BulletItem>Share tips and advice constructively</BulletItem>
          <BulletItem>Respect different fitness levels and goals</BulletItem>
        </Section>

        <Section title="Content Guidelines">
          <Paragraph>
            Keep all content appropriate:
          </Paragraph>
          <BulletItem>No nudity or sexually explicit content</BulletItem>
          <BulletItem>No graphic violence or gore</BulletItem>
          <BulletItem>No illegal activities or drug use</BulletItem>
          <BulletItem>No spam or misleading content</BulletItem>
        </Section>

        <Section title="Reporting & Moderation">
          <Paragraph>
            If you see content or behavior that violates these guidelines:
          </Paragraph>
          <BulletItem>Report it using the in-app reporting tools</BulletItem>
          <BulletItem>Block users who bother you</BulletItem>
          <BulletItem>Contact us at safety@kinn.app for serious issues</BulletItem>
        </Section>

        <Section title="Consequences">
          <Paragraph>
            Violations may result in:
          </Paragraph>
          <BulletItem>Content removal</BulletItem>
          <BulletItem>Temporary suspension</BulletItem>
          <BulletItem>Permanent account ban</BulletItem>
          <BulletItem>Legal action for serious violations</BulletItem>
        </Section>

        <View style={styles.footer}>
          <Pressable onPress={handleAccept} accessibilityRole="button" style={styles.acceptButton}>
            <AppText variant="bodyMedium" tone="primary">I agree to the community guidelines</AppText>
          </Pressable>
          <AppText variant="bodySmall" tone="muted" center>
            Questions? Email safety@kinn.app
          </AppText>
          <AppText variant="caption" tone="muted" center style={styles.date}>
            Last updated: October 2026
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
    gap: spacing.sm,
  },
  acceptButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    marginTop: spacing.sm,
  },
});