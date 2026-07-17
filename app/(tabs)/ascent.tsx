import { useEffect } from 'react'
import { View, FlatList, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { Text } from '@/components/core/Text'
import { Card } from '@/components/core/Card'
import { PhaseProgressRing } from '@/components/shared/PhaseProgressRing'
import { Silhouette } from '@/components/shared/Silhouette'
import { useJourneyStore } from '@/stores/journey.store'
import { colors, getPhaseColor, getPhaseName, spacing, radius } from '@/theme'

const CELL_GAP = spacing[2]

function DayCell({ day, isCompleted, isCurrent, phaseColor, cellSize }: {
  day: number
  isCompleted: boolean
  isCurrent: boolean
  phaseColor: string
  cellSize: number
}) {
  const pulse = useSharedValue(1)

  useEffect(() => {
    if (isCurrent) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 900, reduceMotion: ReduceMotion.System }),
          withTiming(1,   { duration: 900, reduceMotion: ReduceMotion.System }),
        ),
        -1,
        false,
      )
    } else {
      pulse.value = 1
    }
  }, [isCurrent])

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }))

  const bg = isCompleted
    ? getPhaseColor(day)
    : isCurrent
      ? 'transparent'
      : colors.fathom

  const textColor = isCompleted
    ? colors.abyss
    : isCurrent
      ? phaseColor
      : colors.textFaint

  const borderColor = isCurrent ? phaseColor : 'transparent'

  return (
    <Animated.View
      style={[
        {
          width:           Math.max(cellSize, 44),
          height:          Math.max(cellSize, 44),
          borderRadius:    radius.sm,
          backgroundColor: bg,
          alignItems:      'center',
          justifyContent:  'center',
          borderWidth:     isCurrent ? 2 : 0,
          borderColor,
        },
        isCurrent && pulseStyle,
      ]}
    >
      <Text variant="micro" color={textColor}>
        {String(day)}
      </Text>
    </Animated.View>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card style={{ flex: 1, alignItems: 'center', padding: spacing[4] }}>
      <Text variant="heading" color={colors.textHi}>{value}</Text>
      <Text variant="caption" color={colors.textMid} style={{ marginTop: spacing[1] }}>
        {label}
      </Text>
    </Card>
  )
}

export default function Ascent() {
  const { width: screenWidth } = useWindowDimensions()
  const gridWidth = screenWidth - spacing.pagePad * 2
  const cellSize  = Math.floor((gridWidth - CELL_GAP * 6) / 7)

  const { completedDays, currentDay, activeJourney } = useJourneyStore()

  const phaseColor = currentDay > 0 ? getPhaseColor(currentDay) : getPhaseColor(1)
  const phaseName  = currentDay > 0 ? getPhaseName(currentDay)  : getPhaseName(1)

  const daysInFoundation = completedDays.filter((d) => d >= 1  && d <= 7).length
  const daysInBuild      = completedDays.filter((d) => d >= 8  && d <= 14).length
  const daysInCommit     = completedDays.filter((d) => d >= 15 && d <= 21).length

  const days = Array.from({ length: 21 }, (_, i) => i + 1)

  const streak    = completedDays.length
  const remaining = Math.max(0, 21 - completedDays.length)

  return (
    <ScreenWrapper padded scrollable style={{ paddingTop: spacing[6], paddingBottom: spacing.pageBottom }}>
      {/* Heading */}
      <Text variant="title" color={colors.textHi} style={{ marginTop: spacing[6] }}>
        The Ascent
      </Text>
      <Text variant="body" color={colors.textMid} style={{ marginTop: spacing[1] }}>
        {completedDays.length} of 21 days complete
      </Text>

      {/* Silhouette */}
      <View style={{ marginTop: spacing[8], alignItems: 'center' }}>
        <Silhouette
          completedDays={completedDays.length}
          phaseColor={phaseColor}
          animated
        />
      </View>

      {/* Phase progress rings */}
      <View
        style={{
          marginTop:      spacing[8],
          flexDirection:  'row',
          justifyContent: 'space-between',
          gap:            spacing[4],
        }}
      >
        {[
          { label: 'FOUNDATION', color: colors.glacial, dayInPhase: Math.min(daysInFoundation, 7) },
          { label: 'BUILD',      color: colors.surge,   dayInPhase: Math.min(daysInBuild, 7) },
          { label: 'COMMIT',     color: colors.plasma,  dayInPhase: Math.min(daysInCommit, 7) },
        ].map(({ label, color, dayInPhase }) => (
          <View key={label} style={{ flex: 1, alignItems: 'center', gap: spacing[2] }}>
            <PhaseProgressRing dayInPhase={dayInPhase} phaseColor={color} />
            <Text variant="label" color={colors.textLow} uppercase>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <SectionLabel style={{ marginTop: spacing[8] }}>YOUR 21 DAYS</SectionLabel>
      <View style={{ marginTop: spacing[3] }}>
        <FlatList
          data={days}
          keyExtractor={(item) => String(item)}
          numColumns={7}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: CELL_GAP }}
          ItemSeparatorComponent={() => <View style={{ height: CELL_GAP }} />}
          renderItem={({ item }) => (
            <DayCell
              day={item}
              isCompleted={completedDays.includes(item)}
              isCurrent={item === currentDay && !completedDays.includes(item)}
              phaseColor={phaseColor}
              cellSize={cellSize}
            />
          )}
        />
      </View>

      {/* Stats */}
      <View
        style={{
          marginTop:     spacing[8],
          flexDirection: 'row',
          gap:           spacing[3],
        }}
      >
        <StatCard value={String(streak)}    label="Days done" />
        <StatCard value={phaseName}         label="Phase" />
        <StatCard value={String(remaining)} label="Remaining" />
      </View>
    </ScreenWrapper>
  )
}
