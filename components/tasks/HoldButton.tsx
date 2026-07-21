/**
 * HoldButton — LAYOUT CONSTRAINT
 * Must always be rendered inside a fixed-position View anchored to the bottom.
 * Never place inside a ScrollView.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  useReducedMotion,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { colors, fontFamilies, radius, typography } from '@/theme'

type Props = {
  phaseColor: string
  onComplete: () => void
  disabled?: boolean
  label?: string
  holdingLabel?: string
  holdMs?: number
  buttonHeight?: number
  buttonRadius?: number
  labelFontFamily?: string
  labelFontSize?: number
}

export function HoldButton({
  phaseColor,
  onComplete,
  disabled = false,
  label = 'Hold to Complete',
  holdingLabel = 'Completing...',
  holdMs = 1000,
  buttonHeight = 64,
  buttonRadius = radius.pill,
  labelFontFamily = fontFamilies.bold,
  labelFontSize = typography.size.base,
}: Props) {
  const isReducedMotion = useReducedMotion()
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)

  const rafRef       = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  const heartbeatScale = useSharedValue(1)
  const glowOpacity    = useSharedValue(0)

  const startHeartbeat = useCallback(() => {
    if (isReducedMotion || disabled) return
    heartbeatScale.value = withRepeat(
      withSequence(
        withTiming(1.012, { duration: 650 }),
        withTiming(1,     { duration: 650 }),
        withTiming(1.008, { duration: 650 }),
        withTiming(1,     { duration: 650 }),
      ),
      -1,
      false,
    )
  }, [isReducedMotion, disabled, heartbeatScale])

  const stopHeartbeat = useCallback(() => {
    cancelAnimation(heartbeatScale)
    heartbeatScale.value = withTiming(1, { duration: 100 })
  }, [heartbeatScale])

  useEffect(() => {
    if (!disabled) {
      startHeartbeat()
    } else {
      stopHeartbeat()
    }
    return () => {
      cancelAnimation(heartbeatScale)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [disabled, startHeartbeat, stopHeartbeat, heartbeatScale])

  const cancelHold = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    startTimeRef.current = null
    completedRef.current = false
    setProgress(0)
  }, [])

  const startHold = useCallback(() => {
    if (rafRef.current !== null) return
    startTimeRef.current = Date.now()
    completedRef.current = false

    const tick = () => {
      if (startTimeRef.current === null) return
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min(elapsed / holdMs, 1)
      setProgress(pct)

      if (pct >= 1 && !completedRef.current) {
        completedRef.current = true
        rafRef.current = null
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        onComplete()
        setProgress(0)
        setIsHolding(false)
        glowOpacity.value = withTiming(0, { duration: 300 })
        startHeartbeat()
        return
      }

      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [holdMs, onComplete, glowOpacity, startHeartbeat])

  const handlePressIn = useCallback(() => {
    if (disabled) return
    stopHeartbeat()
    setIsHolding(true)
    glowOpacity.value = withTiming(1, { duration: 200 })
    startHold()
  }, [disabled, stopHeartbeat, glowOpacity, startHold])

  const handleRelease = useCallback(() => {
    if (completedRef.current) return
    cancelHold()
    setIsHolding(false)
    glowOpacity.value = withTiming(0, { duration: 300 })
    startHeartbeat()
  }, [cancelHold, glowOpacity, startHeartbeat])

  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartbeatScale.value }],
    shadowColor: phaseColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: disabled ? 0 : glowOpacity.value * 0.30,
    shadowRadius: 24,
    elevation: disabled ? 0 : glowOpacity.value * 6,
  }))

  const buttonAnimStyle = useAnimatedStyle(() => ({
    shadowColor: phaseColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: disabled ? 0 : glowOpacity.value * 0.42,
    shadowRadius: 14,
  }))

  const isVolt = phaseColor === colors.volt
  const activeTextColor = isVolt ? colors.abyss : colors.arcLight

  return (
    <Animated.View style={[styles.outerGlow, containerAnimStyle]}>
      <Pressable
        style={styles.pressable}
        onPressIn={handlePressIn}
        onPressOut={handleRelease}
        onTouchEnd={handleRelease}
        pointerEvents={disabled ? 'none' : 'box-only'}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Hold for one second to complete today's task"
        accessibilityState={{ busy: isHolding, disabled }}
      >
        <Animated.View
          style={[
            styles.button,
            { height: buttonHeight, borderRadius: buttonRadius },
            buttonAnimStyle,
            disabled
              ? styles.buttonDisabled
              : { backgroundColor: phaseColor, borderColor: phaseColor },
          ]}
        >
          <Animated.Text
            style={[
              styles.label,
              { fontFamily: labelFontFamily, fontSize: labelFontSize, color: disabled ? colors.textLow : activeTextColor },
            ]}
          >
            {isHolding ? holdingLabel : label}
          </Animated.Text>

          {isHolding && (
            <View pointerEvents="none" style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: activeTextColor,
                    shadowColor: activeTextColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                    elevation: 2,
                  },
                ]}
              />
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  outerGlow: {
    width: '100%',
    borderRadius: radius.pill,
  },
  pressable: {
    width: '100%',
    borderRadius: radius.pill,
  },
  button: {
    height: 64,
    width: '100%',
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonDisabled: {
    backgroundColor: colors.fathom,
    borderColor: colors.borderCard,
  },
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.base,
  },
  barTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    borderRadius: radius.pill,
  },
})
