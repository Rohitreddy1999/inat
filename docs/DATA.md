# INAT — Data Architecture Document
Version 1.0 | Written before first line of code
Supabase (Postgres) + Supabase Storage
This document is locked. No schema changes
without updating this document first.

---

## CORE PRINCIPLE

Frontend never touches Supabase directly.
All database operations go through services/:

  Component → service function → Supabase

This means the database can change or migrate
to a different provider without touching
a single component file.

---

## THE DATA CHAIN

Every piece of user data connects through
one UUID — the auth user ID:

  auth.users (UUID — master identity)
      ↓
  profiles (same UUID as primary key)
      ↓
  user_journeys (references profiles.id)
      ↓
  daily_completions (references user_journeys.id)

Supporting tables (no user data, public read):
  tracks → subtracks → curriculum_days

---

## TABLE DEFINITIONS

---

### auth.users
Managed entirely by Supabase Auth.
Never write to this table directly.

Key fields used by INAT:
  id          UUID         master user identity
  email       text         login credential
  created_at  timestamptz

Trigger: on_auth_user_created fires on every
new signup and auto-creates a profiles row.

---

### profiles
One row per user. Created automatically by trigger.

```sql
CREATE TABLE profiles (
  id               UUID PRIMARY KEY
                   REFERENCES auth.users(id)
                   ON DELETE CASCADE,
  full_name        TEXT,
  avatar_url       TEXT,
  life_stage       TEXT,
  discovery_answer JSONB DEFAULT '{}',
  open_answer      TEXT,
  recommended_track TEXT,
  location_city    TEXT,
  timezone         TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

discovery_answer JSONB structure (version 2):
{
  "version": 2,
  "answers": {
    "energy":   ["e_motions", "e_mindrace"],
    "barrier":  ["b_drift"],
    "channel":  ["c_words"],
    "identity": ["i_lostwant"],
    "presence": ["p_blur"]
  },
  "openAnswer": "...",
  "scores":     { "Move": 6.9, "Calm": 10.4, "Mindful": 58.5, "Rhythm": 0.0, "Express": 5.75 },
  "confidence": "high",
  "primary":    "Mindful",
  "secondary":  "Calm",
  "reasons":    [{ "id": "e_motions", "text": "Just going through the motions." }],
  "healthMode": false
}
Direct-path users (no quiz): version:2, answers:{}, openAnswer, no score/match fields.

life_stage values:
  "still_studying" | "building_career" |
  "juggling_family" | "reinventing"

RLS policy:
  Users can only read and write their own row.
  auth.uid() = id

Trigger to auto-create on signup:
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

Service functions:
  getProfile(userId)
  updateProfile(userId, data)
  saveOnboardingAnswers(userId, answers, scores)
  uploadAvatar(userId, imageUri)

---

### tracks
Static lookup table. Public read.
Populated once. Rarely changes.

```sql
CREATE TABLE tracks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  tagline    TEXT,
  icon_name  TEXT,
  color      TEXT,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Seed data:
  move     | Move     | #3DF5A6
  rhythm   | Rhythm   | #82D4FF
  express  | Express  | #FF4FD8
  calm     | Calm     | #82D4FF
  mindful  | Mindful  | #3DF5A6

Service functions:
  getAllTracks()

---

### subtracks
One row per subtrack. Public read.
MVP: one live subtrack per track.
Additional subtracks appear as Coming Soon
automatically when is_live = false.
No code change needed to add new subtracks.

```sql
CREATE TABLE subtracks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id   UUID REFERENCES tracks(id),
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  description TEXT,
  is_live    BOOLEAN DEFAULT false,
  is_free    BOOLEAN DEFAULT true,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

is_live logic on Focus screen:
  true + is_free = true  → selectable card
  true + is_free = false → locked card, "Pro" badge
  false                  → "Coming Soon" card, not selectable

Service functions:
  getSubtracksByTrack(trackId)
  getAllSubtracks()

---

### curriculum_days
All 21 days of content per subtrack.
Public read. Never changes per user.

```sql
CREATE TABLE curriculum_days (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtrack_id         UUID REFERENCES subtracks(id),
  day_number          INTEGER NOT NULL,
  phase               TEXT NOT NULL,
  title               TEXT NOT NULL,
  duration_minutes    INTEGER,
  difficulty          TEXT,
  instructions        JSONB,
  why_text            TEXT,
  quote_text          TEXT,
  quote_author        TEXT,
  primary_video_url   TEXT,
  primary_video_label TEXT,
  refs                JSONB,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subtrack_id, day_number)
);
```

phase values: 'foundation' | 'build' | 'commit'

Phase color mapping (in theme/index.ts, not DB):
  foundation → Glacial #82D4FF  (days 1-7)
  build      → Surge #3DF5A6   (days 8-14)
  commit     → Plasma #FF4FD8  (days 15-21)

Service functions:
  getDayContent(subtractId, dayNumber)
  getAllDays(subtractId)

---

### user_journeys
One active row per user at any time.
A user can have multiple completed journeys
(one per subtrack finished).

```sql
CREATE TABLE user_journeys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subtrack_id     UUID REFERENCES subtracks(id),
  current_day     INTEGER DEFAULT 1,
  is_active       BOOLEAN DEFAULT true,
  is_completed    BOOLEAN DEFAULT false,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  last_active_at  TIMESTAMPTZ DEFAULT NOW(),
  graduation_seen BOOLEAN DEFAULT false,
  reflections     JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enforce one active journey per user
CREATE UNIQUE INDEX one_active_journey_per_user
ON user_journeys(user_id)
WHERE is_active = true;
```

reflections JSONB: journey-level reflection
written at Graduation Beat 3.
Not per-day — that lives in daily_completions.

last_active_at: updated on every app open.
Used for re-entry State C gap calculation.

Re-entry state derivation (in utils/dayUnlock.ts):
  today = current calendar date (user timezone)
  last = MAX(daily_completions.completed_date)

  no completions                → State D
  last === today                → State B
  last === yesterday            → State A
  last < yesterday              → State C
  current_day > 21, is_completed → Graduation state

RLS policy:
  Users can only read and write their own rows.
  auth.uid() = user_id

Service functions:
  getActiveJourney(userId)
  getAllJourneys(userId)
  createJourney(userId, subtractId)
  advanceDay(journeyId)
  completeJourney(journeyId)
  updateLastActive(journeyId)
  saveGraduationReflection(journeyId, text)

---

### daily_completions
One row per completed day per journey.
This is the source of truth for all progress.

```sql
CREATE TABLE daily_completions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id      UUID REFERENCES user_journeys(id) ON DELETE CASCADE,
  day_number      INTEGER NOT NULL,
  completed_date  DATE NOT NULL,
  feeling         TEXT,
  reflection_note TEXT,
  duration_actual INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(journey_id, day_number)
);
```

completed_date is DATE not TIMESTAMPTZ.
This is intentional. Midnight unlock compares
calendar dates not timestamps. A completion at
11:58pm on July 14 should unlock July 15 —
DATE comparison handles this correctly
regardless of timezone.

feeling values:
  'great' | 'good' | 'okay' | 'hard'

RLS policy:
  Users can only access completions for their
  own journeys (join check via user_journeys).

Service functions:
  completeDay(journeyId, dayNumber, feeling, note)
  getDayCompletion(journeyId, dayNumber)
  getAllCompletions(journeyId)
  getLastCompletionDate(journeyId)

---

## INDEXES FOR PERFORMANCE

```sql
-- Most common query: get active journey for user
CREATE INDEX idx_journeys_user_active
ON user_journeys(user_id)
WHERE is_active = true;

-- Progress screen: all completions for journey
CREATE INDEX idx_completions_journey
ON daily_completions(journey_id, day_number);

-- Re-entry logic: last completion date
CREATE INDEX idx_completions_date
ON daily_completions(journey_id, completed_date DESC);

-- Curriculum: get day content
CREATE INDEX idx_curriculum_subtrack_day
ON curriculum_days(subtrack_id, day_number);
```

---

## SUPABASE STORAGE

Buckets:

  avatars/
    {user_id}/profile.jpg
    Access: authenticated users, own folder only

  curriculum_media/ (future — not MVP)
    {subtrack_id}/day_{N}/video.mp4
    {subtrack_id}/day_{N}/thumbnail.jpg
    Access: public read

Avatar upload flow:
  1. User selects photo in Profile screen
  2. storage.from('avatars').upload(path, file)
  3. Get public URL back
  4. updateProfile({ avatar_url: url })
  5. Profile re-renders with new avatar

For video content:
  MVP: YouTube URLs in curriculum_days.primary_video_url
  Growth: Cloudflare R2 or Mux for hosted video
  Schema does not change — only the URL host changes.

---

## SCALABILITY PATH

Current (Supabase free tier):
  Handles ~500 concurrent users comfortably.
  No action needed.

At 1,000+ users:
  Enable Supabase Pro ($25/month).
  Connection pooling via PgBouncer (built in).
  No schema changes.

At 10,000+ users:
  Add read replicas for curriculum_days.
  Cache curriculum content in-app (safe —
  curriculum never changes per user).
  Supabase handles this without migration.

At 100,000+ users:
  Migrate to AWS RDS Postgres + connection pooler.
  Schema stays identical.
  Service layer makes this a config change only.

For video at scale:
  Move from YouTube embeds to Mux or Cloudflare Stream.
  curriculum_days.primary_video_url just points
  to a different host. Schema unchanged.

---

## DATA PRIVACY

- Never log emails or onboarding answers
- open_answer is sensitive — never expose in
  error messages, logs, or analytics events
- discovery_answer is sensitive — RLS ensures
  only the user can read their own row
- Delete account → CASCADE deletes profiles,
  user_journeys, and daily_completions automatically
- Supabase encrypts all data at rest by default
- No third-party analytics that receive user data

---

## SERVICE LAYER — COMPLETE FUNCTION LIST

### auth.service.ts
  signUp(email, password, fullName)
  signIn(email, password)
  signOut()
  getSession()
  resetPassword(email)
  deleteAccount(userId)

### profile.service.ts
  getProfile(userId)
  updateProfile(userId, data)
  saveOnboardingAnswers(userId, answers, scores)
  uploadAvatar(userId, imageUri)

### journey.service.ts
  getActiveJourney(userId)
  getAllJourneys(userId)
  createJourney(userId, subtractId)
  advanceDay(journeyId)
  completeJourney(journeyId)
  updateLastActive(journeyId)
  saveGraduationReflection(journeyId, text)

### completion.service.ts
  completeDay(journeyId, dayNumber, feeling, note)
  getDayCompletion(journeyId, dayNumber)
  getAllCompletions(journeyId)
  getLastCompletionDate(journeyId)

### curriculum.service.ts
  getDayContent(subtractId, dayNumber)
  getAllDays(subtractId)
  getAllTracks()
  getSubtracksByTrack(trackId)
  getAllSubtracks()

---

## ZUSTAND STORES (session state only)

### journey.store.ts
Hydrated on app open from Supabase.
Reset on sign out.
Never persisted to AsyncStorage.

  State:
    activeJourney: Journey | null
    currentDay: number
    completedDays: number[]
    lastCompletionDate: Date | null
    reentryState: 'A' | 'B' | 'C' | 'D' | null
    isHydrated: boolean

  Actions:
    hydrate(userId): fetches from Supabase
    markDayComplete(feeling, note): writes to DB + updates store
    reset(): clears all state on sign out

### onboarding.store.ts
Temporary — exists only during onboarding flow.
Cleared completely after journey created.

  State:
    lifeStage: string | null
    answers: Record<string, string[]>   keys: energy|barrier|channel|identity|presence
    openAnswer: string
    matchResult: { primary, secondary, confidence, scores, reasons, healthMode }
    selectedTrack: TrackName | null
    selectedSubtractId: string | null

  Actions:
    setLifeStage(value)
    setAnswer(question, selections)
    runMatch(): calls inat-engine runMatch(), stores result, sets selectedTrack
    setSelectedTrack(track: TrackName)
    setSelectedSubtractId(id)
    setOpenAnswer(text)
    clear(): called immediately after createJourney succeeds

Rule: Never rely on store being populated without
first calling hydrate(). App close = store gone.
App open = hydrate() runs fresh from Supabase.
