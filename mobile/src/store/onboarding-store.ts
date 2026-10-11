import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  hasConnectedHealth: boolean;
  hasAddedFriend: boolean;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  
  // Actions
  setHasSeenOnboarding: () => void;
  setHasConnectedHealth: (connected: boolean) => void;
  setHasAddedFriend: (added: boolean) => void;
  acceptTerms: () => void;
  acceptPrivacy: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      hasConnectedHealth: false,
      hasAddedFriend: false,
      acceptedTerms: false,
      acceptedPrivacy: false,

      setHasSeenOnboarding: () => set({ hasSeenOnboarding: true }),
      
      setHasConnectedHealth: (connected: boolean) => 
        set({ hasConnectedHealth: connected }),
      
      setHasAddedFriend: (added: boolean) => 
        set({ hasAddedFriend: added }),
      
      acceptTerms: () => set({ acceptedTerms: true }),
      
      acceptPrivacy: () => set({ acceptedPrivacy: true }),
      
      completeOnboarding: () => set({ 
        hasSeenOnboarding: true,
        acceptedTerms: true,
        acceptedPrivacy: true,
      }),
      
      resetOnboarding: () => set({
        hasSeenOnboarding: false,
        hasConnectedHealth: false,
        hasAddedFriend: false,
        acceptedTerms: false,
        acceptedPrivacy: false,
      }),
    }),
    {
      name: 'kinn-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);