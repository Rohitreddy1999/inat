import React, { useEffect, useMemo } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import Svg, { Circle, G, Line, Path } from 'react-native-svg'
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { Text } from '@/components/core/Text'
import { colors, getPhaseColor, getPhaseName, radius, spacing } from '@/theme'
import type { GraphPoint } from '@/utils/ascent'
import { formatPracticeDate, titleCase } from '@/utils/ascent'

const GRAPH_HEIGHT = 316
const LEFT_GUTTER = 62
const RIGHT_GUTTER = 24
const TOP_GUTTER = 24
const BOTTOM_GUTTER = 24
const AnimatedLine = Animated.createAnimatedComponent(Line)
const AnimatedG = Animated.createAnimatedComponent(G)

type PixelPoint = GraphPoint & { x: number; y: number }

function Segment({ from, to, index, count }: {
  from: PixelPoint
  to: PixelPoint
  index: number
  count: number
}) {
  const length = Math.hypot(to.x - from.x, to.y - from.y)
  const offset = useSharedValue(length)

  useEffect(() => {
    const delay = Math.min(360, (index / Math.max(1, count)) * 360)
    offset.value = withDelay(
      delay,
      withTiming(0, {
        duration: Math.max(120, 560 / Math.max(1, count)),
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
      ReduceMotion.System,
    )
  }, [count, index, length, offset])

  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: offset.value }))

  return (
    <AnimatedLine
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={getPhaseColor(to.day_number)}
      strokeWidth={3}
      strokeLinecap="round"
      strokeDasharray={`${length} ${length}`}
      animatedProps={animatedProps}
    />
  )
}

function FeelingNode({ point, selected, latest, index, count }: {
  point: PixelPoint
  selected: boolean
  latest: boolean
  index: number
  count: number
}) {
  const color = getPhaseColor(point.day_number)
  const r = latest ? 6.5 : 5.5
  const common = { cx: point.x, cy: point.y }
  const opacity = useSharedValue(0)

  useEffect(() => {
    const delay = count <= 1 ? 0 : Math.min(440, (index / Math.max(1, count - 1)) * 440)
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 160,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
      ReduceMotion.System,
    )
  }, [count, index, opacity])

  const animatedProps = useAnimatedProps(() => ({ opacity: opacity.value }))

  return (
    <AnimatedG animatedProps={animatedProps}>
      {selected ? <Circle {...common} r={13} fill="none" stroke={color} strokeWidth={1} opacity={0.45} /> : null}
      {point.feelingLabel === 'Felt right' ? (
        <Circle {...common} r={r} fill={color} />
      ) : null}
      {point.feelingLabel === 'Pushed through' ? (
        <>
          <Circle {...common} r={r} fill={colors.abyss} stroke={color} strokeWidth={2} />
          <Circle {...common} r={2} fill={color} />
        </>
      ) : null}
      {point.feelingLabel === 'Just okay' ? (
        <>
          <Circle {...common} r={r} fill={colors.abyss} stroke={color} strokeWidth={2} />
          <Path
            d={`M ${point.x - r} ${point.y} A ${r} ${r} 0 0 0 ${point.x + r} ${point.y} L ${point.x - r} ${point.y} Z`}
            fill={color}
          />
        </>
      ) : null}
      {(point.feelingLabel === 'Struggled' || point.feelingLabel === 'Not recorded') ? (
        <Circle
          {...common}
          r={r}
          fill={colors.abyss}
          stroke={color}
          strokeWidth={point.feelingLabel === 'Not recorded' ? 1 : 2}
          strokeDasharray={point.feelingLabel === 'Not recorded' ? '2 2' : undefined}
        />
      ) : null}
      {latest ? <Circle {...common} r={10} fill="none" stroke={color} strokeWidth={1} opacity={0.35} /> : null}
    </AnimatedG>
  )
}

export function AscentGraph({
  points,
  width,
  selectedDay,
  onSelect,
}: {
  points: GraphPoint[]
  width: number
  selectedDay: number | null
  onSelect: (point: GraphPoint) => void
}) {
  const plotWidth = Math.max(1, width - LEFT_GUTTER - RIGHT_GUTTER)
  const plotHeight = GRAPH_HEIGHT - TOP_GUTTER - BOTTOM_GUTTER
  const pixelPoints = useMemo<PixelPoint[]>(() => points.map((point) => ({
    ...point,
    x: LEFT_GUTTER + point.xRatio * plotWidth,
    y: TOP_GUTTER + (1 - point.yRatio) * plotHeight,
  })), [plotHeight, plotWidth, points])

  const summary = points.length === 0
    ? 'Ascent graph. No practices recorded.'
    : `Ascent graph with ${points.length} completed ${points.length === 1 ? 'practice' : 'practices'}, from Day ${points[0].day_number} to Day ${points[points.length - 1].day_number}. Horizontal distance represents calendar time. Vertical position represents curriculum advancement.`

  return (
    <View style={[styles.container, { width, height: GRAPH_HEIGHT }]}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={summary}
        style={styles.accessibleSummary}
      />
      <Svg width={width} height={GRAPH_HEIGHT} importantForAccessibility="no-hide-descendants">
        {[7, 14, 21].map((day) => {
          const y = TOP_GUTTER + (1 - ((day - 1) / 20)) * plotHeight
          return (
            <Line
              key={day}
              x1={LEFT_GUTTER}
              y1={y}
              x2={width - RIGHT_GUTTER}
              y2={y}
              stroke={colors.borderSoft}
              strokeWidth={1}
              strokeDasharray="3 6"
            />
          )
        })}
        {pixelPoints.slice(1).map((point, index) => (
          <Segment
            key={`${pixelPoints[index].day_number}-${point.day_number}`}
            from={pixelPoints[index]}
            to={point}
            index={index}
            count={pixelPoints.length - 1}
          />
        ))}
        {pixelPoints.map((point, index) => (
          <FeelingNode
            key={point.day_number}
            point={point}
            selected={selectedDay === point.day_number}
            latest={index === pixelPoints.length - 1}
            index={index}
            count={pixelPoints.length}
          />
        ))}
      </Svg>

      <View pointerEvents="none" style={styles.phaseLabels} importantForAccessibility="no-hide-descendants">
        <Text variant="label" color={colors.plasma}>COMMIT</Text>
        <Text variant="label" color={colors.volt}>BUILD</Text>
        <Text variant="label" color={colors.iris}>FOUNDATION</Text>
      </View>

      {pixelPoints.map((point) => {
        const touchSize = Platform.OS === 'android' ? 48 : 44
        const phase = titleCase(getPhaseName(point.day_number))
        return (
          <Pressable
            key={`touch-${point.day_number}`}
            onPress={() => onSelect(point)}
            accessibilityRole="button"
            accessibilityLabel={`Day ${point.day_number}, ${formatPracticeDate(point.completed_at)}, ${phase}, ${point.feelingLabel}`}
            accessibilityHint="Shows this practice below the graph"
            accessibilityState={{ selected: selectedDay === point.day_number }}
            style={{
              position: 'absolute',
              left: point.x - touchSize / 2,
              top: point.y - touchSize / 2,
              width: touchSize,
              height: touchSize,
              borderRadius: radius.full,
            }}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: colors.fathom,
    borderColor: colors.borderCard,
    borderWidth: 1,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  phaseLabels: {
    ...StyleSheet.absoluteFillObject,
    left: spacing[3],
    right: undefined,
    width: LEFT_GUTTER - spacing[4],
    paddingTop: TOP_GUTTER - spacing[1],
    paddingBottom: BOTTOM_GUTTER - spacing[1],
    justifyContent: 'space-between',
  },
  accessibleSummary: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
})
