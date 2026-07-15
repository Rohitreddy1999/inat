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
- Nothing yet. Project not initialized.

---

## WHAT IS INCOMPLETE OR BROKEN
- Everything. Starting from scratch.

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
