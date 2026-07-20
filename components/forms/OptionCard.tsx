import React, { useEffect } from 'react'
import { View, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native'
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
  const progress     = useSharedValue(selected ? 1 : 0)
  const checkScale   = useSharedValue(selected ? 1 : 0)
  const checkOpacity = useSharedValue(selected ? 1 : 0)
  const shakeX       = useSharedValue(0)

  useEffect(() => {
    if (selected) {
      progress.value     = withTiming(1, TIMING_BORDER)
      checkScale.value   = withSpring(1, SPRING_SELECT)
      checkOpacity.value = withSpring(1, SPRING_SELECT)
    } else {
      progress.value     = withTiming(0, TIMING_BORDER)
      checkScale.value   = withSpring(0, SPRING_DESELECT)
      checkOpacity.value = withSpring(0, SPRING_DESELECT)
    }
  }, [selected])

  // Outer: handles border color + glow shadow. No overflow:hidden so shadow renders.
  const outerAnimStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.borderCard, colors.borderIris],
    ),
    shadowColor:   colors.iris,
    shadowOffset:  { width: 0, height: 0 },
    shadowRadius:  20,
    shadowOpacity: progress.value,
    elevation:     progress.value * 8,
    transform:     [{ translateX: shakeX.value }],
  }))

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity:   checkOpacity.value,
  }))

  const handlePress = () => {
    if (disabled) {
      shakeX.value = withSequence(
        withTiming(6,  { duration: 60, reduceMotion: ReduceMotion.System }),
        withTiming(-6, { duration: 60, reduceMotion: ReduceMotion.System }),
        withTiming(4,  { duration: 60, reduceMotion: ReduceMotion.System }),
        withTiming(-4, { duration: 60, reduceMotion: ReduceMotion.System }),
        withTiming(0,  { duration: 60, reduceMotion: ReduceMotion.System }),
      )
      return
    }
    onPress()
  }

  const gradientColors = selected
    ? (['rgba(139,92,246,0.12)', 'rgba(139,92,246,0.06)'] as const)
    : ([colors.fathomTop, colors.fathom] as const)

  const highlightBg = selected
    ? 'rgba(139,92,246,0.20)'
    : 'rgba(255,255,255,0.08)'

  return (
    <Animated.View
      style={[
        styles.outer,
        outerAnimStyle,
        disabled ? styles.disabled : undefined,
        style,
      ]}
    >
      {/* Inner clips gradient to rounded corners */}
      <View style={styles.inner}>
        <Pressable
          onPress={handlePress}
          style={styles.pressable}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: selected, disabled }}
          accessibilityLabel={label}
          accessibilityHint={disabled ? 'Maximum selections reached' : undefined}
        >
          {/* Gradient surface */}
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Top inner highlight */}
          <View
            pointerEvents="none"
            style={[styles.topHighlight, { backgroundColor: highlightBg }]}
          />

          {/* Left accent bar — selected only */}
          {selected && (
            <View style={styles.leftBar} pointerEvents="none" />
          )}

          <Animated.Text
            style={[
              styles.label,
              {
                color:      selected ? colors.textHi : colors.textMid,
                fontFamily: selected ? fontFamilies.semibold : fontFamilies.medium,
              },
            ]}
            numberOfLines={0}
          >
            {label}
          </Animated.Text>

          {/* Checkmark circle */}
          <Animated.View style={[styles.checkWrap, checkAnimStyle]}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={13} color={colors.abyss} />
            </View>
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radius.md,
    borderWidth:  1,
  },
  inner: {
    borderRadius: radius.md,
    overflow:     'hidden',
  },
  pressable: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    minHeight:       spacing.touchMin,
  },
  topHighlight: {
    position: 'absolute',
    top:   0,
    left:  0,
    right: 0,
    height: 1,
  },
  leftBar: {
    position:              'absolute',
    left:                  0,
    top:                   0,
    bottom:                0,
    width:                 3,
    backgroundColor:       colors.iris,
    borderTopLeftRadius:   radius.md,
    borderBottomLeftRadius: radius.md,
  },
  label: {
    flex:       1,
    fontSize:   typography.size.step,
    lineHeight: typography.size.step * typography.leading.step,
  },
  checkWrap: {
    marginLeft: spacing[2],
  },
  checkCircle: {
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: colors.iris,
    alignItems:      'center',
    justifyContent:  'center',
  },
  disabled: {
    opacity: 0.35,
  },
})
