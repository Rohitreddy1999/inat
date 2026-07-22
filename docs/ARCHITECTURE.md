# INAT — Architecture Document
Version 1.0 | Written before first line of code
This document is locked. Nothing gets built that
isn't in here. Nothing gets added without updating
this document first.

---

## APP IDENTITY
Name: INAT (I Never Accept Theoretical limits)
Platform: React Native + Expo
Inspired by: Novak Djokovic
Philosophy: A 21-day structured path that gives
users the foundation to explore any field
independently. By day 22, they feel confident
enough to go further on their own. INAT gave
them the base. What they do with it is theirs.
Five paths: Move · Rhythm · Express · Calm · Mindful

---

## TECH STACK
- Framework: React Native + Expo SDK 51+
- Router: Expo Router (file-based)
- Styling: NativeWind + theme/index.ts tokens
- Animation: React Native Reanimated 3
- State: Zustand (session) + Supabase (persisted)
- Backend: Supabase (auth + DB + RLS)
- Language: TypeScript strict mode, no any
- Testing: React Native Testing Library
- Build/Submit: Expo EAS

---

## FOLDER STRUCTURE

```
inat/
├── app/
│   ├── (auth)/
│   │   ├── index.tsx        # Splash
│   │   ├── welcome.tsx      # Welcome
│   │   ├── login.tsx        # Login
│   │   └── signup.tsx       # Signup
│   ├── (onboarding)/
│   │   ├── life-stage.tsx   # Q1 — life stage
│   │   ├── bridge.tsx       # How to find track
│   │   ├── energy.tsx       # Q — energy state (step 2/7)
│   │   ├── barrier.tsx      # Q — barrier (step 3/7)
│   │   ├── channel.tsx      # Q — channel / single select (step 4/7)
│   │   ├── identity.tsx     # Q — identity belief (step 5/7)
│   │   ├── presence.tsx     # Q — presence / single select (step 6/7)
│   │   ├── q6.tsx           # Free text (step 7/7)
│   │   ├── match.tsx        # Track recommendation
│   │   └── focus.tsx        # Subtrack selection
│   ├── (tabs)/
│   │   ├── index.tsx        # Home
│   │   ├── ascent.tsx       # Progress
│   │   ├── community.tsx    # Community (placeholder)
│   │   └── profile.tsx      # Profile + Settings
│   ├── day.tsx              # Day screen (pushed)
│   └── graduation.tsx       # Graduation (pushed)
├── components/
│   ├── core/                # Text, Button, Card, Badge, Input, SkeletonCard
│   ├── forms/               # OptionCard, StepDots
│   ├── tasks/               # HoldButton, StepCard
│   ├── navigation/          # BottomNav, BackButton
│   └── shared/              # ReentryCard, Silhouette, DayCard, TrackCard...
├── services/
│   ├── auth.service.ts
│   ├── journey.service.ts
│   ├── curriculum.service.ts
│   ├── completion.service.ts
│   └── profile.service.ts
├── stores/
│   ├── journey.store.ts
│   └── onboarding.store.ts
├── theme/
│   └── index.ts             # ALL tokens — never hardcode values
├── types/
│   └── index.ts             # ALL TypeScript types
├── utils/
│   ├── inat-brain.ts        # ALL scoring intelligence — vectors, weights, questions
│   ├── inat-engine.ts       # Matching engine logic — DO NOT TUNE HERE
│   └── dayUnlock.ts         # Day unlock + re-entry state logic
└── docs/
    ├── ARCHITECTURE.md      # This file
    ├── DATA.md
    └── COMPONENTS.md
```

---

## NAVIGATION ARCHITECTURE

### Auth check (Splash only)
```
No session          → Welcome
Session, no journey → Onboarding: life-stage
Session, journey    → Home (tabs)
Session, day 21 complete, graduation not seen → Graduation
Session, day 21 complete, graduation seen     → Home
```

### Onboarding flow
```
life-stage → bridge
               ↓ answer questions             ↓ I know what I want
              energy → barrier → channel      match (no recommendation)
                → identity → presence → q6         ↓
                                   ↓          focus (SAME screen)
                                 match ——————→      ↓
                                                  Home
```
Both paths end at the same focus.tsx and the same Home.
No exceptions. No separate components for each path.
Quiz path: 7 steps total (StepDots total=7). life-stage is step 1;
energy=2, barrier=3, channel=4, identity=5, presence=6, q6=7.

### Main app tabs
```
Tab 1: Home     → Day screen (pushed on tap)
Tab 2: Ascent   → Progress screen
Tab 3: Community → Placeholder
Tab 4: Profile  → Profile + Settings
```

### Pushed screens (no tab bar)
```
Day screen    — pushed from Home
Graduation    — pushed after Day 21 hold-complete
```

---

## SCREEN INVENTORY

### (auth) group

**Splash**
Checks Supabase auth session on mount.
Shows INAT wordmark animation (2-3 seconds).
Routes based on session + journey state.
No back navigation. Internet required.
Shows offline state if no connection.

**Welcome**
INAT wordmark + "21 days. One decision."
CTA 1: "Begin your journey →" → Signup
CTA 2: "I already have an account" → Login
No back navigation.

**Login**
Email + password fields.
"Sign in" primary CTA.
"Forgot password" link.
"Don't have an account? Sign up" link.
Error states for wrong credentials.

**Signup**
Full name + email + password fields.
"Create account" primary CTA.
"Already have an account? Sign in" link.
On success: trigger auto-creates profile row.
Routes to onboarding life-stage.

---

### (onboarding) group

**Life Stage — Q1** (single select)
Progress: StepDots step 1 of 7.
Question: "Where are you in life right now?"
Options (icon cards): Still studying / Building my career /
Juggling family life / Reinventing myself
CTA: "Continue" (enabled after selection).
Writes life_stage to Supabase profiles on continue.

**Bridge**
"How would you like to find your track?"
Option 1 (RECOMMENDED badge): "Answer a few questions"
Option 2: "I know what I want"
Note below: "You can always retake questions later"
No progress indicator — this is a routing decision not a question.
Routes to q2 or match.

**Q — Energy** id:'energy' (multi, pick up to 2)
GhostNumber: 01
"How's your energy right now?"
5 options. Sourced from inat-brain.ts QUESTIONS[0].

**Q — Barrier** id:'barrier' (multi, pick up to 2)
GhostNumber: 02
"When you start something and it doesn't stick, what happens?"
6 options. Sourced from inat-brain.ts QUESTIONS[1].

**Q — Channel** id:'channel' (single select)
GhostNumber: 03
"If you had a free hour and no pressure, what sounds fun?"
5 options. Sourced from inat-brain.ts QUESTIONS[2].

**Q — Identity** id:'identity' (multi, pick up to 2)
GhostNumber: 04
"There's a story behind why you are the way you are. Which one is yours?"
6 options. Sourced from inat-brain.ts QUESTIONS[3].

**Q — Presence** id:'presence' (single select)
GhostNumber: 05
"When did you last notice something good in an ordinary day?"
4 options. Sourced from inat-brain.ts QUESTIONS[4].

Scoring: vector-based engine in two files:
utils/inat-brain.ts (data + tuning) and utils/inat-engine.ts (logic).
Never edit inat-engine.ts for tuning. Only edit inat-brain.ts.

**Q6 — Free Text**
GhostNumber: 05
"What's the thing you keep saying you'll start when the time is right?"
Large open textarea.
Hint below: "Nobody else sees this. Just be honest."
CTA: "Show my match →"
Writes open_answer to Supabase profiles.

**Match / Recommendation**
Label: "YOUR MATCH"
Headline: "Here's what we think — but you know yourself best."
All 5 tracks shown as TrackCard components.
Highest scoring track: glowVolt + RECOMMENDED badge.
User can select any track regardless of recommendation.
Track one-liners shown on each card.
CTA: "Start this track →"
If came from direct path: no recommendation, all tracks equal.

**Focus — Subtrack Selection**
Track name pill header (Electric bg, track icon).
"Pick your focus"
"Choose what you want to work on for the next 21 days."
Live subtracks: real SubtrackCard, selectable.
Future subtracks: "Coming Soon" card, not selectable.
Coming Soon cards appear automatically when subtrack exists
in DB with is_live = false. No code change needed to add them.
CTA: "Begin my 21 days →" (disabled until selection made).
Creates user_journeys row in Supabase on confirm.
Clears onboarding.store after journey created.

---

### (tabs) group

**Home**
Re-entry card (top, only for returning users):

  State A — New day available:
    Phase label + "DAY {N} IS LIVE"
    Phase-based message (see re-entry logic)
    CTA: "Let's go" → pushes Day screen

  State B — Today already done:
    Phase label + "DAY {N} COMPLETE"
    "That's the one that counts."
    "Day {N+1} opens tonight at midnight."
    No CTA — acknowledgment only.

  State C — Gap return:
    "WELCOME BACK"
    "Day {N} is still here."
    "The circuit doesn't judge. It waits."
    CTA: "Pick up where you left off" → pushes Day screen

  State D — First ever open (Day 1, no completions):
    No re-entry card. Goes straight to DayCard.

Below re-entry state: DayCard component.
BottomNav fixed at bottom.

**Day Screen** (pushed, no BottomNav)
Guided sequential session model. No free-toggle steps.
Fixed header: back arrow (left) + phase badge (right). No decorative bloom.
Title: day title in Syne-ExtraBold, dynamic font size (40/32/26px by char count,
  max 3 lines). Subtitle: focus name · duration in Hanken Grotesk caption.
Scrollable body sections (in order):
  Before You Start — only if day data includes equipment[]. Phase-color ▸ list.
  Why does this matter? — collapsible. maxHeight Reanimated animation. Collapsed by default.
  Done pills row — completed steps stack here as small pills (step number + check).
    Each pill is tappable to re-expand that step for re-reading.
  Step cards — one active card (full opacity, spring entrance). Steps below at 40% opacity.
    Active card: STEP X OF Y label, instruction text, optional inline video link,
    Done button (60% width / 44px / 22px radius / Hanken medium / phaseColor).
    Tapping Done collapses current step to pill, next step rises up as active.
Fixed bottom (NEVER scrolls):
  LinearGradient fade (transparent → abyss).
  HoldButton: disabled (Fathom bg, muted label) until all steps done.
  When all done: solid phaseColor bg, arcLight label, full hold interaction.
  On hold complete: CompletionMoment overlay appears (not a new screen).
CompletionMoment overlay (absolute fill, zIndex 100):
  Phase color pulse animation on enter.
  "DAY X COMPLETE" anchor header (12px spaced caps, phaseColor).
  Thin phase-color rule (40% width, 20% opacity).
  Day quote — large Syne-ExtraBold, centered, Arc-Light. 28px / 24px by length.
  Attribution — 14px Hanken, arcLight 50%.
  "HOW DID TODAY FEEL?" — 4 feeling pills in 2×2 grid.
    Default border: 1.5px phaseColor 60% opacity. Selected: 2px full + 15% bg tint.
    Scale tap animation. 600ms delay then calls completeDay() + navigates.
BottomNav NOT shown on this screen.

**Ascent — Progress**
Silhouette system:
  Human silhouette SVG in background.
  Lights bottom-to-top as days complete.
  Color = current phase color.
  Slow float animation.
Day grid: all 21 days shown.
  Completed: phase color fill.
  Current: pulsing phase border.
  Future: faint empty.
Three truths section (from daily_completions data).
Stats: streak, phase name, days remaining.
BottomNav fixed.

**Community** (MVP placeholder)
Styled placeholder screen.
"Community coming soon."
BottomNav fixed.

**Profile**
Avatar (initials fallback if no image).
Full name, life stage.
Active journey summary card.
Completed journeys list.
Settings section:
  Notifications toggle
  Change email
  Change password
  Delete account (confirmation required)
  Sign out
BottomNav fixed.

---

### Special screens (pushed)

**Graduation** (full screen, no BottomNav, continuous two-act experience)

Act 1 — Transcendence:
  Reuses the Home Three.js meditation scene in Graduation mode.
  The completed figure emerges in continuous Abyss space while energy releases
  from the figure and cycles Iris → Volt → Plasma with shader-level blending.
  No text interrupts the opening transformation. Once it settles, reveal:
  “You stopped waiting for the right time. You made it.”
  Primary action: “What’s next →”.

Act 2 — The handoff:
  The same scene pulls back and becomes a quiet witness while decision content
  rises into view. Heading: “The next move is yours.”
  Primary action: “Begin another circuit” → Arc then Focus selection, without
  returning through Life Stage or discovery onboarding.
  Secondary action: “See my journey” → completed Ascent record.
  “Go deeper” is an honest non-interactive Coming Soon row until a real deeper
  experience exists. “Share the proof” opens the native share sheet with only
  the completed Focus name. “Return home” is the quiet explicit exit.

Back navigation and gestures are disabled on Graduation. Reduced-motion and
screen-reader users receive the completed figure and controls immediately.
WebGL loading or failure never blocks the copy or actions.

---

## ROUTING RULES (non-negotiable)

1. Auth check happens ONLY in Splash. No other screen checks auth.

2. Journey check happens ONLY in Splash. Result stored in
   journeyStore. All screens read from store, never re-fetch on mount.

3. Onboarding is ONE-WAY. Once a journey exists in Supabase,
   Splash never routes to onboarding again.
   Retaking questions is done from Profile, not by re-entering
   the onboarding flow.

4. Direct path and quiz path BOTH end at the same focus.tsx.
   No separate components.

5. Day screen is always pushed from Home. Never navigated to directly.
   Deep links route to Home, not Day.

6. Graduation is pushed after hold-complete fires on Day 21.
   Day 21 completion sets `current_day` to 22 and records `completed_at` while
   retaining the completed journey as the current record until another circuit
   is created. Graduation does not repeat that mutation when it remounts.
   The handoff routes to Arc/Focus selection, Ascent, or Home.
   Back navigation is disabled on Graduation.

7. BottomNav is NEVER shown on Day screen or Graduation screen.

---

## DAY UNLOCK LOGIC (in utils/dayUnlock.ts)

- Day N+1 unlocks at midnight after Day N is completed.
  Uses calendar DATE comparison, not 24-hour timer.
  A completion on July 14 unlocks the next day on July 15
  regardless of what time the completion happened.

- Early access: subtle "ahead of schedule?" option on Home
  when current day is done and next day exists.
  Not prominent — the 21-day rhythm is the product.

- Missed days: the next day still waits. No penalty. No reset.
  Sequential — cannot do Day 10 without completing Day 9.

- Day 21 completion: triggers Graduation screen push.

- Timezone: stored in profiles.timezone. All date comparisons
  use the user's local timezone, not UTC.

---

## RE-ENTRY STATE LOGIC (in utils/dayUnlock.ts)

On app open after auth confirmed, always fetch fresh from Supabase:

```
today = current calendar date in user's timezone
last_completion_date = MAX(completed_date) from daily_completions
                       WHERE journey_id = active_journey.id

if no active journey:
  → route to onboarding

if no completions exist:
  → State D (first time, show Day 1 card, no re-entry card)

if last_completion_date === today:
  → State B (already done today)

if last_completion_date === yesterday:
  → State A (new day available)

if last_completion_date < yesterday:
  → State C (gap return, calculate daysSince)

if current_day > 21 AND completed_at is set:
  → Home completed state, with an explicit route back to Graduation
```

Phase-based messages for State A:
  Days 1-7:  "You're building the base. Show up."
  Days 8-14: "Day {N}. This is where most people stop."
  Days 15-21: "Day {N}. This is who you're becoming."

---

## FORBIDDEN — NEVER DO THESE

- Call Supabase directly from a component — use services/ only
- Hardcode any color, font size, or spacing value — use theme/index.ts
- Use React Native's Animated API — use Reanimated 3 only
- Use 'any' in TypeScript — fix the type properly
- Put HoldButton inside a ScrollView
- Show BottomNav on Day screen or Graduation
- Create a second Supabase client — one client only
- Add a new color to the palette — palette is closed
- Build a screen not listed in this document without updating it first
- Use glassmorphism on dark backgrounds — use border-glow instead
- Write pure #FFFFFF text — use colors.textHi or colors.arcLight

---

## PHASE VERIFICATION CHECKLISTS

### Phase 1 — Shell and navigation
- [ ] App opens on real iOS device without error
- [ ] App opens on real Android device without error
- [ ] Unauthenticated → Splash → Welcome
- [ ] Authenticated, no journey → Onboarding life-stage
- [ ] Authenticated, with journey → Home
- [ ] All 4 tabs navigate correctly
- [ ] Day screen pushes from Home, back returns to Home
- [ ] Back navigation works on all onboarding screens
- [ ] TypeScript compiles with zero errors
- [ ] No console errors on any screen
- [ ] BottomNav not visible on Day screen

### Phase 2 — Onboarding
- [ ] All 7 question screens display correctly (energy/barrier/channel/identity/presence/q6 + life-stage)
- [ ] Single select enforced on life-stage, channel, presence
- [ ] Multi select max 2 enforced on energy, barrier, identity
- [ ] Shake animation fires on attempted 3rd selection
- [ ] StepDots advance correctly through questions
- [ ] Matching engine tested against all 4 runMatch() test cases
- [ ] life_stage written to Supabase profiles
- [ ] open_answer written to Supabase profiles
- [ ] discovery_answer scores written to Supabase profiles
- [ ] Correct track highlighted on match screen
- [ ] Direct path shows no recommendation
- [ ] user_journeys row created on focus confirm
- [ ] onboarding.store cleared after journey created
- [ ] Both paths land on same Home screen

### Phase 3 — Core experience
- [ ] Home shows correct day number and phase
- [ ] Re-entry card shows correct state for each scenario
- [ ] Day screen content loads from Supabase
- [ ] StepCards checkable and state persists in session
- [ ] HoldButton fixed to bottom, never scrolls
- [ ] Hold completes after 1 second on real device
- [ ] Haptic feedback fires on completion (Expo Haptics)
- [ ] Completion writes to daily_completions in Supabase
- [ ] current_day advances in user_journeys
- [ ] Day 21 completion triggers Graduation push

### Phase 4 — Re-entry card
- [ ] State A correct: new day available
- [ ] State B correct: today already done
- [ ] State C correct: gap return with days count
- [ ] State D correct: no card shown for Day 1
- [ ] Midnight unlock works (test with manual date)
- [ ] Gap of 7+ days shows correct message
- [ ] Phase-based messages correct for each phase

### Phase 5 — Progress and Graduation
- [ ] Silhouette lights correctly per completed days
- [ ] Silhouette color matches current phase
- [ ] Float animation runs smoothly
- [ ] Day grid shows correct completion states
- [ ] Three truths populated from real data
- [ ] Transcendence opening runs completely and settles into its energy loop
- [ ] Handoff keeps the figure present and exposes the ordered action hierarchy
- [ ] New circuit, Ascent, native sharing, and Home actions route correctly
- [ ] Reduced motion, screen reader, and WebGL failure paths remain usable
- [ ] Back navigation disabled on graduation

### Phase 6 — Profile and settings
- [ ] Profile data loads correctly from Supabase
- [ ] Avatar upload works and displays
- [ ] Sign out works and routes to Welcome
- [ ] Delete account removes all data (CASCADE test)
- [ ] All settings items function correctly

---

## SESSION RULES FOR EVERY CLAUDE CODE SESSION

1. Read CLAUDE.md first. Confirm current phase.
   Do not write any code until confirmed.

2. One concern per session:
   UI sessions → component files only
   Logic sessions → service/util files only
   Schema sessions → Supabase only via MCP
   Never mix layers in one session.

3. Show result after each component before moving to next.
   Never build multiple components without review.

4. Run the relevant phase checklist items after building.

5. End of every session — no exceptions:
   Update CLAUDE.md → show diff → commit → push
   Commit format: [phase/component] what changed

6. Never touch files outside the session scope.

7. Never install a new package without explicit approval.

8. If anything is unclear — ask, do not assume.
