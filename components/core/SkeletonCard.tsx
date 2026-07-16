import React, { useEffect } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'
import { colors, radius as radiusTokens } from '@/theme'

type Props = {
  height?: number
  radius?: number
}

export function SkeletonCard({
  height = 72,
  radius = radiusTokens.card,
}: Props) {
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      accessible
      accessibilityLabel="Loading"
      accessibilityRole="none"
      style={[
        animatedStyle,
        {
          height,
          borderRadius: radius,
          backgroundColor: colors.fathom,
          borderWidth: 1,
          borderColor: colors.borderCard,
        },
      ]}
    />
  )
}
