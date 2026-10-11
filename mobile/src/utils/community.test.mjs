import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assignFriendToCircle,
  buildModerationQueueSummary,
  filterVisibleCommunityItems,
  removeCommunityId,
  summarizeCircleAssignments,
  summarizeStoryViewers,
} from './community.ts';

const items = [
  { id: 'post-1', authorId: 'amina', circle: 'gym' },
  { id: 'post-2', authorId: 'lewis', circle: 'family' },
  { id: 'post-3', authorId: 'kamau', circle: 'gym' },
];

test('hides blocked authors and reported items from the visible feed', () => {
  const visible = filterVisibleCommunityItems(items, 'all', ['amina'], ['post-2']);

  assert.deepEqual(visible.map((item) => item.id), ['post-3']);
});

test('filters visible items by the selected circle', () => {
  const visible = filterVisibleCommunityItems(items, 'gym', [], []);

  assert.deepEqual(visible.map((item) => item.id), ['post-1', 'post-3']);
});

test('unblocks one user without changing other block entries', () => {
  assert.deepEqual(removeCommunityId(['amina', 'lewis'], 'amina'), ['lewis']);
  assert.deepEqual(removeCommunityId(['lewis'], 'amina'), ['lewis']);
});

test('summarizes moderation queue entries by reason and total', () => {
  const summary = buildModerationQueueSummary([
    { targetId: 'post-1', targetType: 'post', reason: 'harassment', createdAt: 1 },
    { targetId: 'user-2', targetType: 'user', reason: 'spam', createdAt: 2 },
    { targetId: 'post-3', targetType: 'post', reason: 'unsafe', createdAt: 3 },
  ]);

  assert.deepEqual(summary.total, 3);
  assert.deepEqual(summary.byReason, {
    harassment: 1,
    spam: 1,
    unsafe: 1,
  });
});

test('assigns and summarizes friend circles', () => {
  const assignments = {
    amina: 'gym',
    lewis: 'family',
  };

  assert.deepEqual(assignFriendToCircle(assignments, 'kamau', 'office'), {
    amina: 'gym',
    lewis: 'family',
    kamau: 'office',
  });

  assert.deepEqual(summarizeCircleAssignments(assignments), {
    gym: 1,
    family: 1,
    office: 0,
  });
});

test('summarizes story viewers and expires values', () => {
  const summary = summarizeStoryViewers([
    { id: 'u1', name: 'Amina' },
    { id: 'u2', name: 'Lewis' },
    { id: 'u3', name: 'Kamau' },
  ]);

  assert.deepEqual(summary.total, 3);
  assert.deepEqual(summary.recent, ['Amina', 'Lewis', 'Kamau']);
});