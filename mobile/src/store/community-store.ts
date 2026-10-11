import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { assignFriendToCircle, removeCommunityId, type CommunityCircle } from '@/utils/community';

export type ReportReason = 'harassment' | 'spam' | 'unsafe' | 'other';

type CommunityReport = {
  targetId: string;
  targetType: 'post' | 'user';
  reason: ReportReason;
  createdAt: number;
};

type CommunityState = {
  blockedUserIds: string[];
  reportedPostIds: string[];
  likedPostIds: string[];
  reports: CommunityReport[];
  communityGuidelinesAccepted: boolean;
  circleAssignments: Record<string, CommunityCircle>;
  activityVisibility: Record<string, boolean>;
  toggleReaction: (postId: string) => void;
  acceptCommunityGuidelines: () => void;
  setFriendCircle: (friendId: string, circle: CommunityCircle) => void;
  reportPost: (postId: string, reason: ReportReason) => void;
  reportUser: (userId: string, reason: ReportReason) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  setActivityVisibility: (friendId: string, visible: boolean) => void;
};

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      blockedUserIds: [],
      reportedPostIds: [],
      likedPostIds: [],
      reports: [],
      communityGuidelinesAccepted: false,
      circleAssignments: {},
      activityVisibility: {},

      toggleReaction: (postId) =>
        set((state) => ({
          likedPostIds: state.likedPostIds.includes(postId)
            ? state.likedPostIds.filter((id) => id !== postId)
            : [...state.likedPostIds, postId],
        })),

      acceptCommunityGuidelines: () =>
        set(() => ({
          communityGuidelinesAccepted: true,
        })),

      setFriendCircle: (friendId, circle) =>
        set((state) => ({
          circleAssignments: assignFriendToCircle(state.circleAssignments, friendId, circle),
        })),

      reportPost: (postId, reason) =>
        set((state) => ({
          reportedPostIds: state.reportedPostIds.includes(postId)
            ? state.reportedPostIds
            : [...state.reportedPostIds, postId],
          reports: [...state.reports, { targetId: postId, targetType: 'post', reason, createdAt: Date.now() }],
        })),

      reportUser: (userId, reason) =>
        set((state) => ({
          reports: [...state.reports, { targetId: userId, targetType: 'user', reason, createdAt: Date.now() }],
        })),

      blockUser: (userId) =>
        set((state) => ({
          blockedUserIds: state.blockedUserIds.includes(userId)
            ? state.blockedUserIds
            : [...state.blockedUserIds, userId],
        })),

      unblockUser: (userId) =>
        set((state) => ({ blockedUserIds: removeCommunityId(state.blockedUserIds, userId) })),

      setActivityVisibility: (friendId, visible) =>
        set((state) => ({
          activityVisibility: { ...state.activityVisibility, [friendId]: visible },
        })),
    }),
    {
      name: 'kinn-community-preview',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);