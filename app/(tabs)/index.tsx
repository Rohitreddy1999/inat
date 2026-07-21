import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { DayCard } from '@/components/shared/DayCard'
import { ReentryCard } from '@/components/shared/ReentryCard'
import { Button } from '@/components/core/Button'
import { useJourneyStore } from '@/stores/journey.store'
import { getDayWithSteps } from '@/services/curriculum.service'
import { getPhaseColor, getPhaseName, spacing } from '@/theme'
import { Day } from '@/types'

export default function Home() {
  const router = useRouter()
  const { activeJourney, currentDay, reentryState } = useJourneyStore()

  const [dayData, setDayData] = useState<Day | null>(null)

  // In State B, currentDay is already incremented to the NEXT day.
  // Display and fetch the day that was actually completed (currentDay - 1).
  const displayDay = reentryState === 'B' ? Math.max(currentDay - 1, 1) : currentDay
  const phaseColor = getPhaseColor(Math.max(displayDay, 1))
  const phaseName  = getPhaseName(Math.max(displayDay, 1))

  useEffect(() => {
    if (!activeJourney) return
    getDayWithSteps(activeJourney.arc, activeJourney.focus, displayDay).then(({ day }) => setDayData(day))
  }, [activeJourney, reentryState])

  if (!activeJourney) {
    return (
      <ScreenWrapper padded>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Button variant="primary" onPress={() => router.replace('/(onboarding)/life-stage')}>
            Start your journey
          </Button>
        </View>
      </ScreenWrapper>
    )
  }

  const isCompleted = reentryState === 'B'

  return (
    <ScreenWrapper padded scrollable style={{ paddingTop: spacing[6], paddingBottom: spacing.pageBottom }}>
      {reentryState !== null && reentryState !== 'D' && (
        <ReentryCard
          state={reentryState}
          dayNumber={displayDay}
          phaseColor={phaseColor}
          phaseName={phaseName}
          onCTA={() => router.push('/day')}
        />
      )}

      <View style={{ marginTop: reentryState === 'D' ? 0 : spacing[4] }}>
        <DayCard
          dayNumber={displayDay}
          title={dayData?.title ?? ''}
          phase={phaseName}
          subtractName={activeJourney.focus}
          durationMinutes={dayData?.duration_mins ?? 0}
          phaseColor={phaseColor}
          isCompleted={isCompleted}
          onBegin={() => router.push('/day')}
        />
      </View>
    </ScreenWrapper>
  )
}
