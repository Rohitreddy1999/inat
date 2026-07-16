import React from 'react'
import { Pressable, ActivityIndicator, View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ReduceMotion,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, effects, typography, fontFamilies } from '@/theme'
import { Text } from './Text'

export type ButtonVariant = 'primary' | 'secondary' | 'completed'

type Props = {
  variant?: ButtonVariant
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  glow?: boolean
  phaseColor?: string
  fullWidth?: boolean
  children: React.ReactNode
}

const SPRING = { stiffness: 400, damping: 20, reduceMotion: ReduceMotion.System }

export function Button({
  variant = 'primary',
  onPress,
  disabled = false,
  loading = false,
  glow = true,
  phaseColor = colors.phase.build,
  fullWidth = true,
  children,
}: Props) {
  // hooks must be called unconditionally (Rules of Hooks) —
  // but we only read them for pressable variants below
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    if (disabled || loading) return
    scale.value = withSpring(0.97, SPRING)
  }

  const handlePressOut = () => {
    if (disabled || loading) return
    scale.value = withSpring(1, SPRING)
  }

  if (variant === 'completed') {
    return (
      <View
        pointerEvents="none"
        accessible
        accessibilityRole="none"
        accessibilityLabel={`${String(children)}, completed`}
        style={[
          styles.completed,
          {
            borderColor: `${phaseColor}66`,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
          },
        ]}
      >
        <Ionicons name="checkmark" size={18} color={phaseColor} />
        <Text variant="base" color={phaseColor} style={styles.completedText}>
          {children}
        </Text>
      </View>
    )
  }

  const isPrimary = variant === 'primary'

  return (
    <Animated.View
      style={[
        animatedStyle,
        { alignSelf: fullWidth ? 'stretch' : 'flex-start' },
      ]}
    >
      <Pressable
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          isPrimary ? styles.primary : styles.secondary,
          isPrimary && glow && !disabled ? effects.glowCta : null,
          { opacity: disabled ? (isPrimary ? 0.2 : 0.35) : 1 },
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isPrimary ? colors.ctaText : colors.textMid}
          />
        ) : (
          <Text
            variant="base"
            color={isPrimary ? colors.ctaText : colors.textMid}
            style={isPrimary ? styles.primaryText : styles.secondaryText}
          >
            {children}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.ctaBg,
  },
  secondary: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  completed: {
    height: 58,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryText: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.button,
  },
  secondaryText: {
    fontSize: typography.size.base,
  },
  completedText: {
    fontFamily: fontFamilies.medium,
  },
})
