import {
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import {
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { KinnSplash } from '@/components/brand';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const kinnTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.bg,
    card: colors.cardRaised,
    text: colors.text,
    border: colors.line,
    notification: colors.primary,
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Sora_600SemiBold,
    Sora_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
  });
  const [showBrandSplash, setShowBrandSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  const onSplashFinished = useCallback(() => {
    setShowBrandSplash(false);
  }, []);

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={kinnTheme}>
      <StatusBar style="light" />
      <View style={styles.root}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}>
          {/* Onboarding - show only if not completed */}
          <Stack.Screen 
            name="onboarding" 
            options={{ 
              animation: 'fade',
              gestureEnabled: false,
            }} 
          />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="tracker"
            options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="devices" />
          <Stack.Screen name="coach" />
          <Stack.Screen name="recovery" />
          <Stack.Screen 
            name="settings" 
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
        {showBrandSplash ? <KinnSplash onFinished={onSplashFinished} /> : null}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
