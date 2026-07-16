import React, { useEffect } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated'
import { colors } from '@/theme'

type DotState = 'past' | 'current' | 'future'

type DotProps = {
  state: DotState
}

const DOT_WIDTH_ACTIVE = 16
const DOT_WIDTH_IDLE   = 5
const DOT_HEIGHT       = 5
const DOT_RADIUS       = 3

const SPRING_CONFIG = {
  stiffness: 300,
  damping: 25,
  reduceMotion: ReduceMotion.System,
}

const TIMING_CONFIG = {
  duration: 300,
  reduceMotion: ReduceMotion.System,
}

function Dot({ state }: DotProps) {
  const isCurrent = state === 'current'
  const isFuture  = state === 'future'

  const width         = useSharedValue(isCurrent ? DOT_WIDTH_ACTIVE : DOT_WIDTH_IDLE)
  const colorProgress = useSharedValue(isFuture ? 0 : 1)

  useEffect(() => {
    width.value = withSpring(
      state === 'current' ? DOT_WIDTH_ACTIVE : DOT_WIDTH_IDLE,
      SPRING_CONFIG,
    )
    colorProgress.value = withTiming(state === 'future' ? 0 : 1, TIMING_CONFIG)
  }, [state])

  const dotStyle = useAnimatedStyle(() => ({
    width: width.value,
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1],
      [colors.textFaint, colors.arcLight],
    ),
  }))

  return <Animated.View style={[styles.dot, dotStyle]} />
}

type Props = {
  total: number
  current: number
  style?: StyleProp<ViewStyle>
}

export function StepDots({ total, current, style }: Props) {
  return (
    <View
      style={[styles.row, style]}
      accessibilityLabel={`Step ${current} of ${total}`}
      accessibilityRole="none"
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: total }, (_, i) => {
        const idx   = i + 1
        const state: DotState =
          idx < current  ? 'past' :
          idx === current ? 'current' :
          'future'
        return <Dot key={i} state={state} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: DOT_HEIGHT,
    borderRadius: DOT_RADIUS,
  },
})
