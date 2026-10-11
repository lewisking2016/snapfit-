import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeUsername } from './friend-actions.ts';

test('normalizes a username with an optional at sign', () => {
  assert.equal(normalizeUsername('  @Amina_22  '), 'amina_22');
});

test('rejects usernames outside the supported format', () => {
  assert.equal(normalizeUsername('ab'), null);
  assert.equal(normalizeUsername('amina khan'), null);
});