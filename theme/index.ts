export const colors = {
  // Base surfaces
  abyss:     '#07090D',
  fathom:    '#0F141A',
  fathomTop: '#141920',

  // Three phase accents
  iris:    '#8B5CF6',   // Foundation phase
  volt:    '#62EE10',   // Build phase + CTAs
  plasma:  '#FF4FD8',   // Commit phase
  arcLight: '#EAFFF5',  // near-white text

  // Text tiers
  textHi:    'rgba(255,255,255,0.95)',
  textArc:   '#EAFFF5',
  textMid:   'rgba(255,255,255,0.60)',
  textLow:   'rgba(255,255,255,0.35)',
  textFaint: 'rgba(255,255,255,0.04)',

  // Surfaces
  bgPage:  '#07090D',
  bgCard:  '#0F141A',
  bgRaise: '#141920',
  bgInput: 'rgba(255,255,255,0.05)',
  bgNav:   'rgba(7,9,13,0.96)',
  bgScrim: 'rgba(7,9,13,0.80)',

  // Borders
  border:       'rgba(255,255,255,0.08)',
  borderSoft:   'rgba(255,255,255,0.06)',
  borderCard:   'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.12)',
  borderInner:  'rgba(255,255,255,0.08)',

  // Iris (Foundation / selected states)
  borderIris: 'rgba(139,92,246,0.60)',
  irisTint:   'rgba(139,92,246,0.08)',
  irisGlow:   'rgba(139,92,246,0.20)',
  irisInner:  'rgba(139,92,246,0.20)',

  // Volt (Build / CTAs)
  borderVolt: 'rgba(98,238,16,0.60)',
  voltTint:   'rgba(98,238,16,0.08)',
  voltGlow:   'rgba(98,238,16,0.30)',

  // Plasma (Commit)
  borderPlasma: 'rgba(255,77,216,0.60)',
  plasmaTint:   'rgba(255,77,216,0.08)',
  plasmaGlow:   'rgba(255,77,216,0.20)',

  // Selected state (uses Iris)
  selectedBg: 'rgba(139,92,246,0.08)',

  // CTA (Volt)
  ctaBg:   '#62EE10',
  ctaText: '#07090D',

  // Error
  error: '#E24B4A',

  // Phase system
  phase: {
    foundation: '#8B5CF6',  // Iris — days 1-7
    build:      '#62EE10',  // Volt — days 8-14
    commit:     '#FF4FD8',  // Plasma — days 15-21
  },
} as const

export const typography = {
  font: 'HankenGrotesk',
  size: {
    badge:   9,
    label:   10,
    micro:   11,
    caption: 12,
    body:    13.5,
    step:    14.5,
    base:    15,
    button:  16,
    quote:    20,
    question: 30,
    heading:  26,
    title:    34,
    display: 52,
    ghost:   120,
  },
  weight: {
    regular:  '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
    black:    '900' as const,
  },
  tracking: {
    tight: -0.02,
    label:  0.10,
    wide:   0.28,
  },
  leading: {
    tight:   1.12,
    heading: 1.25,
    step:    1.50,
    body:    1.55,
  },
} as const

export const fontFamilies = {
  // Display / headings — Syne (onboarding + logo only)
  display:  'Syne-ExtraBold',
  heading:  'Syne-Bold',
  // Body — DM Sans
  regular:  'DMSans-Regular',
  medium:   'DMSans-Medium',
  semibold: 'DMSans-SemiBold',
  bold:     'DMSans-Bold',
  black:    'DMSans-Black',
} as const

export const spacing = {
  1:  4,   2:  8,   3: 12,  4: 16,
  5: 20,   6: 24,   8: 32,  10: 40,
  pagePad:    22,
  pageBottom: 100,
  navHeight:  72,
  touchMin:   44,
  stepRow:    14,
  inputPadV:  14,
  badgePadH:  8,
  badgePadV:  3,
  badgeSmH:   6,
  badgeSmV:   2,
  inputHint:  6,
} as const

export const radius = {
  sm:   10,
  md:   14,
  lg:   18,
  card: 20,
  xl:   24,
  pill: 28,
  full: 9999,
} as const

export const effects = {
  glowCta: {
    shadowColor: '#62EE10',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  glowIris: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  glowVolt: {
    shadowColor: '#62EE10',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  glowPlasma: {
    shadowColor: '#FF4FD8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
} as const

export const graduation = {
  openingQuoteDelay: 3600,
  openingActionDelay: 4000,
  openingFadeDuration: 480,
  handoffDuration: 560,
  sceneReadyTimeout: 8000,
  maxContentWidth: 620,
  handoffContentTopRatio: 0.38,
  handoffContentTopMin: 260,
  actionRowMinHeight: 68,
  fallbackFigureWidth: 156,
  fallbackFigureHeight: 248,
  fallbackJointSize: 10,
} as const

export function getPhaseColor(day: number): string {
  if (day <= 7)  return colors.phase.foundation
  if (day <= 14) return colors.phase.build
  return colors.phase.commit
}

export function getPhaseName(day: number): string {
  if (day <= 7)  return 'FOUNDATION'
  if (day <= 14) return 'BUILD'
  return 'COMMIT'
}
