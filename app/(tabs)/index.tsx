import React, { useEffect, useMemo, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { useRouter } from 'expo-router'
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

import { StarfieldBackground } from '@/components/shared/StarfieldBackground'
import { useJourneyStore } from '@/stores/journey.store'
import { getDayWithSteps } from '@/services/curriculum.service'
import { getDayCompletion } from '@/services/completion.service'
import { colors, getPhaseColor, getPhaseName, spacing } from '@/theme'
import type { Day } from '@/types'
import { getMeditationFigureHtml } from '@/assets/webview/meditationFigureHtml'

// ── Screen dimensions (stable after launch) ───────────────────────────────

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

// ── Font refs ──────────────────────────────────────────────────────────────

const DM = {
  regular: 'DMSans-Regular',
  medium:  'DMSans-Medium',
  bold:    'DMSans-Bold',
} as const

type HomeState = 1 | 2 | 3 | 4

// ── Helpers ─────────────────────────────────────────────────────────────────

function getArcIcon(arc: string): keyof typeof Ionicons.glyphMap {
  switch (arc) {
    case 'Move':    return 'body-outline'
    case 'Rhythm':  return 'musical-notes-outline'
    case 'Express': return 'brush-outline'
    case 'Calm':    return 'leaf-outline'
    case 'Mindful': return 'eye-outline'
    default:        return 'star-outline'
  }
}

function getHeadline(homeState: HomeState, arc: string, displayDay: number): string {
  if (homeState === 1) {
    const arcMap: Record<string, string> = {
      Move:    'Your body is ready. Are you?',
      Rhythm:  'Every musician started with silence.',
      Express: 'The blank page is not empty. It is waiting.',
      Calm:    'One breath changes everything.',
      Mindful: 'Awareness begins with a single moment.',
    }
    return arcMap[arc] ?? 'Your journey begins now.'
  }
  if (homeState === 2) {
    if (displayDay <= 3)  return 'You showed up yesterday. Show up again.'
    if (displayDay <= 7)  return 'The base is forming. Stay with it.'
    if (displayDay <= 11) return 'Momentum is yours. Do not stop now.'
    if (displayDay <= 14) return 'You are past the halfway point. Keep going.'
    if (displayDay <= 18) return 'The final phase. Everything counts.'
    return 'Three days from something real. Finish this.'
  }
  if (homeState === 3) return 'Rest. You earned it today.'
  return 'You made it. All 21 days.'
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function Home() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { activeJourney, currentDay, reentryState, isHydrated } = useJourneyStore()

  const [dayData,   setDayData]   = useState<Day | null>(null)
  const [feeling,   setFeeling]   = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // When today is done (reentryState B), currentDay is already incremented in the store
  const displayDay = reentryState === 'B'
    ? Math.max(currentDay - 1, 1)
    : Math.max(currentDay, 1)

  const homeState = useMemo<HomeState>(() => {
    if (!activeJourney) return 1
    if (currentDay > 21) return 4
    if (reentryState === 'B') return 3
    return 2
  }, [activeJourney, currentDay, reentryState])

  const phaseColor = activeJourney ? getPhaseColor(displayDay) : colors.iris
  const phaseName  = activeJourney ? getPhaseName(displayDay)  : 'FOUNDATION'
  const isVolt     = phaseColor === colors.volt

  const silhouetteOpacity =
    displayDay <= 7  ? 0.35 :
    displayDay <= 14 ? 0.60 : 0.85

  const webViewHtml = useMemo(
    () => getMeditationFigureHtml({ mode: 'home', glowColor: phaseColor }),
    [phaseColor],
  )

  // ── Data fetch ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isHydrated) return
    if (!activeJourney) {
      setIsLoading(false)
      return
    }

    Promise.all([
      getDayWithSteps(activeJourney.arc, activeJourney.focus, displayDay),
      getDayCompletion(activeJourney.id, displayDay),
    ]).then(([{ day }, { completion }]) => {
      setDayData(day)
      setFeeling(completion?.feeling ?? null)
      setIsLoading(false)
    })
  }, [activeJourney?.id, displayDay, isHydrated])

  // ── Animations ────────────────────────────────────────────────────────────

  const contentOp   = useSharedValue(0)
  const progressPct = useSharedValue(0)

  useEffect(() => {
    if (!isLoading) {
      contentOp.value = withTiming(1, {
        duration: 400,
        reduceMotion: ReduceMotion.System,
      })
    }
  }, [isLoading])

  useEffect(() => {
    if (!activeJourney) return
    progressPct.value = withTiming(displayDay / 21, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    })
  }, [displayDay, activeJourney?.id])

  const contentStyle  = useAnimatedStyle(() => ({ opacity: contentOp.value }))
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressPct.value * 100}%` as `${number}%`,
  }))

  // ── Derived copy ──────────────────────────────────────────────────────────

  const arcName  = activeJourney?.arc   ?? ''
  const arcIcon  = getArcIcon(arcName)
  const headline = getHeadline(homeState, arcName, displayDay)

  const focusName = activeJourney?.focus ?? ''
  const daySubLabel = dayData
    ? `${dayData.title} · ${dayData.duration_mins ?? 0} min`
    : null

  const ctaLabel =
    homeState === 1 ? 'Start Day 1 →' :
    homeState === 2 ? `Begin Day ${displayDay} →` :
    homeState === 3 ? 'See you tomorrow' :
    'See your graduation →'

  const ctaDisabled = homeState === 3

  function handleCta() {
    if (ctaDisabled) return
    if (homeState === 1 || homeState === 2) { router.push('/day'); return }
    if (homeState === 4) { router.push('/graduation') }
  }

  const bottomPad = 100

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>

      {/* Background — starfield */}
      <StarfieldBackground phaseColor={phaseColor} />

      {/* Background — meditation silhouette (Fix 1 + Fix 2) */}
      <View
        pointerEvents="none"
        style={[styles.webviewWrap, { opacity: silhouetteOpacity }]}
      >
        <WebView
          source={{ html: webViewHtml, baseUrl: 'https://localhost' }}
          style={styles.webview}
          scrollEnabled={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          javaScriptEnabled
          originWhitelist={['*']}
          backgroundColor="transparent"
        />
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          { paddingBottom: bottomPad },
          contentStyle,
        ]}
      >

        {/* Top zone — arc identity only */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Animated.Text style={styles.arcSuperLabel}>YOUR ARC</Animated.Text>
          <View style={styles.arcNameRow}>
            {arcName ? (
              <Ionicons
                name={arcIcon}
                size={14}
                color={colors.arcLight}
                style={styles.arcIcon}
              />
            ) : null}
            <Animated.Text style={styles.arcNameText} numberOfLines={1}>
              {arcName && focusName
                ? `${arcName} · ${focusName}`
                : arcName || '—'}
            </Animated.Text>
          </View>
        </View>

        {/* Spacer — silhouette occupies this visual space (Fix 2) */}
        <View style={styles.spacer} />

        {/* Bottom zone — all status + action elements (Fix 4, 5, 6) */}
        <View style={[styles.bottomZone, { paddingBottom: 24 }]}>

          {/* Element 1 — Phase · Day X of 21 (Fix 4) */}
          {activeJourney ? (
            <View style={styles.phaseProgressLine}>
              <Animated.Text style={[styles.phaseProgressPhase, { color: phaseColor }]}>
                {phaseName}
              </Animated.Text>
              <Animated.Text style={styles.phaseProgressSep}>
                {'  ·  '}
              </Animated.Text>
              <Animated.Text style={styles.phaseProgressDay}>
                {`Day ${displayDay} of 21`}
              </Animated.Text>
            </View>
          ) : null}

          {/* Element 2 — Progress bar (Fix 4) */}
          {activeJourney ? (
            <View style={[styles.progressTrack, { backgroundColor: phaseColor + '1A' }]}>
              <Animated.View
                style={[styles.progressFill, { backgroundColor: phaseColor }, progressStyle]}
              />
            </View>
          ) : null}

          {/* Element 3 — Motivational headline (Fix 4) */}
          <Animated.Text style={styles.headline}>
            {headline}
          </Animated.Text>

          {/* Element 4a — Day title + duration (State 2 / Fix 4) */}
          {(homeState === 2 || homeState === 1) && daySubLabel ? (
            <Animated.Text style={styles.daySubLabel} numberOfLines={2}>
              {daySubLabel}
            </Animated.Text>
          ) : null}

          {/* Element 4b — Feeling echo (State 3 / Fix 6) */}
          {homeState === 3 && feeling ? (
            <Animated.Text style={styles.daySubLabel}>
              {`You felt ${feeling.toLowerCase()} today. Hold that.`}
            </Animated.Text>
          ) : null}

          {/* Element 5 — Primary CTA only, no secondary buttons (Fix 5) */}
          <Pressable
            onPress={ctaDisabled ? undefined : handleCta}
            disabled={ctaDisabled}
            style={[
              styles.primaryBtn,
              ctaDisabled
                ? {
                    backgroundColor: phaseColor + '1A',
                    borderWidth:     1,
                    borderColor:     phaseColor + '33',
                  }
                : { backgroundColor: phaseColor },
            ]}
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
            accessibilityState={{ disabled: ctaDisabled }}
          >
            <Animated.Text style={[
              styles.primaryBtnText,
              ctaDisabled
                ? { color: colors.arcLight + '4D' }
                : { color: isVolt ? colors.abyss : colors.arcLight },
            ]}>
              {ctaLabel}
            </Animated.Text>
          </Pressable>

        </View>
      </Animated.View>
    </View>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: colors.abyss,
  },

  // Meditation silhouette — full screen, no container boundary
  webviewWrap: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    bottom:          0,
    width:           SCREEN_W,
    height:          SCREEN_H,
    zIndex:          1,
    backgroundColor: 'transparent',
  },
  webview: {
    flex:            1,
    backgroundColor: 'transparent',
  },

  // Main content (above WebView)
  content: {
    flex:   1,
    zIndex: 2,
  },

  // Top zone — paddingTop applied inline with insets.top + 16
  header: {
    paddingHorizontal: 20,
  },
  arcSuperLabel: {
    fontFamily:    'DMSans-Regular',
    fontSize:      11,
    letterSpacing: 2,
    color:         'rgba(234,255,245,0.30)',
    marginBottom:  4,
  },
  arcNameRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  arcIcon: {
    marginRight: 6,
  },
  arcNameText: {
    fontFamily:    'DMSans-Bold',
    fontSize:      18,
    lineHeight:    24,
    letterSpacing: 0.3,
    color:         '#EAFFF5',
    flexShrink:    1,
  },

  // Spacer — silhouette zone
  spacer: {
    flex: 1,
  },

  // Bottom zone — Fix 4
  bottomZone: {
    paddingHorizontal: 20,
  },

  // Element 1 — phase · day line
  phaseProgressLine: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  6,
  },
  phaseProgressPhase: {
    fontFamily:    DM.medium,
    fontSize:      11,
    letterSpacing: 1.5,
  },
  phaseProgressSep: {
    fontFamily: DM.medium,
    fontSize:   11,
    color:      colors.arcLight + '59',
  },
  phaseProgressDay: {
    fontFamily:    DM.medium,
    fontSize:      11,
    letterSpacing: 1.5,
    color:         colors.arcLight + '59',
  },

  // Element 2 — progress bar
  progressTrack: {
    height:       2,
    borderRadius: 1,
    marginBottom: 14,
  },
  progressFill: {
    height:       2,
    borderRadius: 1,
  },

  // Element 3 — headline
  headline: {
    fontFamily:   DM.bold,
    fontSize:     26,
    lineHeight:   26 * 1.25,
    color:        colors.arcLight,
    marginBottom: 8,
  },

  // Element 4 — day sub label or feeling echo
  daySubLabel: {
    fontFamily:   DM.regular,
    fontSize:     13,
    lineHeight:   13 * 1.55,
    color:        colors.arcLight + '66',
    marginBottom: 24,
  },

  // Element 5 — CTA
  primaryBtn: {
    height:         52,
    borderRadius:   26,
    alignItems:     'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: DM.bold,
    fontSize:   15,
  },
})
