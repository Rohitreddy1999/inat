import React from 'react'
import { Pressable, View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ReduceMotion,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, radius as radiusTokens } from '@/theme'

type StripPosition = 'left' | 'top'

type Props = {
  accent?: string
  strip?: StripPosition
  padding?: number
  radius?: number
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}

const SPRING = { stiffness: 400, damping: 20, reduceMotion: ReduceMotion.System }

export function Card({
  accent,
  strip = 'left',
  padding = 20,
  radius = radiusTokens.card,
  onPress,
  style,
  children,
}: Props) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.985, SPRING)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING)
  }

  const cardStyle: ViewStyle = {
    backgroundColor: colors.fathom,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.borderCard,
    overflow: 'hidden',
  }

  const inner = (
    <View style={[cardStyle, style]}>
      {/* accent top strip */}
      {accent && strip === 'top' && (
        <View
          style={[styles.stripTop, { backgroundColor: accent }]}
        />
      )}

      {/* accent left border + gradient glow */}
      {accent && strip === 'left' && (
        <>
          <View
            style={[styles.stripLeft, { backgroundColor: accent }]}
          />
          <LinearGradient
            colors={[`${accent}1F`, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </>
      )}

      <View style={{ padding }}>{children}</View>
    </View>
  )

  if (onPress) {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
        >
          {inner}
        </Pressable>
      </Animated.View>
    )
  }

  return inner
}

const styles = StyleSheet.create({
  stripTop: {
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  stripLeft: {
    width: 3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
})
