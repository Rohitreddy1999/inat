import { useEffect, useRef, useState } from 'react'
import { Alert, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Silhouette } from '@/components/shared/Silhouette'
import { Text } from '@/components/core/Text'
import { Card } from '@/components/core/Card'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import { useJourneyStore } from '@/stores/journey.store'
import { markGraduationSeen } from '@/services/journey.service'
import { getProfile } from '@/services/profile.service'
import { getSession } from '@/services/auth.service'
import { colors, spacing } from '@/theme'
import { Profile } from '@/types'

// ─── Beat 1 ──────────────────────────────────────────────────────────────────

interface AuraPulseProps {
  color: string
  delay: number
}

function AuraPulse({ color, delay }: AuraPulseProps) {
  const scale = useSharedValue(0.8)
  const opacity = useSharedValue(0.8)

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withTiming(2.5, { duration: 1500, easing: Easing.out(Easing.cubic) }),
    )
    opacity.value = withDelay(
      delay,
      withTiming(0, { duration: 1500, easing: Easing.out(Easing.cubic) }),
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: 90,
          borderWidth: 2,
          borderColor: color,
        },
      ]}
    />
  )
}

interface AuraGlowProps {
  color: string
  top?: number
  bottom?: number
  left?: number
  right?: number
  startDelay: number
}

function AuraGlow({ color, top, bottom, left, right, startDelay }: AuraGlowProps) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withDelay(startDelay, withTiming(0.15, { duration: 800 }))
  }, [])

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: color,
          top,
          bottom,
          left,
          right,
        },
      ]}
    />
  )
}

interface Beat1Props {
  onAdvance: () => void
}

function Beat1({ onAdvance }: Beat1Props) {
  const silhouetteOpacity = useSharedValue(0)
  const tapHintOpacity = useSharedValue(0)
  const canAdvance = useRef(false)

  useEffect(() => {
    // Phase 1: silhouette fades in over 800ms
    silhouetteOpacity.value = withTiming(1, { duration: 800 })

    // Phase 2 (1000ms): aura pulse — handled by AuraPulse components with their own delays

    // Phase 3 (2500ms): aura glow — handled by AuraGlow components with startDelay

    // After 3 seconds: show tap hint and allow advance
    tapHintOpacity.value = withDelay(3000, withTiming(1, { duration: 400 }))

    const timer = setTimeout(() => {
      canAdvance.current = true
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const silhouetteStyle = useAnimatedStyle(() => ({
    opacity: silhouetteOpacity.value,
  }))

  function handleTap() {
    if (!canAdvance.current) return
    onAdvance()
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleTap}
      style={{ flex: 1 }}
      accessibilityRole="button"
      accessibilityLabel="Tap to continue"
    >
      <View style={{ flex: 1, backgroundColor: colors.abyss, alignItems: 'center', justifyContent: 'center' }}>
        {/* Super saint aura glow — behind silhouette */}
        <AuraGlow color={colors.iris} top={-20} left={-20} startDelay={2500} />
        <AuraGlow color={colors.volt}     top={0}   right={-20} startDelay={2600} />
        <AuraGlow color={colors.plasma}  bottom={-20} left={0} startDelay={2700} />

        {/* Aura pulse rings — centered on silhouette */}
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <AuraPulse color={colors.iris} delay={1000} />
          <AuraPulse color={colors.volt}    delay={1300} />
          <AuraPulse color={colors.plasma}  delay={1600} />
        </View>

        {/* Silhouette */}
        <Animated.View style={silhouetteStyle}>
          <Silhouette
            completedDays={21}
            phaseColor={colors.volt}
            animated
            size="full"
          />
        </Animated.View>

        {/* Tap hint */}
        <Animated.View
          pointerEvents="none"
          style={[
            useAnimatedStyle(() => ({ opacity: tapHintOpacity.value })),
            { position: 'absolute', bottom: spacing[10] },
          ]}
        >
          <Text variant="caption" color={colors.textFaint}>
            tap to continue
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}

// ─── Beat 2 ──────────────────────────────────────────────────────────────────

interface Beat2Props {
  openAnswer: string | null
  onAdvance: () => void
}

function Beat2({ openAnswer, onAdvance }: Beat2Props) {
  const labelOp    = useSharedValue(0)
  const labelTY    = useSharedValue(20)
  const cardOp     = useSharedValue(0)
  const cardTY     = useSharedValue(20)
  const dividerOp  = useSharedValue(0)
  const dividerTY  = useSharedValue(20)
  const bodyOp     = useSharedValue(0)
  const bodyTY     = useSharedValue(20)
  const btnOp      = useSharedValue(0)
  const btnTY      = useSharedValue(20)

  const DUR = 500
  const ease = Easing.out(Easing.cubic)

  function animIn(op: typeof labelOp, ty: typeof labelTY, delay: number) {
    op.value  = withDelay(delay, withTiming(1,  { duration: DUR, easing: ease }))
    ty.value  = withDelay(delay, withTiming(0,  { duration: DUR, easing: ease }))
  }

  useEffect(() => {
    animIn(labelOp,   labelTY,   0)
    animIn(cardOp,    cardTY,    200)
    animIn(dividerOp, dividerTY, 500)
    animIn(bodyOp,    bodyTY,    700)
    animIn(btnOp,     btnTY,     1000)
  }, [])

  const labelStyle   = useAnimatedStyle(() => ({ opacity: labelOp.value,   transform: [{ translateY: labelTY.value }] }))
  const cardStyle    = useAnimatedStyle(() => ({ opacity: cardOp.value,    transform: [{ translateY: cardTY.value }] }))
  const dividerStyle = useAnimatedStyle(() => ({ opacity: dividerOp.value, transform: [{ translateY: dividerTY.value }] }))
  const bodyStyle    = useAnimatedStyle(() => ({ opacity: bodyOp.value,    transform: [{ translateY: bodyTY.value }] }))
  const btnStyle     = useAnimatedStyle(() => ({ opacity: btnOp.value,     transform: [{ translateY: btnTY.value }] }))

  return (
    <ScreenWrapper padded>
      <View style={{ flex: 1, justifyContent: 'center' }}>

        <Animated.View style={labelStyle}>
          <Text
            variant="micro"
            color={colors.textLow}
            uppercase
            style={{ textAlign: 'center', letterSpacing: 2 }}
          >
            21 DAYS AGO YOU WROTE
          </Text>
        </Animated.View>

        <Animated.View style={[cardStyle, { marginTop: spacing[6] }]}>
          <Card accent={colors.iris} strip="left">
            <Text variant="quote" color={colors.textHi} style={{ fontStyle: 'italic' }}>
              {openAnswer ?? 'Something worth starting.'}
            </Text>
          </Card>
        </Animated.View>

        <Animated.View style={[dividerStyle, { marginTop: spacing[8], marginBottom: spacing[8] }]}>
          <View style={{ height: 1, backgroundColor: colors.borderSoft }} />
          <Text variant="heading" color={colors.textHi} style={{ textAlign: 'center', marginTop: spacing[8] }}>
            You showed up anyway.
          </Text>
        </Animated.View>

        <Animated.View style={bodyStyle}>
          <Text variant="body" color={colors.textMid} style={{ textAlign: 'center' }}>
            That's not nothing. That's everything.
          </Text>
        </Animated.View>

      </View>

      <Animated.View style={[btnStyle, { paddingBottom: spacing[10] }]}>
        <Button variant="primary" onPress={onAdvance}>
          See what's next →
        </Button>
      </Animated.View>
    </ScreenWrapper>
  )
}

// ─── Beat 3 ──────────────────────────────────────────────────────────────────

interface Beat3Props {
  onNewCircuit: () => void
  onGoDeeper: () => void
  onDone: () => void
}

function Beat3({ onNewCircuit, onGoDeeper, onDone }: Beat3Props) {
  const titleOp  = useSharedValue(0)
  const titleTY  = useSharedValue(20)
  const card1Op  = useSharedValue(0)
  const card1TY  = useSharedValue(20)
  const card2Op  = useSharedValue(0)
  const card2TY  = useSharedValue(20)
  const card3Op  = useSharedValue(0)
  const card3TY  = useSharedValue(20)

  const DUR = 400
  const ease = Easing.out(Easing.cubic)

  function animIn(op: typeof titleOp, ty: typeof titleTY, delay: number) {
    op.value = withDelay(delay, withTiming(1, { duration: DUR, easing: ease }))
    ty.value = withDelay(delay, withTiming(0, { duration: DUR, easing: ease }))
  }

  useEffect(() => {
    animIn(titleOp, titleTY, 0)
    animIn(card1Op, card1TY, 150)
    animIn(card2Op, card2TY, 300)
    animIn(card3Op, card3TY, 450)
  }, [])

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOp.value, transform: [{ translateY: titleTY.value }] }))
  const card1Style = useAnimatedStyle(() => ({ opacity: card1Op.value, transform: [{ translateY: card1TY.value }] }))
  const card2Style = useAnimatedStyle(() => ({ opacity: card2Op.value, transform: [{ translateY: card2TY.value }] }))
  const card3Style = useAnimatedStyle(() => ({ opacity: card3Op.value, transform: [{ translateY: card3TY.value }] }))

  return (
    <ScreenWrapper padded>
      <View style={{ flex: 1, justifyContent: 'center' }}>

        <Animated.View style={titleStyle}>
          <Text variant="title" color={colors.textHi} style={{ textAlign: 'center' }}>
            {'What happens next\nis yours to decide.'}
          </Text>
        </Animated.View>

        <View style={{ marginTop: spacing[10], gap: spacing[3] }}>

          <Animated.View style={card1Style}>
            <Card onPress={onNewCircuit} accent={colors.iris}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="base" color={colors.textHi} style={{ fontWeight: '700' }}>
                    Start a new circuit
                  </Text>
                  <Text variant="caption" color={colors.textMid} style={{ marginTop: spacing[1] }}>
                    Pick a different Arc. Keep the momentum.
                  </Text>
                </View>
                <Ionicons name="arrow-forward" color={colors.iris} size={20} />
              </View>
            </Card>
          </Animated.View>

          <Animated.View style={card2Style}>
            <Card onPress={onGoDeeper} accent={colors.iris}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="base" color={colors.textHi} style={{ fontWeight: '700' }}>
                    Go deeper
                  </Text>
                  <Text variant="caption" color={colors.textMid} style={{ marginTop: spacing[1] }}>
                    More Focuses coming soon.
                  </Text>
                </View>
                <Badge variant="comingSoon">COMING SOON</Badge>
              </View>
            </Card>
          </Animated.View>

          <Animated.View style={card3Style}>
            <Card onPress={onDone}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="base" color={colors.textHi} style={{ fontWeight: '700' }}>
                    I'm good for now
                  </Text>
                  <Text variant="caption" color={colors.textMid} style={{ marginTop: spacing[1] }}>
                    The circuit is complete. Come back when you're ready.
                  </Text>
                </View>
                <Ionicons name="checkmark-circle" color={colors.textLow} size={20} />
              </View>
            </Card>
          </Animated.View>

        </View>
      </View>
    </ScreenWrapper>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Graduation() {
  const router = useRouter()
  const { activeJourney, reset, hydrate } = useJourneyStore()

  const [beat, setBeat] = useState<1 | 2 | 3>(1)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { session } = await getSession()
      const userId = session?.user?.id
      if (!userId) return

      const [{ profile: p }] = await Promise.all([
        getProfile(userId),
        activeJourney ? markGraduationSeen(activeJourney.id) : Promise.resolve({ error: null }),
      ])

      setProfile(p)

      if (userId) {
        await hydrate(userId)
      }

      setIsLoading(false)
    }
    init()
  }, [])

  function handleNewCircuit() {
    reset()
    router.replace('/(onboarding)/life-stage')
  }

  function handleGoDeeper() {
    Alert.alert('More Focuses coming soon!')
  }

  function handleDone() {
    router.replace('/(tabs)/')
  }

  if (isLoading && beat === 1) {
    // Let Beat 1 render immediately — it doesn't need profile data
  }

  if (beat === 1) {
    return <Beat1 onAdvance={() => setBeat(2)} />
  }

  if (beat === 2) {
    return (
      <Beat2
        openAnswer={profile?.open_answer ?? null}
        onAdvance={() => setBeat(3)}
      />
    )
  }

  return (
    <Beat3
      onNewCircuit={handleNewCircuit}
      onGoDeeper={handleGoDeeper}
      onDone={handleDone}
    />
  )
}
