import type { ImageSourcePropType } from 'react-native';

const CATEGORY_ALIASES: Record<string, string> = {
  strength: 'strength',
  'single dumbbell': 'strength',
  'single dumbbell only': 'strength',
  bodyweight: 'bodyweight',
  'bodyweight calisthenics': 'bodyweight',
  cardio: 'cardio',
  'jump rope': 'cardio',
  'jump rope hiit': 'cardio',
  mobility: 'bodyweight',
  hybrid: 'cardio',
};

const EXERCISE_ALIASES: Record<string, string> = {
  'hang snatch': 'hang-snatch',
  snatch: 'hang-snatch',
  'single-arm floor press': 'single-arm-floor-press',
  'single arm floor press': 'single-arm-floor-press',
  'floor press': 'single-arm-floor-press',
  'offset stance bent row': 'bent-row',
  'bent row': 'bent-row',
  row: 'bent-row',
  windmill: 'kettlebell-windmill',
  'kettlebell windmill': 'kettlebell-windmill',
  'suitcase carry': 'farmers-walk',
  'suitcase carry hold': 'farmers-walk',
  'farmers walk': 'farmers-walk',
  carry: 'farmers-walk',
  'speed rope boxer skip': 'rope-jumping',
  'rope jumping': 'rope-jumping',
  'jump rope': 'rope-jumping',
  jump: 'cardio',
  jumps: 'cardio',
  'box jump': 'cardio',
  'box jumps': 'cardio',
  'single db thruster': 'rope-jumping',
  'tempo deficit push-up': 'pushups',
  'tempo deficit push ups': 'pushups',
  'push-up': 'pushups',
  'push up': 'pushups',
  'pushups': 'pushups',
  'plank': 'plank',
  'hollow body rocker': 'plank',
  'hollow body rockers': 'plank',
  'high knee skip': 'rope-jumping',
};

export function normalizeMovementName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function resolveExerciseArtKey(value: string, category?: string): string {
  const normalized = normalizeMovementName(value || '');
  if (!normalized) {
    return category ? resolveCategoryArtKey(category) : 'strength';
  }

  const directMatch = EXERCISE_ALIASES[normalized];
  if (directMatch) return directMatch;

  for (const [alias, key] of Object.entries(EXERCISE_ALIASES)) {
    if (normalized.includes(alias) || alias.includes(normalized)) {
      return key;
    }
  }

  return category ? resolveCategoryArtKey(category) : 'strength';
}

export function resolveCategoryArtKey(category?: string): string {
  const normalized = normalizeMovementName(category || '');
  return CATEGORY_ALIASES[normalized] || 'strength';
}

const exerciseArtMap: Partial<Record<string, ImageSourcePropType>> = {};

function getExerciseArtMap(): Record<string, ImageSourcePropType> {
  if (Object.keys(exerciseArtMap).length === 0) {
    exerciseArtMap['hang-snatch'] = require('../../assets/exercise-art/hang-snatch.jpg');
    exerciseArtMap['single-arm-floor-press'] = require('../../assets/exercise-art/single-arm-floor-press.jpg');
    exerciseArtMap['bent-row'] = require('../../assets/exercise-art/bent-row.jpg');
    exerciseArtMap['kettlebell-windmill'] = require('../../assets/exercise-art/kettlebell-windmill.jpg');
    exerciseArtMap['farmers-walk'] = require('../../assets/exercise-art/farmers-walk.jpg');
    exerciseArtMap['rope-jumping'] = require('../../assets/exercise-art/rope-jumping.jpg');
    exerciseArtMap.pushups = require('../../assets/exercise-art/pushups.jpg');
    exerciseArtMap.plank = require('../../assets/exercise-art/plank.jpg');
    exerciseArtMap.strength = require('../../assets/exercise-art/strength-fallback.jpg');
    exerciseArtMap.bodyweight = require('../../assets/exercise-art/bodyweight-fallback.jpg');
    exerciseArtMap.cardio = require('../../assets/exercise-art/cardio-fallback.jpg');
  }

  return exerciseArtMap as Record<string, ImageSourcePropType>;
}

export function resolveExerciseArt(
  movement: string,
  category?: string,
): ImageSourcePropType {
  const map = getExerciseArtMap();
  return map[resolveExerciseArtKey(movement, category)] || map.strength;
}
