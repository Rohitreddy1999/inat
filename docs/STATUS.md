# INAT — Current Project Status

This document records changing project state, temporary behavior, known issues, and intentional differences between the current implementation and older documentation. Update it when priorities or temporary decisions change. Durable product and engineering rules belong in `AGENTS.md`.

Last reviewed: July 23, 2026

## Current product stage

The primary application flows and component library exist. The project is currently in a visual and experiential polish phase.

Home screen polish, including the human meditation silhouette and phase-aware presentation, is in a good state.

## Current work order

The user explicitly narrowed current work to one concern: logo and splash.

1. Prototype and approve the first-launch INAT wordmark animation.
2. Integrate the static native splash and first-install/everyday launch split.
3. Return to authentication presentation only after logo/splash approval.
4. Revisit Ascent and the Day instruction experience in dedicated sessions.

Do not jump into unrelated feature development unless the user changes this order.

## Logo and splash direction

The approved first-launch sequence is a reverse-disintegration construction:
the dotless i, N, A, and T write themselves sequentially from Arc-Light
particle energy in one coherent Syne construction. A single charged orb—the
actual dot of the lowercase i—forms from the base of the i, travels beneath the
wordmark from left to right, climbs the right edge, returns across the top, and
settles above the i. It ignites N to Iris, A to Volt, and T to Plasma during
that route. Its atomic rings collapse into the clean final dot. A thin separator
draws beneath the mark with a restrained endpoint glow.
`INITIATE · NURTURE · ADAPT · TRANSCEND` appears as one complete line and remains
part of the Welcome lockup. The former three phase rings and
`21 days. One decision.` line are removed from Welcome.

During the visual prototype, the full sequence may replay on each cold launch
for review. Production must gate it once per installation. The project
currently has no approved local-persistence dependency for that gate; do not add
one without explicit approval. Everyday cold launches remain brief, and
foreground resume never replays the sequence.

## Day experience direction

The curriculum data is already loaded in Supabase. The remaining challenge is presenting it as the most important guided-practice moment in the product.

The Day screen should not feel like a checklist, article, content feed, or conventional wellness lesson. It should help the user move through a repeatable practice ritual:

`Arrive → understand → practice → notice → close`

Across the 21 days, guidance should progressively transfer ownership to the user:

- Days 1–7 establish mechanics and reduce uncertainty.
- Days 8–14 reveal patterns and introduce small choices.
- Days 15–21 increase agency and make the learned flow system explicit.

Do not redesign the Day screen opportunistically while polishing Ascent, Graduation, or Settings. Treat it as a dedicated product-design concern after those three polish tasks.

## Graduation direction

Graduation is a continuous two-act Day-22 handoff: Transcendence, then the handoff. It reuses the Home meditation WebGL generator in a dedicated Graduation mode; the retired three-beat native silhouette flow must not return. The completed journey remains available for Ascent, sharing, and the new-circuit decision until creation of a replacement journey deactivates it.

The rebuild is implemented. Its opening now uses a slow cinematic materialization and camera approach, followed by a high-luminosity Iris/Volt/Plasma particle release from the figure. The handoff actions, native sharing, accessibility bypass, reduced-motion path, WebGL fallback, and direct new-circuit selection are in place.

The current schema has no `graduation_seen` field, and none is inferred. Returning Home after Graduation is an explicit clean exit; Home may continue to offer a route back to the completed Graduation experience. A future product decision and schema migration are required if Graduation must be auto-presented exactly once across app launches.

## Profile and settings direction

Profile is a calm identity-and-circuit hub rather than a second settings list. It shows the user's editable avatar, full name, email, active arc/focus, current phase/day, and membership state. It deliberately excludes onboarding answers and the former life-stage line. A single gear opens pushed settings screens outside the tab navigator.

Settings currently includes local practice reminders, password reset, email change, membership status, sign out, and account deletion. Avatar upload requires a public Supabase Storage bucket named `avatars` with user-scoped write policies. Account deletion requires the authenticated `delete-account` Edge Function; the client must never report deletion when that server operation is unavailable. Notification reminders are local device schedules and require real-device permission testing.

The former Metro override that forced `react-native-svg` through its CommonJS entry has been removed. It bypassed React Native codegen transforms and produced `RNSVG*` codegen warnings. SDK 54's supported package source entry now bundles successfully on Windows with the default Expo Metro resolver.

## Canonical database model

The Supabase curriculum migration is complete. Current code must use:

- `arcs`
- `focuses`
- `days`
- `day_steps`
- `user_journeys`
- `user_day_logs`

The former `tracks`, `subtracks`, `curriculum_days`, `daily_completions`, and `subtrack_id` architecture is gone.

The current architecture, data, component, and design documents now use this canonical model. Legacy component filenames such as `TrackCard` and `SubtrackCard` may remain until a deliberate code migration; they are presentation components, not permission to restore the retired database model.

## Current palette and typography migrations

- Iris `#8B5CF6` replaced Electric `#4DBBFF` for Foundation and selected states.
- Volt is `#62EE10` and is used for Build and primary actions.
- Plasma remains the Commit color.
- DM Sans is the general application UI family.
- Syne remains restricted to its defined brand and onboarding roles.

When older documents conflict, `theme/index.ts` is the executable token source of truth.

## Temporary behavior

The calendar gate is temporarily disabled for launch development. In `utils/dayUnlock.ts`, a completion from today currently returns re-entry State A and makes the incremented day immediately available.

The intended product behavior remains calendar-based unlocking at the user's next local midnight. Re-enable and verify the gate before release. Do not mistake the temporary launch behavior for the permanent product contract.

## Known issues and gaps

- Current date handling extracts UTC dates with `toISOString()` even though the intended unlock behavior is based on the user's stored timezone.
- Graduation cannot be auto-presented exactly once across app launches without a persisted acknowledgement field or an equivalent product-level decision.
- `app.json` declares a light interface and white native splash background despite the dark visual foundation.
- The tab layout's development shortcut targets `/dev-menu`; verify it against the actual development routes before relying on it.
- Testing requirements exist in older documentation, but the current `package.json` does not expose a test command or testing dependencies.
- The Home/Graduation meditation runtime and standalone preview are synchronized with `npm run sync:meditation-figure`.

## Working tree caution

At the time this guide was introduced, the repository contained user-owned untracked development/configuration files and visual assets. Inspect `git status` before every change and do not modify or remove unrelated files.

## Documentation state

The Profile/Settings contracts, canonical arc/focus/day data model, current palette, and SVG resolver decision are synchronized across `DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/COMPONENTS.md`, `docs/DATA.md`, and this status file. `docs/CLAUDE.md` remains historical context and explicitly marks superseded decisions.
