import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { RouteHeader } from '@/components/ui/header';
import { ConnectedDevices } from '@/components/screens/connected-devices';
import { PairDeviceSheet } from '@/components/sheets/pair-device-sheet';
import { spacing } from '@/theme';

/** Pushed route: Connected devices (web `ConnectedDevicesScreen`). */
export default function DevicesRoute() {
  const [isPairSheetVisible, setIsPairSheetVisible] = useState<boolean>(false);

  return (
    <Screen>
      <RouteHeader title="Connected devices" closeIcon="chevron-back" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.xl, paddingBottom: 40 }}>
        <ConnectedDevices onPair={() => setIsPairSheetVisible(true)} />
      </ScrollView>

      <PairDeviceSheet
        visible={isPairSheetVisible}
        onClose={() => setIsPairSheetVisible(false)}
        onDevicePaired={(deviceName) =>
          Alert.alert('Sensor Paired', `Connected to ${deviceName}. Real-time telemetry streaming active.`)
        }
      />
    </Screen>
  );
}
