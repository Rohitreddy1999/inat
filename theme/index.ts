export const colors = {
  abyss:    '#07090D',
  fathom:   '#0F141A',
  surge:    '#3DF5A6',
  glacial:  '#82D4FF',
  plasma:   '#FF4FD8',
  arcLight: '#EAFFF5',
  error:    '#E24B4A',

  textHi:    'rgba(255,255,255,0.95)',
  textArc:   '#EAFFF5',
  textMid:   'rgba(255,255,255,0.60)',
  textLow:   'rgba(255,255,255,0.35)',
  textFaint: 'rgba(255,255,255,0.18)',
  textGhost: 'rgba(255,255,255,0.04)',

  bgPage:  '#07090D',
  bgCard:  '#0F141A',
  bgRaise: '#10161D',
  bgInput: 'rgba(255,255,255,0.05)',
  bgNav:   'rgba(7,9,13,0.96)',
  bgScrim: 'rgba(7,9,13,0.80)',

  border:       'rgba(255,255,255,0.08)',
  borderSoft:   'rgba(255,255,255,0.06)',
  borderCard:   'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.12)',
  borderSurge:  'rgba(61,245,166,0.40)',

  surgeTint:   'rgba(61,245,166,0.12)',
  glacialTint: 'rgba(130,212,255,0.12)',
  plasmaTint:  'rgba(255,79,216,0.12)',
  selectedBg:  'rgba(61,245,166,0.06)',

  ctaBg:   '#3DF5A6',
  ctaText: '#07090D',

  phase: {
    foundation: '#82D4FF',
    build:      '#3DF5A6',
    commit:     '#FF4FD8',
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
    quote:   20,
    heading: 26,
    title:   34,
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
  regular:  'HankenGrotesk-Regular',
  medium:   'HankenGrotesk-Medium',
  semibold: 'HankenGrotesk-SemiBold',
  bold:     'HankenGrotesk-Bold',
  black:    'HankenGrotesk-Black',
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
    shadowColor: '#3DF5A6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  glowSurge: {
    shadowColor: '#3DF5A6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  glowGlacial: {
    shadowColor: '#82D4FF',
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
