# INAT — Claude Code Context
Last updated: July 2026 | Last session: Level 5 shared components — all 9 components including Silhouette

---

## WHAT THIS APP IS
A 21-day habit formation React Native app. Users answer
discovery questions, pick a track and subtrack, complete
one daily task for 21 days, then graduate. Five paths:
Move, Rhythm, Express, Calm, Mindful. By day 22 the user
feels confident enough to explore the field independently.

---

## TECH STACK
- Framework: React Native + Expo SDK 54
- Router: Expo Router (file-based)
- Styling: NativeWind + theme/index.ts (all tokens)
- Animation: React Native Reanimated 3 only
- State: Zustand (session) + Supabase (persisted)
- Backend: Supabase (auth + DB + RLS)
- Language: TypeScript strict, no any
- Build: Expo EAS

---

## WHAT IS BUILT AND WORKING
- Core dependencies installed: expo-router, react-native-safe-area-context,
  react-native-screens, expo-linking, expo-constants, expo-status-bar,
  react-native-reanimated (v4), react-native-worklets (v0.5.1), nativewind (v4),
  tailwindcss (v3.4), zustand, @supabase/supabase-js, expo-font, expo-splash-screen,
  expo-linear-gradient, @expo/vector-icons
- NativeWind v4 configured: tailwind.config.js, babel.config.js, global.css, metro.config.js
- Expo Router configured: scheme "inat", main "expo-router/entry"
- theme/index.ts — all design tokens (colors, typography, spacing, radius, effects,
  fontFamilies, getPhaseColor, getPhaseName)
- types/index.ts — all TypeScript interfaces (Profile, Journey, DayCompletion, Track,
  Subtrack, CurriculumDay, ReentryState)
- lib/supabase.ts — single Supabase client
- Folder structure matches ARCHITECTURE.md exactly
- All 18 placeholder screens created and navigable
- Root layout (app/_layout.tsx) with Stack navigator + Hanken Grotesk font loading
- Tab layout (app/(tabs)/_layout.tsx) with 4 tabs
- Hanken Grotesk loaded locally (5 weights: Regular/Medium/SemiBold/Bold/Black)
  from assets/fonts/ via expo-font useFonts hook + SplashScreen.preventAutoHideAsync
- Level 1 primitives complete (components/core/):
  Text (10 variants) · Button (primary/secondary/completed) · Card (accent left/top, pressable)
  Input (focus glow, shake on error) · Badge (streak/phase/recommended/comingSoon/pro)
  SkeletonCard (shimmer 1.2s loop)
- All primitives: zero hardcoded values, Reanimated 3 animations, ReduceMotion.System,
  full accessibility labels, TypeScript strict with zero errors
- typography.size.badge (9) and typography.size.button (16) added to theme
- typography.leading.step (1.50) added to theme
- SafeAreaView import fixed across all 18 placeholder screens (now from react-native-safe-area-context)

---

## WHAT IS INCOMPLETE OR BROKEN
- No real screen content — all screens are placeholders showing screen name only
  (except app/(tabs)/index.tsx which is temporarily a component test screen)
- No Supabase project connected — .env.local has placeholder values
- No auth logic — Splash (app/(auth)/index.tsx) temporarily redirects to Home tab
- Level 2 form components complete: OptionCard, StepDots
- Level 3 task components complete: StepCard, HoldButton
  - HoldButton layout constraint documented in component file header (must never be inside a ScrollView)
  - HoldButton uses RAF-based progress fill, Reanimated heartbeat, expo-haptics on complete
  - StepCard uses two-slot layout (number left + empty circle right when undone; filled circle+check left when done)
- Level 4 navigation components complete: BackButton, BottomNav
  - BackButton: Ionicons chevron-back, 44×44 touch target (spacing.touchMin), hitSlop backup
  - BottomNav: expo-blur BlurView on iOS, solid bgNav on Android, safe area insets,
    withSequence spring (ReduceMotion.System), router.replace tab nav, phaseColor prop
  - Default tab bar hidden in (tabs)/_layout.tsx; BottomNav mounted there via usePathname
  - BottomNav naturally unmounted on Day and Graduation (those screens are outside (tabs) group)
- Level 6 screens not built
- Android: primary button glow is elevation-only (no green color) — platform limitation

---

## WHAT TO BUILD THIS SESSION
Level 6 screens — wire up real content to all placeholder screens:
auth (splash/welcome/login/signup), onboarding (life-stage→focus), home (DayCard + ReentryCard),
day screen (HoldButton + StepCard), ascent (progress + Silhouette), profile, graduation

---

## DESIGN SYSTEM
Font: Hanken Grotesk (only font, never swap)
Abyss:    #07090D  page background
Fathom:   #0F141A  card background
Surge:    #3DF5A6  primary action, BUILD phase
Glacial:  #82D4FF  FOUNDATION phase
Plasma:   #FF4FD8  COMMIT phase
Arc-Light:#EAFFF5  near-white text
All tokens live in theme/index.ts — never hardcode values.

---

## KEY FILES
- theme/index.ts — all design tokens
- app/(auth)/index.tsx — splash + auth routing
- app/(tabs)/index.tsx — home screen
- app/day.tsx — day screen (hold to complete)
- services/ — all Supabase calls
- stores/journey.store.ts — session state
- utils/scoring.ts — onboarding algorithm
- utils/dayUnlock.ts — re-entry state logic
- docs/ARCHITECTURE.md — screen + routing blueprint
- docs/DATA.md — full schema + service layer
- docs/COMPONENTS.md — every component spec

---

## SLASH COMMANDS
/phase-check — runs current phase verification checklist
/token-check — finds hardcoded values in components/
/commit — typecheck + token check + guided commit

---

## CURRENT PHASE
Component Library Build (pre-Phase 1)

### COMPONENT LIBRARY STATUS (feeds into phases)
Level 0 — Token foundation: COMPLETE
Level 1 — Primitives: COMPLETE
Level 2 — Form: COMPLETE
Level 3 — Task: COMPLETE
Level 4 — Navigation: COMPLETE
Level 5 — Shared: COMPLETE
Level 6 — Screens: IN PROGRESS

### ARCHITECTURE PHASES STATUS
Phase 1 — Shell and navigation: NOT STARTED
Phase 2 — Onboarding: NOT STARTED
Phase 3 — Core experience: NOT STARTED
Phase 4 — Re-entry card: NOT STARTED
Phase 5 — Progress and Graduation: NOT STARTED
Phase 6 — Profile and subscription: NOT STARTED

Current work: Component Library Level 6 — screens. Next: Begin Architecture Phase 1 — Shell and navigation once screens are wired.

## SESSION DECISIONS (Level 5)
- react-native-svg v15.12.1 installed for PhaseProgressRing and Silhouette
- metro.config.js: added resolveRequest override — forces react-native-svg to resolve
  to lib/commonjs/index.js instead of TypeScript src/ (Windows Metro path-resolution bug)
- typography.size.ghost (120) added to theme for GhostNumber
- colors.textGhost ('rgba(255,255,255,0.04)') added to theme for Silhouette base layer
- micro-spacing tokens added: inputPadV, badgePadH, badgePadV, badgeSmH, badgeSmV, inputHint
- Silhouette clipPath: unique IDs via module counter (_silhouetteId) + useRef to prevent
  collision when multiple Silhouettes render on the same screen
- Silhouette: PLACEHOLDER — pill-shaped progress bar (80×160 full, 40×80 mini).
  Real SVG silhouette deferred to post-MVP. Use react-native-skia when implementing.
  Do NOT use react-native-svg clipPath or LinearGradient fill — both fail on iOS.
  Props interface is stable; swap in real component with zero screen changes.
- GhostNumber: importantForAccessibility="no-hide-descendants" + accessibilityElementsHidden
  (not aria-hidden — that's a web prop unsupported in React Native)
- TrackCard: glow (effects.glowSurge) applied only on Pressable style, not Animated.View wrapper

## SESSION DECISIONS (Level 2)
- future-dot color: used colors.textFaint (0.18) — spec says 15% but no theme token
  exists for that exact value; delta is imperceptible at 5dp dot size
- StepDots: importantForAccessibility="no-hide-descendants" hides individual dots
  from VoiceOver/TalkBack; row carries the label "Step X of Y"
- OptionCard disabled state: still pressable (triggers shake feedback); VoiceOver
  sees accessibilityState.disabled=true + hint "Maximum selections reached"
- Android touch target (44 vs 48dp): theme-level decision, not changed in component;
  flagged for future theme update (spacing.touchMin → 48)

---

## FORBIDDEN — NEVER DO THESE
- Call Supabase from a component — use services/ only
- Hardcode any color, size, or spacing — use theme/index.ts
- Use React Native Animated — use Reanimated 3 only
- Use 'any' in TypeScript — fix the type
- Put HoldButton inside a ScrollView
- Show BottomNav on Day screen or Graduation screen
- Create a second Supabase client
- Add new colors to the palette
- Use glassmorphism on cards
- Build a screen not in docs/ARCHITECTURE.md

---

## SESSION RULES
1. Read this file first. Do not write code until confirmed.
2. One concern per session — never mix UI + logic + schema.
3. Show result after each component before building next.
4. Run relevant phase checklist items after building.
5. End every session: update this file → show diff →
   commit → push. Format: [phase] what changed
6. ARCHITECTURE.md phases are the source of truth for feature
   delivery. COMPONENTS.md levels track the component library
   build. Never mix the two numbering systems.

---

## DESIGN CONTEXT
Full product strategy lives in PRODUCT.md (project root).

Register: product — design serves the experience, not marketing.
Platform: adaptive (iOS + Android via React Native + Expo).

Brand in three words: earned, electric, certain.
Inspired by Djokovic's INAT — relentless refusal to accept
theoretical limits. Not a wellness app. Not a task manager.
The energy of a coach who already knows you can do it.

Anti-references:
- Wellness / meditation apps (no Headspace beige, no pastels)
- Corporate productivity tools (no Notion/Linear aesthetic)
- Motivational poster copy (no "you got this", no mountains)

Five design principles (from PRODUCT.md):
1. Show up, not feel inspired
2. Earned, not granted
3. The circuit doesn't judge — it waits
4. Flow through system
5. Day 22 is the real product
