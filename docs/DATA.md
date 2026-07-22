# INAT — Data Architecture

Last reviewed: July 22, 2026

This document describes the current application data contract. Update it before changing persisted data or introducing a new backend dependency.

## Data boundary

All persisted operations follow:

`Screen or component → store/service → lib/supabase.ts → Supabase`

Screens and components never create Supabase clients or query tables directly. Zustand is session state only and is never the durable source of truth.

## Identity chain

The authenticated Supabase user UUID connects all private data:

`auth.users → profiles → user_journeys → user_day_logs`

Curriculum is public read-only application data:

`arcs → focuses → days → day_steps`

The retired `tracks`, `subtracks`, `curriculum_days`, and `daily_completions` model must not be reintroduced.

## Current tables

### profiles

One private row per authenticated user. Fields used by the app:

- `id` — auth user UUID and primary key.
- `full_name` — display name; auth `user_metadata.full_name` is the UI fallback while older profile rows are incomplete.
- `avatar_url` — public Storage URL for the current avatar.
- `life_stage`, `discovery_answer`, `open_answer`, `recommended_track` — sensitive onboarding data retained for matching and migration compatibility; never shown on Profile.
- `timezone` — intended basis for local calendar behavior.
- `created_at`.

RLS must restrict reads and writes to `auth.uid() = id`. Signup metadata contains `full_name`, and the database signup trigger is expected to create the profile row.

### arcs

The five broad fields: Move, Rhythm, Express, Calm, and Mindful. Fields used by the app are `id`, `name`, `description`, `icon_key`, and `created_at`.

### focuses

Specific disciplines within an arc. Fields used by the app are `id`, `arc`, `name`, `description`, `icon_key`, `is_active`, and `created_at`.

### days

One curriculum day for an arc/focus pair. The app reads `id`, `arc`, `focus`, `day_number`, `title`, `subtitle`, `duration_mins`, `phase`, `quote`, `quote_author`, `why_this_matters`, and `created_at`. Valid curriculum positions are 1–21.

### day_steps

Ordered guidance belonging to a day. The app reads `id`, `day_id`, `step_number`, `title`, `instruction`, `has_video`, `video_url`, `video_label`, and `created_at`.

### user_journeys

The user's selected arc/focus and current position. Fields used by the app are `id`, `user_id`, `arc`, `focus`, `current_day`, `is_active`, `started_at`, `completed_at`, and `created_at`.

Only one journey should be active per user. Creating a replacement journey deactivates every other active journey. Completing Day 21 stores `current_day = 22` and `completed_at`; presentation layers must render that as Complete, never “Day 22 of 21.”

### user_day_logs

Immutable completion evidence. Fields used by the app are `id`, `user_id`, `journey_id`, `arc`, `focus`, `day_number`, `feeling`, `completed_at`, and `created_at`.

Completion inserts a log and then advances the journey. Reads are ordered by curriculum day for journey hydration and by completion time where calendar history matters.

### user_onboarding

Structured onboarding responses and match output. Fields represented in the application type are `id`, `user_id`, the five response fields, `matched_arc`, `matched_focus`, `confidence_score`, `completed_at`, and `created_at`.

## Authentication and account operations

`auth.service.ts` owns:

- `signUp(email, password, fullName)`
- `signIn(email, password)`
- `signOut()`
- `getSession()`
- `resetPassword(email)`
- `updateEmail(email)`
- `deleteAccount()`

Email changes use `supabase.auth.updateUser` and may require verification before the authenticated address changes.

Account deletion is privileged and must be performed by the authenticated `delete-account` Supabase Edge Function. The client must never substitute sign-out for deletion or report success after a missing/failed function. The backend operation must delete the auth user and rely on verified cascading foreign keys for private records.

## Profile and avatar storage

The `avatars` Storage bucket is public-read with authenticated user-scoped writes:

`avatars/{user_id}/profile.jpg` or `profile.png`

Upload flow:

1. The user grants photo-library access and selects a square crop.
2. `profile.service.ts` uploads with `upsert: true` into the user's folder.
3. The service obtains the public URL and adds a cache-busting query value.
4. The service updates `profiles.avatar_url`.
5. The Profile screen updates only after both storage and profile writes succeed.

Required service functions are `getProfile`, `updateProfile`, `uploadAvatar`, and `saveOnboardingAnswers`.

## Local notification state

Practice reminders are device-local and are not stored in Supabase. `notification.service.ts` uses one stable scheduled-notification identifier, `inat-daily-practice`, and reads the operating system's scheduled requests as the source of truth.

The service exposes:

- `getPracticeReminder()`
- `savePracticeReminder(enabled, hour, minute)`
- `formatReminderTime(hour, minute)`

Android uses the `practice-reminders` notification channel. Permission denied, scheduling failure, enabled, and disabled states must remain distinguishable. Remote push delivery is not part of this feature.

## Service inventory

### curriculum.service.ts

- `getAllArcs()`
- `getFocusesByArc(arc)`
- `getDayWithSteps(arc, focus, dayNumber)`

### journey.service.ts

- `createJourney(userId, arc, focus)`
- `deactivateJourney(userId)`
- `setJourneyDay(journeyId, day)`
- `getActiveJourney(userId)`

### completion.service.ts

- `completeDay(journeyId, arc, focus, dayNumber, feeling)`
- `getDayCompletion(journeyId, dayNumber)`
- `getAllCompletions(journeyId)`
- `getLastCompletionDate(journeyId)`

## Session store

`journey.store.ts` hydrates the active journey and its logs into `activeJourney`, `currentDay`, `completedDays`, `lastCompletionDate`, `reentryState`, and `isHydrated`. `reset()` clears session state on sign-out or confirmed deletion. `devOverride()` is development-only state simulation, not persistence.

## Privacy and correctness rules

- Never log email addresses, discovery answers, or the open answer.
- Treat discovery and open-answer content as sensitive data protected by RLS.
- Validate account deletion with an authenticated end-to-end cascade test before release.
- Local-calendar features should use the stored profile timezone. The current `getLastCompletionDate` UTC slicing is known debt and must not be copied into new features.
- Loading or backend failures must not be presented as empty or successful states.
