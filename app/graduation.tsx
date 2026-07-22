import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  AppState,
  BackHandler,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { getMeditationFigureHtml } from '@/assets/webview/meditationFigureHtml'
import { Button } from '@/components/core/Button'
import { Text } from '@/components/core/Text'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useJourneyStore } from '@/stores/journey.store'
import {
  colors,
  fontFamilies,
  graduation,
  radius,
  spacing,
  typography,
} from '@/theme'

type GraduationAct = 'transcendence' | 'handoff'
type SceneMessage = { type: 'scene-ready' | 'scene-error' }

function CompletedFigureFallback({ quiet = false }: { quiet?: boolean }) {
  return (
    <View
      pointerEvents="none"
      accessible={false}
      style={[styles.fallbackFigure, quiet && styles.fallbackFigureQuiet]}
    >
      <View style={[styles.fallbackAura, { borderColor: colors.borderIris }]} />
      <View style={[styles.fallbackAuraInner, { borderColor: colors.borderPlasma }]} />
      <View style={styles.fallbackSpine} />
      {[colors.iris, colors.volt, colors.plasma, colors.arcLight].map((color, index) => (
        <View
          key={color}
          style={[
            styles.fallbackJoint,
            { backgroundColor: color, top: spacing[8] + index * spacing[10] },
          ]}
        />
      ))}
      <View style={[styles.fallbackLimb, styles.fallbackLimbLeft]} />
      <View style={[styles.fallbackLimb, styles.fallbackLimbRight]} />
    </View>
  )
}

type ActionRowProps = {
  title: string
  description: string
  icon: React.ComponentProps<typeof Ionicons>['name']
  onPress?: () => void
  disabled?: boolean
  badge?: string
}

function ActionRow({
  title,
  description,
  icon,
  onPress,
  disabled = false,
  badge,
}: ActionRowProps) {
  const content = (
    <>
      <View style={styles.actionIcon}>
        <Ionicons
          name={icon}
          size={spacing[5]}
          color={disabled ? colors.textLow : colors.arcLight}
          accessible={false}
        />
      </View>
      <View style={styles.actionCopy}>
        <Text
          variant="base"
          color={disabled ? colors.textMid : colors.textHi}
          style={styles.actionTitle}
        >
          {title}
        </Text>
        <Text variant="caption" color={colors.textMid} style={styles.actionDescription}>
          {description}
        </Text>
      </View>
      {badge ? (
        <View style={styles.comingSoonBadge}>
          <Text variant="label" color={colors.textMid} uppercase>
            {badge}
          </Text>
        </View>
      ) : (
        <Ionicons
          name="arrow-forward"
          size={spacing[5]}
          color={colors.textMid}
          accessible={false}
        />
      )}
    </>
  )

  if (disabled) {
    return (
      <View
        style={styles.actionRow}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${title}. ${description}. Coming soon.`}
        accessibilityState={{ disabled: true }}
      >
        {content}
      </View>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      {content}
    </Pressable>
  )
}

export default function Graduation() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const webViewRef = useRef<WebView>(null)
  const activeJourney = useJourneyStore((state) => state.activeJourney)
  const clearOnboarding = useOnboardingStore((state) => state.clear)

  const [act, setAct] = useState<GraduationAct>('transcendence')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)
  const [accessibilityReady, setAccessibilityReady] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)
  const [actionVisible, setActionVisible] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [shareError, setShareError] = useState(false)

  const openingOpacity = useSharedValue(0)
  const handoffOpacity = useSharedValue(0)
  const handoffTranslateY = useSharedValue<number>(spacing[6])

  const directAccess = reducedMotion || screenReaderEnabled
  const figureHtml = useMemo(
    () => getMeditationFigureHtml({ mode: 'graduation', reducedMotion }),
    [reducedMotion],
  )

  useEffect(() => {
    const backSubscription = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backSubscription.remove()
  }, [])

  useEffect(() => {
    let mounted = true
    void Promise.all([
      AccessibilityInfo.isReduceMotionEnabled(),
      AccessibilityInfo.isScreenReaderEnabled(),
    ]).then(([reduceMotion, screenReader]) => {
      if (!mounted) return
      setReducedMotion(reduceMotion)
      setScreenReaderEnabled(screenReader)
      setAccessibilityReady(true)
    })

    const reduceSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion,
    )
    const readerSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled,
    )

    return () => {
      mounted = false
      reduceSubscription.remove()
      readerSubscription.remove()
    }
  }, [])

  useEffect(() => {
    if (!accessibilityReady) return
    if (directAccess) {
      setQuoteVisible(true)
      setActionVisible(true)
      openingOpacity.value = withTiming(1, {
        duration: graduation.openingFadeDuration,
        reduceMotion: ReduceMotion.Always,
      })
      return
    }

    const quoteTimer = setTimeout(() => {
      setQuoteVisible(true)
      openingOpacity.value = withTiming(1, {
        duration: graduation.openingFadeDuration,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    }, graduation.openingQuoteDelay)
    const actionTimer = setTimeout(() => setActionVisible(true), graduation.openingActionDelay)

    return () => {
      clearTimeout(quoteTimer)
      clearTimeout(actionTimer)
    }
  }, [accessibilityReady, directAccess, openingOpacity])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!sceneReady) setSceneFailed(true)
    }, graduation.sceneReadyTimeout)
    return () => clearTimeout(timeout)
  }, [sceneReady])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      webViewRef.current?.postMessage(
        JSON.stringify({ type: nextState === 'active' ? 'resume' : 'pause' }),
      )
    })
    return () => {
      webViewRef.current?.postMessage(JSON.stringify({ type: 'pause' }))
      subscription.remove()
    }
  }, [])

  const openingStyle = useAnimatedStyle(() => ({ opacity: openingOpacity.value }))
  const handoffStyle = useAnimatedStyle(() => ({
    opacity: handoffOpacity.value,
    transform: [{ translateY: handoffTranslateY.value }],
  }))

  function handleSceneMessage(event: WebViewMessageEvent) {
    try {
      const message = JSON.parse(event.nativeEvent.data) as SceneMessage
      if (message.type === 'scene-ready') {
        setSceneReady(true)
        setSceneFailed(false)
      }
      if (message.type === 'scene-error') setSceneFailed(true)
    } catch {
      // Ignore unrelated WebView messages.
    }
  }

  function showHandoff() {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'handoff' }))
    setAct('handoff')
    handoffOpacity.value = withTiming(1, {
      duration: directAccess ? 1 : graduation.handoffDuration,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    })
    handoffTranslateY.value = withTiming(0, {
      duration: directAccess ? 1 : graduation.handoffDuration,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    })
  }

  function beginAnotherCircuit() {
    clearOnboarding()
    router.push({ pathname: '/(onboarding)/match', params: { mode: 'new-circuit' } })
  }

  async function shareProof() {
    setShareError(false)
    try {
      await Share.share({
        message: `I completed 21 days of ${activeJourney?.focus ?? 'focused practice'} with INAT. The limit was theoretical.`,
        title: 'INAT — 21 days complete',
      })
    } catch {
      setShareError(true)
    }
  }

  const handoffTop = Math.max(
    graduation.handoffContentTopMin,
    height * graduation.handoffContentTopRatio,
  )

  return (
    <View style={styles.root} accessibilityViewIsModal>
      <CompletedFigureFallback quiet={act === 'handoff'} />

      {!sceneFailed ? (
        <WebView
          ref={webViewRef}
          source={{ html: figureHtml }}
          originWhitelist={['*']}
          onMessage={handleSceneMessage}
          onError={() => setSceneFailed(true)}
          onHttpError={() => setSceneFailed(true)}
          pointerEvents="none"
          scrollEnabled={false}
          bounces={false}
          javaScriptEnabled
          allowsInlineMediaPlayback={false}
          style={styles.webView}
          containerStyle={styles.webViewContainer}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        />
      ) : null}

      {act === 'transcendence' ? (
        <Animated.View
          style={[
            styles.openingContent,
            { paddingBottom: insets.bottom + spacing[6] },
            openingStyle,
          ]}
          pointerEvents={actionVisible ? 'auto' : 'none'}
          accessibilityElementsHidden={!quoteVisible}
          importantForAccessibility={quoteVisible ? 'auto' : 'no-hide-descendants'}
        >
          {quoteVisible ? (
            <Text
              variant="quote"
              color={colors.arcLight}
              align="center"
              style={styles.openingQuote}
            >
              You stopped waiting for the right time. You made it.
            </Text>
          ) : null}
          {actionVisible ? (
            <View style={styles.openingButton}>
              <Button onPress={showHandoff}>What’s next →</Button>
            </View>
          ) : null}
        </Animated.View>
      ) : (
        <Animated.View style={[StyleSheet.absoluteFillObject, handoffStyle]}>
          <ScrollView
            style={styles.handoffScroll}
            contentContainerStyle={[
              styles.handoffContent,
              {
                paddingTop: handoffTop,
                paddingBottom: insets.bottom + spacing[8],
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.handoffInner}>
              <Text
                variant="base"
                color={colors.arcLight}
                style={styles.handoffHeading}
              >
                The next move is yours.
              </Text>
              <Text variant="body" color={colors.textMid} style={styles.handoffIntro}>
                The circuit did its job. Keep what you built. Choose what serves you now.
              </Text>

              <View style={styles.primaryAction}>
                <Button onPress={beginAnotherCircuit}>Begin another circuit</Button>
                <Text variant="caption" color={colors.textMid} style={styles.primarySupport}>
                  Choose a new Arc, or stay with this one and change your Focus.
                </Text>
              </View>

              <View style={styles.actionList}>
                <ActionRow
                  title="See my journey"
                  description="Review the 21 days you built."
                  icon="analytics-outline"
                  onPress={() => router.replace('/(tabs)/ascent')}
                />
                <View style={styles.divider} />
                <ActionRow
                  title="Go deeper"
                  description="Continue beyond the introductory circuit."
                  icon="layers-outline"
                  disabled
                  badge="Coming soon"
                />
                <View style={styles.divider} />
                <ActionRow
                  title="Share the proof"
                  description="Share your completed Focus with the native share sheet."
                  icon="share-outline"
                  onPress={() => void shareProof()}
                />
              </View>

              {shareError ? (
                <Text
                  variant="caption"
                  color={colors.error}
                  align="center"
                  style={styles.shareError}
                >
                  Sharing is unavailable right now. Your Graduation is still here.
                </Text>
              ) : null}

              <Pressable
                onPress={() => router.replace('/(tabs)/')}
                style={({ pressed }) => [styles.homeAction, pressed && styles.homeActionPressed]}
                accessibilityRole="button"
                accessibilityLabel="Return home"
                accessibilityHint="Leaves Graduation and returns to Home"
              >
                <Text variant="base" color={colors.textMid} style={styles.homeActionText}>
                  Return home
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  webViewContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.abyss,
  },
  webView: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  fallbackFigure: {
    position: 'absolute',
    top: '17%',
    alignSelf: 'center',
    width: graduation.fallbackFigureWidth,
    height: graduation.fallbackFigureHeight,
    alignItems: 'center',
    opacity: 0.72,
  },
  fallbackFigureQuiet: {
    top: '4%',
    opacity: 0.38,
    transform: [{ scale: 0.76 }],
  },
  fallbackAura: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderRadius: radius.full,
  },
  fallbackAuraInner: {
    position: 'absolute',
    top: spacing[6],
    bottom: spacing[6],
    left: spacing[5],
    right: spacing[5],
    borderWidth: 1,
    borderRadius: radius.full,
  },
  fallbackSpine: {
    position: 'absolute',
    top: spacing[8],
    bottom: spacing[8],
    width: 1,
    backgroundColor: colors.arcLight,
    opacity: 0.5,
  },
  fallbackJoint: {
    position: 'absolute',
    width: graduation.fallbackJointSize,
    height: graduation.fallbackJointSize,
    borderRadius: radius.full,
  },
  fallbackLimb: {
    position: 'absolute',
    top: '46%',
    width: '44%',
    height: 1,
    backgroundColor: colors.arcLight,
    opacity: 0.4,
  },
  fallbackLimbLeft: {
    left: spacing[2],
    transform: [{ rotate: '28deg' }],
  },
  fallbackLimbRight: {
    right: spacing[2],
    transform: [{ rotate: '-28deg' }],
  },
  openingContent: {
    position: 'absolute',
    left: spacing.pagePad,
    right: spacing.pagePad,
    bottom: 0,
    alignItems: 'center',
  },
  openingQuote: {
    maxWidth: graduation.maxContentWidth,
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.quote,
    lineHeight: typography.size.quote * typography.leading.heading,
  },
  openingButton: {
    width: '100%',
    maxWidth: graduation.maxContentWidth,
    marginTop: spacing[6],
  },
  handoffScroll: {
    flex: 1,
  },
  handoffContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.pagePad,
    backgroundColor: colors.bgScrim,
  },
  handoffInner: {
    width: '100%',
    maxWidth: graduation.maxContentWidth,
    alignSelf: 'center',
  },
  handoffHeading: {
    fontFamily: fontFamilies.black,
    fontSize: typography.size.title,
    lineHeight: typography.size.title * typography.leading.tight,
    letterSpacing: typography.tracking.tight * typography.size.title,
  },
  handoffIntro: {
    marginTop: spacing[3],
    maxWidth: graduation.maxContentWidth,
  },
  primaryAction: {
    marginTop: spacing[8],
  },
  primarySupport: {
    marginTop: spacing[3],
    paddingHorizontal: spacing[2],
    lineHeight: typography.size.caption * typography.leading.step,
  },
  actionList: {
    marginTop: spacing[8],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderStrong,
  },
  actionRow: {
    minHeight: graduation.actionRowMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  actionRowPressed: {
    backgroundColor: colors.bgInput,
  },
  actionIcon: {
    width: spacing[8],
    alignItems: 'center',
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: fontFamilies.bold,
  },
  actionDescription: {
    marginTop: spacing[1],
    lineHeight: typography.size.caption * typography.leading.heading,
  },
  comingSoonBadge: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginLeft: spacing[10] + spacing[3],
  },
  shareError: {
    marginTop: spacing[4],
    lineHeight: typography.size.caption * typography.leading.heading,
  },
  homeAction: {
    minHeight: spacing.touchMin + spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: spacing[8],
    paddingHorizontal: spacing[6],
  },
  homeActionPressed: {
    opacity: 0.6,
  },
  homeActionText: {
    fontFamily: fontFamilies.medium,
  },
})
