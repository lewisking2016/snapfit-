import { ScrollView, StyleSheet, View, Pressable, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { colors, spacing, radius } from '@/theme';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useSettingsStore } from '@/store/settings-store';

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
};

function SettingRow({ icon, title, subtitle, onPress, rightElement, danger }: SettingRowProps) {
  const content = (
    <View style={styles.row}>
      <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={danger ? colors.danger : colors.primary} 
        />
      </View>
      <View style={styles.rowContent}>
        <AppText variant="body" style={danger && { color: colors.danger }}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="bodySmall" tone="secondary">
            {subtitle}
          </AppText>
        )}
      </View>
      {rightElement || (
        onPress && <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable 
        onPress={onPress} 
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

export default function SettingsScreen() {
  const privacy = useSettingsStore((state) => state.privacy);
  const updatePrivacy = useSettingsStore((state) => state.updatePrivacy);

  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In production: call API to delete account
            // For now: reset onboarding to show onboarding again
            resetOnboarding();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your workout data will be exported and sent to your email.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Request Export', 
          onPress: () => {
            Alert.alert('Request Received', 'We\'ll email your data within 48 hours.');
          }
        },
      ]
    );
  };

  return (
    <Screen>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </Pressable>
          <AppText variant="heading">Settings</AppText>
          <View style={styles.placeholder} />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <AppText variant="label" tone="muted" style={styles.sectionLabel}>
            Account
          </AppText>
          <View style={styles.card}>
            <SettingRow 
              icon="person-outline" 
              title="Profile" 
              subtitle="Name, avatar, bio"
              onPress={() => Alert.alert('Coming Soon', 'Profile editing is coming soon.')}
            />
            <View style={styles.divider} />
            <SettingRow 
              icon="notifications-outline" 
              title="Notifications" 
              subtitle="Push notification preferences"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings are coming soon.')}
            />
            <View style={styles.divider} />
            <SettingRow 
              icon="lock-closed-outline" 
              title="Privacy" 
              subtitle="Who can see your activity"
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings are coming soon.')}
            />
          </View>
        </View>

        {/* Privacy Controls */}
        <View style={styles.section}>
          <AppText variant="label" tone="muted" style={styles.sectionLabel}>
            Privacy Controls
          </AppText>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleContent}>
                <AppText variant="body">Show Activity</AppText>
                <AppText variant="bodySmall" tone="secondary">
                  Let friends see your workouts
                </AppText>
              </View>
              <Switch
                value={privacy.showActivity}
                onValueChange={(value) => updatePrivacy({ showActivity: value })}
                trackColor={{ false: colors.card, true: colors.primaryContainer }}
                thumbColor={privacy.showActivity ? colors.primary : colors.textTertiary}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.toggleRow}>
              <View style={styles.toggleContent}>
                <AppText variant="body">Allow Nudges</AppText>
                <AppText variant="bodySmall" tone="secondary">
                  Let friends send you nudges
                </AppText>
              </View>
              <Switch
                value={privacy.allowNudges}
                onValueChange={(value) => updatePrivacy({ allowNudges: value })}
                trackColor={{ false: colors.card, true: colors.primaryContainer }}
                thumbColor={privacy.allowNudges ? colors.primary : colors.textTertiary}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.toggleRow}>
              <View style={styles.toggleContent}>
                <AppText variant="body">Show on Leaderboard</AppText>
                <AppText variant="bodySmall" tone="secondary">
                  Appear in friend leaderboards
                </AppText>
              </View>
              <Switch
                value={privacy.showOnLeaderboard}
                onValueChange={(value) => updatePrivacy({ showOnLeaderboard: value })}
                trackColor={{ false: colors.card, true: colors.primaryContainer }}
                thumbColor={privacy.showOnLeaderboard ? colors.primary : colors.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <AppText variant="label" tone="muted" style={styles.sectionLabel}>
            Your Data
          </AppText>
          <View style={styles.card}>
            <SettingRow 
              icon="download-outline" 
              title="Export Data" 
              subtitle="Download your workout history"
              onPress={handleExportData}
            />
            <View style={styles.divider} />
            <SettingRow 
              icon="heart-outline" 
              title="Health Permissions" 
              subtitle="Manage Apple Health / Google Fit"
              onPress={() => Alert.alert('Coming Soon', 'Health permissions are coming soon.')}
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <AppText variant="label" tone="muted" style={styles.sectionLabel}>
            Legal
          </AppText>
          <View style={styles.card}>
            <SettingRow 
              icon="document-text-outline" 
              title="Terms of Service" 
              onPress={() => router.push('/terms')}
            />
            <View style={styles.divider} />
            <SettingRow 
              icon="shield-checkmark-outline" 
              title="Privacy Policy" 
              onPress={() => router.push('/privacy')}
            />
            <View style={styles.divider} />
            <SettingRow 
              icon="people-outline" 
              title="Community Guidelines" 
              onPress={() => router.push('/community-guidelines')}
            />
          </View>
        </View>

        {/* Delete Account - Critical */}
        <View style={styles.section}>
          <AppText variant="label" tone="muted" style={styles.sectionLabel}>
            Danger Zone
          </AppText>
          <View style={[styles.card, styles.cardDanger]}>
            <SettingRow 
              icon="trash-outline" 
              title="Delete Account" 
              subtitle="Permanently remove your account and data"
              onPress={handleDeleteAccount}
              danger
            />
          </View>
        </View>

        {/* Version */}
        <AppText variant="caption" tone="muted" center style={styles.version}>
          Kinn v1.0.0 (Phase 1 MVP)
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.huge,
  },
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.xl,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  cardDanger: {
    borderWidth: 1,
    borderColor: colors.danger + '40',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.88,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDanger: {
    backgroundColor: colors.danger + '20',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginLeft: 68,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  toggleContent: {
    flex: 1,
    gap: 2,
  },
  version: {
    marginTop: spacing.xl,
  },
});