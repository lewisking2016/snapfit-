import { Image, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Sheet } from '@/components/ui/sheet';
import { AppText } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { colors, radius, spacing } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

/** Reused by the Home tab header's avatar button. */
export const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBh1xHsZmkc7w0sj0NHoeSvHIF030F6I_ITx2cGzWkdPMZsHcKg6kAr94M3Dg4PTnkGq3yRACjN8iW-Rp-7ysdk0g_IgU-5RYGKNtML57OsFiLJ0Tv9sveVR8PN1gjJTJrRWp_bojWAqVwU1sXbutOGdPm4Wd3KPE6Yx_F9VcQz_wJEBXaZErHL-mkKI0-JGsGXGdZkIii-JvMmYOGHGG9WDXs7oS1FOwpoTvMtWG4rwBxRyG5mQRhRHg';

const STAT_TILES = [
  { label: 'Weight', value: '78.4 KG', color: colors.text },
  { label: 'Max HR', value: '188 BPM', color: colors.secondary },
  { label: 'Load Baseline', value: '20 KG DB', color: colors.primary },
];

const BRIDGES = [
  {
    id: 'recovery',
    icon: 'bedtime',
    title: 'Recovery & Sleep Architecture',
    color: colors.secondary,
    route: '/recovery' as const,
  },
  {
    id: 'audio',
    icon: 'headphones',
    title: 'Audio Companion & Spotify',
    color: colors.primary,
    route: '/coach' as const,
  },
  {
    id: 'devices',
    icon: 'watch',
    title: 'Connected Devices & Samsung Health',
    color: colors.secondary,
    route: '/devices' as const,
  },
];

export function AthleteProfileSheet({ visible, onClose }: Props) {
  const navigate = (route: '/recovery' | '/coach' | '/devices') => {
    onClose();
    router.push(route);
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Icon name="person" size={22} color={colors.primary} />
        <View style={styles.headerText}>
          <AppText variant="overline" tone="muted">
            Athlete Diagnostics
          </AppText>
          <AppText variant="heading">User Profile</AppText>
        </View>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close profile"
          style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}>
          <Icon name="close" size={18} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.identityCard}>
        <Image
          source={{ uri: AVATAR_URL }}
          style={styles.avatar}
          accessibilityLabel="Profile photo"
        />
        <View style={styles.identityText}>
          <View style={styles.nameRow}>
            <AppText variant="heading" style={styles.bold}>
              Alex Mercer
            </AppText>
            <View style={styles.proBadge}>
              <AppText variant="caption" style={styles.proBadgeText}>
                PRO SYNC
              </AppText>
            </View>
          </View>
          <AppText variant="caption" tone="secondary">
            High-Performance Unilateral Split
          </AppText>
          <AppText variant="caption" tone="secondary-accent" style={styles.mono}>
            ID: AT-9842-COR
          </AppText>
        </View>
      </View>

      <View style={styles.statsRow}>
        {STAT_TILES.map((tile) => (
          <View key={tile.label} style={styles.statTile}>
            <AppText variant="caption" tone="muted" style={styles.statLabel}>
              {tile.label.toUpperCase()}
            </AppText>
            <AppText variant="bodyMedium" style={[styles.bold, { color: tile.color }]}>
              {tile.value}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.bridges}>
        <AppText variant="overline" tone="muted" style={styles.bridgesLabel}>
          Deep Hub Bridges
        </AppText>
        {BRIDGES.map((bridge) => (
          <Pressable
            key={bridge.id}
            onPress={() => navigate(bridge.route)}
            accessibilityRole="button"
            accessibilityLabel={bridge.title}
            style={({ pressed }) => [styles.bridgeRow, pressed && { opacity: 0.7 }]}>
            <View style={styles.bridgeLeft}>
              <Icon name={bridge.icon} size={16} color={bridge.color} />
              <AppText variant="label">{bridge.title}</AppText>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textSecondary} />
          </Pressable>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lineSoft,
  },
  headerText: { flex: 1, gap: 2 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardRaised,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  identityText: { flex: 1, gap: 2 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  proBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm / 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proBadgeText: {
    color: '#283500',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  mono: { fontFamily: 'monospace', fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  bridges: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  bridgesLabel: {
    letterSpacing: 1,
  },
  bridgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  bridgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
});
