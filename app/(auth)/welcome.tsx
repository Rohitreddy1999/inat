import { useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { PhaseProgressRing } from '@/components/shared/PhaseProgressRing'

const DURATION = 400
const EASING   = Easing.out(Easing.cubic)

function useSlot(delay: number) {
  const opacity    = useSharedValue(0)
  const translateY = useSharedValue(20)
  const animStyle  = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))
  return {
    animStyle,
    enter: () => {
      opacity.value    = withDelay(delay, withTiming(1, { duration: DURATION, easing: EASING }))
      translateY.value = withDelay(delay, withTiming(0, { duration: DURATION, easing: EASING }))
    },
  }
}

export default function Welcome() {
  const wordmark = useSlot(0)
  const tagline  = useSlot(150)
  const rings    = useSlot(300)
  const buttons  = useSlot(450)

  useEffect(() => {
    wordmark.enter()
    tagline.enter()
    rings.enter()
    buttons.enter()
  // enter() references stable shared values — safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScreenWrapper padded>
      <View style={styles.top}>
        <Animated.View style={wordmark.animStyle}>
          <Text variant="display" color={colors.surge} align="center">
            INAT
          </Text>
        </Animated.View>

        <Animated.View style={[styles.taglineWrap, tagline.animStyle]}>
          <Text variant="body" color={colors.textMid} align="center">
            21 days. One decision.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.rings, rings.animStyle]}>
          <PhaseProgressRing dayInPhase={3} phaseColor={colors.glacial} />
          <PhaseProgressRing dayInPhase={5} phaseColor={colors.surge}   />
          <PhaseProgressRing dayInPhase={7} phaseColor={colors.plasma}  />
        </Animated.View>
      </View>

      <Animated.View style={[styles.bottom, buttons.animStyle]}>
        <Button
          variant="primary"
          onPress={() => router.push('/(auth)/signup')}
        >
          Begin your journey →
        </Button>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel="I already have an account"
        >
          <Text variant="base" color={colors.textMid} align="center">
            I already have an account
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineWrap: {
    marginTop: spacing[2],
  },
  rings: {
    flexDirection: 'row',
    gap: spacing[6],
    marginTop: spacing[10],
  },
  bottom: {
    paddingBottom: spacing[8],
  },
  loginLink: {
    marginTop: spacing[4],
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
})
