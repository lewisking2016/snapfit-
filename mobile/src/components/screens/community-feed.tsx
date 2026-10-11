import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Host, Switch } from '@expo/ui';

import { AppText } from '@/components/ui/text';
import { colors, radius, spacing, type } from '@/theme';
import { useCommunityStore, type ReportReason } from '@/store/community-store';
import {
  buildModerationQueueSummary,
  filterVisibleCommunityItems,
  summarizeStoryViewers,
  type CommunityCircleFilter,
} from '@/utils/community';

type Post = {
  id: string;
  authorId: string;
  author: string;
  circle: 'gym' | 'family' | 'office';
  circleLabel: string;
  time: string;
  activity: string;
  caption: string;
  reactions: number;
};

const CIRCLES: { id: CommunityCircleFilter; label: string }[] = [
  { id: 'all', label: 'Everyone' },
  { id: 'gym', label: 'Gym' },
  { id: 'family', label: 'Family' },
  { id: 'office', label: 'Office' },
];

const STORIES = [
  {
    id: 'amina',
    name: 'Amina',
    detail: 'Upper push · 2h',
    viewers: [
      { id: 'leo', name: 'Leo' },
      { id: 'maya', name: 'Maya' },
      { id: 'nora', name: 'Nora' },
      { id: 'sam', name: 'Sam' },
    ],
  },
  {
    id: 'lewis',
    name: 'Lewis',
    detail: 'Recovery · 4h',
    viewers: [
      { id: 'rhea', name: 'Rhea' },
      { id: 'isla', name: 'Isla' },
    ],
  },
  {
    id: 'kamau',
    name: 'Kamau',
    detail: '5 km run · 5h',
    viewers: [
      { id: 'zuri', name: 'Zuri' },
      { id: 'drew', name: 'Drew' },
      { id: 'nina', name: 'Nina' },
      { id: 'tariq', name: 'Tariq' },
    ],
  },
];

const POSTS: Post[] = [
  {
    id: 'post-amina-1',
    authorId: 'amina',
    author: 'Amina',
    circle: 'gym',
    circleLabel: 'Gym crew',
    time: '18 min ago',
    activity: 'UPPER PUSH · 42 MIN',
    caption: 'Kept the last set controlled. Small wins add up.',
    reactions: 4,
  },
  {
    id: 'post-lewis-1',
    authorId: 'lewis',
    author: 'Lewis',
    circle: 'family',
    circleLabel: 'Family',
    time: '1 hr ago',
    activity: 'ACTIVE RECOVERY · 28 MIN',
    caption: 'Easy pace today. Ready for the next one.',
    reactions: 2,
  },
  {
    id: 'post-kamau-1',
    authorId: 'kamau',
    author: 'Kamau',
    circle: 'office',
    circleLabel: 'Office miles',
    time: '3 hrs ago',
    activity: 'RUN · 5.0 KM',
    caption: 'New route before work. That hill is no joke.',
    reactions: 7,
  },
];

const REPORT_REASONS: { label: string; value: ReportReason }[] = [
  { label: 'Harassment or bullying', value: 'harassment' },
  { label: 'Spam or misleading', value: 'spam' },
  { label: 'Unsafe behavior', value: 'unsafe' },
  { label: 'Something else', value: 'other' },
];

export function CommunityFeed() {
  const router = useRouter();
  const [selectedCircle, setSelectedCircle] = useState<CommunityCircleFilter>('all');
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<{ post: Post; type: 'post' | 'user' } | null>(null);
  const blockedUserIds = useCommunityStore((state) => state.blockedUserIds);
  const reportedPostIds = useCommunityStore((state) => state.reportedPostIds);
  const likedPostIds = useCommunityStore((state) => state.likedPostIds);
  const reports = useCommunityStore((state) => state.reports);
  const communityGuidelinesAccepted = useCommunityStore((state) => state.communityGuidelinesAccepted);
  const toggleReaction = useCommunityStore((state) => state.toggleReaction);
  const acceptCommunityGuidelines = useCommunityStore((state) => state.acceptCommunityGuidelines);
  const reportPost = useCommunityStore((state) => state.reportPost);
  const reportUser = useCommunityStore((state) => state.reportUser);
  const blockUser = useCommunityStore((state) => state.blockUser);
  const moderationSummary = buildModerationQueueSummary(reports);
  const visiblePosts = filterVisibleCommunityItems(
    POSTS,
    selectedCircle,
    blockedUserIds,
    reportedPostIds,
  );
  const visibleStories = STORIES.filter((story) => !blockedUserIds.includes(story.id));

  const requireGuidelines = (nextAction: () => void) => {
    if (!communityGuidelinesAccepted) {
      Alert.alert(
        'Review community guidelines',
        'Accept the community guidelines before posting or reacting to moments.',
        [
          { text: 'Review', onPress: () => router.push('/community-guidelines') },
          { text: 'Accept and continue', onPress: () => { acceptCommunityGuidelines(); nextAction(); } },
        ],
      );
      return;
    }

    nextAction();
  };

  const confirmBlock = (post: Post) => {
    Alert.alert(`Block ${post.author}?`, 'Their posts and stories will disappear from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Block', style: 'destructive', onPress: () => blockUser(post.authorId) },
    ]);
  };

  const submitReport = (reason: ReportReason) => {
    if (!reportTarget) return;
    if (reportTarget.type === 'post') {
      reportPost(reportTarget.post.id, reason);
    } else {
      reportUser(reportTarget.post.authorId, reason);
    }
    setReportTarget(null);
    setOpenActionsFor(null);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <View>
          <AppText variant="label" tone="muted">YOUR PEOPLE</AppText>
          <AppText variant="heading">Moments</AppText>
        </View>
        <AppText variant="caption" tone="muted">24H</AppText>
      </View>

      {!communityGuidelinesAccepted ? (
        <View style={styles.guidelineGate}>
          <View style={styles.gateContent}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <View style={styles.gateTextWrap}>
              <AppText variant="bodySmall">Community guidelines need your approval before you react or share.</AppText>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/community-guidelines')}
            accessibilityRole="button"
            style={styles.guidelineButton}>
            <AppText variant="caption" tone="primary">Review guidelines</AppText>
          </Pressable>
        </View>
      ) : null}

      {visibleStories.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyList}>
          {visibleStories.map((story) => {
            const storySummary = summarizeStoryViewers(story.viewers);
            return (
              <Pressable
                key={story.id}
                onPress={() => requireGuidelines(() => Alert.alert(
                  story.name,
                  `${story.detail}\n\nViewed by ${storySummary.recent.join(', ')}${storySummary.total > storySummary.recent.length ? ` +${storySummary.total - storySummary.recent.length} more` : ''}\nExpires in 24 hours`,
                ))}
                accessibilityRole="button"
                accessibilityLabel={`${story.name}, ${story.detail}, ${storySummary.total} viewers`}
                style={styles.story}>
                <View style={styles.storyRing}>
                  <View style={styles.storyAvatar}>
                    <AppText variant="title" tone="primary">{story.name[0]}</AppText>
                  </View>
                </View>
                <AppText variant="caption" numberOfLines={1}>{story.name}</AppText>
                <AppText variant="caption" tone="muted" numberOfLines={1}>{story.detail}</AppText>
                <AppText variant="caption" tone="muted">{storySummary.total} viewers</AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <AppText variant="bodySmall" tone="secondary">No moments from your circle yet.</AppText>
      )}

      <View style={styles.moderationSummary}>
        <AppText variant="label" tone="muted">MODERATION</AppText>
        <View style={styles.moderationSummaryRow}>
          <AppText variant="heading">{moderationSummary.total} queue</AppText>
          <AppText variant="caption" tone="secondary">Top risks: {Object.keys(moderationSummary.byReason).length ? Object.entries(moderationSummary.byReason).sort((a, b) => b[1] - a[1])[0][0] : 'none'}</AppText>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.circleList}>
        {CIRCLES.map((circle) => {
          const selected = selectedCircle === circle.id;
          return (
            <Pressable
              key={circle.id}
              onPress={() => setSelectedCircle(circle.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.circleChip, selected && styles.circleChipSelected]}>
              <AppText variant="caption" style={selected ? styles.circleLabelSelected : styles.circleLabel}>
                {circle.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.feedHeading}>
        <AppText variant="heading">Activity</AppText>
        <AppText variant="caption" tone="muted">FRIENDS ONLY</AppText>
      </View>

      {visiblePosts.length ? visiblePosts.map((post) => {
        const reacted = likedPostIds.includes(post.id);
        return (
          <View key={post.id} style={styles.post}>
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <AppText variant="title" tone="primary">{post.author[0]}</AppText>
              </View>
              <View style={styles.postMeta}>
                <AppText variant="bodyMedium">{post.author}</AppText>
                <AppText variant="caption" tone="muted">{post.circleLabel} · {post.time}</AppText>
              </View>
              <Pressable
                onPress={() => {
                  setOpenActionsFor((id) => id === post.id ? null : post.id);
                  setReportTarget(null);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Actions for ${post.author}'s post`}
                hitSlop={8}
                style={styles.moreButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
            {openActionsFor === post.id ? (
              <View style={styles.actionPanel}>
                {reportTarget?.post.id === post.id ? (
                  <>
                    <AppText variant="caption" tone="secondary">Choose a report reason</AppText>
                    {REPORT_REASONS.map((reason) => (
                      <Pressable
                        key={reason.value}
                        onPress={() => submitReport(reason.value)}
                        accessibilityRole="button"
                        style={styles.actionOption}>
                        <AppText variant="bodySmall">{reason.label}</AppText>
                      </Pressable>
                    ))}
                    <Pressable
                      onPress={() => setReportTarget(null)}
                      accessibilityRole="button"
                      style={styles.actionOption}>
                      <AppText variant="bodySmall" tone="muted">Cancel</AppText>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      onPress={() => setReportTarget({ post, type: 'post' })}
                      accessibilityRole="button"
                      style={styles.actionOption}>
                      <AppText variant="bodySmall">Report post</AppText>
                    </Pressable>
                    <Pressable
                      onPress={() => setReportTarget({ post, type: 'user' })}
                      accessibilityRole="button"
                      style={styles.actionOption}>
                      <AppText variant="bodySmall">Report user</AppText>
                    </Pressable>
                    <Pressable
                      onPress={() => confirmBlock(post)}
                      accessibilityRole="button"
                      style={styles.actionOption}>
                      <AppText variant="bodySmall" style={styles.destructiveText}>Block user</AppText>
                    </Pressable>
                  </>
                )}
              </View>
            ) : null}
            <View style={styles.activityLine}>
              <Ionicons name="barbell-outline" size={15} color={colors.primary} />
              <AppText variant="label" tone="primary">{post.activity}</AppText>
            </View>
            <AppText variant="body" style={styles.caption}>{post.caption}</AppText>
            <View style={styles.postFooter}>
              <Pressable
                onPress={() => requireGuidelines(() => toggleReaction(post.id))}
                accessibilityRole="button"
                accessibilityLabel={reacted ? 'Remove support reaction' : 'Send support reaction'}
                accessibilityState={{ selected: reacted }}
                style={styles.reactionButton}>
                <Ionicons name={reacted ? 'heart' : 'heart-outline'} size={18} color={reacted ? colors.danger : colors.textSecondary} />
                <AppText variant="caption" tone={reacted ? 'default' : 'secondary'}>
                  {post.reactions + (reacted ? 1 : 0)}
                </AppText>
              </Pressable>
              <AppText variant="caption" tone="muted">Keep it supportive</AppText>
            </View>
          </View>
        );
      }) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={25} color={colors.primary} />
          <AppText variant="bodyMedium" center>No activity in this circle yet.</AppText>
          <AppText variant="caption" tone="secondary" center>Invite someone you know to get your circle moving.</AppText>
        </View>
      )}
    </View>
  );
}

export function ActivityVisibility({ friends }: { friends: { id: string; name: string }[] }) {
  const visibility = useCommunityStore((state) => state.activityVisibility);
  const setActivityVisibility = useCommunityStore((state) => state.setActivityVisibility);

  return (
    <View style={styles.visibilitySection}>
      <View style={styles.sectionHeading}>
        <View>
          <AppText variant="label" tone="muted">PRIVACY</AppText>
          <AppText variant="heading">Activity visibility</AppText>
        </View>
      </View>
      {friends.map((friend) => (
        <View key={friend.id} style={styles.visibilityRow}>
          <View style={styles.avatarSmall}>
            <AppText variant="caption" tone="primary">{friend.name[0]}</AppText>
          </View>
          <Host matchContents style={styles.visibilityHost}>
            <Switch
              label={`Share activity with ${friend.name}`}
              value={visibility[friend.id] ?? true}
              onValueChange={(value) => setActivityVisibility(friend.id, value)}
              testID={`activity-visibility-${friend.id}`}
            />
          </Host>
        </View>
      ))}
      <AppText variant="caption" tone="muted">Preview only. These settings are stored on this device.</AppText>
    </View>
  );
}

export function BlockedPeople({ people }: { people: { id: string; name: string }[] }) {
  const blockedUserIds = useCommunityStore((state) => state.blockedUserIds);
  const unblockUser = useCommunityStore((state) => state.unblockUser);
  const blockedPeople = people.filter((person) => blockedUserIds.includes(person.id));

  if (!blockedPeople.length) return null;

  return (
    <View style={styles.visibilitySection}>
      <View>
        <AppText variant="label" tone="muted">PRIVACY</AppText>
        <AppText variant="heading">Blocked people</AppText>
      </View>
      {blockedPeople.map((person) => (
        <View key={person.id} style={styles.visibilityRow}>
          <View style={styles.avatarSmall}>
            <AppText variant="caption" tone="primary">{person.name[0]}</AppText>
          </View>
          <AppText variant="bodySmall" style={styles.visibilityName}>{person.name}</AppText>
          <Pressable
            onPress={() => unblockUser(person.id)}
            accessibilityRole="button"
            accessibilityLabel={`Unblock ${person.name}`}
            style={styles.unblockButton}>
            <AppText variant="caption" tone="primary">Unblock</AppText>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  storyList: { gap: spacing.md, paddingVertical: spacing.xs },
  story: { width: 84, alignItems: 'center', gap: 2 },
  storyRing: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: colors.primary, padding: 3, marginBottom: spacing.xs },
  storyAvatar: { flex: 1, borderRadius: 28, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  guidelineGate: { backgroundColor: colors.cardRaised, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  gateContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  gateTextWrap: { flex: 1 },
  guidelineButton: { alignSelf: 'flex-start', paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.primaryContainer },
  moderationSummary: { backgroundColor: colors.cardRaised, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
  moderationSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.sm },
  circleList: { gap: spacing.sm, paddingVertical: spacing.xs },
  circleChip: { minHeight: 40, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.cardRaised, alignItems: 'center', justifyContent: 'center' },
  circleChipSelected: { backgroundColor: colors.primary },
  circleLabel: { color: colors.textSecondary },
  circleLabelSelected: { ...type.caption, color: colors.textInverse },
  feedHeading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.sm },
  post: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  postMeta: { flex: 1, gap: 2 },
  moreButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  actionPanel: { backgroundColor: colors.cardRaised, borderRadius: radius.md, padding: spacing.sm, gap: spacing.xs },
  actionOption: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm },
  destructiveText: { color: colors.danger },
  activityLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  caption: { lineHeight: 23 },
  postFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reactionButton: { minWidth: 48, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  emptyState: { alignItems: 'center', backgroundColor: colors.cardRaised, borderRadius: radius.md, gap: spacing.sm, padding: spacing.xl },
  visibilitySection: { gap: spacing.md, marginTop: spacing.xxl, paddingTop: spacing.xl, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  visibilityRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  avatarSmall: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  visibilityName: { flex: 1 },
  visibilityHost: { flex: 1 },
  unblockButton: { minWidth: 72, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});