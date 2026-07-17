import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'
import { Card } from '@/components/core/Card'
import { Text } from '@/components/core/Text'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { colors, spacing } from '@/theme'

type Props = {
  state: 'A' | 'B' | 'C'
  dayNumber: number
  daysSinceLastOpen?: number
  phaseColor: string
  phaseName: string
  onCTA: () => void
}

function getStateAHeading(dayNumber: number): string {
  if (dayNumber <= 7)  return 'You\'re building the base. Show up.'
  if (dayNumber <= 14) return `Day ${dayNumber}. This is where most people stop.`
  return `Day ${dayNumber}. This is who you're becoming.`
}

export function ReentryCard({
  state,
  dayNumber,
  phaseColor,
  phaseName,
  onCTA,
}: Props) {
  const opacity    = useSharedValue(0)
  const translateY = useSharedValue(20)

  useEffect(() => {
    const config = { duration: 400, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System }
    opacity.value    = withTiming(1,  config)
    translateY.value = withTiming(0,  config)
  }, [opacity, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <Card>
        <View style={{ gap: spacing[3] }}>
          {state === 'A' && (
            <>
              <Badge variant="phase" color={phaseColor}>
                {phaseName} · DAY {dayNumber}
              </Badge>
              <Text variant="heading" color={colors.textHi}>
                {getStateAHeading(dayNumber)}
              </Text>
              <Button variant="primary" onPress={onCTA}>Let's go</Button>
            </>
          )}

          {state === 'B' && (
            <>
              <Badge variant="phase" color={phaseColor}>
                DAY {dayNumber} COMPLETE
              </Badge>
              <Text variant="heading" color={colors.textHi}>
                That's the one that counts.
              </Text>
              <Text variant="body" color={colors.textMid}>
                Day {dayNumber + 1} opens tonight at midnight.
              </Text>
            </>
          )}

          {state === 'C' && (
            <>
              <Badge variant="phase" color={phaseColor}>WELCOME BACK</Badge>
              <Text variant="heading" color={colors.textHi}>
                Day {dayNumber} is still here.
              </Text>
              <Text variant="body" color={colors.textMid}>
                The circuit doesn't judge. It waits.
              </Text>
              <Button variant="primary" onPress={onCTA}>
                Pick up where you left off
              </Button>
            </>
          )}
        </View>
      </Card>
    </Animated.View>
  )
}
