import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AscentGraph } from '@/components/ascent/AscentGraph'
import { Text } from '@/components/core/Text'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { getAllCompletions } from '@/services/completion.service'
import { useJourneyStore } from '@/stores/journey.store'
import { colors, fontFamilies, getPhaseColor, getPhaseName, radius, spacing, typography } from '@/theme'
import type { UserDayLog } from '@/types'
import {
  buildGraphPoints,
  calculatePracticeSignal,
  formatPracticeDate,
  getAscentObservation,
  normalizeAscentLogs,
  titleCase,
  type GraphPoint,
  type PracticeSignal as PracticeSignalValue,
} from '@/utils/ascent'

function PracticeSignal({ signal, phaseColor }: {
  signal: PracticeSignalValue
  phaseColor: string
}) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withTiming(signal.ratio, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    })
  }, [progress, signal.ratio])

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as `${number}%`,
  }))

  return (
    <View style={styles.signalSection}>
      <Text variant="label" color={colors.textLow} uppercase>PRACTICE SIGNAL</Text>
      <Text style={styles.signalValue} color={colors.arcLight}>
        {`${signal.numerator} OF THE LAST ${signal.denominator} ${signal.denominator === 1 ? 'DAY' : 'DAYS'} · ${signal.state.toUpperCase()}`}
      </Text>
      <View
        style={[styles.signalTrack, { backgroundColor: phaseColor + '1F' }]}
        accessibilityRole="progressbar"
        accessibilityLabel={`Practice Signal: ${signal.numerator} of the last ${signal.denominator} days, ${signal.state}`}
        accessibilityValue={{ min: 0, max: signal.denominator, now: signal.numerator }}
      >
        <Animated.View style={[styles.signalFill, { backgroundColor: phaseColor }, fillStyle]} />
      </View>
      <Text variant="caption" color={colors.textLow} style={styles.signalCaption}>
        Distinct practice dates in your current rolling eligible window.
      </Text>
    </View>
  )
}

function SelectedPractice({ practice }: { practice: GraphPoint }) {
  const phaseColor = getPhaseColor(practice.day_number)
  return (
    <View style={styles.selectedPractice} accessible accessibilityLabel={`Selected practice. Day ${practice.day_number}. ${formatPracticeDate(practice.completed_at)}. ${titleCase(getPhaseName(practice.day_number))}. ${practice.feelingLabel}.`}>
      <View style={styles.selectedTopLine}>
        <Text style={styles.selectedDay} color={colors.arcLight}>{`Day ${practice.day_number}`}</Text>
        <Text variant="label" color={phaseColor}>{getPhaseName(practice.day_number)}</Text>
      </View>
      <Text variant="body" color={colors.textMid}>
        {`${formatPracticeDate(practice.completed_at)} · ${practice.feelingLabel}`}
      </Text>
    </View>
  )
}

function RecentPractices({ practices }: { practices: GraphPoint[] }) {
  const recent = [...practices]
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    .slice(0, 3)

  if (recent.length === 0) return null

  return (
    <View style={styles.recentSection}>
      <Text style={styles.sectionHeading} color={colors.arcLight}>Recent practices</Text>
      <View accessibilityRole="list">
        {recent.map((practice, index) => {
          const phaseColor = getPhaseColor(practice.day_number)
          return (
            <View
              key={practice.day_number}
              accessibilityRole="text"
              accessibilityLabel={`Day ${practice.day_number}, ${titleCase(getPhaseName(practice.day_number))}, ${practice.feelingLabel}, ${formatPracticeDate(practice.completed_at)}`}
              style={[styles.recentRow, index < recent.length - 1 && styles.recentRowBorder]}
            >
              <View style={[styles.recentMarker, { backgroundColor: phaseColor }]} />
              <View style={styles.recentMain}>
                <Text style={styles.recentDay} color={colors.arcLight}>{`Day ${practice.day_number}`}</Text>
                <Text variant="caption" color={colors.textMid}>
                  {`${titleCase(getPhaseName(practice.day_number))} · ${practice.feelingLabel}`}
                </Text>
              </View>
              <Text variant="caption" color={colors.textLow} style={styles.recentDate}>
                {formatPracticeDate(practice.completed_at)}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default function Ascent() {
  const { width } = useWindowDimensions()
  const { activeJourney, currentDay, isHydrated } = useJourneyStore()
  const [logs, setLogs] = useState<UserDayLog[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    if (!isHydrated) return
    if (!activeJourney) {
      setLogs([])
      setIsLoading(false)
      setError(false)
      return
    }
    setIsLoading(true)
    const result = await getAllCompletions(activeJourney.id)
    setLogs(result.completions)
    setError(Boolean(result.error))
    setIsLoading(false)
  }, [activeJourney?.id, currentDay, isHydrated])

  useEffect(() => {
    void load()
  }, [load])

  const { practices, diagnostics } = useMemo(() => normalizeAscentLogs(logs), [logs])
  const points = useMemo(() => buildGraphPoints(practices), [practices])
  const latestDay = points[points.length - 1]?.day_number ?? 1
  const positionDay = Math.min(21, Math.max(1, Number.isInteger(currentDay) ? currentDay : latestDay, latestDay))
  const phaseColor = getPhaseColor(positionDay)
  const phaseName = getPhaseName(positionDay)
  const signal = useMemo(
    () => calculatePracticeSignal(practices, activeJourney?.started_at ?? new Date().toString()),
    [activeJourney?.started_at, practices],
  )
  const observation = useMemo(() => getAscentObservation(practices), [practices])
  const selectedPractice = points.find((point) => point.day_number === selectedDay)
    ?? points[points.length - 1]
    ?? null
  const graphWidth = Math.max(1, width - spacing.pagePad * 2)
  const excludedCount = diagnostics.invalidRows + diagnostics.duplicateRows
  const dataNotice = [
    excludedCount > 0
      ? `${excludedCount} duplicate or invalid ${excludedCount === 1 ? 'record was' : 'records were'} excluded`
      : null,
    diagnostics.outOfOrderDates > 0
      ? `${diagnostics.outOfOrderDates} date sequence ${diagnostics.outOfOrderDates === 1 ? 'conflict was' : 'conflicts were'} rendered without a downward path`
      : null,
  ].filter((part): part is string => part !== null).join('; ')

  useEffect(() => {
    if (points.length > 0 && !points.some((point) => point.day_number === selectedDay)) {
      setSelectedDay(points[points.length - 1].day_number)
    }
  }, [points, selectedDay])

  if (!isHydrated || isLoading) {
    return (
      <ScreenWrapper padded style={styles.centered}>
        <ActivityIndicator color={phaseColor} accessibilityLabel="Loading Ascent" />
        <Text variant="body" color={colors.textMid} style={styles.loadingText}>Reading your practice record…</Text>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper padded scrollable style={styles.scrollContent}>
      <View style={styles.header}>
        <Text variant="label" color={colors.textLow} uppercase>ASCENT</Text>
        <Text style={styles.focusTitle} color={colors.arcLight}>
          {activeJourney?.focus ?? 'Your practice'}
        </Text>
        <Text variant="base" color={phaseColor}>{`Day ${positionDay} · ${titleCase(phaseName)}`}</Text>
      </View>

      {error ? (
        <View style={styles.errorState} accessibilityRole="alert">
          <Text style={styles.stateTitle} color={colors.arcLight}>Your record could not be loaded.</Text>
          <Text variant="body" color={colors.textMid}>The circuit is unchanged. Try again when the connection returns.</Text>
          <Pressable onPress={() => void load()} accessibilityRole="button" style={styles.retryButton}>
            <Text variant="base" color={phaseColor}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <AscentGraph
            points={points}
            width={graphWidth}
            selectedDay={selectedPractice?.day_number ?? null}
            onSelect={(point) => setSelectedDay(point.day_number)}
          />

          {points.length === 0 ? (
            <View style={styles.earlyState}>
              <Text style={styles.stateTitle} color={colors.arcLight}>Nothing recorded yet.</Text>
              <Text variant="body" color={colors.textMid}>Day 1 is waiting.</Text>
            </View>
          ) : (
            <>
              {selectedPractice ? <SelectedPractice practice={selectedPractice} /> : null}
              {points.length === 1 ? (
                <Text variant="body" color={colors.textMid} style={styles.begunText}>The ascent has begun.</Text>
              ) : null}
            </>
          )}

          {dataNotice ? (
            <Text variant="caption" color={colors.textLow} style={styles.dataNotice}>
              {`${dataNotice}.`}
            </Text>
          ) : null}

          <PracticeSignal signal={signal} phaseColor={phaseColor} />

          <View style={styles.observation}>
            <Text variant="label" color={phaseColor} uppercase>{observation.title}</Text>
            <Text style={styles.observationBody} color={colors.arcLight}>{observation.body}</Text>
          </View>

          <RecentPractices practices={points} />
        </>
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: spacing[6],
    paddingBottom: spacing.pageBottom + spacing[10],
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing[3],
  },
  header: {
    marginTop: spacing[4],
    marginBottom: spacing[6],
  },
  focusTitle: {
    fontFamily: fontFamilies.black,
    fontSize: typography.size.title,
    lineHeight: typography.size.title * typography.leading.tight,
    letterSpacing: typography.tracking.tight * typography.size.title,
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  earlyState: {
    paddingVertical: spacing[6],
  },
  stateTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.quote,
    lineHeight: typography.size.quote * typography.leading.heading,
    marginBottom: spacing[1],
  },
  errorState: {
    minHeight: 316,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderCard,
    backgroundColor: colors.fathom,
    padding: spacing[6],
    justifyContent: 'center',
  },
  retryButton: {
    minHeight: 48,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginTop: spacing[4],
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
  },
  selectedPractice: {
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  selectedTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    marginBottom: spacing[1],
  },
  selectedDay: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.base,
  },
  begunText: {
    marginTop: spacing[3],
  },
  dataNotice: {
    marginTop: spacing[3],
    lineHeight: typography.size.caption * typography.leading.body,
  },
  signalSection: {
    marginTop: spacing[8],
  },
  signalValue: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.quote,
    lineHeight: typography.size.quote * typography.leading.heading,
    marginTop: spacing[2],
  },
  signalTrack: {
    height: spacing[2],
    overflow: 'hidden',
    borderRadius: radius.full,
    marginTop: spacing[4],
  },
  signalFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  signalCaption: {
    marginTop: spacing[2],
  },
  observation: {
    marginTop: spacing[8],
    paddingTop: spacing[5],
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
  },
  observationBody: {
    fontFamily: fontFamilies.medium,
    fontSize: typography.size.quote,
    lineHeight: typography.size.quote * typography.leading.heading,
    marginTop: spacing[3],
  },
  recentSection: {
    marginTop: spacing[8],
  },
  sectionHeading: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.quote,
    marginBottom: spacing[3],
  },
  recentRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  recentRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  recentMarker: {
    width: spacing[2],
    height: spacing[2],
    borderRadius: radius.full,
  },
  recentMain: {
    flex: 1,
    gap: spacing[1],
  },
  recentDay: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.base,
  },
  recentDate: {
    maxWidth: 92,
    textAlign: 'right',
  },
})
