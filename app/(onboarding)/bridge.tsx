import { useEffect } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'
import { colors, spacing, fontFamilies, typography, radius, effects } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Badge } from '@/components/core/Badge'
import { BackButton } from '@/components/navigation/BackButton'
import { QuestionHeading } from '@/components/shared/QuestionHeading'

const SPRING = { stiffness: 400, damping: 20, reduceMotion: ReduceMotion.System }

function fadeUp(opacity: { value: number }, ty: { value: number }, delay: number) {
  opacity.value = withDelay(delay, withTiming(1, {
    duration: 400,
    easing: Easing.out(Easing.cubic),
    reduceMotion: ReduceMotion.System,
  }))
  ty.value = withDelay(delay, withTiming(0, {
    duration: 400,
    easing: Easing.out(Easing.cubic),
    reduceMotion: ReduceMotion.System,
  }))
}

export default function Bridge() {
  // Entrance animation shared values
  const hO = useSharedValue(0);  const hTy = useSharedValue(20)
  const sO = useSharedValue(0);  const sTy = useSharedValue(20)
  const c1O = useSharedValue(0); const c1Ty = useSharedValue(20)
  const c2O = useSharedValue(0); const c2Ty = useSharedValue(20)
  const fO = useSharedValue(0);  const fTy = useSharedValue(20)

  // Card press scales
  const scale1 = useSharedValue(1)
  const scale2 = useSharedValue(1)

  useEffect(() => {
    fadeUp(hO, hTy, 0)
    fadeUp(sO, sTy, 100)
    fadeUp(c1O, c1Ty, 200)
    fadeUp(c2O, c2Ty, 320)
    fadeUp(fO, fTy, 440)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hStyle  = useAnimatedStyle(() => ({ opacity: hO.value,  transform: [{ translateY: hTy.value  }] }))
  const sStyle  = useAnimatedStyle(() => ({ opacity: sO.value,  transform: [{ translateY: sTy.value  }] }))
  const c1Style = useAnimatedStyle(() => ({ opacity: c1O.value, transform: [{ translateY: c1Ty.value }, { scale: scale1.value }] }))
  const c2Style = useAnimatedStyle(() => ({ opacity: c2O.value, transform: [{ translateY: c2Ty.value }, { scale: scale2.value }] }))
  const fStyle  = useAnimatedStyle(() => ({ opacity: fO.value,  transform: [{ translateY: fTy.value  }] }))

  return (
    <ScreenWrapper padded>
      <BackButton onPress={() => router.back()} />

      <Animated.View style={[styles.headingWrap, hStyle]}>
        <QuestionHeading
          text="Let's find your Arc."
          highlight="Arc"
          highlightColor={colors.volt}
        />
      </Animated.View>

      <Animated.View style={sStyle}>
        <Text variant="body" color={colors.textMid} style={styles.subtext}>
          Two ways in. Both lead to the same place.
        </Text>
      </Animated.View>

      <View style={styles.cards}>

        {/* Card 1 — Recommended */}
        <Animated.View style={[styles.card1Shadow, c1Style]}>
          <Pressable
            onPress={() => router.push('/(onboarding)/energy')}
            onPressIn={() => { scale1.value = withSpring(0.97, SPRING) }}
            onPressOut={() => { scale1.value = withSpring(1, SPRING) }}
            accessibilityRole="button"
            accessibilityLabel="Help me find it. Recommended. Takes less than 2 minutes."
            style={styles.card1Pressable}
          >
            <LinearGradient
              colors={['rgba(139,92,246,0.12)', 'rgba(139,92,246,0.06)']}
              style={styles.gradient1}
            >
              <View style={styles.innerHighlight} />

              <View style={styles.cardTop}>
                <View style={styles.badgeRow}>
                  <Badge variant="recommended">RECOMMENDED</Badge>
                </View>
                <Text style={styles.cardTitle}>Help me find it</Text>
                <Text variant="body" color={colors.textMid} style={styles.cardBody}>
                  Answer five questions and we&apos;ll find what calls to you.
                </Text>
              </View>

              <View style={styles.timeRow}>
                <View style={styles.timeDot} />
                <Text variant="caption" color={colors.volt}>
                  Takes less than 2 minutes
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Card 2 — Direct */}
        <Animated.View style={[styles.card2Shadow, c2Style]}>
          <Pressable
            onPress={() => router.push('/(onboarding)/match')}
            onPressIn={() => { scale2.value = withSpring(0.97, SPRING) }}
            onPressOut={() => { scale2.value = withSpring(1, SPRING) }}
            accessibilityRole="button"
            accessibilityLabel="I already know. Show me all five Arcs."
            style={styles.card2Pressable}
          >
            <LinearGradient
              colors={['#141920', '#0F141A']}
              style={styles.gradient2}
            >
              <View style={styles.innerHighlight} />
              <Text style={styles.cardTitle}>I already know</Text>
              <Text variant="body" color={colors.textMid} style={styles.cardBody}>
                Show me all five Arcs.{'\n'}I&apos;ll choose myself.
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

      </View>

      <Animated.View style={[styles.footer, fStyle]}>
        <Text variant="caption" color={colors.textLow} align="center">
          You can always come back and retake the questions later.
        </Text>
      </Animated.View>
    </ScreenWrapper>
  )
}

const CARD_RADIUS = radius.lg

const styles = StyleSheet.create({
  headingWrap: {
    marginTop: spacing[10] + spacing[2],
  },
  subtext: {
    marginTop: spacing[2],
  },
  cards: {
    flex:           1,
    justifyContent: 'center',
    marginTop:      spacing[5],
    gap:            spacing[3],
  },

  // Card 1 — iris glow
  card1Shadow: {
    borderRadius: CARD_RADIUS,
    ...effects.glowIris,
  },
  card1Pressable: {
    borderRadius: CARD_RADIUS,
    overflow:     'hidden',
    borderWidth:  1.5,
    borderColor:  colors.borderIris,
  },

  // Card 2 — dark, no glow
  card2Shadow: {
    borderRadius: CARD_RADIUS,
  },
  card2Pressable: {
    borderRadius: CARD_RADIUS,
    overflow:     'hidden',
    borderWidth:  1,
    borderColor:  colors.borderCard,
  },

  // Card 1 gradient — content at top, time hint pinned to bottom
  gradient1: {
    padding:        spacing[8],
    paddingBottom:  spacing[6],
    justifyContent: 'space-between',
    minHeight:      160,
  },
  // Card 2 gradient — compact, content top-aligned
  gradient2: {
    padding: spacing[8],
  },
  innerHighlight: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    height:          1,
    backgroundColor: colors.borderInner,
  },
  cardTop: {
    gap: spacing[1],
  },
  badgeRow: {
    alignSelf:    'flex-start',
    marginBottom: spacing[2],
  },
  cardTitle: {
    fontFamily: fontFamilies.heading,
    fontSize:   typography.size.base + 3,
    lineHeight: (typography.size.base + 3) * 1.2,
    color:      colors.textHi,
  },
  cardBody: {
    marginTop: spacing[1],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  timeDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: colors.volt,
    marginRight:     spacing[2],
  },
  footer: {
    marginTop:     'auto',
    paddingBottom: spacing[10],
  },
})
