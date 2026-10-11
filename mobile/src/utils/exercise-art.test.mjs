import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveExerciseArtKey } from './exercise-art.ts';

test('maps common strength work to the matching exercise art key', () => {
  assert.equal(resolveExerciseArtKey('Hang Snatch'), 'hang-snatch');
  assert.equal(resolveExerciseArtKey('single-arm floor press'), 'single-arm-floor-press');
});

test('falls back to a category-level key for unknown movements', () => {
  assert.equal(resolveExerciseArtKey('mystery movement'), 'strength');
  assert.equal(resolveExerciseArtKey('box jumps'), 'cardio');
});
