import React, { useEffect } from 'react'
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ReduceMotion,
  Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, typography, fontFamilies } from '@/theme'

type Props = {
  label: string
  selected: boolean
  onPress: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

const TIMING_BORDER = {
  duration: 180,
  easing: Easing.out(Easing.ease),
  reduceMotion: ReduceMotion.System,
}

const SPRING_SELECT = {
  stiffness: 400,
  damping: 20,
  reduceMotion: ReduceMotion.System,
}

const SPRING_DESELECT = {
  stiffness: 500,
  damping: 22,
  reduceMotion: ReduceMotion.System,
}

export function OptionCard({ label, selected, onPress, disabled = false, style }: Props) {
  const progress = useSharedValue(selected ? 1 : 0)
  const checkScale = useSharedValue(selected ? 1 : 0)
  const checkOpacity = useSharedValue(selected ? 1 : 0)
  const shakeX = useSharedValue(0)

  useEffect(() => {
    if (selected) {
      progress.value = withTiming(1, TIMING_BORDER)
      checkScale.value = withSpring(1, SPRING_SELECT)
      checkOpacity.value = withSpring(1, SPRING_SELECT)
    } else {
      progress.value = withTiming(0, TIMING_BORDER)
      checkScale.value = withSpring(0, SPRING_DESELECT)
      checkOpacity.value = withSpring(0, SPRING_DESELECT)
    }
  }, [selected])

  const cardAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.fathom, colors.selectedBg],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.borderCard, colors.borderSurge],
    ),
    transform: [{ translateX: shakeX.value }],
  }))

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }))

  const handlePress = () => {
    if (disabled) {
      shakeX.value = withSequence(
        withTiming(6,  { duration: 60,  reduceMotion: ReduceMotion.System }),
        withTiming(-6, { duration: 60,  reduceMotion: ReduceMotion.System }),
        withTiming(4,  { duration: 60,  reduceMotion: ReduceMotion.System }),
        withTiming(-4, { duration: 60,  reduceMotion: ReduceMotion.System }),
        withTiming(0,  { duration: 60,  reduceMotion: ReduceMotion.System }),
      )
      return
    }
    onPress()
  }

  return (
    <Animated.View
      style={[
        styles.card,
        cardAnimStyle,
        disabled ? styles.disabled : undefined,
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={styles.pressable}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected, disabled }}
        accessibilityLabel={label}
        accessibilityHint={disabled ? 'Maximum selections reached' : undefined}
      >
        {selected && (
          <LinearGradient
            colors={[colors.selectedBg, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}
        <Animated.Text
          style={[
            styles.label,
            { color: selected ? colors.textHi : colors.textMid },
          ]}
          numberOfLines={0}
        >
          {label}
        </Animated.Text>
        <Animated.View style={[styles.check, checkAnimStyle]}>
          <Ionicons name="checkmark-circle" size={22} color={colors.surge} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    minHeight: spacing.touchMin,
  },
  label: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.step,
    lineHeight: typography.size.step * typography.leading.step,
  },
  check: {
    marginLeft: spacing[2],
  },
  disabled: {
    opacity: 0.35,
  },
})
