import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Sheet } from '@/components/ui/sheet';
import { AppText } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { colors, radius, spacing } from '@/theme';

type DiscoveredDevice = {
  id: string;
  name: string;
  kind: string;
  rssi: number;
};

// Fixed discovery list — the scan "reveals" one device every 300ms.
const DISCOVERED_DEVICES: DiscoveredDevice[] = [
  { id: 'polar-h10', name: 'Polar H10', kind: 'Chest Strap', rssi: -42 },
  { id: 'garmin-hrm', name: 'Garmin HRM-Pro Plus', kind: 'Chest Strap', rssi: -58 },
  { id: 'withings-body', name: 'Withings Body Smart Scale', kind: 'Smart Scale', rssi: -71 },
];

const SCAN_INTERVAL_MS = 300;

type PairDeviceSheetProps = {
  visible: boolean;
  onClose: () => void;
  onDevicePaired: (deviceName: string) => void;
};

export function PairDeviceSheet({ visible, onClose, onDevicePaired }: PairDeviceSheetProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [wasVisible, setWasVisible] = useState(visible);
  const isMountedRef = useRef(true);

  // Restart the simulated BLE scan each time the sheet opens. This is React's
  // guarded render-time adjustment ("storing information from previous
  // renders") — an effect would trigger a cascading render.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setRevealedCount(0);
    }
  }

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reveal one peripheral every 300ms. setState only ever runs inside the
  // timer callback, and the interval is cleared on close/unmount.
  useEffect(() => {
    if (!visible) return undefined;

    let found = 0;
    const intervalId = setInterval(() => {
      if (!isMountedRef.current) {
        clearInterval(intervalId);
        return;
      }
      found += 1;
      setRevealedCount(found);
      if (found >= DISCOVERED_DEVICES.length) {
        clearInterval(intervalId);
      }
    }, SCAN_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [visible]);

  const handlePair = (deviceName: string) => {
    onDevicePaired(deviceName);
    onClose();
  };

  const isScanning = visible && revealedCount < DISCOVERED_DEVICES.length;
  const discovered = DISCOVERED_DEVICES.slice(0, revealedCount);

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Pair Telemetry Sensor"
      subtitle="BLE Peripheral Discovery"
      scroll
    >
      <View style={styles.body}>
        {isScanning ? (
          <View style={styles.scanningRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <AppText variant="bodyMedium" style={styles.scanningText}>
              Scanning for BLE Peripherals...
            </AppText>
          </View>
        ) : (
          <AppText variant="bodyMedium" tone="secondary" style={styles.scanningText}>
            {discovered.length > 0
              ? `${discovered.length} peripheral${discovered.length === 1 ? '' : 's'} found nearby.`
              : 'No peripherals found.'}
          </AppText>
        )}

        <AppText variant="caption" tone="muted">
          Make sure your strap or scale is in pairing mode.
        </AppText>

        <View style={styles.list}>
          {discovered.map((device) => (
            <Pressable
              key={device.id}
              accessibilityRole="button"
              accessibilityLabel={`Pair ${device.name}`}
              accessibilityHint={`Connects this ${device.kind} and starts telemetry streaming`}
              onPress={() => handlePair(device.name)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowIcon}>
                <Icon name="bluetooth-connected" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowText}>
                <AppText variant="bodyMedium" numberOfLines={1}>
                  {device.name}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {device.kind} · RSSI {device.rssi} dBm
                </AppText>
              </View>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scanningText: {
    flexShrink: 1,
  },
  list: {
    marginTop: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rowPressed: {
    backgroundColor: colors.cardRaised,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chip,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});
