import React from 'react';
import { View, Pressable } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { Sheet } from '../ui/sheet';
import { AppText } from '../ui/text';
import { Icon } from '../ui/icon';

export interface AudioDevice {
  id: string;
  name: string;
  kind: string;
  icon: 'headphones' | 'hearing' | 'volume-up';
  latencyMs: number;
  tag: string;
}

export const AUDIO_DEVICES: AudioDevice[] = [
  {
    id: 'beats',
    name: 'Beats Powerbeats Pro',
    kind: 'Earbuds',
    icon: 'headphones',
    latencyMs: 12,
    tag: 'Ultra-low latency',
  },
  {
    id: 'airpods',
    name: 'Apple AirPods Pro 2',
    kind: 'Earbuds',
    icon: 'headphones',
    latencyMs: 18,
    tag: 'Spatial Audio',
  },
  {
    id: 'shokz',
    name: 'Shokz OpenRun Pro',
    kind: 'Bone Conduction',
    icon: 'hearing',
    latencyMs: 22,
    tag: 'Ambient Aware',
  },
  {
    id: 'phone',
    name: 'Phone Speaker',
    kind: 'Internal',
    icon: 'volume-up',
    latencyMs: 4,
    tag: 'Direct Dac',
  },
];

interface SwitchAudioSheetProps {
  visible: boolean;
  onClose: () => void;
  activeId: string;
  onSelect: (device: AudioDevice) => void;
}

export function SwitchAudioSheet({ visible, onClose, activeId, onSelect }: SwitchAudioSheetProps) {
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Sound Routing"
      subtitle="Switch Audio Output"
    >
      <View style={{ gap: spacing.sm }}>
        {AUDIO_DEVICES.map((device) => {
          const active = device.id === activeId;
          return (
            <Pressable
              key={device.id}
              onPress={() => onSelect(device)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${device.name}, ${device.kind}, ${device.latencyMs} milliseconds latency, ${device.tag}`}
              accessibilityState={{ selected: active }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.md,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: active ? colors.primary : colors.line,
                backgroundColor: active ? colors.primaryContainer : colors.card,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? colors.primary : colors.chip,
                }}
              >
                <Icon
                  name={device.icon}
                  size={18}
                  color={active ? colors.onPrimary : colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <AppText variant="bodyMedium">{device.name}</AppText>
                <AppText variant="caption" tone="muted">
                  {device.kind} • {device.latencyMs}ms • {device.tag}
                </AppText>
              </View>
              {active ? (
                <Icon name="check-circle" size={20} color={colors.primary} />
              ) : (
                <Icon name="chevron-right" size={20} color={colors.textTertiary} />
              )}
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}
