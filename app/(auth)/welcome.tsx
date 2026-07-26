import { useEffect, useRef, useState } from 'react'
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
import { AnimatedWordmark } from '@/components/brand/AnimatedWordmark'

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
  const [tapCount, setTapCount] = useState(0)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buttons = useSlot(150)

  useEffect(() => {
    buttons.enter()
  // enter() references stable shared values — safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      if (tapTimer.current) clearTimeout(tapTimer.current)
    }
  }, [])

  return (
    <ScreenWrapper padded>
      <View style={styles.top}>
        <TouchableOpacity
          activeOpacity={1}
          accessibilityLabel="INAT"
          style={styles.wordmarkTouch}
          onPress={() => {
            setTapCount((prev) => {
              const next = prev + 1
              if (tapTimer.current) clearTimeout(tapTimer.current)
              if (next >= 5 && __DEV__) {
                router.push('/admin')
                return 0
              }
              tapTimer.current = setTimeout(() => setTapCount(0), 2000)
              return next
            })
          }}
        >
          <AnimatedWordmark animated={false} />
        </TouchableOpacity>
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
  wordmarkTouch: {
    width: '100%',
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
