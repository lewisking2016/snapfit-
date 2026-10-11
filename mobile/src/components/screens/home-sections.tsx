import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { colors, radius, spacing } from '@/theme';
import { AVATAR_URL } from '@/components/sheets/athlete-profile-sheet';

/**
 * Presentational sections for the Home tab — ported from the web prototype's
 * "Ecosystem Architecture" screen (src/components/screens/HomeScreen.tsx).
 * All copy, node structure and color roles are preserved 1:1.
 */

export type HomeRoute =
  | '/(tabs)/index'
  | '/(tabs)/routines'
  | '/(tabs)/progress'
  | '/(tabs)/recovery'
  | '/(tabs)/coach'
  | '/tracker'
  | '/devices';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD2xFVaBJrodohQxfyDqbQBwQ1PjuSP86LhurBmrmemiXQ_k5Rb_tjcD3jnfpdD0YXQden9cUAvqtM65Zw9abiH5d1TqIcrhJXjSDUudTmNFuH55Aa9teYk6K8FX3dxGCOmbvzT3KMJJ0P3Tm6Myhyj2ydf-UAEFupRYz7-ufgEAKqKWSj40fMoUL9A3coPFnOp1bnRlO1bnRLek3YDt8nPoHZXUwgg38uuZmckiph2FbaoSrB_G4LA';

const BANNER_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4YV8ulk8j8hN5RGQth9-Vynaqu-yhgPaOwLEE6L-zph43IrSkX2Y1O4YWkrao9MaF_TifCZAcSU-TuLv9clLab4x9Drz5Z7CbeaxopRS01WX3llvcj192wvZKZZCVIqsY-_O5MGyWDJlduwk2eguoJhUL5AtfIVMVCeRPRaa_zepuxdt1YOGOKtUZigNnEIpGIek1YA64JO2B4aVfNQKT6M9cDR2ecS2lfaDkFbZe1ITF4BPVNwrA1Q';

/** Group heading: colored dot + bold title + right-aligned overline caption. */
function GroupHeader({
  dotColor,
  title,
  caption,
}: {
  dotColor: string;
  title: string;
  caption: string;
}) {
  return (
    <View style={styles.groupHeader}>
      <View style={styles.groupHeaderLeft}>
        <View style={[styles.groupDot, { backgroundColor: dotColor }]} />
        <AppText variant="heading">{title}</AppText>
      </View>
      <AppText variant="overline" tone="muted">
        {caption}
      </AppText>
    </View>
  );
}

/** Top app bar — mobile counterpart of the web Header (logo, title, bell, avatar). */
export function HomeHeader({
  onOpenNotifications,
  onOpenProfile,
}: {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} accessibilityLabel="SnapFit logo" />
        <View style={styles.brandText}>
          <AppText variant="overline" tone="muted">
            Athletic Telemetry
          </AppText>
          <AppText variant="heading">Home</AppText>
        </View>
      </View>
      <View style={styles.headerActions}>
        <Pressable
          onPress={onOpenNotifications}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          hitSlop={8}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
          <Icon name="notifications" size={22} color={colors.textSecondary} />
          <View style={styles.unreadDot} />
        </Pressable>
        <Pressable
          onPress={onOpenProfile}
          accessibilityRole="button"
          accessibilityLabel="Athlete Profile"
          hitSlop={8}
          style={({ pressed }) => [styles.avatarBtn, pressed && styles.pressed]}>
          <Image
            source={{ uri: AVATAR_URL }}
            style={styles.avatar}
            accessibilityLabel="Profile photo"
          />
        </Pressable>
      </View>
    </View>
  );
}

const DOCK_NODES: { icon: string; label: string; route: HomeRoute; active?: boolean }[] = [
  { icon: 'grid-view', label: 'Home', route: '/(tabs)/index', active: true },
  { icon: 'play-circle', label: 'Tracker', route: '/tracker' },
  { icon: 'fitness-center', label: 'Routines', route: '/(tabs)/routines' },
  { icon: 'monitoring', label: 'Progress', route: '/(tabs)/progress' },
];

/** System Topology card — Tier 01 dock grid + Tier 02 deep bridges. */
export function TopologyCard({ onNavigate }: { onNavigate: (route: HomeRoute) => void }) {
  return (
    <Card style={styles.block}>
      <View style={styles.blockHead}>
        <View style={styles.blockIcon}>
          <Icon name="schema" size={18} color={colors.primary} />
        </View>
        <AppText variant="bodyMedium">System Topology</AppText>
        <View style={styles.tierBadge}>
          <AppText variant="caption" tone="secondary-accent">
            DUAL TIER
          </AppText>
        </View>
      </View>

      <View style={styles.topologyPanel}>
        <View style={styles.tierRow}>
          <AppText variant="overline" tone="secondary">
            Tier 01: Global Bottom Dock (Persistent)
          </AppText>
          <AppText variant="caption" tone="primary">
            4 Anchors
          </AppText>
        </View>

        <View style={styles.dockGrid}>
          {DOCK_NODES.map((node) => (
            <Pressable
              key={node.label}
              onPress={() => onNavigate(node.route)}
              accessibilityRole="button"
              accessibilityLabel={node.label}
              style={({ pressed }) => [
                styles.dockNode,
                node.active && styles.dockNodeActive,
                pressed && styles.pressed,
              ]}>
              <Icon
                name={node.icon}
                size={16}
                color={node.active ? colors.primary : colors.text}
              />
              <AppText
                variant="caption"
                tone={node.active ? 'primary' : 'default'}
                center
                numberOfLines={1}>
                {node.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        {/* Connecting telemetry pipes */}
        <View style={styles.pipeRow}>
          {[colors.primary, colors.secondary].map((color) => (
            <View key={color} style={styles.pipeGroup}>
              <View style={[styles.pipeBar, { backgroundColor: color }]} />
              <Icon name="arrow-downward" size={12} color={color} />
            </View>
          ))}
        </View>

        <AppText variant="overline" tone="secondary">
          Tier 02: Contextual Drawers &amp; Deep Bridges
        </AppText>

        <View style={styles.bridgeGrid}>
          <View style={styles.bridgeCard}>
            <AppText variant="caption" tone="primary">
              Via Dashboard
            </AppText>
            <Pressable
              onPress={() => onNavigate('/devices')}
              accessibilityRole="button"
              accessibilityLabel="Oraimo & Samsung Health"
              style={({ pressed }) => [styles.bridgeRow, pressed && styles.pressed]}>
              <Icon name="watch" size={14} color={colors.text} />
              <AppText variant="caption" tone="default" style={styles.bridgeText}>
                Oraimo &amp; Samsung Health
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => onNavigate('/(tabs)/recovery')}
              accessibilityRole="button"
              accessibilityLabel="Recovery & Sleep Lock"
              style={({ pressed }) => [styles.bridgeRow, pressed && styles.pressed]}>
              <Icon name="bedtime" size={14} color={colors.text} />
              <AppText variant="caption" tone="default" style={styles.bridgeText}>
                Recovery &amp; Sleep Lock
              </AppText>
            </Pressable>
          </View>

          <View style={styles.bridgeCard}>
            <AppText variant="caption" tone="secondary-accent">
              Via Live Session
            </AppText>
            <Pressable
              onPress={() => onNavigate('/(tabs)/coach')}
              accessibilityRole="button"
              accessibilityLabel="Marcus Spotify Coach"
              style={({ pressed }) => [styles.bridgeRow, pressed && styles.pressed]}>
              <Icon name="graphic-eq" size={14} color={colors.text} />
              <AppText variant="caption" tone="default" style={styles.bridgeText}>
                Marcus Spotify Coach
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => onNavigate('/tracker')}
              accessibilityRole="button"
              accessibilityLabel="Sub-Second HR Stream"
              style={({ pressed }) => [styles.bridgeRow, pressed && styles.pressed]}>
              {/* Web uses material-symbols `ecg_heart`; closest MaterialIcons glyph. */}
              <Icon name="monitor-heart" size={14} color={colors.text} />
              <AppText variant="caption" tone="default" style={styles.bridgeText}>
                Sub-Second HR Stream
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  );
}

type NodeAction = {
  label: string;
  onPress: () => void;
};

type ExecutionNodeData = {
  n: string;
  icon: string;
  title: string;
  sub: string;
  badge: string;
  badgeTone: 'volt' | 'cyan' | 'muted';
  description: string;
  outletLabel: string;
  actions: NodeAction[];
  chevronRoute: HomeRoute;
  iconColor: string;
};

/** Core Execution stack — SCREEN 01–04 node cards. */
export function ExecutionNodes({
  onNavigate,
  onStartSession,
}: {
  onNavigate: (route: HomeRoute) => void;
  onStartSession: () => void;
}) {
  const badgeToneColor = {
    volt: colors.primary,
    cyan: colors.secondary,
    muted: colors.textTertiary,
  };

  const NODES: ExecutionNodeData[] = [
    {
      n: '01',
      icon: 'grid-view',
      title: "Today's Dashboard",
      sub: 'Command Center & Quick-Launch',
      badge: 'Primary Tab',
      badgeTone: 'volt',
      description:
        'Unified glanceable rings for daily burn, fast-entry tiles for single dumbbell, jump rope cadence, and outdoor jogging telemetry.',
      outletLabel: 'Key Outlets:',
      actions: [
        { label: '1-Tap Live Session', onPress: onStartSession },
        { label: 'Catalog Browser', onPress: () => onNavigate('/(tabs)/routines') },
      ],
      chevronRoute: '/(tabs)/routines',
      iconColor: colors.primary,
    },
    {
      n: '02',
      icon: 'play-circle',
      title: 'Live Tracker',
      sub: 'In-Workout Telemetry Engine',
      badge: 'Real-Time Core',
      badgeTone: 'cyan',
      description:
        'Sub-second reps tracker, haptic rest countdown timer, current load telemetry, and live Bluetooth heart-rate pulse streams from watch.',
      outletLabel: 'Feeds:',
      actions: [
        { label: 'Marcus Spotify Ducking', onPress: () => onNavigate('/(tabs)/coach') },
        { label: 'Watch BLE Pulse', onPress: () => onNavigate('/devices') },
      ],
      chevronRoute: '/tracker',
      iconColor: colors.secondary,
    },
    {
      n: '03',
      icon: 'fitness-center',
      title: 'Workout Routines',
      sub: 'Curated Catalog & Custom Splits',
      badge: 'Primary Tab',
      badgeTone: 'muted',
      description:
        'Specialized protocols for minimal gear: Single-Dumbbell Complexes, Jump Rope Cadence Intervals, Tactical Calisthenics, and Zone 2 Walks.',
      outletLabel: 'Action:',
      actions: [
        { label: 'Load & Launch into Live Tracker', onPress: () => onNavigate('/(tabs)/routines') },
      ],
      chevronRoute: '/(tabs)/routines',
      iconColor: colors.text,
    },
    {
      n: '04',
      icon: 'monitoring',
      title: 'Progress & Logs',
      sub: 'Tonnage, PR Benchmarks & Volume',
      badge: 'Primary Tab',
      badgeTone: 'muted',
      description:
        'Macro analytics, 7-day movement arcs, load delta vs previous cycle, and personal record recognition metrics.',
      outletLabel: 'Sync:',
      actions: [{ label: 'Aggregates all Live Sessions', onPress: () => onNavigate('/(tabs)/progress') }],
      chevronRoute: '/(tabs)/progress',
      iconColor: colors.text,
    },
  ];

  return (
    <View style={styles.group}>
      <GroupHeader dotColor={colors.primary} title="Core Execution" caption="Primary Shell Elements" />
      <View style={styles.groupGap}>
        {NODES.map((node) => (
          <Card key={node.n} style={styles.nodeCard}>
            <View style={styles.nodeHead}>
              <View style={[styles.nodeIcon, { backgroundColor: colors.primaryContainer }]}>
                <Icon name={node.icon} size={22} color={node.iconColor} />
              </View>
              <View style={styles.nodeHeadText}>
                <View style={styles.nodeTitleRow}>
                  <View style={styles.screenChip}>
                    <AppText variant="caption" tone="muted">
                      SCREEN {node.n}
                    </AppText>
                  </View>
                  <AppText variant="heading" numberOfLines={1}>
                    {node.title}
                  </AppText>
                </View>
                <AppText variant="caption" tone="secondary" numberOfLines={1}>
                  {node.sub}
                </AppText>
              </View>
              <View style={[styles.statusPill, { backgroundColor: colors.primaryContainer }]}>
                <AppText variant="caption" style={{ color: badgeToneColor[node.badgeTone] }}>
                  {node.badge}
                </AppText>
              </View>
            </View>

            <AppText variant="caption" tone="secondary">
              {node.description}
            </AppText>

            <View style={styles.outletRow}>
              <AppText variant="caption" tone="muted">
                {node.outletLabel}
              </AppText>
              <View style={styles.outletActions}>
                {node.actions.map((action) => (
                  <Pressable
                    key={action.label}
                    onPress={action.onPress}
                    accessibilityRole="button"
                    accessibilityLabel={action.label}
                    style={({ pressed }) => [styles.outletBtn, pressed && styles.pressed]}>
                    <AppText variant="caption" tone="default" numberOfLines={1}>
                      {action.label}
                    </AppText>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={() => onNavigate(node.chevronRoute)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${node.title}`}
                hitSlop={8}
                style={({ pressed }) => [styles.chevronBtn, pressed && styles.pressed]}>
                <Icon name="chevron-right" size={16} color={colors.text} />
              </Pressable>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

/** Sensors & Context Hubs — banner asset + SCREEN 05–07 node cards. */
export function HubNodes({ onNavigate }: { onNavigate: (route: HomeRoute) => void }) {
  const NODES = [
    {
      n: '05',
      icon: 'nights-stay',
      title: 'Recovery & Sleep',
      sub: 'Sleep Architecture & Screen Lockout',
      badge: 'Hub Module',
      description:
        'Stage breakdown (Deep, REM, Light), readiness index calculations, and automated nighttime screen-time intervention to enforce rest.',
      feed: 'Feeds Readiness score into Screen 01 Home prior to morning training',
      route: '/(tabs)/recovery' as HomeRoute,
    },
    {
      n: '06',
      icon: 'headphones',
      title: 'Audio & Spotify Companion',
      sub: 'Coach Marcus & BPM Pace Lock',
      badge: 'Hub Module',
      description:
        'Adaptive pacing soundtrack locked to 140-160 BPM, automatic Spotify volume ducking during Marcus vocal coaching cues & split alerts.',
      feed: 'Directly coupled to Screen 02 Live Tracker active timer states',
      route: '/(tabs)/coach' as HomeRoute,
    },
    {
      n: '07',
      // Web uses material-symbols `devices_wearables`; closest MaterialIcons glyph.
      icon: 'devices',
      title: 'Connected Devices & Health',
      sub: 'Oraimo Watch 4 Pro & Samsung Health',
      badge: 'Hardware Bridge',
      description:
        'Low-latency BLE telemetry pipeline, bidirectional Samsung Health sync for calorie burn, active minutes, and continuous watch battery status.',
      feed: 'Feeds hardware diagnostics to Screen 01 and biometric telemetry to Screen 02',
      route: '/devices' as HomeRoute,
    },
  ];

  return (
    <View style={styles.group}>
      <GroupHeader
        dotColor={colors.secondary}
        title="Sensors & Context Hubs"
        caption="Dedicated Modular Sub-Screens"
      />

      {/* Visual banner asset */}
      <View style={styles.banner}>
        <Image
          source={{ uri: BANNER_URL }}
          style={styles.bannerImage}
          accessibilityLabel="Hardware Interlock BLE Pipeline"
        />
        <View style={styles.bannerScrim} />
        <View style={styles.bannerBody}>
          <AppText variant="overline" tone="secondary-accent">
            Hardware Interlock
          </AppText>
          <AppText variant="bodyMedium">
            BLE Sensor Pipeline &amp; Audio Telemetry
          </AppText>
        </View>
        <View style={styles.bannerIcon}>
          <Icon name="hub" size={20} color={colors.primary} />
        </View>
      </View>

      <View style={styles.groupGap}>
        {NODES.map((node) => (
          <Card key={node.n} style={styles.nodeCard}>
            <View style={styles.nodeHead}>
              <View style={[styles.nodeIcon, { backgroundColor: colors.primaryContainer }]}>
                <Icon name={node.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.nodeHeadText}>
                <View style={styles.nodeTitleRow}>
                  <View style={styles.screenChip}>
                    <AppText variant="caption" tone="muted">
                      SCREEN {node.n}
                    </AppText>
                  </View>
                  <AppText variant="heading" numberOfLines={1}>
                    {node.title}
                  </AppText>
                </View>
                <AppText variant="caption" tone="secondary" numberOfLines={1}>
                  {node.sub}
                </AppText>
              </View>
              <View style={[styles.statusPill, { backgroundColor: colors.cardRaised }]}>
                <AppText variant="caption" tone="muted">
                  {node.badge}
                </AppText>
              </View>
            </View>

            <AppText variant="caption" tone="secondary">
              {node.description}
            </AppText>

            <View style={styles.feedRow}>
              <Icon name="arrow-forward" size={14} color={colors.primary} />
              <AppText variant="caption" tone="muted" style={styles.feedText}>
                {node.feed}
              </AppText>
            </View>

            <Pressable
              onPress={() => onNavigate(node.route)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${node.title}`}
              style={({ pressed }) => [styles.feedCta, pressed && styles.pressed]}>
              <AppText variant="caption" tone="primary">
                Open Module
              </AppText>
              <Icon name="chevron-right" size={14} color={colors.primary} />
            </Pressable>
          </Card>
        ))}
      </View>
    </View>
  );
}

const PHASES = [
  {
    n: '01',
    title: 'Morning / Pre-Workout',
    phase: 'Phase 1',
    color: colors.primary,
    parts: [
      { text: 'User checks Recovery Score (' },
      { text: 'Screen 05', bold: true },
      { text: ') → Verifies Oraimo Watch BLE link (' },
      { text: 'Screen 07', bold: true },
      { text: ') → Selects Single-Dumbbell session from Routines (' },
      { text: 'Screen 03', bold: true },
      { text: ').' },
    ],
  },
  {
    n: '02',
    title: 'During Workout Session',
    phase: 'Phase 2',
    color: colors.secondary,
    parts: [
      { text: 'Executes reps in Live Tracker (' },
      { text: 'Screen 02', bold: true },
      { text: ') → Listens to Trainer Marcus audio cues & 140 BPM cadence (' },
      { text: 'Screen 06', bold: true },
      { text: ') → Heart rate streams direct from Oraimo sensor.' },
    ],
  },
  {
    n: '03',
    title: 'Post-Workout & Night Lockout',
    phase: 'Phase 3',
    color: colors.textTertiary,
    parts: [
      { text: 'Session volume commits to Progress Records (' },
      { text: 'Screen 04', bold: true },
      { text: ') & syncs with Samsung Health (' },
      { text: 'Screen 07', bold: true },
      { text: ') → Night bedtime screen lockout activates (' },
      { text: 'Screen 05', bold: true },
      { text: ').' },
    ],
  },
];

/** Daily Flow Pathways — 3-phase timeline card. */
export function FlowPathways() {
  return (
    <View style={styles.group}>
      <Card style={styles.block}>
        <View style={styles.blockHead}>
          <Icon name="timeline" size={18} color={colors.primary} />
          <AppText variant="bodyMedium">Daily Flow Pathways</AppText>
          <View style={styles.tierBadge}>
            <AppText variant="caption" tone="muted">
              3 Phases
            </AppText>
          </View>
        </View>

        {PHASES.map((phase, i) => (
          <View key={phase.n}>
            <View style={styles.phaseRow}>
              <View style={styles.phaseRail}>
                <View style={[styles.phaseCircle, { backgroundColor: phase.color }]}>
                  <AppText variant="caption" tone="inverse">
                    {phase.n}
                  </AppText>
                </View>
                {i < PHASES.length - 1 ? <View style={styles.phaseConnector} /> : null}
              </View>
              <View style={styles.phaseBody}>
                <View style={styles.phaseTitleRow}>
                  <AppText variant="bodyMedium">{phase.title}</AppText>
                  <AppText variant="caption" tone="primary">
                    {phase.phase}
                  </AppText>
                </View>
                <AppText variant="caption" tone="secondary">
                  {phase.parts.map((part, j) => (
                    <AppText
                      key={j}
                      variant="caption"
                      tone={part.bold ? 'default' : 'secondary'}
                      style={part.bold && styles.phaseBold}>
                      {part.text}
                    </AppText>
                  ))}
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}

const QUICK_JUMPS: { icon: string; label: string; sub: string; route: HomeRoute; wide?: boolean }[] = [
  { icon: 'grid-view', label: '01. Dashboard', sub: 'Command Home', route: '/(tabs)/index' },
  { icon: 'play-circle', label: '02. Live Tracker', sub: 'Reps & Telemetry', route: '/tracker' },
  { icon: 'fitness-center', label: '03. Routines', sub: 'Catalog Splits', route: '/(tabs)/routines' },
  { icon: 'monitoring', label: '04. Progress', sub: 'Volume & PRs', route: '/(tabs)/progress' },
  { icon: 'nights-stay', label: '05. Sleep & Lock', sub: 'Recovery Hub', route: '/(tabs)/recovery' },
  { icon: 'headphones', label: '06. Marcus Audio', sub: 'Spotify Companion', route: '/(tabs)/coach' },
  {
    icon: 'devices',
    label: '07. Connected Devices & Health Bridge',
    sub: 'Oraimo Watch 4 Pro BLE • Samsung Health 2-Way Pipeline',
    route: '/devices',
    wide: true,
  },
];

/** Quick Jump Index — interactive navigation grid. */
export function QuickJumpGrid({ onNavigate }: { onNavigate: (route: HomeRoute) => void }) {
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <View style={styles.groupHeaderLeft}>
          <AppText variant="overline" tone="muted">
            Quick Jump Index
          </AppText>
        </View>
        <AppText variant="caption" tone="primary">
          Interactive Nodes
        </AppText>
      </View>

      <View style={styles.jumpGrid}>
        {QUICK_JUMPS.map((jump) => (
          <Pressable
            key={jump.label}
            onPress={() => onNavigate(jump.route)}
            accessibilityRole="button"
            accessibilityLabel={jump.label}
            style={({ pressed }) => [
              styles.jumpCard,
              jump.wide && styles.jumpCardWide,
              pressed && styles.pressed,
            ]}>
            <View style={styles.jumpLeft}>
              <Icon
                name={jump.icon}
                size={18}
                color={jump.route === '/devices' ? colors.primary : colors.textSecondary}
              />
              <View style={styles.jumpText}>
                <AppText variant="label" numberOfLines={1}>
                  {jump.label}
                </AppText>
                <AppText variant="caption" tone="muted" numberOfLines={1}>
                  {jump.sub}
                </AppText>
              </View>
            </View>
            <Icon name="arrow-forward" size={16} color={colors.textTertiary} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.cardRaised,
  },
  brandText: {
    gap: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
  group: {
    gap: spacing.md,
  },
  groupGap: {
    gap: spacing.md,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  groupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  block: {
    gap: spacing.md,
  },
  blockHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  blockIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  tierBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.cardRaised,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  topologyPanel: {
    gap: spacing.md,
    backgroundColor: '#0b0e11',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.md,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dockGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dockNode: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.cardRaised,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dockNodeActive: {
    backgroundColor: colors.chip,
    borderColor: colors.textTertiary,
  },
  pipeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
  },
  pipeGroup: {
    alignItems: 'center',
    gap: 2,
  },
  pipeBar: {
    width: 2,
    height: 12,
    opacity: 0.4,
  },
  bridgeGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bridgeCard: {
    flex: 1,
    gap: 4,
    backgroundColor: colors.cardRaised,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.sm,
  },
  bridgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  bridgeText: {
    flex: 1,
  },
  nodeCard: {
    gap: spacing.sm,
  },
  nodeHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  nodeIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeHeadText: {
    flex: 1,
    gap: 2,
  },
  nodeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  screenChip: {
    backgroundColor: colors.chip,
    borderRadius: radius.sm / 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  outletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  outletActions: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  outletBtn: {
    backgroundColor: colors.cardRaised,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardRaised,
  },
  banner: {
    height: 128,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.card,
  },
  bannerImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  bannerScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17,20,23,0.55)',
  },
  bannerBody: {
    padding: spacing.md,
    gap: 2,
    backgroundColor: 'rgba(11,14,17,0.65)',
  },
  bannerIcon: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,14,17,0.6)',
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  feedText: {
    flex: 1,
  },
  feedCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  phaseRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  phaseRail: {
    alignItems: 'center',
  },
  phaseCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.line,
    marginVertical: 2,
  },
  phaseBody: {
    flex: 1,
    gap: 2,
    paddingBottom: spacing.md,
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  phaseBold: {
    color: colors.text,
    fontWeight: '600',
  },
  jumpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  jumpCard: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.cardRaised,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  jumpCardWide: {
    width: '100%',
  },
  jumpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  jumpText: {
    flex: 1,
    gap: 1,
  },
});
