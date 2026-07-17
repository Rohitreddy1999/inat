import React, { useEffect } from 'react'
import { Text, StyleProp, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated'
import { typography, fontFamilies } from '@/theme'


type Props = {
  number: number
  style?: StyleProp<ViewStyle>
}

export function GhostNumber({ number, style }: Props) {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(8)

  useEffect(() => {
    opacity.value = withTiming(0.04, { duration: 600, reduceMotion: ReduceMotion.System })
    translateY.value = withTiming(0, { duration: 800, reduceMotion: ReduceMotion.System })
  }, [opacity, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const label = String(number).padStart(2, '0')

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          zIndex: 0,
        },
        animatedStyle,
        style,
      ]}
    >
      <Text
        style={{
          fontSize: typography.size.ghost,
          fontFamily: fontFamilies.black,
          color: 'white',
          lineHeight: typography.size.ghost,
        }}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {label}
      </Text>
    </Animated.View>
  )
}
