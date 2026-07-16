/**
 * HoldButton — LAYOUT CONSTRAINT
 * This component must ALWAYS be rendered inside a
 * fixed-position View anchored to the bottom of the screen.
 * It must NEVER be placed inside a ScrollView.
 * This constraint is enforced by the Day screen layout.
 * Violating this breaks the core daily interaction.
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
  label?: string
  holdingLabel?: string
  holdMs?: number
}

export function HoldButton({
  phaseColor,
  onComplete,
  label = 'Hold to Complete',
  holdingLabel = 'Completing...',
  holdMs = 1000,
}: Props) {
  const isReducedMotion = useReducedMotion()
  const [isHolding, setIsHolding]   = useState(false)
  const [progress, setProgress]     = useState(0)

  const rafRef       = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  // Reanimated shared values
  const heartbeatScale = useSharedValue(1)
  const glowOpacity    = useSharedValue(0) // 0=idle, 1=holding

  // ── Heartbeat ──────────────────────────────────────────────────
  const startHeartbeat = useCallback(() => {
    if (isReducedMotion) return
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
  }, [isReducedMotion, heartbeatScale])

  const stopHeartbeat = useCallback(() => {
    cancelAnimation(heartbeatScale)
    heartbeatScale.value = withTiming(1, { duration: 100 })
  }, [heartbeatScale])

  useEffect(() => {
    startHeartbeat()
    return () => {
      cancelAnimation(heartbeatScale)
      // Cancel any in-flight RAF on unmount to prevent setState after unmount
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [startHeartbeat, heartbeatScale])

  // ── RAF progress fill ──────────────────────────────────────────
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
    if (rafRef.current !== null) return // already running
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
        // Reset to idle
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

  // ── Touch handlers ─────────────────────────────────────────────
  const handlePressIn = useCallback(() => {
    stopHeartbeat()
    setIsHolding(true)
    glowOpacity.value = withTiming(1, { duration: 200 })
    startHold()
  }, [stopHeartbeat, glowOpacity, startHold])

  const handleRelease = useCallback(() => {
    if (completedRef.current) return // let completion handle reset
    cancelHold()
    setIsHolding(false)
    glowOpacity.value = withTiming(0, { duration: 300 })
    startHeartbeat()
  }, [cancelHold, glowOpacity, startHeartbeat])

  // ── Animated styles ────────────────────────────────────────────
  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartbeatScale.value }],
    shadowColor: phaseColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowOpacity.value * 0.30,
    shadowRadius: 24,
    elevation: glowOpacity.value * 6,
  }))

  const buttonAnimStyle = useAnimatedStyle(() => ({
    shadowColor: phaseColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowOpacity.value * 0.42,
    shadowRadius: 14,
  }))

  return (
    <Animated.View style={[styles.outerGlow, containerAnimStyle]}>
      <Pressable
        style={styles.pressable}
        onPressIn={handlePressIn}
        onPressOut={handleRelease}
        onTouchEnd={handleRelease}
        pointerEvents="box-only"
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Hold for one second to complete today's task"
        accessibilityState={{ busy: isHolding }}
      >
        <Animated.View style={[styles.button, buttonAnimStyle]}>
          {/* Label */}
          <Animated.Text style={styles.label}>
            {isHolding ? holdingLabel : label}
          </Animated.Text>

          {/* Progress bar at bottom of button */}
          {isHolding && (
            <View
              pointerEvents="none"
              style={[styles.barTrack]}
            >
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: phaseColor,
                    shadowColor: phaseColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
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
    // No overflow:hidden here — that would clip the inner glow shadow on iOS.
    // The inner button already clips the progress bar with its own overflow:hidden.
  },
  button: {
    height: 64,
    width: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.fathom,
    borderWidth: 1,
    borderColor: colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.base,
    color: colors.textHi,
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
