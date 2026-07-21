import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { StarfieldBackground } from '@/components/shared/StarfieldBackground'
import { HoldButton } from '@/components/tasks/HoldButton'
import { useJourneyStore } from '@/stores/journey.store'
import { getDayWithSteps } from '@/services/curriculum.service'
import { getDayCompletion, completeDay } from '@/services/completion.service'
import { getSession } from '@/services/auth.service'
import {
  getPhaseColor, getPhaseName,
  colors,
} from '@/theme'
import type { Day as DayData, DayStep } from '@/types'

// ── DM Sans font references (Day screen only) ─────────────────────────────────

const DM = {
  regular: 'DMSans-Regular',
  medium:  'DMSans-Medium',
  bold:    'DMSans-Bold',
} as const

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSessionTitleFontSize(title: string): number {
  if (title.length < 20)  return 28
  if (title.length <= 35) return 23
  return 19
}

function getQuoteFontSize(quote: string): number {
  return quote.length > 80 ? 20 : 24
}

// ── Placeholder data ──────────────────────────────────────────────────────────

const PLACEHOLDER_DAY: DayData = {
  id: '', arc: 'Move', focus: 'Muscle & Strength', day_number: 1,
  title: 'Define Your Single Most Important Task', subtitle: null, duration_mins: 20,
  phase: 'Foundation',
  quote: 'It is not enough to be busy. The question is: what are we busy about?',
  quote_author: 'Henry David Thoreau',
  why_this_matters: 'Research on cognitive load consistently shows that choosing one clear priority before the day begins reduces decision fatigue by up to 40%. When your brain knows exactly what success looks like, it stops burning energy on re-evaluation.',
  created_at: '',
}

const PLACEHOLDER_STEPS: DayStep[] = [
  {
    id: '1', day_id: '', step_number: 1,
    title: 'Open a blank document',
    instruction: 'Open a blank document or notebook. Write "My MIT today is:" at the top.',
    has_video: false, video_url: null, video_label: null, created_at: '',
  },
  {
    id: '2', day_id: '', step_number: 2,
    title: 'Scan your task list',
    instruction: 'Scan your task list. Ask: if I could only finish one thing today, what would matter most in 90 days?',
    has_video: false, video_url: null, video_label: null, created_at: '',
  },
  {
    id: '3', day_id: '', step_number: 3,
    title: 'Write that one task',
    instruction: 'Write that one task. Underline it. Close everything else and start it first.',
    has_video: false, video_url: null, video_label: null, created_at: '',
  },
]

// ── Step dot ──────────────────────────────────────────────────────────────────

function StepDot({ state, phaseColor }: { state: 'done' | 'current' | 'remaining'; phaseColor: string }) {
  const scale = useSharedValue(1)

  useEffect(() => {
    if (state === 'current') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 900, reduceMotion: ReduceMotion.System }),
          withTiming(1,   { duration: 900, reduceMotion: ReduceMotion.System }),
        ),
        -1, false,
      )
    } else {
      cancelAnimation(scale)
      scale.value = withTiming(1, { duration: 200, reduceMotion: ReduceMotion.System })
    }
    return () => { cancelAnimation(scale) }
  }, [state])

  const size = state === 'current' ? 8 : 6
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const dotOpacity = state === 'done' ? 0.5 : state === 'remaining' ? 0.2 : 1.0

  return (
    <Animated.View
      style={[{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: state === 'remaining' ? 'transparent' : phaseColor,
        borderWidth: state === 'remaining' ? 1.5 : 0,
        borderColor: phaseColor,
        opacity: dotOpacity,
      }, animStyle]}
    />
  )
}

// ── Why section (collapsible) ─────────────────────────────────────────────────

function WhySection({ text, phaseColor }: { text: string; phaseColor: string }) {
  const [expanded, setExpanded] = useState(false)
  const maxH    = useSharedValue(0)
  const bodyOp  = useSharedValue(0)
  const chevRot = useSharedValue(0)

  function toggle() {
    const next = !expanded
    setExpanded(next)
    maxH.value    = withTiming(next ? 500 : 0, { duration: next ? 300 : 250, reduceMotion: ReduceMotion.System })
    bodyOp.value  = withTiming(next ? 1 : 0,   { duration: next ? 280 : 180, reduceMotion: ReduceMotion.System })
    chevRot.value = withTiming(next ? 90 : 0,  { duration: 250,              reduceMotion: ReduceMotion.System })
  }

  const bodyStyle = useAnimatedStyle(() => ({
    maxHeight: maxH.value,
    opacity:   bodyOp.value,
    overflow:  'hidden',
  }))
  const chevStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevRot.value}deg` }],
  }))

  return (
    <View style={[styles.whyOuter, { borderTopColor: phaseColor + '1A' }]}>
      <Pressable
        onPress={toggle}
        style={styles.whyRow}
        accessibilityRole="button"
        accessibilityLabel="Why does this matter?"
        accessibilityState={{ expanded }}
      >
        <Animated.Text style={[styles.whyRowLabel, { color: colors.arcLight + '6B' }]}>
          Why does this matter?
        </Animated.Text>
        <Animated.View style={chevStyle}>
          <Ionicons name="chevron-forward" size={14} color={phaseColor} />
        </Animated.View>
      </Pressable>

      <Animated.View style={bodyStyle}>
        <View style={[styles.whyPanel, { borderLeftColor: phaseColor }]}>
          <Animated.Text style={styles.whyPanelText}>{text}</Animated.Text>
        </View>
      </Animated.View>
    </View>
  )
}

// ── Feeling pill ──────────────────────────────────────────────────────────────

function FeelingPill({ label, phaseColor, isSelected, onPress }: {
  label: string; phaseColor: string; isSelected: boolean; onPress: () => void
}) {
  const scale     = useSharedValue(1)
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  function handlePress() {
    scale.value = withSequence(
      withTiming(0.97, { duration: 80,  reduceMotion: ReduceMotion.System }),
      withTiming(1,    { duration: 150, reduceMotion: ReduceMotion.System }),
    )
    onPress()
  }

  return (
    <Animated.View style={[styles.feelingWrap, animStyle]}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.feelingPill,
          isSelected
            ? { backgroundColor: phaseColor + '29', borderColor: phaseColor, borderWidth: 2 }
            : { borderColor: phaseColor + '66', borderWidth: 1.5 },
        ]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={label}
      >
        <Animated.Text style={[styles.feelingText, { color: colors.arcLight }]}>
          {label}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  )
}

// ── Completion moment ─────────────────────────────────────────────────────────

const FEELINGS = ['Pushed through', 'Felt right', 'Just okay', 'Struggled'] as const
type Feeling = typeof FEELINGS[number]

function CompletionMoment({
  quote, author, phaseColor, dayNumber, onContinue,
}: {
  quote: string; author: string | null; phaseColor: string
  dayNumber: number; onContinue: (f: Feeling) => void
}) {
  const [selected, setSelected] = useState<Feeling | null>(null)

  const overlayOp  = useSharedValue(0)
  const quoteOp    = useSharedValue(0)
  const feelingOp  = useSharedValue(0)
  const feelingTY  = useSharedValue(20)
  const continueTY = useSharedValue(30)
  const continueOp = useSharedValue(0)

  useEffect(() => {
    overlayOp.value = withTiming(1, { duration: 400, reduceMotion: ReduceMotion.System })
    setTimeout(() => {
      quoteOp.value = withTiming(1, { duration: 600, reduceMotion: ReduceMotion.System })
    }, 200)
    setTimeout(() => {
      feelingOp.value = withTiming(1, { duration: 400, reduceMotion: ReduceMotion.System })
      feelingTY.value = withTiming(0, { duration: 400, reduceMotion: ReduceMotion.System })
    }, 1000)
  }, [])

  useEffect(() => {
    if (selected) {
      continueOp.value = withTiming(1, { duration: 300, reduceMotion: ReduceMotion.System })
      continueTY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System })
    }
  }, [selected])

  const overlayStyle  = useAnimatedStyle(() => ({ opacity: overlayOp.value }))
  const quoteStyle    = useAnimatedStyle(() => ({ opacity: quoteOp.value }))
  const feelingStyle  = useAnimatedStyle(() => ({
    opacity:   feelingOp.value,
    transform: [{ translateY: feelingTY.value }],
  }))
  const continueStyle = useAnimatedStyle(() => ({
    opacity:   continueOp.value,
    transform: [{ translateY: continueTY.value }],
  }))

  const isVolt         = phaseColor === colors.volt
  const continueBtnTxt = dayNumber >= 21 ? 'Complete Journey' : `Continue to Day ${dayNumber + 1}`
  const qSize          = getQuoteFontSize(quote)

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.completionRoot, overlayStyle]}>
      <StarfieldBackground phaseColor={phaseColor} brighterStars />

      <ScrollView
        contentContainerStyle={styles.completionContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DAY X COMPLETE */}
        <View style={styles.completionAnchor}>
          <Animated.Text style={[styles.completionDayLabel, { color: phaseColor }]}>
            {`DAY ${dayNumber} COMPLETE`}
          </Animated.Text>
          <View style={[styles.completionRule, { backgroundColor: phaseColor + '4D' }]} />
        </View>

        {/* Quote */}
        <Animated.View style={[styles.quoteBlock, quoteStyle]}>
          <Animated.Text style={[styles.quoteText, { fontSize: qSize, lineHeight: qSize * 1.4 }]}>
            {quote}
          </Animated.Text>
          {author ? (
            <Animated.Text style={styles.quoteAuthor}>{`— ${author}`}</Animated.Text>
          ) : null}
        </Animated.View>

        {/* Feeling picker */}
        <Animated.View style={[styles.feelingSection, feelingStyle]}>
          <Animated.Text style={styles.feelingLabel}>HOW DID TODAY FEEL?</Animated.Text>
          <View style={styles.feelingGrid}>
            {FEELINGS.map((f) => (
              <FeelingPill
                key={f}
                label={f}
                phaseColor={phaseColor}
                isSelected={selected === f}
                onPress={() => { if (!selected) setSelected(f) }}
              />
            ))}
          </View>
        </Animated.View>

        {/* Continue button — appears after feeling selected */}
        {selected ? (
          <Animated.View style={[styles.continueWrap, continueStyle]}>
            <Pressable
              onPress={() => onContinue(selected)}
              style={[styles.continueBtn, { backgroundColor: phaseColor }]}
              accessibilityRole="button"
              accessibilityLabel={continueBtnTxt}
            >
              <Animated.Text style={[styles.continueBtnText, { color: isVolt ? colors.abyss : colors.arcLight }]}>
                {continueBtnTxt}
              </Animated.Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </ScrollView>
    </Animated.View>
  )
}

// ── Day screen ────────────────────────────────────────────────────────────────

export default function Day() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { activeJourney, currentDay, hydrate } = useJourneyStore()

  const [dayData, setDayData]               = useState<DayData | null>(null)
  const [daySteps, setDaySteps]             = useState<DayStep[]>([])
  const [isCompleted, setIsCompleted]       = useState(false)
  const [isLoading, setIsLoading]           = useState(true)
  const [currentStep, setCurrentStep]       = useState(0)
  const [showHoldButton, setShowHoldButton] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [isSaving, setIsSaving]             = useState(false)

  const phaseColor  = getPhaseColor(Math.max(currentDay, 1))
  const phaseName   = getPhaseName(Math.max(currentDay, 1))
  const displayDay  = activeJourney ? currentDay : 1
  const displayName = `DAY ${displayDay} · ${phaseName}`
  const isVolt      = phaseColor === colors.volt

  // ── Data loading ──────────────────────────────────────────────────────────
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

  // ── Progress bar ──────────────────────────────────────────────────────────
  const progressPct = useSharedValue(0)
  useEffect(() => {
    const pct = daySteps.length > 0
      ? (showHoldButton ? 1 : currentStep / daySteps.length)
      : 0
    progressPct.value = withTiming(pct, { duration: 300, reduceMotion: ReduceMotion.System })
  }, [currentStep, daySteps.length, showHoldButton])

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressPct.value * 100}%` as any,
  }))

  // ── Step scene transition ─────────────────────────────────────────────────
  const stepOp            = useSharedValue(1)
  const stepTY            = useSharedValue(0)
  const isFirstStepRender = useRef(true)
  const isGoingBackRef    = useRef(false)

  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false
      return
    }

    if (isGoingBackRef.current) {
      isGoingBackRef.current = false
      stepTY.value = 0
      stepOp.value = withTiming(1, { duration: 200, reduceMotion: ReduceMotion.System })
    } else {
      stepTY.value = 20
      const tid = setTimeout(() => {
        stepOp.value = withTiming(1, { duration: 200, reduceMotion: ReduceMotion.System })
        stepTY.value = withTiming(0, { duration: 200, reduceMotion: ReduceMotion.System })
      }, 80)
      return () => clearTimeout(tid)
    }
  }, [currentStep])

  const stepAnimStyle = useAnimatedStyle(() => ({
    opacity:   stepOp.value,
    transform: [{ translateY: stepTY.value }],
  }))

  // ── Hold button entrance ──────────────────────────────────────────────────
  const holdOp = useSharedValue(0)
  const holdTY = useSharedValue(60)

  useEffect(() => {
    if (!showHoldButton) return
    holdOp.value = withTiming(1, { duration: 400, reduceMotion: ReduceMotion.System })
    holdTY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    })
  }, [showHoldButton])

  const holdAnimStyle = useAnimatedStyle(() => ({
    opacity:   holdOp.value,
    transform: [{ translateY: holdTY.value }],
  }))

  // ── Stale-closure-safe refs ───────────────────────────────────────────────
  const stepsRef       = useRef(daySteps)
  const currentStepRef = useRef(currentStep)
  stepsRef.current       = daySteps
  currentStepRef.current = currentStep

  // ── Step navigation ───────────────────────────────────────────────────────
  function advanceStep() {
    stepOp.value = withTiming(0, { duration: 200, reduceMotion: ReduceMotion.System })
    stepTY.value = withTiming(-20, { duration: 200, reduceMotion: ReduceMotion.System })

    const isLast = currentStepRef.current >= stepsRef.current.length - 1
    setTimeout(() => {
      if (isLast) {
        setShowHoldButton(true)
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }, 200)
  }

  function goToPrevStep() {
    isGoingBackRef.current = true
    stepOp.value = withTiming(0, { duration: 200, reduceMotion: ReduceMotion.System })
    setTimeout(() => {
      setCurrentStep(prev => prev - 1)
    }, 200)
  }

  function handleBack() {
    if (currentStep > 0 && !showHoldButton) {
      goToPrevStep()
    } else {
      router.back()
    }
  }

  // ── Completion handlers ───────────────────────────────────────────────────
  function handleHoldComplete() {
    setShowCompletion(true)
  }

  async function handleContinue(feeling: Feeling) {
    if (!activeJourney || isSaving) return
    setIsSaving(true)

    const { error } = await completeDay(
      activeJourney.id, activeJourney.arc, activeJourney.focus, currentDay, feeling,
    )

    if (error) {
      setIsSaving(false)
      Alert.alert('Could not save', 'Your completion did not save. Please try again.')
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

  const step             = daySteps[currentStep]
  const totalSteps       = daySteps.length
  const sessionTitleSize = dayData ? getSessionTitleFontSize(dayData.title) : 23

  return (
    <View style={styles.root}>
      <StarfieldBackground phaseColor={phaseColor} />

      <View style={[styles.safeContent, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

        {/* Header: back arrow + phase badge */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.arcLight + '80'} />
          </Pressable>

          <View style={{ flex: 1 }} />

          <View style={[styles.phaseBadge, { borderColor: phaseColor }]}>
            <Animated.Text style={[styles.phaseBadgeText, { color: phaseColor }]}>
              {displayName}
            </Animated.Text>
          </View>
        </View>

        {/* Session header */}
        {!isLoading && dayData ? (
          <View style={styles.sessionHeader}>
            <Animated.Text style={styles.sessionLabel}>{"TODAY'S SESSION"}</Animated.Text>
            <Animated.Text style={[styles.sessionTitle, { fontSize: sessionTitleSize, lineHeight: sessionTitleSize * 1.2 }]}>
              {dayData.title}
            </Animated.Text>
            <Animated.Text style={styles.sessionMeta}>
              {`${dayData.focus} · ${dayData.duration_mins ?? 0} min`}
            </Animated.Text>
          </View>
        ) : null}

        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, { backgroundColor: phaseColor + '1A' }]}>
            <Animated.View style={[styles.progressFill, { backgroundColor: phaseColor }, progressStyle]} />
          </View>
        </View>

        {/* Step dots */}
        {!isLoading && totalSteps > 0 && (
          <View style={styles.dotsRow}>
            {daySteps.map((_, i) => (
              <StepDot
                key={i}
                phaseColor={phaseColor}
                state={
                  showHoldButton
                    ? 'done'
                    : i < currentStep ? 'done'
                    : i === currentStep ? 'current'
                    : 'remaining'
                }
              />
            ))}
          </View>
        )}

        {/* Main area */}
        <View style={styles.mainArea}>

          {/* Step scene — vertically centered glassmorphism card */}
          {!isLoading && step && !showHoldButton && (
            <Animated.View style={[styles.stepScene, stepAnimStyle]}>
              <BlurView
                intensity={20}
                tint="dark"
                style={[styles.stepCard, { borderColor: phaseColor + '26' }]}
              >
                <Animated.Text style={styles.stepLabel}>
                  {`STEP ${currentStep + 1} OF ${totalSteps}`}
                </Animated.Text>

                <Animated.Text style={styles.stepTitle}>
                  {step.title}
                </Animated.Text>

                <Animated.Text style={styles.stepInstruction}>
                  {step.instruction}
                </Animated.Text>

                {step.has_video && step.video_url ? (
                  <Pressable
                    onPress={() => Linking.openURL(step.video_url!)}
                    style={styles.videoRow}
                    accessibilityRole="link"
                    accessibilityLabel="Watch how to do this"
                  >
                    <View style={[styles.videoCircle, { backgroundColor: phaseColor + '29' }]}>
                      <Ionicons name="play" size={11} color={phaseColor} />
                    </View>
                    <Animated.Text style={styles.videoText}>Watch how to do this</Animated.Text>
                  </Pressable>
                ) : null}
              </BlurView>

              {/* Next arrow — outside card, absolute bottom-right of scene */}
              <Pressable
                onPress={advanceStep}
                style={[styles.nextArrow, { backgroundColor: phaseColor + '21' }]}
                accessibilityRole="button"
                accessibilityLabel="Next step"
              >
                <Ionicons name="chevron-forward" size={22} color={phaseColor} />
              </Pressable>
            </Animated.View>
          )}

          {/* Why does this matter */}
          {!isLoading && !showHoldButton && dayData?.why_this_matters ? (
            <WhySection text={dayData.why_this_matters} phaseColor={phaseColor} />
          ) : null}

          {/* Hold to Complete area */}
          <View style={styles.holdArea}>
            {/* Dimmed placeholder — visible during steps */}
            {!showHoldButton && (
              <View style={[styles.holdPlaceholder, {
                backgroundColor: phaseColor + '14',
                borderColor:     phaseColor + '26',
              }]}>
                <Animated.Text style={[styles.holdPlaceholderText, { color: colors.arcLight + '40' }]}>
                  Hold to complete
                </Animated.Text>
              </View>
            )}

            {/* Active hold button — slides up when all steps done */}
            {showHoldButton && !showCompletion ? (
              <Animated.View style={holdAnimStyle}>
                {isCompleted ? (
                  <View style={[styles.completedPill, { borderColor: phaseColor + '66', backgroundColor: phaseColor + '22' }]}>
                    <Ionicons name="checkmark-circle" size={18} color={phaseColor} />
                    <Animated.Text style={[styles.completedText, { color: phaseColor }]}>
                      {`Day ${displayDay} Complete`}
                    </Animated.Text>
                  </View>
                ) : (
                  <HoldButton
                    phaseColor={phaseColor}
                    holdMs={1500}
                    onComplete={handleHoldComplete}
                    buttonHeight={50}
                    buttonRadius={25}
                    labelFontFamily={DM.bold}
                    labelFontSize={14}
                    label="Hold to complete"
                  />
                )}
              </Animated.View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Completion moment */}
      {showCompletion ? (
        <CompletionMoment
          quote={dayData?.quote ?? 'You showed up. That matters.'}
          author={dayData?.quote_author ?? null}
          phaseColor={phaseColor}
          dayNumber={displayDay}
          onContinue={handleContinue}
        />
      ) : null}
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.abyss,
  },

  safeContent: {
    flex: 1,
  },

  // Header row
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 20,
    paddingTop:        48,
  },

  backBtn: {
    width:          44,
    height:         44,
    alignItems:     'center',
    justifyContent: 'center',
  },

  phaseBadge: {
    borderWidth:       1,
    borderRadius:      20,
    paddingVertical:   4,
    paddingHorizontal: 12,
  },
  phaseBadgeText: {
    fontFamily:    DM.medium,
    fontSize:      10,
    letterSpacing: 1.5,
  },

  // Session header
  sessionHeader: {
    paddingHorizontal: 20,
    marginTop:         14,
  },
  sessionLabel: {
    fontFamily:    DM.medium,
    fontSize:      10,
    letterSpacing: 1.8,
    color:         colors.arcLight + '47',
    marginBottom:  6,
  },
  sessionTitle: {
    fontFamily:   DM.bold,
    color:         colors.arcLight,
    marginBottom:  6,
  },
  sessionMeta: {
    fontFamily: DM.regular,
    fontSize:   11,
    color:       colors.arcLight + '59',
  },

  // Progress bar
  progressWrap: {
    paddingHorizontal: 20,
    marginTop:         10,
  },
  progressTrack: {
    height:       2,
    borderRadius: 1,
  },
  progressFill: {
    height:       2,
    borderRadius: 1,
  },

  // Dot indicators
  dotsRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    gap:            8,
    marginTop:      9,
  },

  // Main area — flex container for step + why + hold
  mainArea: {
    flex:     1,
    position: 'relative',
  },

  // Step scene — vertically centers the glassmorphism card
  stepScene: {
    flex:            1,
    position:        'relative',
    justifyContent:  'center',
    paddingVertical: 20,
  },

  // Glassmorphism card
  stepCard: {
    marginHorizontal: 20,
    borderRadius:     24,
    borderWidth:      1,
    overflow:         'hidden',
    backgroundColor:  colors.fathom + '8C',
    padding:          24,
  },

  stepLabel: {
    fontFamily:    DM.medium,
    fontSize:      10,
    letterSpacing: 2,
    color:         colors.arcLight + '4D',
    marginBottom:  10,
  },

  stepTitle: {
    fontFamily:   DM.medium,
    fontSize:     17,
    lineHeight:   17 * 1.35,
    color:         colors.arcLight,
    marginBottom:  13,
  },

  stepInstruction: {
    fontFamily:   DM.regular,
    fontSize:     14,
    lineHeight:   14 * 1.78,
    color:         colors.arcLight + 'C2',
    marginBottom:  18,
  },

  // Video link
  videoRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  videoCircle: {
    width:          28,
    height:         28,
    borderRadius:   14,
    alignItems:     'center',
    justifyContent: 'center',
  },
  videoText: {
    fontFamily: DM.regular,
    fontSize:   12,
    color:       colors.arcLight + '85',
  },

  // Next arrow — absolute, outside card, bottom-right of scene
  nextArrow: {
    position:       'absolute',
    bottom:         12,
    right:          20,
    width:          44,
    height:         44,
    borderRadius:   22,
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         2,
  },

  // Why section
  whyOuter: {
    marginHorizontal: 20,
    borderTopWidth:   1,
  },
  whyRow: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingVertical: 11,
  },
  whyRowLabel: {
    fontFamily: DM.regular,
    fontSize:   12,
    flex:       1,
  },
  whyPanel: {
    backgroundColor: colors.fathom,
    borderLeftWidth: 2,
    padding:         16,
    marginBottom:    8,
  },
  whyPanelText: {
    fontFamily: DM.regular,
    fontSize:   13,
    lineHeight: 13 * 1.7,
    color:       colors.arcLight + 'BF',
  },

  // Hold button area
  holdArea: {
    marginHorizontal: 20,
    marginBottom:     22,
    marginTop:        8,
  },

  holdPlaceholder: {
    height:         50,
    borderRadius:   25,
    borderWidth:    1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  holdPlaceholderText: {
    fontFamily: DM.bold,
    fontSize:   14,
  },

  completedPill: {
    height:         50,
    borderRadius:   25,
    borderWidth:    1,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
  },
  completedText: {
    fontFamily: DM.bold,
    fontSize:   14,
  },

  // Completion moment
  completionRoot: {
    zIndex:          100,
    backgroundColor: colors.abyss,
  },
  completionContent: {
    flexGrow:          1,
    alignItems:        'center',
    justifyContent:    'center',
    paddingTop:        60,
    paddingBottom:     60,
    paddingHorizontal: 28,
  },
  completionAnchor: {
    alignItems:   'center',
    marginBottom: 36,
  },
  completionDayLabel: {
    fontFamily:    DM.medium,
    fontSize:      10,
    letterSpacing: 3,
    marginBottom:  10,
  },
  completionRule: {
    width:  50,
    height: 1,
  },

  // Quote
  quoteBlock: {
    alignItems:   'center',
    marginTop:    32,
    marginBottom: 32,
    width:        '100%',
  },
  quoteText: {
    fontFamily:   DM.bold,
    color:         colors.arcLight,
    textAlign:    'center',
    marginBottom: 10,
  },
  quoteAuthor: {
    fontFamily:   DM.regular,
    fontSize:     12,
    color:         colors.arcLight + '61',
    textAlign:    'center',
    marginBottom: 34,
  },

  feelingSection: {
    width: '100%',
  },
  feelingLabel: {
    fontFamily:    DM.medium,
    fontSize:      10,
    letterSpacing: 2,
    color:          colors.arcLight + '59',
    textAlign:     'center',
    marginBottom:  14,
  },
  feelingGrid: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            10,
    justifyContent: 'center',
    marginBottom:   14,
  },
  feelingWrap: {
    minWidth: '44%',
  },
  feelingPill: {
    height:            44,
    borderRadius:      24,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 16,
  },
  feelingText: {
    fontFamily: DM.regular,
    fontSize:   12,
  },

  continueWrap: {
    width: '100%',
  },
  continueBtn: {
    height:         46,
    borderRadius:   23,
    alignItems:     'center',
    justifyContent: 'center',
    width:          '100%',
  },
  continueBtnText: {
    fontFamily: DM.medium,
    fontSize:   13,
  },
})
