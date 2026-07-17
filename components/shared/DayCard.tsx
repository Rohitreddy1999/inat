import React from 'react'
import { View } from 'react-native'
import { Card } from '@/components/core/Card'
import { Text } from '@/components/core/Text'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { colors, spacing } from '@/theme'

type Props = {
  dayNumber: number
  title: string
  phase: string
  subtractName: string
  durationMinutes: number
  phaseColor: string
  isCompleted: boolean
  onBegin: () => void
}

export function DayCard({
  dayNumber,
  title,
  phase,
  subtractName,
  durationMinutes,
  phaseColor,
  isCompleted,
  onBegin,
}: Props) {
  return (
    <Card>
      <View style={{ gap: spacing[3] }}>
        {/* Top row: section label + phase badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <SectionLabel>{phase}</SectionLabel>
          <Badge variant="phase" color={phaseColor}>{phase}</Badge>
        </View>

        {/* Day number + radial bloom */}
        <View style={{ position: 'relative' }}>
          {/* Decorative bloom behind day number */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: phaseColor,
              opacity: 0.06,
              top: -20,
              left: -20,
              zIndex: 0,
            }}
          />
          <Text
            variant="display"
            color={phaseColor}
            style={{ zIndex: 1 }}
          >
            {String(dayNumber)}
          </Text>
        </View>

        {/* Day title */}
        <Text variant="title" color={colors.textHi} style={{ marginTop: spacing[1] }}>
          {title}
        </Text>

        {/* Metadata */}
        <Text variant="caption" color={colors.textMid}>
          {subtractName} · {durationMinutes} min
        </Text>

        {/* CTA */}
        {isCompleted ? (
          <Button variant="completed" phaseColor={phaseColor}>
            Day {dayNumber} Complete
          </Button>
        ) : (
          <Button variant="primary" onPress={onBegin}>
            Begin Day {dayNumber} →
          </Button>
        )}
      </View>
    </Card>
  )
}
