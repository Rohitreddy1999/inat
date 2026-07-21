# INAT — Claude Code Context
Last updated: July 2026 | Last session: Orientation screen + bridge rebuild + Arc/Focus language

---

## WHAT THIS APP IS
A 21-day habit formation React Native app. Users answer
discovery questions, pick an Arc and Focus, complete
one daily task for 21 days, then graduate. Five Arcs:
Move, Rhythm, Express, Calm, Mindful. By day 22 the user
feels confident enough to explore the field independently.

## TERMINOLOGY
- **Arc** — the five main paths (Move, Rhythm, Express, Calm, Mindful).
  User-facing name for what was previously called "track".
- **Focus** — specific discipline within an Arc (e.g. "Running" within Move).
  User-facing name for what was previously called "subtrack".
- **Code variables keep old names** — subtrack_id, subtracks table,
  getSubtracksByTrack(), selectedTrack, etc. Only string literals the user
  sees have been updated. Never rename the DB columns or TS variables.

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
- Level 6A auth screens complete:
  - services/auth.service.ts (signUp/signIn/signOut/getSession/resetPassword)
  - services/journey.service.ts (getActiveJourney)
  - stores/journey.store.ts (hydrate/reset, isHydrated flag)
  - app/(auth)/index.tsx — Splash: 600ms wordmark + 400ms tagline fade, auth routing
  - app/(auth)/welcome.tsx — staggered entrance animation, PhaseProgressRings
  - app/(auth)/login.tsx — signIn + forgot password + hydrate routing
  - app/(auth)/signup.tsx — signUp → onboarding routing
  - app/_layout.tsx — all Stack groups configured (auth/onboarding/tabs/day/graduation)
  - Input.tsx extended: keyboardType + autoCapitalize pass-through props added
- All 3 auth flow tests pending (requires real Supabase project — .env.local has placeholders)
- Level 6B onboarding screens not built
- Android: primary button glow is elevation-only (no green color) — platform limitation

---

## WHAT TO BUILD THIS SESSION
Orientation screen + bridge rebuild + Arc/Focus language — COMPLETE (commit b157a8a)

---

## DESIGN SYSTEM
Display/Headings: Syne (ExtraBold for display, Bold for title/heading)
Body: Hanken Grotesk (Regular/Medium/SemiBold/Bold/Black)
Never swap fonts — Syne for display+heading variants only, Hanken for everything else.

Abyss:    #07090D  page background
Fathom:   #0F141A  card background
Iris:     #8B5CF6  Foundation phase + selected states + onboarding accent
Volt:     #62EE10  Build phase + ALL CTAs (primary buttons, active states)
Plasma:   #FF4FD8  Commit phase
Arc-Light:#EAFFF5  near-white text
All tokens live in theme/index.ts — never hardcode values.

Color role rule:
  Iris  — Foundation phase (days 1-7), selected card states, onboarding highlights
  Volt  — Build phase (days 8-14), all CTA buttons app-wide
  Plasma — Commit phase (days 15-21)
  Electric (#4DBBFF) is REMOVED — replaced by Iris. Never use it again.

---

## KEY FILES
- theme/index.ts — all design tokens
- app/(auth)/index.tsx — splash + auth routing (checks life_stage to decide orientation vs life-stage)
- app/(onboarding)/orientation.tsx — shows ONCE for new users (life_stage null); never shown to returning users
- app/(tabs)/index.tsx — home screen
- app/day.tsx — day screen (hold to complete)
- services/ — all Supabase calls
- stores/journey.store.ts — session state
- utils/inat-brain.ts — ALL scoring intelligence (vectors, weights, questions). Tune here only.
- utils/inat-engine.ts — matching engine logic. DO NOT TUNE HERE.
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

## DEV TOOLING

### Access
5-tap the INAT wordmark on the Welcome screen → opens `app/admin.tsx`.
Only functional when `__DEV__ === true` (development builds only).
Never ships: guarded by `if (!__DEV__) throw` at module level + `return null` inside component.

### Admin Account (Supabase — FlowState project)
| email | password |
|---|---|
| dev@inat.app | INATdev2026! |

This is the only dev account. Never create additional test accounts.

### Files
- `app/admin.tsx` — admin panel (__DEV__ only)
- `services/admin.service.ts` — all admin DB operations (never call Supabase from admin.tsx directly)
- `app/(auth)/welcome.tsx` — 5-tap handler on wordmark (2-second reset window)
- `app/_layout.tsx` — `admin` Stack.Screen gated by `__DEV__`

### Admin Controls
- **CURRENT STATE** — Day X/21, Journey ID (first 8 chars), Re-entry state, Completions count
- **JUMP TO DAY** — grid of days 1–21; sets `current_day` and backfills completion history
- **SIMULATE RE-ENTRY** — State A (yesterday), B (today), C (5 days ago), D (no completions)
  by updating the latest completion row's date then re-hydrating
- **JUMP TO SCREEN** — direct nav to any screen without auth/journey preconditions
- **DANGER** — Reset Journey (deactivates + clears completions → onboarding) / Sign Out

### Schema note
`daily_completions.completed_date` is a `date` column (YYYY-MM-DD).
Migration applied: renamed from `completed_at` to align with service layer.

## BUGS FIXED

### Journey / day advancement
- `completeDay()` correctly writes `current_day: dayNumber + 1` — verified via Supabase
- `handleComplete()` in day.tsx already awaits `hydrate()` before navigation — confirmed correct
- `hydrate()` sets `isHydrated: true` even when no active journey exists — confirmed correct

### State B home screen display
- After completing a day, `currentDay` in the store is the NEXT day (already incremented).
  Home screen now uses `displayDay = reentryState === 'B' ? currentDay - 1 : currentDay`
  so the card shows the day that was actually completed, not the upcoming one.
- `getDayContent` call also uses `displayDay` directly — no duplicate offset expression.
- `getSubtrackById` split into a separate `useEffect` keyed on `subtrack_id` only;
  it no longer re-fetches on every re-entry state change.

### Journey creation (onboarding re-entry)
- `createJourney` restructured: upsert first (safe), deactivate others after success.
  Previously deactivated existing journeys before the upsert — if the upsert failed,
  the user was left with no active journey and looped back to onboarding indefinitely.
- Deactivation now uses `.neq('id', newJourney.id)` instead of `.neq('subtrack_id', ...)`
  so any stale same-subtrack rows are also cleaned up.
- `deactivateJourney` now returns `PostgrestError | null` instead of `void`.
- `focus.tsx` no longer calls `deactivateJourney` directly — handled inside `createJourney`.

### Admin panel
- All direct `supabase.from()` calls moved out of `admin.tsx` into service functions:
  - `services/journey.service.ts`: `setJourneyDay(journeyId, day)`
  - `services/completion.service.ts`: `deleteJourneyCompletions`, `insertJourneyCompletions`,
    `getLatestCompletionId`, `updateCompletionDate`, `insertSyntheticCompletion`
- Every DB call now checks the returned error and surfaces it via `Alert` — no more
  silent failures that showed a success confirmation when nothing changed.
- `handleResetJourney` stops and shows an error if deactivation fails; no longer navigates
  to onboarding while the active journey is still live in the DB.
- Date offset in `handleSetDay` simplified: `day - 1 - (i - 1)` → `day - i`.
- All stale test/dev accounts deleted; `dev@inat.app` is the single dev account.

---

## CURRENT PHASE
Component Library Build (pre-Phase 1)

### COMPONENT LIBRARY STATUS (feeds into phases)
Level 0 — Token foundation: COMPLETE
Level 1 — Primitives: COMPLETE
Level 2 — Form: COMPLETE
Level 3 — Task: COMPLETE
Level 4 — Navigation: COMPLETE
Level 5 — Shared: COMPLETE (QuestionHeading added this session)
Level 6 — Screens: COMPLETE (6A auth ✓, 6B onboarding ✓, 6C main screens ✓, 6D graduation ✓)

### ARCHITECTURE PHASES STATUS
Phase 1 — Shell and navigation: COMPLETE
Phase 2 — Onboarding: COMPLETE
Phase 3 — Core experience: COMPLETE (Day screen + completion flow)
Phase 4 — Re-entry card: COMPLETE (ReentryCard + dayUnlock util)
Phase 5 — Progress and Graduation: COMPLETE (Ascent complete, Graduation 3-beat screen complete)
Phase 6 — Profile and subscription: IN PROGRESS (Profile screen complete, no subscription yet)

Current work: Architecture Phase 1 verification, then Phase 2 onboarding polish.

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
- TrackCard: glow (effects.glowVolt) applied only on Pressable style, not Animated.View wrapper

## SESSION DECISIONS (Color + Syne + Onboarding Rebuild)
- Palette locked: Iris #8B5CF6 replaces Electric #4DBBFF for Foundation/selected states
- Volt value changed: #DAFF00 → #62EE10 (brighter, more legible green)
- Syne-Bold.ttf + Syne-ExtraBold.ttf added to assets/fonts/; loaded in _layout.tsx
- fontFamilies.display = 'Syne-ExtraBold', fontFamilies.heading = 'Syne-Bold'
- Text component: display/title/heading variants now use Syne; all others stay Hanken
- OptionCard rebuilt: two-layer (outer shadow, inner overflow:hidden), LinearGradient
  surface, iris glow + left bar + filled circle checkmark on selected state
- OptionCard shadow on outer Animated.View (not inner) to avoid overflow:hidden clipping
- QuestionHeading: new component in components/shared/ — Syne-Bold 30px, splits text
  around a single highlight word rendered in an accent color
- typography.size.question = 30 added to theme for QuestionHeading font size
- All 7 onboarding screens rebuilt: absolute-positioned CTA (bottom: spacing[10]),
  QuestionHeading replaces Text variant="heading", GhostNumber top-right, total=7 StepDots
- q6 textarea: bare TextInput (not Input component) with styles applied directly —
  wrapping in a View intercepted touches and blocked keyboard on iOS
- Button disabled primary opacity: 0.2 → 0.3 (matches spec, more clearly inactive)
- Global rename across 18 files: electric→iris, borderElectric→borderIris,
  electricTint→irisTint, glowElectric→glowIris

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
- Edit inat-engine.ts to change scoring behavior — only inat-brain.ts vectors and weights are tunable
- Add scoring logic to inat-engine.ts — all intelligence lives in inat-brain.ts

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
