import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Pressable,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { AppText } from '@/components/ui/text';
import { colors, spacing } from '@/theme';
import { useOnboardingStore } from '@/store/onboarding-store';
import { TermsAcceptanceSheet } from '@/components/sheets/terms-acceptance-sheet';
import { HealthPermissionSheet } from '@/components/sheets/health-permission-sheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const SLIDES: OnboardingSlide[] = [
  {
    id: 'welcome',
    title: 'Welcome to Kinn',
    description: 'Move together. Track your progress, challenge friends, and achieve your fitness goals.',
    icon: 'fitness-outline',
  },
  {
    id: 'health',
    title: 'Connect Your Health Data',
    description: 'Sync steps, workouts, and activity from Apple Health or Google Fit for accurate tracking.',
    icon: 'heart-outline',
  },
  {
    id: 'friends',
    title: 'Train With Friends',
    description: 'Add friends to see their activity, send nudges, and compete in challenges.',
    icon: 'people-outline',
  },
];

const gradientColors = [colors.bg, colors.card, colors.cardRaised];
const VIEW_CONFIG = { viewAreaCoveragePercentThreshold: 50 };

function SlideItem({ item }: { item: OnboardingSlide }) {
  return (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={64} color={colors.primary} />
      </View>
      <AppText variant="heading1" center style={styles.title}>
        {item.title}
      </AppText>
      <AppText variant="body" tone="secondary" center style={styles.description}>
        {item.description}
      </AppText>
    </View>
  );
}

function renderSlide({ item }: { item: OnboardingSlide }) {
  return <SlideItem item={item} />;
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTerms, setShowTerms] = useState(true);
  const [showHealth, setShowHealth] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding, setHasSeenOnboarding, setHasConnectedHealth } = useOnboardingStore();

  const viewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setShowHealth(true);
  };

  const handleHealthAllow = () => {
    setHasConnectedHealth(true);
    finishOnboarding();
  };

  const handleHealthSkip = () => {
    setHasConnectedHealth(false);
    finishOnboarding();
  };

  const handleTermsAccept = () => {
    setShowTerms(false);
  };

  const finishOnboarding = () => {
    setShowHealth(false);
    setHasSeenOnboarding();
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      {/* Background gradient effect using View */}
      <View style={[styles.gradientBg, { backgroundColor: gradientColors[currentIndex] }]} />

      {/* Skip button */}
      <Pressable onPress={handleSkip} style={styles.skipButton}>
        <AppText variant="bodySmall" tone="secondary">
          Skip
        </AppText>
      </Pressable>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={VIEW_CONFIG}
        bounces={false}
        style={styles.flatList}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <Button
          label={isLastSlide ? 'Get Started' : 'Next'}
          onPress={handleNext}
          full
        />
        {!isLastSlide && (
          <Pressable onPress={handleComplete} style={styles.secondaryLink}>
            <AppText variant="bodySmall" tone="secondary">
              Or continue without connecting
            </AppText>
          </Pressable>
        )}
      </View>

      {/* Terms Acceptance Sheet */}
      <TermsAcceptanceSheet
        visible={showTerms}
        onAccept={handleTermsAccept}
        onViewTerms={() => router.push('/terms')}
        onViewPrivacy={() => router.push('/privacy')}
      />

      {/* Health Permission Sheet */}
      <HealthPermissionSheet
        visible={showHealth}
        onClose={() => handleHealthSkip()}
        onAllow={handleHealthAllow}
        onSkip={handleHealthSkip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  gradientBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.5,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.huge + spacing.lg,
    right: spacing.xl,
    zIndex: 10,
    padding: spacing.sm,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.cardRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    marginBottom: spacing.md,
  },
  description: {
    textAlign: 'center',
    maxWidth: 280,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardRaised,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
    gap: spacing.md,
  },
  secondaryLink: {
    alignSelf: 'center',
    padding: spacing.sm,
  },
});