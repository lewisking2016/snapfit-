import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Sheet } from '@/components/ui/sheet';
import { AppText } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { colors, radius, spacing } from '@/theme';

type NotificationsSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Oraimo BLE Sync Complete',
    desc: 'Resting HR 68 BPM & 99% SpO2 synced to daily biometric baseline.',
    time: '12m ago',
    icon: 'sync',
    accent: 'volt' as const,
  },
  {
    id: '2',
    title: 'Target Sleep Goal Met (96%)',
    desc: '7h 52m total duration logged. Deep sleep reached +18% peak.',
    time: '6h ago',
    icon: 'bedtime',
    accent: 'cyan' as const,
  },
  {
    id: '3',
    title: 'Marcus Coach Pacing Calibration',
    desc: 'Optimal 140 BPM playlist aligned with Single DB Unilateral Shred.',
    time: 'Yesterday',
    icon: 'graphic_eq',
    accent: 'volt' as const,
  },
];

export function NotificationsSheet({ visible, onClose }: NotificationsSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Icon name="notifications" size={22} color={colors.primary} />
        <View style={styles.headerText}>
          <AppText variant="overline" tone="muted">
            System Telemetry Logs
          </AppText>
          <AppText variant="heading">Notifications</AppText>
        </View>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
          style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}>
          <Icon name="close" size={18} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {NOTIFICATIONS.map((n) => (
          <View key={n.id} style={styles.item}>
            <View style={styles.iconWrap}>
              <Icon
                name={n.icon}
                size={18}
                color={n.accent === 'volt' ? colors.primary : colors.secondary}
              />
            </View>
            <View style={styles.body}>
              <View style={styles.titleRow}>
                <AppText variant="label" style={styles.title} numberOfLines={1}>
                  {n.title}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {n.time}
                </AppText>
              </View>
              <AppText variant="caption" tone="secondary">
                {n.desc}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
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
  list: { gap: spacing.sm },
  item: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chip,
  },
  body: { flex: 1, gap: 2 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: { flex: 1 },
});
