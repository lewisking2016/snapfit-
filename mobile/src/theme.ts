/**
 * Kinn design tokens — Brand Guide §14–16.
 * Dark mode is the hero look.
 */

export const palette = {
  ink: '#0D1014',
  lime: '#C6F24E',
  graphite: '#1B2027',
  paper: '#F7F8F6',
  white: '#FFFFFF',
  slate: '#5F6873',
  mist: '#9AA3AD',
  line: '#E1E4E0',
  /** Slightly raised panels on ink */
  graphiteRaised: '#222831',
  /** Soft lime wash for containers */
  limeDim: '#2A3A0E',
  danger: '#FF5A5F',
  warning: '#FFB020',
  black: '#000000',
} as const;

export const colors = {
  bg: palette.ink,
  card: palette.graphite,
  cardRaised: palette.graphiteRaised,
  chip: palette.graphiteRaised,
  line: '#2A313A',
  lineSoft: '#232A30',
  lineLight: palette.line,

  primary: palette.lime,
  onPrimary: palette.ink,
  primaryContainer: palette.limeDim,
  onPrimaryContainer: palette.lime,

  secondary: palette.mist,
  secondaryContainer: '#2A313A',

  accent: palette.warning,
  danger: palette.danger,

  text: palette.paper,
  textSecondary: palette.mist,
  textTertiary: palette.slate,
  textMuted: palette.slate,
  textInverse: palette.ink,

  paper: palette.paper,
  white: palette.white,
} as const;

/** Badge accents — keep lime primary; secondary neutrals only. */
export const badgeColors = {
  lime: { bg: palette.limeDim, fg: palette.lime },
  gray: { bg: palette.graphiteRaised, fg: palette.mist },
  /** @deprecated alias for lime during SnapFit → Kinn migration */
  volt: { bg: palette.limeDim, fg: palette.lime },
  cyan: { bg: palette.graphiteRaised, fg: palette.mist },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  icon: 30,
  pill: 999,
} as const;

const fontSora = 'Sora_700Bold';
const fontSoraSemi = 'Sora_600SemiBold';
const fontDm = 'DMSans_400Regular';
const fontDmMed = 'DMSans_500Medium';

/** Type scale — Brand Guide §15 (mobile). */
export const type = {
  heroNumber: {
    fontFamily: fontSora,
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1,
    lineHeight: 52,
  },
  display: {
    fontFamily: fontSora,
    fontSize: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
    lineHeight: 42,
  },
  heading1: {
    fontFamily: fontSora,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  heading2: {
    fontFamily: fontSoraSemi,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  title: {
    fontFamily: fontSoraSemi,
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  /** Aliases used by existing SnapFit screens */
  heading: {
    fontFamily: fontSoraSemi,
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  body: {
    fontFamily: fontDm,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fontDmMed,
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: fontDm,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  button: {
    fontFamily: fontDmMed,
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontDm,
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  label: {
    fontFamily: fontDmMed,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 1.44,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  },
  overline: {
    fontFamily: fontDmMed,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 1.44,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  },
  metric: {
    fontFamily: fontSora,
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1,
    lineHeight: 52,
  },
  metricSm: {
    fontFamily: fontSora,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 34,
  },
} as const;

export const motion = {
  fast: 150,
  base: 200,
  soft: 250,
  splashTotal: 2700,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  float: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
} as const;
