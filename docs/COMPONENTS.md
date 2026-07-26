# INAT — Components Document
Version 1.0 | Written before first line of code
React Native + NativeWind + Reanimated
This document is locked. Every component is
listed here before it gets built. No new
components without updating this document first.

---

## CORE PRINCIPLE

Build once. Use everywhere.
If you are writing the same JSX twice,
it belongs here as a component.

Hierarchy:
  Primitives → Composed → Screens

Primitives are atoms.
Composed components are built from primitives.
Screens are built from composed components.
Screens live in app/. Everything else in components/.

---

## DESIGN TOKEN RULE

Every component imports from ONE place only:

  import { colors, typography, spacing, radius, effects }
  from '@/theme'

Never hardcode a hex value in a component.
Never hardcode a font size in a component.
If a value is not in theme/index.ts, add it there
first, then reference it here.

---

## THEME STRUCTURE (theme/index.ts)

```typescript
export const colors = {
  abyss:    '#07090D',
  fathom:   '#0F141A',
  iris:     '#8B5CF6',
  volt:     '#62EE10',
  plasma:   '#FF4FD8',
  arcLight: '#EAFFF5',
  error:    '#E24B4A',

  textHi:    'rgba(255,255,255,0.95)',
  textArc:   '#EAFFF5',
  textMid:   'rgba(255,255,255,0.60)',
  textLow:   'rgba(255,255,255,0.35)',
  textFaint: 'rgba(255,255,255,0.04)',

  bgPage:  '#07090D',
  bgCard:  '#0F141A',
  bgRaise: '#141920',
  bgInput: 'rgba(255,255,255,0.05)',
  bgNav:   'rgba(7,9,13,0.96)',
  bgScrim: 'rgba(7,9,13,0.80)',

  border:         'rgba(255,255,255,0.08)',
  borderSoft:     'rgba(255,255,255,0.06)',
  borderCard:     'rgba(255,255,255,0.06)',
  borderStrong:   'rgba(255,255,255,0.12)',
  borderIris:     'rgba(139,92,246,0.60)',

  irisTint:   'rgba(139,92,246,0.08)',
  voltTint:   'rgba(98,238,16,0.08)',
  plasmaTint: 'rgba(255,79,216,0.08)',
  selectedBg: 'rgba(139,92,246,0.08)',

  ctaBg:   '#62EE10',
  ctaText: '#07090D',

  phase: {
    foundation: '#8B5CF6',
    build:      '#62EE10',
    commit:     '#FF4FD8',
  },
} as const

export const typography = {
  font: 'DMSans',
  size: {
    label:   10,
    micro:   11,
    caption: 12,
    body:    13.5,
    step:    14.5,
    base:    15,
    quote:   20,
    heading: 26,
    title:   34,
    display: 52,
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
    body:    1.55,
  },
} as const

export const spacing = {
  1:  4,   2:  8,   3: 12,  4: 16,
  5: 20,   6: 24,   8: 32,  10: 40,
  pagePad:    22,
  pageBottom: 100,
  navHeight:  72,
  touchMin:   44,
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
  glowVolt: {
    shadowColor: '#62EE10',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  glowIris: {
    shadowColor: '#8B5CF6',
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

// Helpers
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
```

---

## ANIMATION CONSTANTS

All application animations use Reanimated and honor the system reduced-motion preference.
Never use React Native's Animated API.

```typescript
// Standard entrance: fade + rise
// Used on every screen and card list
const ENTRANCE = {
  duration: 400,
  from: { opacity: 0, translateY: 20 },
  to:   { opacity: 1, translateY: 0 },
  easing: Easing.out(Easing.cubic),
}

// Stagger delay between list items
const STAGGER_DELAY = 80 // ms per item

// Spring for selection and checkmarks
const SELECTION_SPRING = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
}

// Press feedback scale
const PRESS_SCALE = 0.97

// Screen transitions: handled by Expo Router
// Forward → slide left
// Back    → slide right
```

---

## COMPONENT CATALOG

---

## LEVEL 1 — PRIMITIVES (components/core/)

---

### Text — components/core/Text.tsx
All text in the app. Never use RN's Text directly.

Props:
  variant: 'display' | 'title' | 'heading' | 'quote'
         | 'base' | 'body' | 'step' | 'caption'
         | 'micro' | 'label'
  color?: string       default: colors.textHi
  align?: 'left' | 'center' | 'right'
  uppercase?: boolean
  style?: StyleProp<TextStyle>
  children: React.ReactNode

Variant specs:
  display  → 52px, weight 900, tracking -0.02
  title    → 34px, weight 700, tracking -0.02
  heading  → 26px, weight 700, tracking -0.02
  quote    → 20px, weight 500
  base     → 15px, weight 400
  body     → 13.5px, weight 400, leading 1.55
  step     → 14.5px, weight 500, leading 1.5
  caption  → 12px, weight 400
  micro    → 11px, weight 500, tracking 0.10
  label    → 10px, weight 500, tracking 0.10

---

### Button — components/core/Button.tsx
All tappable CTAs.

Props:
  variant: 'primary' | 'secondary' | 'completed'
  onPress: () => void
  disabled?: boolean     default: false
  loading?: boolean      default: false
  glow?: boolean         default: true (primary only)
  phaseColor?: string    used by completed variant
  fullWidth?: boolean    default: true
  children: React.ReactNode

Variant specs:
  primary:
    Height 56, radius pill (28), Surge fill, Abyss text
    Font 16px bold. Glow when active.
    disabled: 20% opacity, no press response

  secondary:
    Height 52, radius pill (28), transparent bg
    Border 1px borderStrong. textMid. Font 15px.
    disabled: 35% opacity

  completed:
    Height 58, radius lg (18), no fill
    Border 1px phaseColor at 40%
    phaseColor text + checkmark icon left
    Not pressable (cursor default)

States:
  pressed:  scale 0.97, SELECTION_SPRING back
  loading:  ActivityIndicator replaces text
  disabled: opacity only, no scale on press

Accessibility:
  accessibilityRole="button"
  accessibilityState={{ disabled, busy: loading }}

---

### Card — components/core/Card.tsx
All card surfaces. Fathom fill always.
No glassmorphism. No blur on cards.

Props:
  accent?: string        phase color for accent strip
  strip?: 'left' | 'top' default: 'left'
  padding?: number       default: 20
  radius?: number        default: radius.card (20)
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  children: React.ReactNode

States:
  default:      Fathom bg, 1px borderCard
  accent left:  3px colored left border
                + gradient inset glow overlay
  accent top:   3px color strip at top edge
  pressable:    scale 0.985 on press

---

### Input — components/core/Input.tsx
All text input fields.

Props:
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  multiline?: boolean    default: false
  maxLength?: number
  secureTextEntry?: boolean
  error?: string
  hint?: string
  style?: StyleProp<ViewStyle>

States:
  default:  bgInput fill, borderCard border
  focused:  borderStrong border, subtle Surge glow
  error:    error color border, error text below field
            + shake animation on submit

---

### Badge — components/core/Badge.tsx
Streak count, phase label, status indicators.

Props:
  variant: 'streak' | 'phase' | 'recommended' | 'comingSoon' | 'pro'
  color?: string    phase color
  children: React.ReactNode

Variant specs:
  streak:      45° rotated rounded square (diamond shape)
               phaseColor fill, white number, 9px bold
  phase:       pill, phaseColor text, phaseColor border, transparent bg
  recommended: "RECOMMENDED" pill, Surge bg, Abyss text, 10px bold
  comingSoon:  "COMING SOON" pill, borderSoft, textLow, 10px
  pro:         "PRO" pill, small, Plasma bg, Abyss text

---

### SkeletonCard — components/core/SkeletonCard.tsx
Loading placeholder.

Props:
  height?: number    default: 72
  radius?: number    default: radius.card

Animation:
  Shimmer: opacity 0.3 → 0.6 → 0.3
  withRepeat + withTiming, 1.2s, infinite loop

---

## LEVEL 2 — FORM COMPONENTS (components/forms/)

---

### OptionCard — components/forms/OptionCard.tsx
Every selectable option in onboarding questions.
Text only. No icons.

Props:
  label: string
  selected: boolean
  onPress: () => void
  disabled?: boolean    when max selections reached

States:
  default:
    Fathom bg, borderCard border (1px white 7%)
    textMid label, check circle invisible (scale 0)

  selected:
    selectedBg fill (Surge 6%)
    borderSurge border (Surge 40%)
    textHi label
    Surge check circle springs in (scale 0 → 1)
    Radial gradient overlay: Surge 6% from left,
    fades to transparent

  disabled (unselected, max reached):
    35% opacity, no press response

Animations:
  Selection:   border + bg color 180ms ease
  Checkmark:   SELECTION_SPRING, scale 0→1 + opacity
  Deselect:    reverse spring, slightly faster
  Max shake:   translateX 0→6→-6→4→-4→0, 300ms
               fires on attempted 3rd selection
               no state change on the tapped card

---

### StepDots — components/forms/StepDots.tsx
Onboarding progress indicator.

Props:
  total: number       number of steps
  current: number     1-indexed
  style?: StyleProp<ViewStyle>

Dot states:
  past:    5×5px, arcLight, radius 3
  current: 16×5px, arcLight, radius 3 (pill)
  future:  5×5px, white 15%, radius 3

Animations:
  Width: 300ms spring
    past→current: 5→16 (stretches to pill)
    current→past: 16→5 (shrinks back)
  Color: 300ms ease

---

## LEVEL 3 — TASK COMPONENTS (components/tasks/)

---

### StepCard — components/tasks/StepCard.tsx
Sequential guided step. One active at a time.

Props:
  step: StepItem        { instruction, videoUrl?, videoLabel? }
  stepIndex: number     0-indexed
  totalSteps: number
  phaseColor: string
  isActive: boolean
  onDone: () => void

States:
  active (isActive=true):
    Full opacity (1.0). Spring entrance: translateY 18→0 + opacity 0.4→1.
    Shows: "STEP X OF Y" muted label, instruction text, optional video link card,
    Done button (60% width / 44px / 22px radius / DM Sans medium / phaseColor bg).
    Video link: Fathom bg, phaseColor play icon, title + "Tap to open".

  pending (isActive=false):
    40% opacity. No Done button.

  done (managed by Day screen — card hidden; pill rendered instead):
    When re-read (expandedDoneStep = this index): isActive=true,
    onDone collapses back to pill.

Animations:
  Becoming active: withTiming opacity 0.4→1 (350ms) +
                   withSpring translateY 18→0 (stiffness 280, damping 26)
  Becoming pending: withTiming opacity 1→0.4 (200ms)

---

### HoldButton — components/tasks/HoldButton.tsx
The most important interaction in INAT.
Hold 1 second to complete the day.

Props:
  phaseColor: string
  onComplete: () => void
  disabled?: boolean     default: false — true until all steps done
  label?: string         default: 'Hold to Complete'
  holdingLabel?: string  default: 'Completing...'
  holdMs?: number        default: 1000

CRITICAL LAYOUT RULE:
HoldButton is ALWAYS inside a fixed-position View
anchored to the bottom of the screen.
It is NEVER inside a ScrollView.
This is enforced by the Day screen layout.

States:
  disabled (not all steps done):
    Fathom background, borderCard border, textLow label.
    pointerEvents none — no heartbeat, no interaction.

  idle (all steps done, not holding):
    phaseColor solid background, arcLight label (abyss on Volt).
    Heartbeat pulse: scale 1→1.012→1→1.008→1, 2.6s infinite loop.

  holding:
    Heartbeat stops.
    Inner glow: phaseColor 42%. Outer glow: phaseColor 30%.
    Progress bar fills from left (arcLight color) over holdMs (RAF-based).

  complete:
    Fires onComplete (shows CompletionMoment overlay in Day screen).
    Resets progress to 0, glow fades out.

Touch handling:
  onPressIn → start RAF fill
  onPressOut → cancel RAF, reset to 0
  finger leaves button → cancel + reset
  touchAction: none (prevents scroll conflicts)
  No ScrollView nesting — ever

---

## LEVEL 4 — NAVIGATION (components/navigation/)

---

### BottomNav — components/navigation/BottomNav.tsx
Fixed bottom tab bar. Always visible in main app.
Never visible on Day screen or Graduation.

Props:
  active: 'home' | 'ascent' | 'community' | 'profile'

Tabs:
  Home      | house icon    | /(tabs)/
  Ascent    | chart icon    | /(tabs)/ascent
  Community | group icon    | /(tabs)/community
  Profile   | person icon   | /(tabs)/profile

Active state:
  Icon + label: current phase color
  Inactive: white 35%

Layout:
  Height: 72px
  Background: bgNav (rgba 7,9,13,0.96)
  BlurView behind on iOS
  Position: absolute bottom 0, full width
  Includes bottom safe area inset

Animations:
  Tab switch: icon scale 0.85→1, SELECTION_SPRING

---

### BackButton — components/navigation/BackButton.tsx
Back navigation in onboarding and elsewhere.

Props:
  onPress: () => void
  style?: StyleProp<ViewStyle>

Appearance:
  Chevron-left icon, white 60%, 20px
  No background, no border
  Touch target: minimum 44×44 (padding applied)

---

## LEVEL 5 — SHARED (components/shared/)

---

### ScreenWrapper — components/shared/ScreenWrapper.tsx
Wraps every screen. Provides consistent base.

Props:
  children: React.ReactNode
  padded?: boolean       adds pagePad horizontal padding
  scrollable?: boolean   wraps in ScrollView
  style?: StyleProp<ViewStyle>

Always provides:
  Background: colors.abyss
  SafeAreaView (top + bottom insets)
  Entrance animation: fade 300ms on mount
  KeyboardAvoidingView when scrollable=true

---

### AnimatedWordmark — components/brand/AnimatedWordmark.tsx
First-launch brand sequence and reusable completed INAT wordmark.

Props:
  animated?: boolean
  onComplete?: () => void
  showDeclaration?: boolean

Sequence:
  1. Dotless lowercase i writes itself in Arc-Light.
  2. N, A, and T write themselves one at a time in Arc-Light.
  3. The single dot forms at the base of the i as a charged atomic orb.
  4. The orb travels beneath the wordmark left-to-right, climbs the right edge,
     returns across the top, and settles above the i while it ignites:
     N → Iris, A → Volt, T → Plasma.
  5. The same orb settles above the i; its rings and particles collapse.
  6. A fine separator draws beneath the wordmark and retains a subtle endpoint
     glow.
  7. `INITIATE · NURTURE · ADAPT · TRANSCEND` appears all at once and remains
     attached to the static Welcome lockup.

The orb is never duplicated. Before landing, the i has no dot. After landing,
the final circle is the orb itself in its quiet state.

Animation uses Reanimated and react-native-svg only. It adds no playback or
animation package. Reduced motion presents the completed colored wordmark and
declaration immediately, then calls onComplete without decorative delay.

---

### SectionLabel — components/shared/SectionLabel.tsx
Uppercase section labels. "WHAT TO DO" etc.

Props:
  children: string    pass in as uppercase
  style?: StyleProp<ViewStyle>

Appearance:
  11px, weight 600, tracking wide (0.28em)
  Color: textLow

---

### GhostNumber — components/shared/GhostNumber.tsx
Large background number behind question headings.

Props:
  number: number    1-5 for questions
  style?: StyleProp<ViewStyle>

Appearance:
  Zero-padded: "01", "02", "03"...
  120px, weight black (900)
  White 4% opacity
  Position: absolute, behind heading
  pointerEvents: none

Animation:
  Entrance: fade in 600ms + drift up 8→0px, 800ms
  Runs on screen mount

---

### DayCard — components/shared/DayCard.tsx
Card on Home screen showing today's day.

Props:
  dayNumber: number
  title: string
  phase: string
  subtractName: string
  durationMinutes: number
  phaseColor: string
  isCompleted: boolean
  onBegin: () => void

Appearance:
  Full-width Card component base
  Top row: phase label + streak badge
  Large day number (display size, 52px, 900)
  Day title (title size, 34px, 700)
  Subtrack + duration metadata (caption)
  Radial bloom behind day number (decorative)
  CTA: "Begin Day {N} →" OR completed Button state

---

### ReentryCard — components/shared/ReentryCard.tsx
The returning user moment. Top of Home screen.
Not rendered for State D (first ever open).

Props:
  state: 'A' | 'B' | 'C'
  dayNumber: number
  daysSinceLastOpen?: number    for State C
  phaseColor: string
  phaseName: string
  onCTA: () => void

State A — New day available:
  Phase label: "[PHASE] · DAY {N}"
  Heading: phase-based message
    Days 1-7:  "You're building the base. Show up."
    Days 8-14: "Day {N}. This is where most people stop."
    Days 15-21: "Day {N}. This is who you're becoming."
  CTA Button: "Let's go"

State B — Today already done:
  Phase label: "DAY {N} COMPLETE"
  Heading: "That's the one that counts."
  Subtext: "Day {N+1} opens tonight at midnight."
  No CTA button — acknowledgment only

State C — Gap return:
  Label: "WELCOME BACK"
  Heading: "Day {N} is still here."
  Subtext: "The circuit doesn't judge. It waits."
  CTA Button: "Pick up where you left off"

Animation:
  Entrance: fade + rise, 400ms, ENTRANCE config
  CTA: standard Button component (primary variant)

---

### TrackCard — components/shared/TrackCard.tsx
Track option on match/recommendation screen.

Props:
  name: string
  tagline: string
  iconName: string
  isRecommended: boolean
  isSelected: boolean
  onPress: () => void

States:
  default:               standard Card, textMid tagline
  recommended:           Surge glow, RECOMMENDED badge
  selected:              selectedBg fill, Surge border
  recommended+selected:  both effects combined

---

### SubtrackCard — components/shared/SubtrackCard.tsx
Subtrack option on focus screen.
Name only — no subtitle or tagline.

Props:
  name: string
  isLive: boolean
  isFree: boolean
  isSelected: boolean
  onPress: () => void

States:
  live + free + unselected:  standard Card, pressable
  live + free + selected:    Surge border + selectedBg fill
  live + not free:           lock icon + Pro badge, pressable
                             → routes to subscription
  not live:                  "Coming Soon" badge
                             40% opacity, not pressable

---

### PhaseProgressRing — components/shared/PhaseProgressRing.tsx
Circular ring showing progress within current phase.

Props:
  dayInPhase: number    1-7 within the phase
  phaseColor: string
  size?: number         default: 64

Appearance:
  Outer ring: phaseColor at 15% opacity
  Progress arc: phaseColor full, strokeLinecap round
  Center: day-in-phase number in phaseColor

---

### Silhouette — components/shared/Silhouette.tsx
Human figure that charges as days complete.
Used in Ascent (progress) and Graduation screens.

Props:
  completedDays: number    0-21
  phaseColor: string       current phase color
  totalDays?: number       default: 21
  size?: 'full' | 'mini'  full=Ascent, mini=future use
  animated?: boolean       float animation on/off

Visual behavior:
  SVG human silhouette — gender-neutral, abstract,
  fluid not athletic, slightly upward-reaching posture
  Base: white 4% opacity (barely visible)
  Lit portion: bottom to top, completedDays/21 ratio
  Lit color: phaseColor with soft gradient edge
  At 21/21: fully lit, graduation aura applied
  by parent (Graduation screen), not here

Float animation (when animated=true):
  translateY: 0 → -8 → 0, sinusoidal
  Duration: 4 seconds, infinite loop
  easeInOut

SVG spec:
  Abstract humanoid silhouette
  No gender markers
  Single filled path
  ~200×400 viewBox
  Renders at any size via width/height props

---

## PROFILE COMPONENTS (components/profile/)

### ProfileAvatar

Displays the stored avatar or a two-letter initials fallback. The entire control opens the photo-library flow. A phase-neutral Iris camera badge communicates editability; upload progress is visible and interaction is disabled while saving. The avatar uses the shared profile size/radius tokens and exposes “Add profile picture” or “Change profile picture” to accessibility services.

### ActiveCircuitCard

Presents Arc and Focus as separate rows, followed by the user's phase and circuit position. The seven numbered nodes represent position within the current phase, not all 21 days. Foundation, Build, and Commit labels explain the phase system. Completed journeys render “Circuit complete” and never expose the persisted sentinel as “Day 22 of 21.” Arc symbols are decorative; the card exposes one concise summary label to screen readers.

### SettingsGroup and SettingsRow

Reusable inset-list primitives for Profile and Settings. Rows use a stable horizontal structure: icon, primary label, optional trailing value, and chevron only when the row navigates or performs an action. Minimum row height is 64dp. Destructive state uses Error; unavailable membership remains legible and non-interactive rather than appearing broken. Groups may omit a heading for isolated actions such as Delete account.

### SettingsHeader

Inline pushed-screen header with BackButton, centered DM Sans title, and a width-matched trailing spacer. Settings routes remain in the root stack so BottomNav is not mounted.

---

## SCREEN-LEVEL LAYOUT PATTERNS

These are not components. They are patterns
every screen follows.

### Onboarding screen pattern
```
ScreenWrapper (padded=true)
  ├── Row: BackButton | StepDots | spacer (26px)
  ├── View (relative, marginTop 44)
  │   ├── GhostNumber (absolute, behind)
  │   └── Text variant="heading"
  ├── Text variant="caption" color=textMid (pick up to N)
  ├── View (flex 1, gap 9)
  │   └── OptionCard × N
  └── Button variant="primary" (disabled until selection)
```

### Day screen layout pattern
```
ScreenWrapper (scrollable=false, padded=false)
  ├── View (fixed header)
  │   ├── BackButton (left)
  │   └── Badge variant="phase" (right)
  ├── ScrollView (flex 1, contentPadding bottom 160)
  │   ├── Title block: Animated.Text Syne-ExtraBold (dynamic 40/32/26px), caption subtitle
  │   ├── BeforeYouStart section (if day data has equipment[])
  │   ├── WhySection (collapsible, maxHeight + opacity Reanimated)
  │   ├── Done pills row (flexWrap, completed steps as phaseColor pills)
  │   └── StepCards: active card full opacity + spring entrance;
  │       pending cards 40% opacity; done cards hidden unless re-reading
  ├── View (absolute bottom 0 — FIXED, pointerEvents box-none)
  │   ├── LinearGradient (transparent → abyss)
  │   └── HoldButton (disabled=true until allDone; active=solid phaseColor)
  │       OR completed pill when isCompleted
  └── CompletionMoment (absoluteFill overlay, zIndex 100)
      ├── Phase color pulse (scale+opacity Reanimated)
      ├── "DAY X COMPLETE" anchor + thin rule
      ├── Quote (Syne-ExtraBold 28/24px, lineHeight 1.3, arcLight, centered)
      ├── Attribution (14px DM Sans, arcLight 50%)
      └── 4× FeelingPill (scale tap animation, 600ms delay → completeDay → navigate)
      (BottomNav NOT rendered on this screen)
```

---

## COMPONENT BUILD ORDER

Build in this exact sequence.
Never skip ahead. Each level uses the level above.

Level 0 — Token foundation (before any component):
  theme/index.ts

Level 1 — Primitives:
  Text → Button → Card → Input → Badge → SkeletonCard

Level 2 — Form:
  OptionCard → StepDots

Level 3 — Task:
  StepCard → HoldButton

Level 4 — Navigation:
  BackButton → BottomNav

Level 5 — Shared:
  ScreenWrapper → SectionLabel → GhostNumber →
  DayCard → ReentryCard → TrackCard →
  SubtrackCard → PhaseProgressRing → Silhouette

Level 6 — Screens (in app/):
  Splash → Welcome → Login → Signup →
  LifeStage → Bridge → Q2 → Q3 → Q4 → Q5 →
  Q6 → Match → Focus →
  Home → Day → Ascent → Community → Profile →
  Graduation

---

## TESTING REQUIREMENTS

Write these before or alongside each component:

```typescript
// utils/scoring.test.ts
describe('calculateScores', () => {
  it('returns Move as top score for restless + move_body')
  it('returns Mindful for anxious + lost_touch')
  it('handles tie — returns first alphabetically')
  it('returns all five arcs with scores >= 0')
  it('scores sum correctly across all questions')
})

// utils/dayUnlock.test.ts
describe('getReentryState', () => {
  it('returns D when no completions exist')
  it('returns B when last completion is today')
  it('returns A when last completion is yesterday')
  it('returns C when last completion is 3 days ago')
  it('returns C when last completion is 30 days ago')
})

// components/forms/OptionCard.test.tsx
describe('OptionCard', () => {
  it('renders label correctly')
  it('shows checkmark when selected=true')
  it('hides checkmark when selected=false')
  it('does not call onPress when disabled=true')
  it('calls onPress when not disabled')
})

// components/tasks/HoldButton.test.tsx
describe('HoldButton', () => {
  it('renders idle label by default')
  it('renders holdingLabel while holding')
  it('calls onComplete after holdMs')
  it('resets on pointer cancel')
})
```

---

## WHAT IS NEVER BUILT

- Glassmorphism cards (Fathom fill always)
- Blur on card surfaces (blur only on BottomNav/overlays)
- Pure #FFFFFF text (use textHi or arcLight)
- New colors (palette is closed)
- React Native Animated API (use Reanimated only)
- StyleSheet.create in screen files (NativeWind only)
- Inline hex values in any component
- HoldButton inside a ScrollView (ever)
- BottomNav on Day screen or Graduation
- Second Supabase client (one client only)
- 'any' TypeScript type (fix the type properly)
