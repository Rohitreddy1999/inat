---
name: INAT
description: 21 days. One decision. Yours.
colors:
  # Surfaces
  bg-abyss: "#07090D"
  bg-fathom: "#0F141A"
  bg-raise: "#141920"
  bg-input: "#FFFFFF0D"
  bg-nav: "#07090DF5"
  bg-scrim: "#07090DCC"
  # Phase accents
  accent-iris: "#8B5CF6"
  accent-volt: "#62EE10"
  accent-plasma: "#FF4FD8"
  # Phase tints (on-surface overlays)
  iris-tint: "#8B5CF614"
  volt-tint: "#62EE1014"
  plasma-tint: "#FF4FD81F"
  selected-bg: "#8B5CF614"
  # Text (dark-surface hierarchy)
  arc-light: "#EAFFF5"
  text-hi: "#FFFFFFF2"
  text-arc: "#EAFFF5"
  text-mid: "#FFFFFF99"
  text-low: "#FFFFFF59"
  text-faint: "#FFFFFF2E"
  # CTA pair (forced contrast: Abyss on Volt)
  cta-bg: "#62EE10"
  cta-text: "#07090D"
  # Utility
  error: "#E24B4A"
  border: "#FFFFFF14"
  border-soft: "#FFFFFF0F"
  border-card: "#FFFFFF12"
  border-strong: "#FFFFFF1F"
  border-iris: "#8B5CF699"
typography:
  display:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "52sp"
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "34sp"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "26sp"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  quote:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "20sp"
    fontWeight: 500
  base:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "15sp"
    fontWeight: 400
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "13.5sp"
    fontWeight: 400
    lineHeight: 1.55
  step:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "14.5sp"
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "12sp"
    fontWeight: 400
  micro:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "11sp"
    fontWeight: 500
    letterSpacing: "0.10em"
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "10sp"
    fontWeight: 500
    letterSpacing: "0.10em"
  badge:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "9sp"
    fontWeight: 700
    lineHeight: "11dp"
  button:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "16sp"
    fontWeight: 700
font-families:
  display:  "Syne-ExtraBold"
  heading:  "Syne-Bold"
  regular:  "DMSans-Regular"
  medium:   "DMSans-Medium"
  semibold: "DMSans-SemiBold"
  bold:     "DMSans-Bold"
  black:    "DMSans-Black"
rounded:
  sm: "10dp"
  md: "14dp"
  lg: "18dp"
  card: "20dp"
  xl: "24dp"
  pill: "28dp"
  full: "9999dp"
spacing:
  1: "4dp"
  2: "8dp"
  3: "12dp"
  4: "16dp"
  5: "20dp"
  6: "24dp"
  8: "32dp"
  10: "40dp"
  page-pad: "22dp"
  page-bottom: "100dp"
  nav-height: "72dp"
  touch-min: "44dp"
  step-row: "14dp"
components:
  button-primary:
    backgroundColor: "{colors.cta-bg}"
    textColor: "{colors.cta-text}"
    rounded: "{rounded.pill}"
    height: "56dp"
    padding: "0 24dp"
  button-primary-disabled:
    backgroundColor: "{colors.cta-bg}"
    textColor: "{colors.cta-text}"
    rounded: "{rounded.pill}"
    height: "56dp"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-mid}"
    rounded: "{rounded.pill}"
    height: "52dp"
    padding: "0 24dp"
  button-completed:
    backgroundColor: "transparent"
    textColor: "phase-color"
    rounded: "{rounded.lg}"
    height: "58dp"
  card-default:
    backgroundColor: "{colors.bg-fathom}"
    rounded: "{rounded.card}"
    padding: "20dp"
  card-accent:
    backgroundColor: "{colors.bg-fathom}"
    rounded: "{rounded.card}"
    padding: "20dp"
  option-card-default:
    backgroundColor: "{colors.bg-fathom}"
    textColor: "{colors.text-mid}"
    rounded: "{rounded.md}"
    padding: "16dp 20dp"
  option-card-selected:
    backgroundColor: "{colors.selected-bg}"
    textColor: "{colors.text-hi}"
    rounded: "{rounded.md}"
    padding: "16dp 20dp"
  input-default:
    backgroundColor: "{colors.bg-input}"
    textColor: "{colors.text-hi}"
    rounded: "{rounded.md}"
    padding: "14dp 16dp"
  badge-streak:
    container: "32×32dp"
    diamond: "22×22dp, borderRadius 5dp, rotate 45deg, phase-color fill"
    innerRotate: "-45deg"
    text: "font-families.bold, 9sp, text-hi"
  badge-phase:
    shape: "pill, borderWidth 1, phase-color border, transparent bg"
    text: "font-families.medium, 10sp, uppercase, phase-color"
    padding: "3dp 8dp"
  badge-recommended:
    shape: "pill, surge fill, surge border"
    text: "font-families.bold, 10sp, uppercase, abyss"
    padding: "3dp 8dp"
  badge-coming-soon:
    shape: "pill, border-soft border, transparent bg"
    text: "font-families.medium, 10sp, uppercase, text-low"
    padding: "3dp 8dp"
  badge-pro:
    shape: "pill (smaller padding), plasma fill, plasma border"
    text: "font-families.bold, 10sp, uppercase, abyss"
    padding: "2dp 6dp"
  skeleton-card:
    backgroundColor: "{colors.bg-fathom}"
    borderColor: "{colors.border-card}"
    borderWidth: "1dp"
    defaultHeight: "72dp"
    defaultRadius: "{rounded.card}"
    animation: "opacity 0.3→0.6, 600ms easeInOut, repeat infinite reverse"
    cycle: "1.2s full cycle (600ms each direction)"
    accessibility: "role none, label Loading"
  step-card-undone:
    textColor: "{colors.text-mid}"
    height: "44dp"
    padding: "{spacing.step-row} 0"
  step-card-done:
    textColor: "{colors.text-mid}"
    height: "44dp"
    padding: "{spacing.step-row} 0"
  hold-button:
    backgroundColor: "{colors.bg-fathom}"
    textColor: "{colors.text-hi}"
    rounded: "{rounded.pill}"
    height: "64dp"
    width: "100%"
  track-card-default:
    backgroundColor: "{colors.bg-fathom}"
    textColor: "{colors.text-hi}"
    rounded: "{rounded.card}"
    padding: "20dp"
  track-card-selected:
    backgroundColor: "{colors.selected-bg}"
    textColor: "{colors.text-hi}"
    rounded: "{rounded.card}"
    padding: "20dp"
  subtrack-card-default:
    backgroundColor: "{colors.bg-fathom}"
    textColor: "{colors.text-hi}"
    rounded: "{rounded.card}"
    padding: "20dp"
  subtrack-card-selected:
    backgroundColor: "{colors.selected-bg}"
    textColor: "{colors.text-hi}"
    rounded: "{rounded.card}"
    padding: "20dp"
---

# Design System: INAT

## 1. Overview: The Proving Ground

**Creative North Star: "The Proving Ground"**

INAT is where commitment becomes physical. The interface does not welcome or comfort — it witnesses. Every screen is built for a specific moment: the 5am moment when the alarm goes off, when inspiration has left the building, and what remains is the system. DM Sans rendered black-weight on near-total-dark communicates one thing: *this is not decorative*. The three phase colors — Foundation, Build, Commit — are not branding choices. They are a progress arc. When the user reaches Plasma, they earned it by living through Iris and Volt first.

The design carries the INAT philosophy structurally. The HoldButton cannot be tapped — it must be held. The graduation moment requires three beats before the user can leave. Day unlocks are calendar-gated, not timer-gated. These are not UX patterns; they are the design asserting that things worth doing require more than a tap.

The palette is closed. No new colors are added. Iris marks Foundation and selected states; Volt marks Build and primary actions; Plasma marks Commit. Their scarcity gives them meaning. A screen where accent color appears everywhere has lost the argument.

**What this system explicitly rejects:** wellness and meditation apps (no Headspace beige, no soft pastels, no breathing-room whitespace as a substitute for meaning); corporate productivity tools (no Notion neutrals, no Linear precision-grid aesthetic, no checkbox energy); motivational poster energy (no mountain photography, no "you got this" copy, no abstract uplift that wasn't earned).

**Key Characteristics:**
- Near-total dark surface — Abyss (`#07090D`) everywhere except elevated cards (Fathom, `#0F141A`).
- Three phase accents a user earns sequentially, not decoratively.
- Two typefaces with distinct roles: Syne (onboarding headings + logo only) and DM Sans (all app UI). Contrast through weight within DM Sans — Black (900) for display, Regular (400) for body.
- Glow, not shadow — elevation communicated by phase-colored glow on selected and active states only. Static cards are silent.
- Motion is ritual, not decoration — holds, springs, staggered lists, silhouette lighting — each animation has one reason.
- Minimum 44pt touch targets (iOS) / 48dp (Android). HoldButton centered for ambidextrous access.

## 2. Colors: The Earned Palette

A closed four-role system: two near-black surfaces carry depth, three phase accents carry earned meaning, one near-white carries text. Every token is load-bearing. Nothing is decorative.

### Primary
- **Iris — Electric Violet** (`#8B5CF6`): FOUNDATION phase color (days 1–7) and selected-state accent. Onboarding uses Iris exclusively.
- **Arc-Light — Near-White Mint** (`#EAFFF5`): StepDots active state, text token for moments of maximum emphasis. Identical to `text-arc`. Reserved — never used for body copy.

### Secondary
- **Volt — Electric Green** (`#62EE10`): BUILD phase color (days 8–14) and primary-action color. It marks forward motion and the action available now.

### Tertiary
- **Plasma — Hot Magenta** (`#FF4FD8`): COMMIT phase color (days 15–21). Final seven days. Charged, near-completion. Never repurposed for general UI decoration.

### Neutral
- **Abyss** (`#07090D`): Page background. Also the text color on Surge-fill buttons (contrast ~7.2:1 against Surge).
- **Fathom** (`#0F141A`): Card background. Elevation above Abyss through lightness shift alone — no shadow.
- **Raise** (`#141920`): Pressed card state, slightly above Fathom.
- **Error Red** (`#E24B4A`): Input error borders and error text. Appears only when something went wrong.
- **Text tokens** (RGBA on dark surfaces): `text-hi` rgba(255,255,255,0.95) for headings and primary content; `text-mid` rgba(255,255,255,0.60) for secondary content; `text-low` rgba(255,255,255,0.35) for metadata; `text-faint` rgba(255,255,255,0.04) for decorative ghost layers.
- **Border tokens**: `border-card` rgba(255,255,255,0.06) hairline for card edges; `border-strong` rgba(255,255,255,0.12) for secondary controls; `border-iris` rgba(139,92,246,0.60) for selected states.

**The Closed Palette Rule.** The palette is locked. Iris, Volt, and Plasma map to Foundation, Build, and Commit. Volt also carries primary actions. Adding a fourth accent dissolves that architecture. No new colors without an explicit product decision.

**The Accent Economy Rule.** Any given screen contains one dominant phase accent, appearing in few meaningful places. Its rarity is the argument.

**The No Pure White Rule.** Pure `#FFFFFF` is prohibited. Body text uses `text-hi` (rgba(255,255,255,0.95), hex `#FFFFFFF2`). Near-white moments use `arc-light` (`#EAFFF5`). Prevents harshness on near-black and keeps the palette disciplined across the full 21-day arc.

## 3. Typography: Two Roles, One System

**App UI Font:** DM Sans (all screens except onboarding)
**Onboarding / Logo Font:** Syne (ExtraBold for display headings, Bold for section headings; onboarding screens and wordmark only)

**Character:** DM Sans is geometric and neutral — legible at any weight, never calling attention to itself. The interface recedes so the content leads. Syne is wide and certain — it carries the brand's defiant personality in the onboarding arc and the wordmark, then steps aside. The two families never appear together on the same screen outside the onboarding flow.

### Hierarchy
- **Display** (900, 52sp, leading 1.12, tracking −0.02em): Day numbers on the Home DayCard, INAT wordmark, graduation headlines. One instance per screen.
- **Title** (700, 34sp, leading 1.12, tracking −0.02em): Screen titles, day task title on DayCard. One per screen.
- **Heading** (700, 26sp, leading 1.25, tracking −0.02em): Onboarding question headings, WHY THIS MATTERS title.
- **Quote** (500, 20sp): Inspirational quotes in day content. Present without dominating.
- **Base** (400, 15sp): Button labels, short UI paragraphs, navigation metadata.
- **Body** (400, 13.5sp, leading 1.55): Long-form content — `why_text` sections, onboarding hints, profile text.
- **Step** (500, 14.5sp, leading 1.5): StepCard instruction text in "WHAT TO DO" sections.
- **Caption** (400, 12sp): Timestamps, subtrack name, duration on DayCard metadata row.
- **Micro** (500, 11sp, tracking 0.10em): Secondary labels, GhostNumber-adjacent text.
- **Label** (500, 10sp, tracking 0.10em, uppercase enforced): SectionLabels ("WHAT TO DO", "WHY THIS MATTERS"), badge pill text. Always uppercase at the variant level — never lowercase.
- **Badge** (700, 9sp, lineHeight 11dp): Streak badge number only — diamond badge center text. Never used elsewhere; the smallest rendered text in the system.

**The Two-Role Rule.** Syne is used in exactly two places: the onboarding question screens and the wordmark. Everywhere else is DM Sans. Never use Syne on tabs, day screens, auth screens, graduation, or any component. Never add a third typeface.

**The Weight-First Rule.** Hierarchy is established by weight before size. Never reach for a larger size when a heavier weight conveys hierarchy more efficiently.

## 4. Elevation: Glow, Not Shadow

INAT uses no drop shadows on any static surface. Depth is communicated through two mechanisms only: background lightness progression (Abyss → Fathom → Raise) for structural elevation, and phase-colored glow exclusively for interactive and selected states.

### Glow Vocabulary
- **glowCta** (`shadowColor: #62EE10, opacity: 0.25, radius: 20dp, elevation: 8`): Primary Button and HoldButton in active/holding state. The single action available right now.
- **glowVolt** (`shadowColor: #62EE10, opacity: 0.18, radius: 16dp, elevation: 6`): Build-phase emphasis.
- **glowIris** (`shadowColor: #8B5CF6, opacity: 0.18, radius: 16dp, elevation: 6`): Foundation and selected-state emphasis.
- **glowPlasma** (`shadowColor: #FF4FD8, opacity: 0.18, radius: 16dp, elevation: 6`): Phase-specific glow during COMMIT days (15–21).

**The Glow-Not-Shadow Rule.** Drop shadows are prohibited. Glow — a colored radial emanation — earns its place because it carries phase meaning. The color tells you where in the journey you are. A neutral gray shadow carries no meaning and is therefore forbidden.

**The Static Silence Rule.** Glow appears only on interactive states (selected, holding, recommended). Inert cards carry only a hairline `border-card`. Nothing glows without a reason.

## 5. Components

### Buttons

Character: certain and weighted — primary is a Surge-fill pill radiating CTA glow; secondary is a ghost that yields to primary.

- **Shape:** Pill (28dp radius) for primary and secondary. Rounded rect (18dp) for the completed variant.
- **Primary** (height 56dp, Volt `#62EE10` fill, Abyss `#07090D` text, 700 weight, 16sp): `glowCta` when enabled. Press: scale 0.97, spring return (stiffness 400, damping 20). Disabled: 20% opacity, no press scale, no glow.
- **Secondary** (height 52dp, transparent bg, `border-strong` border, `text-mid` text, 400 15sp): Disabled: 35% opacity.
- **Completed** (height 58dp, no fill, phase-color border at 40% opacity, phase-color text, leading checkmark icon): Not pressable — acknowledgment only.

### StepCard (Task Step)

One step in the "WHAT TO DO" list. The layout is a three-slot row that morphs on completion — the right-side empty circle "moves" to the left and fills.

- **Undone state:** Left slot shows step number in phase color (500 weight, 14.5sp). Right slot shows an empty circle (32×32dp, `radius.full`, 1.5dp border at phase-color 40%). Text is `text-mid`, 500 weight, 14.5sp.
- **Done state:** Left slot shows a filled phase-color circle (32×32dp) with a white checkmark that springs in (stiffness 400, damping 20). Right slot disappears (opacity → 0, 150ms). Text strikes through and fades to 50% opacity (200ms ease).
- **Layout:** Row height 14dp vertical padding (`spacing.step-row`), `gap: 12dp`, `minHeight: 44dp`. Bottom border `border-soft` hairline on all items except the last (`isLast` prop).
- **Accessibility:** `accessibilityRole="checkbox"`, `accessibilityState={{ checked: done }}`, `accessibilityLabel="Step N: [text]"`.
- **Reduced motion:** `ReduceMotion.System` on all animations — instant state change when enabled.

### HoldButton (Signature Component)

The most important interaction in INAT. 1-second hold completes the day. No tap shortcut — ever.

- **Idle:** Heartbeat pulse (scale 1→1.012→1→1.008→1, 2.6s loop). No glow. Signals alive and waiting.
- **Holding:** Heartbeat stops. Phase-color inner glow (42% opacity) activates. Phase bar fills left→right, 0%→100% over 1000ms. Phase bar glows at phase-color 60%.
- **Complete:** `onComplete` fires. Progress resets. Glows fade.
- **Release early:** RAF cancelled. Progress returns to 0.
- **Layout constraint:** Always in a `position: absolute, bottom: 0` View. Never inside a ScrollView. This is structural — violation breaks the interaction on Android scroll events.
- **Reduced motion:** Heartbeat suppressed. Hold fill and glow still run (functional, not decorative).

### Cards / Containers

Character: dark, quiet — present without competing.

- **Shape:** 20dp radius. Fathom (`#0F141A`) fill always.
- **Border:** `border-card` (rgba(255,255,255,0.07)) hairline on all cards.
- **Accent variant:** 3dp left border in phase color + radial gradient inset (phase color 6% from left, fading transparent). Used on "WHY THIS MATTERS" cards only — never decoratively.
- **Pressable:** Scale 0.985 on press, spring return.
- **No blur, no glassmorphism.** BlurView appears only behind BottomNav on iOS. Cards never blur.

### Inputs / Fields

- **Default:** `bg-input` fill (rgba white 0.05), `border-card` border (rgba white 0.07), 14dp radius.
- **Focus:** `border-strong` shift (rgba white 0.12) + Iris glow overlay.
- **Error:** `#E24B4A` border + error text below + shake animation (translateX 0→6→−6→4→−4→0, 300ms).
- **Placeholder:** `text-low` (rgba white 0.35). Meets 4.5:1 contrast on the composite dark surface.
- **Multiline:** Same visual treatment. Used only for Q6 open-answer field.

### OptionCard (Form Selection)

- **Default:** Fathom bg, `border-card`, `text-mid` label, checkmark invisible (scale 0). `accessibilityRole="checkbox"`.
- **Selected:** `selected-bg` fill (Iris 8%), `border-iris` (Iris 60%), `text-hi` label, Iris checkmark springs in (scale 0→1, stiffness 400/damping 20). Border + bg interpolate over 180ms ease.
- **Disabled-unselected (max reached):** 35% opacity. Still pressable — triggers shake. `accessibilityState={{ disabled: true }}` + `accessibilityHint="Maximum selections reached"`.
- **Max-exceeded shake:** Fires on the tapped card (translateX 0→6→−6→4→−4→0, 300ms). No state change.
- **Deselect spring:** stiffness 500/damping 22 (slightly faster than select). `selected+disabled` is not a valid state.

### TrackCard (Track Selection)

The primary selection card on the Match screen. Three-column row: icon container → name/tagline → optional badge.

- **Icon container:** 48×48dp, `radius.md` (14dp), `bg-raise` fill when default → `iris-tint` fill when selected. Icon 28sp: `text-mid` default → Iris selected.
- **Default:** Fathom bg, `border-card` border (1dp), `radius.card`.
- **Selected:** `selected-bg` (Iris 8%) fill, `border-iris` (Iris 60%) border.
- **Recommended:** `glowVolt` effect applied to the card container — the only unsolicited glow in the system. A single recommended badge appears top-right.
- **Press:** Spring scale 0.985 (stiffness 400, damping 20). `ReduceMotion.System`.
- **Typography:** Track name in `base`/700 (`text-hi`). Tagline in `caption` (`text-mid`).
- **Accessibility:** `accessibilityRole="button"`, `accessibilityState={{ selected }}`, `accessibilityLabel="[name], [tagline]"`.
- **Constraint:** Only one card per list may carry `isRecommended=true`. The recommendation badge and glow are mutually exclusive with coming-soon or locked states.

### SubtrackCard (Subtrack Selection)

Selection card for the Focus screen. Simpler than TrackCard — name left, status indicators right. Three states: selectable, locked (live but paywalled), not-live.

- **Selectable:** Same Fathom/selected-bg/border-card/border-surge transitions as TrackCard. Spring scale 0.985 on press.
- **Locked (live + not free):** Lock icon (16sp, `text-low`) + Pro badge on the right. Pressable (Pro upsell flow). Full opacity.
- **Not live:** 40% opacity, no press handler. `accessibilityState={{ disabled: true }}`. Coming Soon badge on the right.
- **Typography:** Name in `base`/400. Color: `text-hi` for selectable/locked, `text-low` for not-live.
- **Layout:** Row, `align: space-between`, `padding: 20dp`, `radius.card`.
- **Rule:** Locked and not-live are mutually exclusive states. A card is never both at once.

### Navigation (BottomNav)

- **Background:** `bg-nav` (rgba(7,9,13,0.96)) with BlurView behind on iOS. Solid on Android.
- **Height:** 72dp + bottom safe-area inset. Content must clear `page-bottom` (100dp).
- **Active tab:** Icon + label in current phase color. Spring scale 0.85→1 on switch.
- **Inactive:** rgba(255,255,255,0.35).
- **Visibility:** Mounted only on the four tab screens. Unmounted on Day and Graduation — not hidden, unmounted.

### BackButton

Utility navigation component. A minimal pressable chevron — carries no state, no animation, no variant API.

- **Icon:** `chevron-back` Ionicon, 26sp, `text-mid` color.
- **Touch target:** 44×44dp (`spacing.touchMin`), `hitSlop` 10dp on all four sides.
- **Placement:** Always top-left of the screen, outside the content scroll area, aligned with StepDots in a three-slot top row (BackButton | StepDots | width-matched spacer).
- **No animation:** BackButton is a pure Pressable. Do not add spring or scale — the minimal treatment is intentional. Navigation feedback comes from the screen transition, not the button.
- **Accessibility:** `accessibilityRole="button"`, `accessibilityLabel="Go back"`.

### Badges

Five read-only label variants — none are pressable.

- **Streak** (32dp outer container, 22×22dp diamond rotated 45°, phase-color fill, inner counter-rotated −45°, bold 9sp `text-hi` number): Day-streak counter. The rotation produces a diamond; the counter-rotation keeps the number upright. Never resized.
- **Phase** (pill, 1dp border in phase color, transparent bg, `label` 10sp uppercase, phase-color text): Phase labels on TrackCards and day metadata.
- **Recommended** (pill, Iris fill + Iris border, bold `label` 10sp uppercase, Abyss text): The single recommended option. Appears at most once per screen.
- **Coming Soon** (pill, `border-soft` border, `text-low` uppercase `label` text): Locked future options. Communicates inaccessibility without harsh visual treatment.
- **Pro** (smaller pill, Plasma fill + Plasma border, bold `label` 10sp uppercase, Abyss text): Feature gate marker. Plasma signals the furthest-earned phase — contextually appropriate for gated premium features.

**Badge Economy Rule.** One badge per list item, two badges maximum per card. Stacking three variants on a single card breaks hierarchy.

### SkeletonCard (Loading State)

- **Shape:** Fathom fill, `border-card` border, default 72dp height, `rounded.card` radius — matches Card dimensions exactly.
- **Animation:** Opacity pulses 0.3 → 0.6, 600ms easeInOut each direction (1.2s full cycle), `withRepeat(−1, reverse: true)`. `ReduceMotion.System` honored — on reduced-motion devices opacity stays at 0.3 with no animation.
- **Accessibility:** `accessible`, `accessibilityRole="none"`, `accessibilityLabel="Loading"` — screen readers announce loading state without announcing an interactive element.
- **Sizing:** `height` and `radius` are props (defaults: 72dp, card radius). Always match the real card it stands in for — use the same height the loaded card will occupy.

### StepDots (Progress Indicator)

Onboarding progress through Q1–Q6.

- **Past:** 5×5dp, Arc-Light (`#EAFFF5`), 3dp radius.
- **Current:** 16×5dp pill (width springs 5→16dp on advance, 300ms spring; color withTiming 300ms). Arc-Light.
- **Future:** 5×5dp, `text-faint` (`#FFFFFF2E`, ~18% opacity), 3dp radius.
- **Accessibility:** Row carries `accessibilityLabel="Step X of Y"`, `accessibilityRole="none"`. Individual dots hidden from screen reader traversal via `importantForAccessibility="no-hide-descendants"`.
- **Reduced motion:** `ReduceMotion.System` on all — instant width/color change when user has reduced motion enabled.

### GhostNumber (Question Backdrop)

A decorative, absolutely-positioned large numeral that sits behind the question heading on onboarding question screens (Q2–Q6). It carries no interactive meaning — it is pure spatial rhythm.

- **Typography:** 120sp, `DMSans-Black` (900), white at 4% opacity.
- **Position:** `position: absolute, zIndex: 0`, fills the heading container (`StyleSheet.absoluteFillObject` or equivalent). The heading text sits above it at `zIndex: 1`.
- **Content:** Zero-padded two-digit string (`01`, `02`, `03`, `04`, `05`) matching the question index, not the StepDots step.
- **Entrance animation:** Opacity fades from 0 → 0.04 over 600ms (`withTiming`). translateY slides from 8dp → 0 over 800ms. Both use `ReduceMotion.System` — on reduced-motion devices they snap to final values instantly.
- **Non-interactive:** `pointerEvents="none"`, `accessibilityElementsHidden`, hidden from all screen reader traversal.
- **The One Per Screen Rule.** One GhostNumber per question screen — never stacked, never on non-question screens.

### Profile and Settings

Profile is an identity-and-circuit hub, not an account-control list. The visual hierarchy is: compact screen title and settings gear; editable avatar, name, and email; Active Circuit; then membership. Onboarding answers and life-stage copy never appear here.

The Active Circuit card uses one phase color derived from the user's actual position. Arc and Focus are stacked as distinct facts, the current phase is named, seven numbered nodes show position within that phase, and the Foundation/Build/Commit legend makes the system understandable without decoration. Completed state reads “Circuit complete.”

Settings uses native-feeling inset groups with 64dp minimum rows. Every row remains horizontal: 20sp outline icon, DM Sans primary label, optional right-aligned value, and chevron only for actionable rows. Membership reads “Not active” without implying a purchase flow. Delete account is isolated, Error-colored, and confirmation-gated. Accent color is reserved for actual state and interaction; inactive information does not glow.

Profile-specific executable dimensions live in `theme/index.ts` under `profile`: avatar, edit badge, icon button, circuit icon, progress node/line, row height, and maximum content width.

## 6. Do's and Don'ts

### Do:
- **Do** use `text-hi` (rgba(255,255,255,0.95) / `#FFFFFFF2`) or `arc-light` (`#EAFFF5`) for all primary text. Pure `#FFFFFF` is prohibited.
- **Do** apply only the current phase accent on any given screen — Iris for days 1–7, Volt for 8–14, Plasma for 15–21.
- **Do** anchor HoldButton in a fixed-position View at screen bottom, outside any ScrollView, always.
- **Do** convey elevation through background lightness (Abyss → Fathom → Raise) and phase-colored glow for interactive states only.
- **Do** use Reanimated for all animations. React Native's `Animated` API is prohibited.
- **Do** keep the current phase accent to ≤3 appearances per screen.
- **Do** respect safe-area insets on iOS (Dynamic Island, notch, home indicator) and Android (status bar, nav bar, display cutout, IME).
- **Do** maintain 44pt minimum touch targets on iOS, 48dp on Android.
- **Do** call Supabase exclusively from `services/` — never from a component.

### Don't:
- **Don't** build a wellness or meditation aesthetic. No Headspace beige, no soft pastels, no breathing-room whitespace as a substitute for meaning. The dark palette is load-bearing.
- **Don't** build a corporate productivity tool. No Notion neutrals, no Linear precision-grid, no checkbox energy. INAT is not a task manager wearing a journey costume.
- **Don't** use motivational poster copy or imagery. No mountains, no "you got this," no abstract uplift. "The circuit doesn't judge. It waits." — not "Believe in yourself."
- **Don't** use glassmorphism on card surfaces. Blur is permitted only behind BottomNav on iOS.
- **Don't** use drop shadows. Phase-colored glow or nothing.
- **Don't** add a third typeface. DM Sans carries application UI; Syne is restricted to its documented brand roles.
- **Don't** render pure `#FFFFFF` anywhere.
- **Don't** show BottomNav on the Day screen or Graduation screen.
- **Don't** put HoldButton inside a ScrollView.
- **Don't** add a new color to the palette. The palette is closed.
- **Don't** use `any` in TypeScript. Fix the type.
- **Don't** put a `border-left` stripe wider than 3dp on a card decoratively. The Card accent variant's left strip is a phase signal — never used without phase meaning.
