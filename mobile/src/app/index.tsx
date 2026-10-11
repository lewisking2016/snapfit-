import { useEffect } from 'react';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useShallow } from 'zustand/react/shallow';

/**
 * Root index - redirects to onboarding if not seen, otherwise to tabs.
 * This is the entry point for the app.
 */
export default function RootIndex() {
  const { hasSeenOnboarding } = useOnboardingStore(
    useShallow((state) => ({
      hasSeenOnboarding: state.hasSeenOnboarding,
    }))
  );

  useEffect(() => {
    // Small delay to ensure store is hydrated
    const timer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [hasSeenOnboarding]);

  return null;
}