import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme';

/**
 * Kinn Phase 1 tabs: Home · Friends · Move · Progress
 * Live workout tracker stays a fullScreenModal outside this group.
 */
export default function TabsLayout() {
  if (Platform.OS === 'web') {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarPosition: 'bottom',
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: 68,
            paddingTop: 8,
            paddingBottom: 8,
            elevation: 0,
            shadowColor: 'transparent',
          },
          tabBarLabelStyle: { fontFamily: 'DMSans_500Medium', fontSize: 11 },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: 'Friends',
            tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="move"
          options={{
            title: 'Move',
            tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, size }) => <Ionicons name="trending-up-outline" color={color} size={size} />,
          }}
        />
      </Tabs>
    );
  }

  return (
    <NativeTabs
      labelStyle={{ color: colors.textSecondary }}
      iconColor={{ default: colors.textTertiary, selected: colors.primary }}
      backgroundColor="transparent"
      tintColor={colors.primary}
      indicatorColor={colors.chip}
      minimizeBehavior="onScrollDown"
      backBehavior="initialRoute">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="friends">
        <NativeTabs.Trigger.Label>Friends</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.2.fill" md="group" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="move">
        <NativeTabs.Trigger.Label>Move</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="figure.strengthtraining.traditional"
          md="fitness_center"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.line.uptrend.xyaxis" md="trending_up" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
