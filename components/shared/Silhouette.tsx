/**
 * SILHOUETTE — PLACEHOLDER (pill progress bar)
 * Real implementation deferred to post-MVP.
 * Planned: react-native-skia for GPU-accelerated
 * clip-path fill on human silhouette SVG.
 * Do not use SVG clipPath or LinearGradient fill —
 * both fail on iOS in react-native-svg.
 * Props interface unchanged — swap in real
 * component later with zero screen changes.
 */

import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'
import { Text } from '@/components/core/Text'
import { colors } from '@/theme'

type Props = {
  completedDays: number
  phaseColor: string
  totalDays?: number
  size?: 'full' | 'mini'
  animated?: boolean
}

export function Silhouette({
  completedDays,
  phaseColor,
  totalDays = 21,
  size = 'full',
  animated = true,
}: Props) {
  const isMini  = size === 'mini'
  const width   = isMini ? 40 : 80
  const height  = isMini ? 80 : 160
  const radius  = 40

  const ratio      = Math.min(completedDays / totalDays, 1)
  const fillHeight = height * ratio

  const translateY = useSharedValue(0)

  useEffect(() => {
    if (!animated) return
    translateY.value = withRepeat(
      withTiming(-8, {
        duration: 4000,
        easing: Easing.inOut(Easing.sin),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    )
  }, [animated, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[{ alignItems: 'center' }, animatedStyle]}>
      <View
        style={{
          width,
          height,
          borderRadius: radius,
          borderWidth: 2,
          borderColor: colors.borderStrong,
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: fillHeight,
            backgroundColor: phaseColor,
            borderRadius: radius,
            opacity: 0.85,
          }}
        />
      </View>

      {!isMini && (
        <Text
          variant="caption"
          color={colors.textMid}
          style={{ marginTop: 8, textAlign: 'center' }}
        >
          {completedDays}/{totalDays}
        </Text>
      )}
    </Animated.View>
  )
}
