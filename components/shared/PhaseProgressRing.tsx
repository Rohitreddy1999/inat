import React from 'react'
import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { Text } from '@/components/core/Text'
import { colors } from '@/theme'

type Props = {
  dayInPhase: number
  phaseColor: string
  size?: number
}

export function PhaseProgressRing({ dayInPhase, phaseColor, size = 64 }: Props) {
  const strokeWidth = 3
  const center      = size / 2
  const r           = center - strokeWidth / 2
  const circumference = 2 * Math.PI * r
  const progress    = circumference * (dayInPhase / 7)

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Day ${dayInPhase} of 7`}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={phaseColor}
          strokeOpacity={0.15}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc — rotated -90° so it starts at top */}
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={phaseColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Center label */}
      <Text variant="micro" color={phaseColor}>
        {String(dayInPhase)}
      </Text>
    </View>
  )
}
