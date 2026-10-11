import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { INITIAL_SAMSUNG_HEALTH, INITIAL_WATCH_STATE } from '../../data/mockData';
import type { SamsungHealthState } from '../../types';
import { AppText } from '../ui/text';
import { Card } from '../ui/card';
import { Icon } from '../ui/icon';
import { Pill } from '../ui/pill';
import { Button } from '../ui/button';
import { Switch, ToggleRow } from '../ui/toggle';

const HEART_RED = '#ffb4ab';

type StreamKey = keyof SamsungHealthState['streams'];

const STREAM_ENTRIES: { key: StreamKey; title: string; desc: string; icon: string }[] = [
  {
    key: 'steps',
    title: 'Steps & Walking Distance',
    desc: 'Continuous all-day motion vectors',
    icon: 'directions_walk',
  },
  {
    key: 'sleep',
    title: 'Sleep Stages & Architecture',
    desc: 'Deep, REM, and recovery index',
    icon: 'bedtime',
  },
  {
    key: 'activeBurn',
    title: 'Active Burn & Heart Rate',
    desc: 'Caloric burn and peak HR zones',
    icon: 'local_fire_department',
  },
];

// Bar heights approximating the web SVG sparkline path (no SVG dependency on RN).
const SPARK_BARS = [30, 30, 62, 34, 78, 40, 62, 30, 30, 70, 36, 58, 44, 30, 66, 38, 52, 30];

/**
 * Port of web `ConnectedDevicesScreen` (src/components/screens/ConnectedDevicesScreen.tsx).
 * The parent route owns the pair-sheet visibility and the pairing alert.
 */
export function ConnectedDevices({ onPair }: { onPair: () => void }) {
  const watch = INITIAL_WATCH_STATE;
  const samsung = INITIAL_SAMSUNG_HEALTH;

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [liveBpm, setLiveBpm] = useState<number>(watch.restingHr);
  const [lastSyncLabel, setLastSyncLabel] = useState<string>(samsung.lastHandshake);
  const [streams, setStreams] = useState<SamsungHealthState['streams']>(samsung.streams);
  const [autoSync, setAutoSync] = useState<boolean>(watch.autoSync);

  // Mount guard: the 1200ms sync timeout can fire after unmount.
  const mountedRef = useRef<boolean>(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSyncWatch = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      if (!mountedRef.current) return;
      setIsSyncing(false);
      setLastSyncLabel('Just now');
      setLiveBpm(67 + Math.floor(Math.random() * 5));
    }, 1200);
  };

  const toggleStream = (streamKey: StreamKey) => {
    setStreams((prev) => ({ ...prev, [streamKey]: !prev[streamKey] }));
  };

  return (
    <View style={{ gap: spacing.xl }}>
      {/* Status Scrim & Glance Banner */}
      <View style={styles.bannerRow}>
        <View style={styles.rowCentered}>
          <View style={styles.voltDot} />
          <AppText
            variant="label"
            style={{ color: colors.primary, fontWeight: '700', textTransform: 'uppercase' }}>
            Telemetry Pipeline Active
          </AppText>
        </View>
        <View style={styles.bannerChip}>
          <Icon name="sync" size={14} color={colors.secondary} />
          <AppText variant="caption" tone="muted">
            Live BLE Link
          </AppText>
        </View>
      </View>

      {/* Primary Wearable Card */}
      <Card style={styles.cardGap}>
        <View style={styles.cardHeader}>
          <View style={styles.rowCentered}>
            <View style={styles.iconBoxVolt}>
              <Icon name="watch" size={26} color={colors.primary} />
            </View>
            <View style={{ gap: 2 }}>
              <AppText variant="title" style={{ fontWeight: '700' }}>
                {watch.name}
              </AppText>
              <AppText variant="caption" tone="secondary">
                {watch.model} • MAC: {watch.mac}
              </AppText>
            </View>
          </View>
          <Pill label="Streaming" tone="volt" />
        </View>

        {/* Battery & Signal Pill Cluster */}
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Icon name="battery_5_bar" size={20} color={colors.primary} />
            <AppText variant="overline" tone="muted">
              Charge
            </AppText>
            <View style={styles.metricValue}>
              <AppText variant="metricSm" style={{ fontWeight: '700' }}>
                {watch.charge}
              </AppText>
              <AppText variant="caption" tone="muted">
                %
              </AppText>
            </View>
          </View>
          <View style={styles.metricBox}>
            <Icon name="signal_cellular_alt" size={20} color={colors.secondary} />
            <AppText variant="overline" tone="muted">
              Link
            </AppText>
            <View style={styles.metricValue}>
              <AppText variant="metricSm" style={{ fontWeight: '700' }}>
                {watch.linkDbm}
              </AppText>
              <AppText variant="caption" tone="muted">
                dBm
              </AppText>
            </View>
          </View>
        </View>

        {/* Realtime Telemetry Grid */}
        <View style={styles.hrPanel}>
          <View style={styles.rowBetween}>
            <View style={styles.rowCentered}>
              <Icon name="favorite" size={16} color={HEART_RED} />
              <AppText variant="overline" tone="muted">
                Resting Heart Rate
              </AppText>
            </View>
            <View style={styles.rowCentered}>
              <AppText variant="metric" style={{ fontWeight: '800' }}>
                {liveBpm}
              </AppText>
              <AppText variant="label" tone="muted" style={{ fontWeight: '700' }}>
                BPM
              </AppText>
            </View>
          </View>

          {/* Realtime Heart Rate Mini Sparkline → bar meter (no SVG on RN) */}
          <View
            style={styles.hrMeter}
            accessibilityRole="image"
            accessibilityLabel="Live heart rate trend sparkline">
            {SPARK_BARS.map((h, i) => (
              <View key={i} style={[styles.hrBar, { height: `${h}%` }]} />
            ))}
          </View>

          <View style={styles.hrSpo2Row}>
            <View style={styles.rowCentered}>
              <Icon name="bloodtype" size={14} color={colors.secondary} />
              <AppText variant="caption" tone="muted">
                Continuous SpO2
              </AppText>
            </View>
            <AppText variant="bodyMedium" style={{ fontWeight: '700', color: colors.primary }}>
              {watch.continuousSpo2}% Normal
            </AppText>
          </View>
        </View>

        {/* Watch Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.rowCentered}>
            <Icon name="verified" size={16} color={colors.textMuted} />
            <AppText variant="caption" tone="muted">
              {watch.firmware}
            </AppText>
          </View>
          <Button
            label={isSyncing ? 'Syncing...' : 'Sync Now'}
            variant="primary"
            icon="refresh"
            loading={isSyncing}
            disabled={isSyncing}
            onPress={handleSyncWatch}
          />
        </View>

        {/* Background Auto-Sync Row */}
        <ToggleRow
          label="Background Auto-Sync"
          description="Update telemetry every 60 seconds"
          value={autoSync}
          onValueChange={setAutoSync}
        />
      </Card>

      {/* Samsung Health Platform Card */}
      <Card style={styles.cardGap}>
        <View style={styles.cardHeader}>
          <View style={styles.rowCentered}>
            <View style={styles.iconBoxCyan}>
              <Icon name="health_metrics" size={26} color={colors.secondary} />
            </View>
            <View style={{ gap: 2 }}>
              <AppText variant="title" style={{ fontWeight: '700' }}>
                Samsung Health
              </AppText>
              <AppText variant="caption" tone="secondary">
                Health Connect SDK • 2-Way Sync
              </AppText>
            </View>
          </View>
          <Pill label="Connected" tone="cyan" />
        </View>

        {/* Sync Log & Time Pill */}
        <View style={styles.handshakeBox}>
          <AppText variant="caption" tone="muted">
            Latest Cloud Handshake
          </AppText>
          <AppText variant="label" style={{ fontWeight: '600' }}>
            {lastSyncLabel}
          </AppText>
        </View>

        {/* Data Stream Permissions */}
        <View style={{ gap: spacing.sm }}>
          <AppText
            variant="overline"
            tone="muted"
            style={{ fontWeight: '700', textTransform: 'uppercase' }}>
            Active Read/Write Streams
          </AppText>

          {STREAM_ENTRIES.map((entry) => {
            const on = streams[entry.key];
            return (
              <View key={entry.key} style={styles.streamRow}>
                <View style={styles.rowCentered}>
                  <Icon
                    name={entry.icon}
                    size={20}
                    color={on ? colors.primary : colors.textMuted}
                  />
                  <View style={{ flex: 1, gap: 2 }}>
                    <AppText variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {entry.title}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {entry.desc}
                    </AppText>
                  </View>
                </View>
                <Switch value={on} onValueChange={() => toggleStream(entry.key)} />
              </View>
            );
          })}
        </View>
      </Card>

      {/* Priority Calibration Matrix */}
      <Card style={styles.cardGap}>
        <View style={{ gap: 2 }}>
          <AppText variant="title" style={{ fontWeight: '700' }}>
            Data Source Conflict Resolution
          </AppText>
          <AppText variant="caption" tone="secondary">
            Hardware priority for real-time workout tracking vs ambient logs.
          </AppText>
        </View>

        <View style={styles.conflictRow}>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="overline" tone="muted">
              Heart Rate & Live Sets
            </AppText>
            <AppText variant="bodyMedium" style={{ fontWeight: '600' }}>
              Oraimo Watch 4 Pro
            </AppText>
          </View>
          <Pill label="Master" tone="volt" />
        </View>

        <View style={styles.conflictRow}>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="overline" tone="muted">
              All-day Steps & Sleep Aggregation
            </AppText>
            <AppText variant="bodyMedium" style={{ fontWeight: '600' }}>
              Samsung Health
            </AppText>
          </View>
          <Pill label="Master" tone="cyan" />
        </View>
      </Card>

      {/* Pair New Sensor CTA */}
      <Button
        label="Pair Chest Strap or Smart Scale"
        variant="secondary"
        icon="add-circle"
        full
        onPress={onPair}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  bannerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  voltDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  rowCentered: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardGap: { gap: spacing.md },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  iconBoxVolt: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.cardRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxCyan: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.cardRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: { flexDirection: 'row', gap: spacing.sm },
  metricBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  metricValue: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginLeft: 'auto' },
  hrPanel: {
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  hrMeter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 32,
    gap: 3,
  },
  hrBar: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  hrSpo2Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  handshakeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  streamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.cardRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  conflictRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
