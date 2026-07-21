import React, { useEffect, useState } from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  ReduceMotion,
} from 'react-native-reanimated'

import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { BackButton } from '@/components/navigation/BackButton'
import { Badge } from '@/components/core/Badge'
import { Text } from '@/components/core/Text'
import { StepCard, StepItem } from '@/components/tasks/StepCard'
import { HoldButton } from '@/components/tasks/HoldButton'
import { useJourneyStore } from '@/stores/journey.store'
import { getDayWithSteps } from '@/services/curriculum.service'
import { getDayCompletion, completeDay } from '@/services/completion.service'
import { getSession } from '@/services/auth.service'
import { getPhaseColor, getPhaseName, colors, fontFamilies, radius, spacing, typography } from '@/theme'
import { Day, DayStep } from '@/types'

const HOLD_PANEL_HEIGHT = 136

// ── Fix 1: title font size by character count ────────────────────────────────
function getTitleFontSize(title: string): number {
  const len = title.length
  if (len < 20) return 40
  if (len <= 35) return 32
  return 26
}

// ── Fix 5: quote font size by character count ────────────────────────────────
function getQuoteFontSize(quote: string): number {
  return quote.length > 120 ? 24 : 28
}

// ── Placeholder data ─────────────────────────────────────────────────────────
const PLACEHOLDER_DAY: Day = {
  id: '',
  arc: 'Move',
  focus: 'Muscle & Strength',
  day_number: 1,
  title: 'Define Your Single Most Important Task',
  subtitle: null,
  duration_mins: 20,
  phase: 'Foundation',
  quote: 'It is not enough to be busy. The question is: what are we busy about?',
  quote_author: 'Henry David Thoreau',
  why_this_matters: 'Research on cognitive load consistently shows that choosing one clear priority before the day begins reduces decision fatigue by up to 40%. When your brain knows exactly what success looks like, it stops burning energy on re-evaluation.',
  created_at: '',
}

const PLACEHOLDER_STEPS: DayStep[] = [
  { id: '1', day_id: '', step_number: 1, title: 'Open a blank document', instruction: 'Open a blank document or notebook. Write "My MIT today is:" at the top.', has_video: false, video_url: null, video_label: null, created_at: '' },
  { id: '2', day_id: '', step_number: 2, title: 'Scan your task list', instruction: 'Scan your task list. Ask: if I could only finish one thing today, what would matter most in 90 days?', has_video: false, video_url: null, video_label: null, created_at: '' },
  { id: '3', day_id: '', step_number: 3, title: 'Write that one task', instruction: 'Write that one task. Underline it. Close everything else and start it first.', has_video: false, video_url: null, video_label: null, created_at: '' },
]

// ── Fix 3: Done pill — shows expanded state when active ──────────────────────
function DonePill({
  stepNumber,
  phaseColor,
  isExpanded,
  onPress,
}: {
  stepNumber: number
  phaseColor: string
  isExpanded: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.donePill,
        {
          borderColor: isExpanded ? phaseColor : phaseColor + '4D',
          backgroundColor: isExpanded ? phaseColor + '15' : colors.fathom,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Step ${stepNumber} done, tap to re-read`}
      accessibilityState={{ expanded: isExpanded }}
    >
      <Ionicons name="checkmark" size={11} color={phaseColor} />
      <Animated.Text style={[styles.donePillText, { color: phaseColor }]}>
        {stepNumber}
      </Animated.Text>
    </Pressable>
  )
}

// ── Why section (collapsible) ────────────────────────────────────────────────
function WhySection({ text, phaseColor }: { text: string; phaseColor: string }) {
  const [expanded, setExpanded] = useState(false)

  const animMaxHeight = useSharedValue(0)
  const animOpacity   = useSharedValue(0)
  const chevronRot    = useSharedValue(0)

  function toggle() {
    if (expanded) {
      animMaxHeight.value = withTiming(0,   { duration: 250, reduceMotion: ReduceMotion.System })
      animOpacity.value   = withTiming(0,   { duration: 180, reduceMotion: ReduceMotion.System })
      chevronRot.value    = withTiming(0,   { duration: 250, reduceMotion: ReduceMotion.System })
    } else {
      animMaxHeight.value = withTiming(600, { duration: 320, reduceMotion: ReduceMotion.System })
      animOpacity.value   = withTiming(1,   { duration: 300, reduceMotion: ReduceMotion.System })
      chevronRot.value    = withTiming(1,   { duration: 250, reduceMotion: ReduceMotion.System })
    }
    setExpanded(!expanded)
  }

  const collapseStyle = useAnimatedStyle(() => ({
    maxHeight: animMaxHeight.value,
    opacity:   animOpacity.value,
    overflow:  'hidden',
  }))

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRot.value * 90}deg` }],
  }))

  return (
    <View style={[styles.whyContainer, { borderLeftColor: phaseColor }]}>
      <Pressable
        onPress={toggle}
        style={styles.whyHeader}
        accessibilityRole="button"
        accessibilityLabel="Why does this matter?"
        accessibilityState={{ expanded }}
      >
        <Text variant="body" color={colors.textHi} style={styles.whyHeaderText}>
          Why does this matter?
        </Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-forward" size={16} color={phaseColor} />
        </Animated.View>
      </Pressable>

      <Animated.View style={collapseStyle}>
        <Text variant="body" color={colors.textMid} style={styles.whyBody}>
          {text}
        </Text>
      </Animated.View>
    </View>
  )
}

// ── Fix 6: feeling pill with scale animation ─────────────────────────────────
function FeelingPill({
  label,
  phaseColor,
  isSelected,
  onPress,
}: {
  label: string
  phaseColor: string
  isSelected: boolean
  onPress: () => void
}) {
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  function handlePress() {
    scale.value = withSequence(
      withTiming(0.97, { duration: 80,  reduceMotion: ReduceMotion.System }),
      withTiming(1,    { duration: 150, reduceMotion: ReduceMotion.System }),
    )
    onPress()
  }

  return (
    <Animated.View style={[styles.feelingPillWrap, animStyle]}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.feelingPill,
          isSelected
            ? { backgroundColor: phaseColor + '26', borderColor: phaseColor, borderWidth: 2 }
            : { borderColor: phaseColor + '99', borderWidth: 1.5 },
        ]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={label}
      >
        <Animated.Text
          style={[
            styles.feelingText,
            { color: isSelected ? colors.arcLight : colors.textMid },
          ]}
        >
          {label}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  )
}

// ── Completion moment overlay ─────────────────────────────────────────────────
const FEELINGS = ['Pushed through', 'Felt right', 'Just okay', 'Struggled'] as const
type Feeling = typeof FEELINGS[number]

function CompletionMoment({
  quote,
  author,
  phaseColor,
  dayNumber,
  onFeelingSelect,
}: {
  quote: string
  author: string | null
  phaseColor: string
  dayNumber: number
  onFeelingSelect: (feeling: Feeling) => void
}) {
  const [selected, setSelected] = useState<Feeling | null>(null)

  const overlayOpacity = useSharedValue(0)
  const pulseScale     = useSharedValue(0.4)
  const pulseOpacity   = useSharedValue(0.7)

  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 400, reduceMotion: ReduceMotion.System })

    pulseScale.value = withSequence(
      withTiming(2.4, { duration: 600, reduceMotion: ReduceMotion.System }),
      withTiming(2.8, { duration: 300, reduceMotion: ReduceMotion.System }),
    )
    pulseOpacity.value = withSequence(
      withTiming(0.5, { duration: 400, reduceMotion: ReduceMotion.System }),
      withTiming(0,   { duration: 400, reduceMotion: ReduceMotion.System }),
    )
  }, [])

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }))
  const pulseStyle   = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity:   pulseOpacity.value,
  }))

  // Fix 6: 600ms delay before calling parent (lets scale animation + selected state land)
  function handleSelect(f: Feeling) {
    if (selected) return
    setSelected(f)
    setTimeout(() => onFeelingSelect(f), 600)
  }

  // Fix 5: dynamic quote font size
  const quoteFontSize = getQuoteFontSize(quote)

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.completionOverlay, overlayStyle]}>
      {/* Pulse */}
      <Animated.View
        pointerEvents="none"
        style={[styles.pulse, { backgroundColor: phaseColor }, pulseStyle]}
      />

      <ScrollView
        contentContainerStyle={styles.completionContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Fix 4: Day completion anchor */}
        <View style={styles.completionAnchor}>
          <Animated.Text style={[styles.completionDayLabel, { color: phaseColor }]}>
            {`DAY ${dayNumber} COMPLETE`}
          </Animated.Text>
          <View style={[styles.completionRule, { backgroundColor: phaseColor + '33' }]} />
        </View>

        {/* Fix 5: Quote — large poster treatment */}
        <View style={styles.quoteBlock}>
          <Animated.Text
            style={[
              styles.quoteText,
              { fontSize: quoteFontSize, lineHeight: quoteFontSize * 1.3 },
            ]}
          >
            {quote}
          </Animated.Text>
          {author ? (
            <Animated.Text style={styles.quoteAuthor}>
              {`— ${author}`}
            </Animated.Text>
          ) : null}
        </View>

        {/* Feeling picker */}
        <View style={styles.feelingSection}>
          <Animated.Text style={styles.feelingLabel}>
            HOW DID TODAY FEEL?
          </Animated.Text>

          <View style={styles.feelingGrid}>
            {FEELINGS.map((f) => (
              <FeelingPill
                key={f}
                label={f}
                phaseColor={phaseColor}
                isSelected={selected === f}
                onPress={() => handleSelect(f)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  )
}

// ── Day screen ────────────────────────────────────────────────────────────────
export default function Day() {
  const router = useRouter()
  const { activeJourney, currentDay, hydrate } = useJourneyStore()

  const [dayData, setDayData]               = useState<Day | null>(null)
  const [daySteps, setDaySteps]             = useState<DayStep[]>([])
  const [isCompleted, setIsCompleted]       = useState(false)
  const [isLoading, setIsLoading]           = useState(true)
  const [currentStep, setCurrentStep]       = useState(0)
  const [expandedDoneStep, setExpandedDoneStep] = useState<number | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [isSaving, setIsSaving]             = useState(false)

  const phaseColor = currentDay > 0 ? getPhaseColor(currentDay) : getPhaseColor(1)
  const phaseName  = currentDay > 0 ? getPhaseName(currentDay)  : getPhaseName(1)

  useEffect(() => {
    if (!activeJourney) {
      setDayData(PLACEHOLDER_DAY)
      setDaySteps(PLACEHOLDER_STEPS)
      setIsLoading(false)
      return
    }

    Promise.all([
      getDayWithSteps(activeJourney.arc, activeJourney.focus, activeJourney.current_day),
      getDayCompletion(activeJourney.id, activeJourney.current_day),
    ]).then(([{ day, steps }, { completion }]) => {
      setDayData(day)
      setDaySteps(steps)
      if (completion) setIsCompleted(true)
      setIsLoading(false)
    })
  }, [activeJourney])

  const steps: StepItem[] = React.useMemo(() =>
    daySteps.map((s) => ({
      instruction: s.instruction,
      videoUrl:    s.has_video ? (s.video_url ?? undefined) : undefined,
      videoLabel:  s.has_video ? (s.video_label ?? undefined) : undefined,
    })),
  [daySteps])

  const allDone = currentStep >= steps.length && steps.length > 0

  function advanceStep() {
    setExpandedDoneStep(null)
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  // Fix 3: toggle a done pill to re-expand / re-collapse
  function toggleDoneStep(i: number) {
    setExpandedDoneStep((prev) => (prev === i ? null : i))
  }

  async function handleHoldComplete() {
    setShowCompletion(true)
  }

  async function handleFeelingSelect(feeling: Feeling) {
    if (!activeJourney || isSaving) return
    setIsSaving(true)

    const { error } = await completeDay(activeJourney.id, activeJourney.arc, activeJourney.focus, currentDay, feeling)

    if (error) {
      setIsSaving(false)
      Alert.alert('Could not save', 'Your completion did not save. Please try again.', [{ text: 'OK' }])
      return
    }

    const { session } = await getSession()
    if (session) await hydrate(session.user.id)

    if (currentDay >= 21) {
      router.push('/graduation')
    } else {
      router.back()
    }
  }

  const focusLabel  = activeJourney?.focus ?? PLACEHOLDER_DAY.focus
  const displayDay  = activeJourney ? currentDay : 1
  const displayName = `DAY ${displayDay} · ${phaseName}`
  const titleText   = isLoading ? '' : (dayData?.title ?? '')

  // Fix 1: dynamic title font size
  const titleFontSize = getTitleFontSize(titleText)

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <View style={{ flex: 1 }} />
        <Badge variant="phase" color={phaseColor}>
          {displayName}
        </Badge>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: HOLD_PANEL_HEIGHT + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Fix 1: Title block — dynamic font size, max 3 lines */}
        <View style={styles.titleBlock}>
          <Animated.Text
            numberOfLines={3}
            style={[
              styles.dayTitle,
              { fontSize: titleFontSize, lineHeight: titleFontSize * 1.12 },
            ]}
          >
            {titleText}
          </Animated.Text>
          <Text variant="caption" color={colors.textMid} style={styles.daySubtitle}>
            {[
              focusLabel,
              dayData?.duration_mins ? `${dayData.duration_mins} min` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>


        {/* Why does this matter */}
        {dayData?.why_this_matters ? (
          <View style={styles.section}>
            <WhySection text={dayData.why_this_matters} phaseColor={phaseColor} />
          </View>
        ) : null}

        {/* Fix 3: Done pills — each shows expanded state, tapping toggles */}
        {currentStep > 0 ? (
          <View style={styles.donePillsRow}>
            {steps.slice(0, currentStep).map((_, i) => (
              <DonePill
                key={i}
                stepNumber={i + 1}
                phaseColor={phaseColor}
                isExpanded={expandedDoneStep === i}
                onPress={() => toggleDoneStep(i)}
              />
            ))}
          </View>
        ) : null}

        {/* Fix 3: Step cards — re-read expanded done steps inline */}
        {steps.length > 0 ? (
          <View style={styles.stepsArea}>
            {steps.map((step, i) => {
              const isDone     = i < currentStep
              const isReread   = expandedDoneStep === i
              // Done steps: only render card when being re-read
              if (isDone && !isReread) return null
              // Re-read card: isActive=true so Done button shows; onDone collapses it
              if (isDone && isReread) {
                return (
                  <StepCard
                    key={i}
                    step={step}
                    stepIndex={i}
                    totalSteps={steps.length}
                    phaseColor={phaseColor}
                    isActive={true}
                    onDone={() => setExpandedDoneStep(null)}
                  />
                )
              }
              // Active or pending step: dim if a done step is currently expanded
              const isActive = i === currentStep && expandedDoneStep === null
              return (
                <StepCard
                  key={i}
                  step={step}
                  stepIndex={i}
                  totalSteps={steps.length}
                  phaseColor={phaseColor}
                  isActive={isActive}
                  onDone={advanceStep}
                />
              )
            })}
          </View>
        ) : null}
      </ScrollView>

      {/* Fixed bottom: Hold to Complete */}
      <View style={styles.holdPanel} pointerEvents="box-none">
        <LinearGradient
          colors={['transparent', colors.abyss]}
          style={styles.holdGradient}
          pointerEvents="none"
        />
        <View style={styles.holdInner}>
          {isCompleted ? (
            <View
              style={[
                styles.completedPill,
                { backgroundColor: phaseColor + '22', borderColor: phaseColor + '66' },
              ]}
            >
              <Ionicons name="checkmark-circle" size={18} color={phaseColor} />
              <Animated.Text style={[styles.completedText, { color: phaseColor }]}>
                {`Day ${displayDay} Complete`}
              </Animated.Text>
            </View>
          ) : (
            <HoldButton
              phaseColor={phaseColor}
              holdMs={1200}
              disabled={!allDone}
              onComplete={handleHoldComplete}
            />
          )}
        </View>
      </View>

      {/* Completion moment overlay */}
      {showCompletion ? (
        <CompletionMoment
          quote={dayData?.quote ?? 'You showed up. That matters.'}
          author={dayData?.quote_author ?? null}
          phaseColor={phaseColor}
          dayNumber={displayDay}
          onFeelingSelect={handleFeelingSelect}
        />
      ) : null}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[6],
    paddingHorizontal: spacing.pagePad,
    paddingBottom: spacing[3],
  },

  // Fix 1: title uses dynamic fontSize injected inline; only fontFamily + margin here
  titleBlock: {
    paddingHorizontal: spacing.pagePad,
    paddingTop: spacing[5],
    paddingBottom: spacing[2],
  },
  dayTitle: {
    fontFamily: fontFamilies.display,
    color: colors.arcLight,
    marginBottom: spacing[2],
  },
  daySubtitle: {
    fontFamily: fontFamilies.regular,
    letterSpacing: 0.1,
  },

  section: {
    paddingHorizontal: spacing.pagePad,
    marginTop: spacing[6],
  },
  sectionLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.textLow,
    marginBottom: spacing[3],
  },
  equipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  equipChevron: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  equipText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typography.size.body,
    lineHeight: typography.size.body * typography.leading.body,
    color: colors.textMid,
  },

  whyContainer: {
    backgroundColor: colors.fathom,
    borderLeftWidth: 2,
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  whyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  whyHeaderText: {
    fontFamily: fontFamilies.medium,
    flex: 1,
  },
  whyBody: {
    paddingTop: spacing[3],
    paddingBottom: spacing[1],
  },

  donePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    paddingHorizontal: spacing.pagePad,
    marginTop: spacing[5],
  },
  donePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  donePillText: {
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.caption,
  },

  stepsArea: {
    paddingHorizontal: spacing.pagePad,
    marginTop: spacing[3],
  },

  holdPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  holdGradient: {
    height: 56,
  },
  holdInner: {
    backgroundColor: colors.abyss,
    paddingHorizontal: spacing.pagePad,
    paddingBottom: spacing[10],
  },
  completedPill: {
    height: 64,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  completedText: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.base,
  },

  // Completion overlay
  completionOverlay: {
    backgroundColor: colors.abyss,
    zIndex: 100,
  },
  pulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: '28%',
    alignSelf: 'center',
  },
  completionContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: spacing[10],
    paddingBottom: spacing[10],
    paddingHorizontal: spacing.pagePad,
  },

  // Fix 4: completion anchor
  completionAnchor: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  completionDayLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: spacing[3],
  },
  completionRule: {
    width: '40%',
    height: 1,
  },

  // Fix 5: quote — fontSize injected inline; only family + alignment here
  quoteBlock: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  quoteText: {
    fontFamily: fontFamilies.display,
    color: colors.arcLight,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  quoteAuthor: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.arcLight + '80',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  feelingSection: {
    width: '100%',
  },
  feelingLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.textMid,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  feelingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'center',
  },
  feelingPillWrap: {
    minWidth: '44%',
  },
  feelingPill: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  feelingText: {
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.body,
  },
})
