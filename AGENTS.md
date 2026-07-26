# INAT — AI Agent Playbook

This is the canonical entry point for every AI agent working on INAT. Read this file completely before inspecting or changing the project.

## Required reading order

1. `AGENTS.md` — durable product, architecture, and working rules.
2. `PRODUCT.md` — mission, audience, positioning, and product principles.
3. `docs/STATUS.md` — current priorities, temporary decisions, known issues, and documentation drift.
4. `docs/ARCHITECTURE.md` — navigation and screen contract.
5. The relevant feature document:
   - `docs/COMPONENTS.md` for UI components and interaction rules.
   - `docs/DATA.md` for persistence and service-layer behavior.
   - `DESIGN.md` for visual language and design tokens.
   - `docs/MEDITATION-FIGURE.md` for the Home WebView/WebGL figure.
6. Before writing Expo code, read the exact versioned Expo SDK 54 documentation at https://docs.expo.dev/versions/v54.0.0/ for the APIs involved.

If documentation conflicts, do not silently choose a convenient interpretation. Use the source-of-truth order below and report unresolved conflicts before implementing them.

## Source-of-truth order

1. The user's current instruction.
2. This `AGENTS.md` playbook.
3. `PRODUCT.md` for product intent.
4. The current Supabase schema and intentional implementation decisions recorded in `docs/STATUS.md`.
5. Feature-specific documents in `docs/` and `DESIGN.md`.
6. Historical notes in `docs/CLAUDE.md`.

Current code does not automatically outrank documentation. It does so only when `docs/STATUS.md` records the difference as an intentional migration or temporary decision.

## What INAT is

INAT means **I Never Accept Theoretical Limits**.

INAT is a 21-day proving ground for people who keep postponing something meaningful. A user chooses one field, follows a deliberately structured circuit, and develops enough experience and confidence to decide whether and how to continue independently.

The five arcs are:

- Move
- Rhythm
- Express
- Calm
- Mindful

An arc is a broad field. A focus is the specific discipline or direction the user practices for 21 days.

INAT is not a habit tracker, streak machine, self-help library, or darker version of a wellness app. It does not merely deliver daily content. It transfers capability.

## The mission and Day 22 outcome

The person who starts Day 1 and the person who completes Day 21 should be meaningfully different.

By Day 22, the user should understand:

- whether the chosen field genuinely fits them;
- how they personally begin and sustain practice;
- what conditions help them enter flow;
- what interrupts their flow;
- how to return after friction or absence; and
- how to continue without depending on INAT.

The underlying system is:

`Choose deliberately → prepare → practice with structure → notice → adjust → repeat independently`

Dependency is a product failure. Day 22 is the real product.

## Non-negotiable product principles

### Show up, not feel inspired

INAT reduces the friction between intention and action. Motivation is not the primary currency; structure is.

### Earned, not granted

Completion must carry weight. Rituals such as the HoldButton exist because finishing should require deliberate action rather than a casual tap.

### The circuit does not judge; it waits

There are no shame screens, streak threats, penalties, or resets for absence. The next unfinished day remains available when the user returns.

### Flow through system

INAT creates repeatable conditions for flow. It does not promise to manufacture flow or reduce it to inspirational language.

### Guidance should decrease as agency increases

Days 1–7 establish mechanics and remove uncertainty. Days 8–14 help users recognize patterns and make choices. Days 15–21 should increasingly reveal and transfer ownership of the system.

### Curriculum credibility matters

Curriculum is curated by INAT and should be reviewed or certified by an appropriate professional. Authority should create trust without making the daily experience clinical or dependent on credentials.

## Canonical technical architecture

INAT is an Expo SDK 54 React Native application using:

- Expo Router for file-based navigation;
- TypeScript in strict mode;
- Zustand for temporary session state;
- Supabase for authentication and persisted data;
- React Native Reanimated for motion;
- a centralized theme in `theme/index.ts`; and
- a WebView/Three.js shader scene for the Home meditation figure.

The required data boundary is:

`Screen or component → store/service → single Supabase client → database`

Screens and components never query Supabase directly. Database access belongs in `services/`. The sole client lives in `lib/supabase.ts`.

## Canonical Supabase curriculum model

The current model is:

- `arcs` — the five broad fields;
- `focuses` — specific disciplines within an arc;
- `days` — daily curriculum content by arc, focus, and day number;
- `day_steps` — ordered guided steps belonging to a day;
- `user_journeys` — the user's selected arc/focus and current position; and
- `user_day_logs` — completed-day history and feeling data.

The following model is retired and must never be used or reintroduced:

- `tracks`
- `subtracks`
- `curriculum_days`
- `daily_completions`
- journeys based on `subtrack_id`

Old references to those names in `docs/ARCHITECTURE.md`, `docs/DATA.md`, or `docs/COMPONENTS.md` are documentation debt, not implementation guidance.

## Navigation and user journey

The major navigation areas are:

1. Authentication: Splash, Welcome, Login, Signup.
2. Onboarding: Orientation/Life Stage, discovery questions or direct choice, Match, Focus.
3. Main tabs: Home, Ascent, Community, Profile.
4. Pushed immersive screens: Day and Graduation.

Both discovery paths must end at the same Focus experience and create the same kind of journey.

Day and Graduation never show BottomNav. The Day screen is a critical guided-practice environment, not a checklist or content feed. Its presentation should help the user arrive, understand, practice, notice, and close.

Graduation must reflect the capability the user earned, not merely congratulate 21 completions.

## Design principles

The brand is **earned, electric, certain**. The voice is terse and true: a demanding coach who has already decided the user is capable, not a therapist or cheerleader.

The current closed palette is:

- Abyss and Fathom for primary surfaces;
- Iris for Foundation, days 1–7;
- Volt for Build, days 8–14, and primary actions;
- Plasma for Commit, days 15–21; and
- Arc-Light for high-emphasis near-white text.

Do not reintroduce Electric `#4DBBFF`; Iris replaced it.

Design rules:

- Do not add colors without an explicit product decision.
- Use accent color sparingly; it must carry meaning.
- Avoid generic wellness softness, corporate productivity styling, and motivational-poster imagery or copy.
- Motion must communicate ritual, state, progress, or hierarchy—not decoration alone.
- Use DM Sans for general application UI.
- Use Syne only in the roles defined by the current design system.
- Meet WCAG AA contrast and touch-target requirements.
- Respect the system reduced-motion preference in every animation.
- Keep the dark visual foundation consistent across native configuration and screens.

## Coding and implementation standards

- Use TypeScript strict mode. Never introduce `any` to bypass a type problem.
- Use the `@/` path alias for project imports.
- Put persisted-data operations in `services/`.
- Maintain one Supabase client only.
- Use Zustand for session state; do not treat it as durable persistence.
- Use Reanimated for application animation. Do not introduce React Native's `Animated` API.
- Use tokens from `theme/index.ts`; do not hardcode colors, spacing, radii, typography, or reusable motion values in components.
- Do not add a package without explicit approval.
- Do not build a new screen or change the schema without first updating the appropriate contract document.
- Keep changes scoped to one concern and preserve unrelated user work.
- Never log emails, discovery answers, or the user's open answer.
- Treat the user's open answer and discovery results as sensitive data.

### Protected implementation boundaries

- `utils/inat-brain.ts` owns questions, vectors, weights, and scoring intelligence.
- `utils/inat-engine.ts` owns matching mechanics. Do not tune behavior or add product intelligence there.
- `HoldButton` must remain fixed outside scrolling Day content.
- BottomNav must never appear on Day or Graduation.
- The Home meditation figure is documented in `docs/MEDITATION-FIGURE.md`; keep its TypeScript runtime and standalone HTML reference synchronized when it changes.

## How to implement a feature

1. Read this file, `PRODUCT.md`, `docs/STATUS.md`, and the relevant contract documents.
2. Inspect the current implementation and working tree before proposing changes.
3. Identify the single concern being changed: UI, logic, data, or documentation.
4. Resolve contradictions before coding. Do not preserve obsolete behavior merely because an old document mentions it.
5. Confirm relevant Expo behavior against the exact SDK 54 documentation.
6. Reuse existing components, tokens, services, and types before creating new ones.
7. Implement the smallest coherent change.
8. Verify TypeScript and the relevant feature behavior in proportion to risk.
9. Check accessibility, reduced motion, loading, empty, error, and re-entry states.
10. Update documentation whenever an architectural or product contract changes.

## Definition of done

A change is not complete until:

- it matches the product mission and current architecture;
- it uses the canonical Supabase model;
- TypeScript passes with no newly introduced errors;
- relevant behavior has been exercised or clearly identified as requiring a real device/Supabase environment;
- accessibility and reduced-motion behavior have been considered;
- no unrelated user files were modified;
- applicable documentation reflects the decision; and
- remaining risks or unverified states are reported clearly.

## Document map

- `AGENTS.md` — canonical AI working playbook and durable constraints.
- `PRODUCT.md` — product mission, audience, positioning, voice, and Day-22 philosophy.
- `docs/STATUS.md` — current work, temporary behavior, known issues, and intentional drift.
- `docs/ARCHITECTURE.md` — screen inventory, routing, and journey behavior; contains old data-model terminology pending cleanup.
- `docs/DATA.md` — intended data and privacy rules; its retired curriculum schema must not be followed.
- `docs/COMPONENTS.md` — component interaction contracts; some design names and screen details are historical.
- `DESIGN.md` — detailed visual language; defer to the current theme and recorded migrations when token names conflict.
- `docs/MEDITATION-FIGURE.md` — current Home meditation figure implementation.
- `docs/CLAUDE.md` — historical session log and decisions; useful context, not the primary playbook.
- `theme/index.ts` — current executable design tokens.
- `types/index.ts` — current application data shapes.

Always begin here, then read `docs/STATUS.md` before doing project work.
