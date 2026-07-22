import { useEffect, useState } from 'react'
import { View, Pressable, StyleSheet, Alert, Text as RNText, Platform } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  interpolateColor,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { colors, spacing, fontFamilies, typography, radius } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Button } from '@/components/core/Button'
import { BackButton } from '@/components/navigation/BackButton'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useJourneyStore } from '@/stores/journey.store'
import { getSession } from '@/services/auth.service'
import { saveOnboardingAnswers } from '@/services/profile.service'
import { createJourney } from '@/services/journey.service'
import { getFocusesByArc } from '@/services/curriculum.service'
import type { TrackName } from '@/utils/inat-brain'

// ─── Arc identifier icons ──────────────────────────────────────────────────────

type IonIconName = React.ComponentProps<typeof Ionicons>['name']

const ARC_ICONS: Record<TrackName, IonIconName> = {
  Move:    'pulse-outline',
  Rhythm:  'musical-notes-outline',
  Express: 'brush-outline',
  Calm:    'water-outline',
  Mindful: 'leaf-outline',
}

// ─── Focus data ────────────────────────────────────────────────────────────────

type MCIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name']

type FocusItem = {
  name: string
  icon: MCIconName
  status: 'active' | 'soon'
}

const FOCUS_DATA: Record<TrackName, FocusItem[]> = {
  Move: [
    { name: 'Muscle & Strength', icon: 'dumbbell',     status: 'active' },
    { name: 'Tennis',            icon: 'tennis-ball',  status: 'soon'   },
    { name: 'Yoga',              icon: 'yin-yang',     status: 'soon'   },
    { name: 'Boxing',            icon: 'boxing-glove', status: 'soon'   },
    { name: 'Hiking',            icon: 'hiking',       status: 'soon'   },
  ],
  Rhythm: [
    { name: 'Music Theory', icon: 'music',       status: 'active' },
    { name: 'Guitar',       icon: 'guitar-acoustic', status: 'soon' },
    { name: 'Piano',        icon: 'piano',       status: 'soon'   },
    { name: 'Beat Making',  icon: 'headphones',  status: 'soon'   },
    { name: 'Songwriting',  icon: 'microphone',  status: 'soon'   },
  ],
  Express: [
    { name: 'Drawing & Sketching', icon: 'pencil',         status: 'active' },
    { name: 'Color Theory',        icon: 'palette',        status: 'soon'   },
    { name: 'Watercolor',          icon: 'water',          status: 'soon'   },
    { name: 'Digital Art',         icon: 'tablet',         status: 'soon'   },
    { name: 'Hand Lettering',      icon: 'format-size',    status: 'soon'   },
  ],
  Calm: [
    { name: 'Breathwork',    icon: 'lungs',                 status: 'active' },
    { name: 'Meditation',    icon: 'brain',                 status: 'soon'   },
    { name: 'Cold Exposure', icon: 'snowflake',             status: 'soon'   },
    { name: 'Sound Healing', icon: 'sine-wave',             status: 'soon'   },
    { name: 'Sleep Rituals', icon: 'moon-waning-crescent',  status: 'soon'   },
  ],
  Mindful: [
    { name: 'Gratitude & Reflection', icon: 'notebook-outline', status: 'active' },
    { name: 'Journaling',             icon: 'feather',           status: 'soon'   },
    { name: 'Stoicism',               icon: 'book-open-variant', status: 'soon'   },
    { name: 'Digital Detox',          icon: 'cellphone-off',     status: 'soon'   },
    { name: 'Morning Rituals',        icon: 'weather-sunset-up', status: 'soon'   },
  ],
}

// ─── Animation constants ───────────────────────────────────────────────────────

const IRIS_BORDER_REST   = 'rgba(139,92,246,0.35)'
const IRIS_BORDER_ACTIVE = 'rgba(139,92,246,0.88)'
const ANIM_IN    = { duration: 300, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System }
const ANIM_OUT   = { duration: 200, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System }
const SPRING_CFG = { stiffness: 400, damping: 20, reduceMotion: ReduceMotion.System }

// ─── FocusCard ────────────────────────────────────────────────────────────────

type FocusCardProps = {
  item: FocusItem
  isSelected: boolean
  onPress?: () => void
}

function FocusCard({ item, isSelected, onPress }: FocusCardProps) {
  const progress = useSharedValue(0)
  const scale    = useSharedValue(1)
  const isSoon   = item.status === 'soon'

  useEffect(() => {
    progress.value = withTiming(
      isSelected ? 1 : 0,
      isSelected ? ANIM_IN : ANIM_OUT,
    )
  }, [isSelected]) // eslint-disable-line react-hooks/exhaustive-deps

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [IRIS_BORDER_REST, IRIS_BORDER_ACTIVE],
    ),
  }))

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.025, 0.10]),
  }))

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const cardContent = (
    <View style={isSoon ? { opacity: 0.3 } : undefined}>
      <Animated.View style={[styles.cardOuter, cardStyle]}>
        {!isSoon && (
          <Animated.View
            style={[StyleSheet.absoluteFillObject, styles.innerGlow, glowStyle]}
            pointerEvents="none"
          />
        )}
        <View style={styles.cardInner}>
          <MaterialCommunityIcons name={item.icon} size={32} color={colors.iris} />
          <RNText style={styles.focusName}>{item.name}</RNText>
          {isSoon && <RNText style={styles.soonText}>Soon</RNText>}
        </View>
      </Animated.View>
    </View>
  )

  if (isSoon) {
    return (
      <View
        accessible
        accessibilityState={{ disabled: true }}
        accessibilityLabel={`${item.name}, coming soon`}
      >
        {cardContent}
      </View>
    )
  }

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97, SPRING_CFG) }}
        onPressOut={() => { scale.value = withSpring(1,    SPRING_CFG) }}
        android_ripple={{ color: 'rgba(139,92,246,0.15)', borderless: false }}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={item.name}
        accessibilityHint="Double tap to select this Focus"
      >
        {cardContent}
      </Pressable>
    </Animated.View>
  )
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function Focus() {
  const { mode } = useLocalSearchParams<{ mode?: string }>()
  const isNewCircuit = mode === 'new-circuit'
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null)

  const {
    selectedTrack,
    lifeStage,
    answers,
    matchResult,
    openAnswer,
    clear,
  } = useOnboardingStore()

  const hydrate = useJourneyStore((s) => s.hydrate)
  const arc = selectedTrack ?? 'Move'
  const [focusItems, setFocusItems] = useState<FocusItem[]>(FOCUS_DATA[arc])

  useEffect(() => {
    let mounted = true
    setSelectedFocus(null)
    void getFocusesByArc(arc).then(({ focuses }) => {
      if (!mounted || focuses.length === 0) return
      setFocusItems(focuses.map((focus) => ({
        name: focus.name,
        icon: FOCUS_DATA[arc].find((item) => item.name === focus.name)?.icon ?? 'compass-outline',
        status: focus.is_active ? 'active' : 'soon',
      })))
    })
    return () => { mounted = false }
  }, [arc])

  function handleSelectFocus(name: string) {
    setSelectedFocus(name)
  }

  async function handleBegin() {
    if (!selectedFocus) return
    setIsLoading(true)

    const focusName = selectedFocus

    const { session } = await getSession()
    if (!session?.user) {
      setIsLoading(false)
      router.replace('/(auth)/login')
      return
    }

    const userId = session.user.id

    if (!isNewCircuit) {
      const fullMatchResult = matchResult.primary
        ? {
            primary:    matchResult.primary,
            secondary:  matchResult.secondary!,
            confidence: matchResult.confidence!,
            scores:     matchResult.scores!,
            reasons:    matchResult.reasons,
            healthMode: matchResult.healthMode,
          }
        : null

      const { error: profileError } = await saveOnboardingAnswers(
        userId,
        lifeStage ?? '',
        answers,
        openAnswer,
        fullMatchResult,
      )

      if (profileError) {
        setIsLoading(false)
        Alert.alert('Error', 'Could not save your answers. Please try again.')
        return
      }
    }

    const { error: journeyError } = await createJourney(userId, arc, focusName)

    if (journeyError) {
      setIsLoading(false)
      Alert.alert('Error', 'Could not create your journey. Please try again.')
      return
    }

    await hydrate(userId)
    clear()

    router.replace('/(tabs)/')
  }

  const arcIcon = ARC_ICONS[arc]

  return (
    <ScreenWrapper padded scrollable>
      <BackButton onPress={() => router.back()} />

      {/* Arc breadcrumb — summarised for screen readers as a single label */}
      <View
        style={styles.arcRow}
        accessible
        accessibilityLabel={`Arc: ${arc}`}
      >
        <Ionicons
          name={arcIcon}
          size={16}
          color={colors.iris}
          accessible={false}
        />
        <RNText style={styles.arcLabel} accessible={false}>{arc}</RNText>
      </View>

      {/* Heading — "focus" in Plasma, rest in Arc-Light */}
      <RNText style={styles.heading} accessibilityRole="header">
        {'Pick your '}
        <RNText style={styles.headingAccent}>focus</RNText>
        {'.'}
      </RNText>

      {/* Focus cards */}
      <View style={styles.list}>
        {focusItems.map((item) => (
          <FocusCard
            key={item.name}
            item={item}
            isSelected={selectedFocus === item.name}
            onPress={item.status === 'active' ? () => handleSelectFocus(item.name) : undefined}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={handleBegin}
          disabled={!selectedFocus}
          loading={isLoading}
        >
          {isNewCircuit ? 'Begin this circuit →' : 'Begin my 21 days →'}
        </Button>
      </View>
    </ScreenWrapper>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  arcRow: {
    marginTop:     spacing[6],
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing[2],
  },
  arcLabel: {
    fontFamily: fontFamilies.display,
    fontSize:   typography.size.base,
    color:      colors.iris,
    lineHeight: typography.size.base * 1.2,
  },
  heading: {
    marginTop:  spacing[3],
    fontFamily: fontFamilies.heading,
    fontSize:   typography.size.question,
    color:      colors.arcLight,
    lineHeight: typography.size.question * 1.15,
  },
  headingAccent: {
    color: colors.plasma,
  },
  list: {
    marginTop: spacing[6],
    gap:       spacing[3],
  },
  cardOuter: {
    borderRadius:    radius.card,
    borderWidth:     1,
    overflow:        'hidden',
    backgroundColor: colors.fathom,
  },
  cardInner: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               spacing[4],
    paddingVertical:   spacing[6],
    paddingHorizontal: spacing[5],
  },
  innerGlow: {
    backgroundColor: colors.iris,
  },
  focusName: {
    flex:       1,
    fontFamily: fontFamilies.heading,
    fontSize:   typography.size.quote,
    color:      colors.arcLight,
    lineHeight: typography.size.quote * 1.3,
  },
  soonText: {
    fontFamily: 'HankenGrotesk-Regular',
    fontSize:   typography.size.caption,
    color:      colors.iris,
    lineHeight: typography.size.caption * 1.4,
  },
  cta: {
    marginTop:     spacing[6],
    paddingBottom: spacing[10],
  },
})
