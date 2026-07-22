import { useEffect, useState } from 'react'
import { View, Pressable, StyleSheet, Text as RNText } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, fontFamilies, typography, radius } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { BackButton } from '@/components/navigation/BackButton'
import { useOnboardingStore } from '@/stores/onboarding.store'
import type { TrackName } from '@/utils/inat-brain'

// ─── Arc data ──────────────────────────────────────────────────────────────────

type ArcData = {
  name: TrackName
  icon: React.ComponentProps<typeof Ionicons>['name']
  reason: string
}

const ARCS: ArcData[] = [
  {
    name:   'Move',
    icon:   'pulse-outline',
    reason: "You process the world through your body first. Motion is how you think.",
  },
  {
    name:   'Rhythm',
    icon:   'musical-notes-outline',
    reason: "You're drawn to patterns. Music is just patterns you can feel.",
  },
  {
    name:   'Express',
    icon:   'brush-outline',
    reason: "You've been observing everything. It's time to put it somewhere.",
  },
  {
    name:   'Calm',
    icon:   'water-outline',
    reason: "You're not looking for less. You're looking for quieter.",
  },
  {
    name:   'Mindful',
    icon:   'leaf-outline',
    reason: "You already know what's good for you. You just need to feel it again.",
  },
]

const IRIS_BORDER_REST   = 'rgba(139,92,246,0.35)'
const IRIS_BORDER_ACTIVE = 'rgba(139,92,246,0.88)'
const ANIM_IN  = { duration: 300, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System }
const ANIM_OUT = { duration: 200, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System }

// ─── ArcCard ───────────────────────────────────────────────────────────────────

type ArcCardProps = {
  arc: ArcData
  isSelected: boolean
  isRecommended: boolean
  onPress: () => void
}

function ArcCard({ arc, isSelected, isRecommended, onPress }: ArcCardProps) {
  const sel = useSharedValue(0)

  useEffect(() => {
    sel.value = withTiming(isSelected ? 1 : 0, isSelected ? ANIM_IN : ANIM_OUT)
  }, [isSelected]) // eslint-disable-line react-hooks/exhaustive-deps

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(sel.value, [0, 1], [IRIS_BORDER_REST, IRIS_BORDER_ACTIVE]),
  }))

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sel.value, [0, 1], [0.025, 0.10]),
  }))

  return (
    <Animated.View style={[styles.cardOuter, cardStyle]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={isRecommended ? `${arc.name}, recommended` : arc.name}
        accessibilityHint="Double tap to select this Arc"
        style={styles.cardInner}
      >
        {/* Iris inner glow — clipped by cardOuter overflow:hidden */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, styles.innerGlow, glowStyle]}
          pointerEvents="none"
        />

        {/* Icon — always Iris */}
        <Ionicons name={arc.icon} size={28} color={colors.iris} />

        {/* Arc name — flex:1 pushes badge to far right */}
        <Text style={styles.arcName}>{arc.name}</Text>

        {/* RECOMMENDED badge — white pill, algorithm path only */}
        {isRecommended && (
          <Badge variant="phase" color={colors.arcLight}>RECOMMENDED</Badge>
        )}
      </Pressable>
    </Animated.View>
  )
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function Match() {
  const { mode } = useLocalSearchParams<{ mode?: string }>()
  const { setSelectedTrack, matchResult } = useOnboardingStore()
  const isNewCircuit = mode === 'new-circuit'
  const entryMode: 'algorithm' | 'self-select' = !isNewCircuit && matchResult.primary
    ? 'algorithm'
    : 'self-select'

  // Starts null — no card pre-highlighted, user must choose
  const [selected, setSelected] = useState<TrackName | null>(null)

  function handleSelect(name: TrackName) {
    setSelected(name)
    setSelectedTrack(name)
  }

  const headline = entryMode === 'algorithm'
    ? "Here's where to start."
    : "Your call."

  const primaryReason = entryMode === 'algorithm'
    ? (ARCS.find(a => a.name === matchResult.primary)?.reason ?? '')
    : null

  return (
    <ScreenWrapper padded scrollable>
      <BackButton onPress={() => router.back()} />

      {/* ARC's — hero word: "ARC" in Iris, "'s" in Arc-Light */}
      <RNText style={styles.arcsLabel} accessibilityRole="header">
        {'ARC'}
        <RNText style={styles.arcsLabelSuffix}>{"'s"}</RNText>
      </RNText>

      {/* One-line headline */}
      <RNText
        style={styles.headline}
        numberOfLines={1}
        adjustsFontSizeToFit
        accessibilityRole="header"
      >
        {headline}
      </RNText>

      {/* Algorithm path: white divider + reason text, between headline and cards */}
      {entryMode === 'algorithm' && primaryReason && (
        <>
          <View style={styles.divider} />
          <Text style={styles.reason}>{primaryReason}</Text>
        </>
      )}

      {/* Arc cards */}
      <View style={styles.list}>
        {ARCS.map((arc) => (
          <ArcCard
            key={arc.name}
            arc={arc}
            isSelected={selected === arc.name}
            isRecommended={entryMode === 'algorithm' && arc.name === matchResult.primary}
            onPress={() => handleSelect(arc.name)}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={() => router.push({
            pathname: '/(onboarding)/focus',
            params: isNewCircuit ? { mode: 'new-circuit' } : undefined,
          })}
          disabled={!selected}
        >
          Start this Arc
        </Button>
      </View>
    </ScreenWrapper>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Hero label — "ARC" portion (Iris color set here)
  arcsLabel: {
    marginTop:     spacing[10],
    fontFamily:    fontFamilies.heading,
    fontSize:      typography.size.display,
    color:         colors.iris,
    lineHeight:    typography.size.display * typography.leading.tight,
    letterSpacing: typography.tracking.tight * typography.size.display,
  },
  // "'s" suffix — inherits size/font from parent, overrides color to white
  arcsLabelSuffix: {
    color: colors.arcLight,
  },

  // Headline — matches onboarding question heading
  headline: {
    marginTop:  spacing[2],
    fontFamily: fontFamilies.heading,
    fontSize:   typography.size.question,
    color:      colors.arcLight,
    lineHeight: typography.size.question * 1.15,
  },

  // Divider line (algorithm path only)
  divider: {
    height:          1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginTop:       spacing[5],
  },

  // Reason text (algorithm path only, below divider)
  reason: {
    marginTop:  spacing[3],
    fontFamily: 'HankenGrotesk-Regular',
    fontSize:   typography.size.body,
    color:      colors.arcLight,
    lineHeight: typography.size.body * 1.55,
  },

  // Card list
  list: {
    marginTop: spacing[6],
    gap:       spacing[3],
  },

  // Card outer — animated border, overflow clips inner glow
  cardOuter: {
    borderRadius:    radius.card,
    borderWidth:     1.5,
    overflow:        'hidden',
    backgroundColor: colors.fathom,
  },

  // Card inner — horizontal row: icon | name (flex) | badge?
  cardInner: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               spacing[4],
    paddingVertical:   spacing[6],
    paddingHorizontal: spacing[5],
  },

  // Iris inner glow overlay
  innerGlow: {
    backgroundColor: colors.iris,
  },

  // Arc name — hero size, flex:1 pushes badge to far right
  arcName: {
    flex:       1,
    fontFamily: fontFamilies.heading,
    fontSize:   typography.size.heading,
    color:      colors.arcLight,
    lineHeight: typography.size.heading * 1.15,
  },

  // CTA
  cta: {
    marginTop:     spacing[6],
    paddingBottom: spacing[10],
  },
})
