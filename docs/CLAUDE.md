# INAT — Claude Code Context
Last updated: July 2026 | Last session: Project initialized

---

## WHAT THIS APP IS
A 21-day habit formation React Native app. Users answer
discovery questions, pick a track and subtrack, complete
one daily task for 21 days, then graduate. Five paths:
Move, Rhythm, Express, Calm, Mindful. By day 22 the user
feels confident enough to explore the field independently.

---

## TECH STACK
- Framework: React Native + Expo SDK 51+
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
  react-native-reanimated, nativewind (v4), tailwindcss (v3.4), zustand, @supabase/supabase-js
- NativeWind v4 configured: tailwind.config.js, babel.config.js, global.css, metro.config.js
- Expo Router configured: scheme "inat", main "expo-router/entry"
- theme/index.ts — all design tokens (colors, typography, spacing, radius, effects,
  getPhaseColor, getPhaseName)
- types/index.ts — all TypeScript interfaces (Profile, Journey, DayCompletion, Track,
  Subtrack, CurriculumDay, ReentryState)
- lib/supabase.ts — single Supabase client
- Folder structure matches ARCHITECTURE.md exactly
- All 18 placeholder screens created and navigable
- Root layout (app/_layout.tsx) with Stack navigator
- Tab layout (app/(tabs)/_layout.tsx) with 4 tabs
- TypeScript compiles with zero errors

---

## WHAT IS INCOMPLETE OR BROKEN
- No real screen content — all screens are placeholders showing screen name only
- No fonts loaded (Hanken Grotesk — Phase 2)
- No Supabase project connected — .env.local has placeholder values
- No auth logic — Splash routes nowhere yet
- No components built — components/ folders exist but are empty

---

## WHAT TO BUILD THIS SESSION
[REPLACE THIS before starting every session]

## DEFINITION OF DONE
[REPLACE THIS before starting every session]

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
Phase 1 — Shell and navigation
See docs/ARCHITECTURE.md for phase checklists.

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
