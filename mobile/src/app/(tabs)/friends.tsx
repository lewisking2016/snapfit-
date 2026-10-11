import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { type CommunityCircle } from '@/utils/community';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ActivityVisibility, BlockedPeople, CommunityFeed } from '@/components/screens/community-feed';
import { colors, radius, spacing, type } from '@/theme';
import { normalizeUsername } from '@/utils/friend-actions';
import { useCommunityStore } from '@/store/community-store';

type Friend = {
  id: string;
  name: string;
  lastMove: string;
  nudge: string;
};

const MOCK_FRIENDS: Friend[] = [
  { id: 'amina', name: 'Amina', lastMove: '8.2k steps · today', nudge: 'Ahead on steps' },
  { id: 'lewis', name: 'Lewis', lastMove: 'Upper body · yesterday', nudge: 'Rest day?' },
  { id: 'kamau', name: 'Kamau', lastMove: '5 km run · today', nudge: 'New PR pace' },
];

/**
 * Friends tab — Phase 1 skeleton (mock data).
 * UGC report/block ships in Phase 2 before public social.
 */
export default function FriendsScreen() {
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const blockedUserIds = useCommunityStore((state) => state.blockedUserIds);
  const circleAssignments = useCommunityStore((state) => state.circleAssignments);
  const setFriendCircle = useCommunityStore((state) => state.setFriendCircle);
  const visibleFriends = MOCK_FRIENDS.filter((friend) => !blockedUserIds.includes(friend.id));

  const sendFriendRequest = () => {
    const handle = normalizeUsername(username);
    if (!handle) {
      setFeedback({ text: 'Enter a username with 3 to 30 letters, numbers, dots, or underscores.', isError: true });
      return;
    }
    if (MOCK_FRIENDS.some((friend) => friend.id === handle)) {
      setFeedback({ text: `@${handle} is already in your circle.`, isError: true });
      return;
    }
    if (pendingRequests.some((friend) => friend.id === handle)) {
      setFeedback({ text: `A request to @${handle} is already pending.`, isError: true });
      return;
    }

    setPendingRequests((requests) => [
      ...requests,
      { id: handle, name: `@${handle}`, lastMove: 'Waiting for a reply', nudge: 'Pending' },
    ]);
    setUsername('');
    setFeedback({ text: `Request sent to @${handle}.`, isError: false });
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <AppText variant="heading1">Friends</AppText>
        <AppText variant="body" tone="secondary" style={styles.sub}>
          Train with people you actually know.
        </AppText>

        <Button
          label={addFriendOpen ? 'Cancel' : 'Add friend'}
          icon={addFriendOpen ? 'close-outline' : 'person-add-outline'}
          variant={addFriendOpen ? 'secondary' : 'primary'}
          full
          style={styles.cta}
          onPress={() => {
            setAddFriendOpen((open) => !open);
            setFeedback(null);
          }}
        />

        {addFriendOpen ? (
          <View style={styles.addForm}>
            <AppText variant="label" tone="muted">USERNAME</AppText>
            <TextInput
              accessibilityLabel="Friend username"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(value) => {
                setUsername(value);
                setFeedback(null);
              }}
              onSubmitEditing={sendFriendRequest}
              placeholder="@username"
              placeholderTextColor={colors.textTertiary}
              returnKeyType="send"
              style={styles.usernameInput}
              value={username}
            />
            <Button label="Send request" icon="paper-plane-outline" full onPress={sendFriendRequest} />
            {feedback ? (
              <AppText
                variant="caption"
                style={feedback.isError ? styles.errorText : styles.feedbackText}>
                {feedback.text}
              </AppText>
            ) : null}
          </View>
        ) : null}

        <CommunityFeed />

        <AppText variant="label" tone="muted" style={styles.sectionLabel}>
          Your circle
        </AppText>

        {visibleFriends.map((friend) => (
          <FriendRow
            key={friend.id}
            friend={friend}
            circle={circleAssignments[friend.id] ?? 'gym'}
            onCircleChange={(circle) => setFriendCircle(friend.id, circle)}
          />
        ))}

        {pendingRequests.length ? (
          <>
            <AppText variant="label" tone="muted" style={styles.pendingLabel}>
              Requests sent
            </AppText>
            {pendingRequests.map((friend) => (
              <FriendRow
                key={friend.id}
                friend={friend}
                circle={circleAssignments[friend.id] ?? 'family'}
                onCircleChange={(circle) => setFriendCircle(friend.id, circle)}
              />
            ))}
          </>
        ) : null}

        <ActivityVisibility friends={visibleFriends} />
        <BlockedPeople people={MOCK_FRIENDS} />
      </ScrollView>
    </Screen>
  );
}

function FriendRow({
  friend,
  circle,
  onCircleChange,
}: {
  friend: Friend;
  circle: CommunityCircle;
  onCircleChange: (circle: CommunityCircle) => void;
}) {
  const circleOptions: CommunityCircle[] = ['gym', 'family', 'office'];

  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.friendMain, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${friend.name}, ${friend.lastMove}`}>
        <View style={styles.avatar}>
          <AppText variant="title" tone="inverse">
            {friend.name.startsWith('@') ? friend.name.slice(1, 2).toUpperCase() : friend.name.slice(0, 1)}
          </AppText>
        </View>
        <View style={styles.meta}>
          <AppText variant="title">{friend.name}</AppText>
          <AppText variant="bodySmall" tone="secondary">
            {friend.lastMove}
          </AppText>
        </View>
        <AppText variant="caption" tone="primary" style={styles.nudge}>
          {friend.nudge}
        </AppText>
      </Pressable>
      <View style={styles.circleSelector}>
        {circleOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => onCircleChange(option)}
            accessibilityRole="button"
            accessibilityLabel={`Move ${friend.name} to ${option}`}
            style={[styles.circleChip, circle === option && styles.circleChipSelected]}>
            <AppText variant="caption" style={circle === option ? styles.circleChipTextSelected : styles.circleChipText}>
              {option}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
    gap: spacing.sm,
  },
  sub: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  cta: {
    marginBottom: spacing.xxl,
  },
  addForm: {
    backgroundColor: colors.cardRaised,
    borderRadius: radius.lg,
    gap: spacing.md,
    marginBottom: spacing.xxl,
    padding: spacing.lg,
  },
  usernameInput: {
    ...type.body,
    backgroundColor: colors.bg,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  feedbackText: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.danger,
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  pendingLabel: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  row: {
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  friendMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.88,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  nudge: {
    maxWidth: 88,
    textAlign: 'right',
  },
  circleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  circleChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.cardRaised,
  },
  circleChipSelected: {
    backgroundColor: colors.primary,
  },
  circleChipText: {
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  circleChipTextSelected: {
    color: colors.textInverse,
    textTransform: 'capitalize',
  },
});
