import React, { useEffect } from 'react'
import { Pressable, StyleSheet, View, Linking } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  ReduceMotion,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { colors, fontFamilies, radius, spacing, typography } from '@/theme'

export type StepItem = {
  instruction: string
  videoUrl?: string
  videoLabel?: string
}

type Props = {
  step: StepItem
  stepIndex: number   // 0-indexed
  totalSteps: number
  phaseColor: string
  isActive: boolean
  onDone: () => void
}

export function StepCard({ step, stepIndex, totalSteps, phaseColor, isActive, onDone }: Props) {
  const opacity = useSharedValue(isActive ? 1 : 0.4)
  const translateY = useSharedValue(0)

  useEffect(() => {
    if (isActive) {
      translateY.value = 18
      opacity.value = withTiming(1, { duration: 350, reduceMotion: ReduceMotion.System })
      translateY.value = withSpring(0, {
        stiffness: 280,
        damping: 26,
        reduceMotion: ReduceMotion.System,
      })
    } else {
      opacity.value = withTiming(0.4, { duration: 200, reduceMotion: ReduceMotion.System })
    }
  }, [isActive])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const cardBorderColor = phaseColor + '4D'
  const doneLabelColor = phaseColor === colors.volt ? colors.abyss : colors.arcLight

  return (
    <Animated.View style={[styles.card, { borderColor: cardBorderColor }, animStyle]}>
      <Animated.Text style={styles.stepLabel}>
        {`STEP ${stepIndex + 1} OF ${totalSteps}`}
      </Animated.Text>

      <Animated.Text style={styles.instruction}>
        {step.instruction}
      </Animated.Text>

      {step.videoUrl ? (
        <Pressable
          onPress={() => Linking.openURL(step.videoUrl!)}
          accessibilityRole="link"
          accessibilityLabel={step.videoLabel ?? 'Watch video'}
          style={[styles.videoCard, { borderColor: phaseColor + '33' }]}
        >
          <View style={[styles.videoIconWrap, { backgroundColor: phaseColor + '1A' }]}>
            <Ionicons name="play" size={16} color={phaseColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Animated.Text style={styles.videoTitle}>
              {step.videoLabel ?? 'Watch video'}
            </Animated.Text>
            <Animated.Text style={styles.videoSub}>Tap to open</Animated.Text>
          </View>
        </Pressable>
      ) : null}

      {isActive ? (
        <Pressable
          onPress={onDone}
          style={[styles.doneBtn, { backgroundColor: phaseColor }]}
          accessibilityRole="button"
          accessibilityLabel="Mark step as done"
        >
          <Animated.Text style={[styles.doneBtnText, { color: doneLabelColor }]}>
            Done
          </Animated.Text>
        </Pressable>
      ) : null}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.fathom,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing[6],
    marginBottom: spacing[3],
  },
  stepLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.textLow,
    marginBottom: spacing[3],
  },
  instruction: {
    fontFamily: fontFamilies.regular,
    fontSize: typography.size.body,
    lineHeight: typography.size.body * typography.leading.body,
    color: colors.textHi,
  },
  videoCard: {
    marginTop: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.abyss,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing[3],
  },
  videoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.base,
    color: colors.textHi,
  },
  videoSub: {
    fontFamily: fontFamilies.regular,
    fontSize: typography.size.caption,
    color: colors.textMid,
    marginTop: 2,
  },
  doneBtn: {
    marginTop: spacing[5],
    height: 44,
    width: '60%',
    borderRadius: 22,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.base,
  },
})
