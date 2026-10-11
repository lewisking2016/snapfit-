export type CommunityCircle = 'gym' | 'family' | 'office';
export type CommunityCircleFilter = 'all' | CommunityCircle;
export type CircleAssignments = Record<string, CommunityCircle>;

export type CommunityItem = {
  id: string;
  authorId: string;
  circle: CommunityCircle;
};

export type StoryViewer = {
  id: string;
  name: string;
};

export type CommunityModerationReason = 'harassment' | 'spam' | 'unsafe' | 'other';

export type CommunityModerationQueueEntry = {
  targetId: string;
  targetType: 'post' | 'user';
  reason: CommunityModerationReason;
  createdAt: number;
};

export function removeCommunityId(ids: readonly string[], targetId: string): string[] {
  return ids.filter((id) => id !== targetId);
}

export function buildModerationQueueSummary(entries: readonly CommunityModerationQueueEntry[]) {
  const byReason = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.reason] = (acc[entry.reason] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: entries.length,
    byReason,
  };
}

export function assignFriendToCircle(
  assignments: CircleAssignments,
  friendId: string,
  circle: CommunityCircle,
): CircleAssignments {
  return {
    ...assignments,
    [friendId]: circle,
  };
}

export function summarizeCircleAssignments(assignments: CircleAssignments) {
  const summary: Record<CommunityCircle, number> = {
    gym: 0,
    family: 0,
    office: 0,
  };

  Object.values(assignments).forEach((circle) => {
    summary[circle] += 1;
  });

  return summary;
}

export function summarizeStoryViewers(viewers: readonly StoryViewer[]) {
  return {
    total: viewers.length,
    recent: viewers.slice(0, 3).map((viewer) => viewer.name),
  };
}

export function filterVisibleCommunityItems<T extends CommunityItem>(
  items: readonly T[],
  selectedCircle: CommunityCircleFilter,
  blockedUserIds: readonly string[],
  reportedItemIds: readonly string[],
): T[] {
  return items.filter(
    (item) =>
      !blockedUserIds.includes(item.authorId) &&
      !reportedItemIds.includes(item.id) &&
      (selectedCircle === 'all' || item.circle === selectedCircle),
  );
}