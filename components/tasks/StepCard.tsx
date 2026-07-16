import React, { useEffect, useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { colors, fontFamilies, radius, spacing, typography } from '@/theme'

type Props = {
  index: number
  text: string
  done: boolean
  phaseColor: string
  onToggle: () => void
  isLast?: boolean
}

const SPRING_CHECK = {
  stiffness: 400,
  damping: 20,
  reduceMotion: ReduceMotion.System,
}

export function StepCard({ index, text, done, phaseColor, onToggle, isLast = false }: Props) {
  const checkScale   = useSharedValue(done ? 1 : 0)
  const checkOpacity = useSharedValue(done ? 1 : 0)
  const textOpacity  = useSharedValue(done ? 0.5 : 1)
  const rightOpacity = useSharedValue(done ? 0 : 1)
  const leftBgScale  = useSharedValue(done ? 1 : 0)

  useEffect(() => {
    if (done) {
      checkScale.value   = withSpring(1, SPRING_CHECK)
      checkOpacity.value = withSpring(1, SPRING_CHECK)
      leftBgScale.value  = withSpring(1, SPRING_CHECK)
      textOpacity.value  = withTiming(0.5, { duration: 200, reduceMotion: ReduceMotion.System })
      rightOpacity.value = withTiming(0, { duration: 150, reduceMotion: ReduceMotion.System })
    } else {
      checkScale.value   = withSpring(0, SPRING_CHECK)
      checkOpacity.value = withSpring(0, SPRING_CHECK)
      leftBgScale.value  = withSpring(0, SPRING_CHECK)
      textOpacity.value  = withTiming(1, { duration: 200, reduceMotion: ReduceMotion.System })
      rightOpacity.value = withTiming(1, { duration: 150, reduceMotion: ReduceMotion.System })
    }
  }, [done])

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }))

  const textAnimStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }))

  const rightAnimStyle = useAnimatedStyle(() => ({
    opacity: rightOpacity.value,
  }))

  const leftBgAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: leftBgScale.value }],
    opacity: leftBgScale.value,
  }))

  const circleBorderColor = useMemo(() => phaseColor + '66', [phaseColor])

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.row, !isLast && styles.borderBottom]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`Step ${index}: ${text}`}
    >
      {/* Left: step number (undone) or filled circle+check (done) */}
      <View style={styles.leftSlot}>
        {/* Filled circle with checkmark — springs in when done */}
        <Animated.View
          style={[styles.filledCircle, { backgroundColor: phaseColor }, leftBgAnimStyle]}
          pointerEvents="none"
        >
          <Animated.View style={checkAnimStyle}>
            <Ionicons name="checkmark" size={16} color={colors.abyss} />
          </Animated.View>
        </Animated.View>

        {/* Step number — visible when undone */}
        {!done && (
          <Animated.Text style={[styles.indexText, { color: phaseColor }]}>
            {index}
          </Animated.Text>
        )}
      </View>

      {/* Step text */}
      <Animated.Text
        style={[styles.text, textAnimStyle, done && styles.strikethrough]}
        numberOfLines={0}
      >
        {text}
      </Animated.Text>

      {/* Right: empty circle indicator — visible when undone */}
      <Animated.View
        style={[styles.rightCircle, { borderColor: circleBorderColor }, rightAnimStyle]}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.stepRow,
    paddingHorizontal: 0,
    gap: spacing[3],
    minHeight: spacing.touchMin,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  leftSlot: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  filledCircle: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.step,
    lineHeight: typography.size.step * typography.leading.step,
  },
  text: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.step,
    lineHeight: typography.size.step * typography.leading.step,
    color: colors.textMid,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  rightCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
})
