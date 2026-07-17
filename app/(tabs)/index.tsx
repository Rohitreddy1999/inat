import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { DayCard } from '@/components/shared/DayCard'
import { ReentryCard } from '@/components/shared/ReentryCard'
import { Button } from '@/components/core/Button'
import { useJourneyStore } from '@/stores/journey.store'
import { getDayContent, getSubtrackById } from '@/services/curriculum.service'
import { getPhaseColor, getPhaseName, spacing } from '@/theme'
import { CurriculumDay, Subtrack } from '@/types'

export default function Home() {
  const router = useRouter()
  const { activeJourney, currentDay, reentryState } = useJourneyStore()

  const [dayContent, setDayContent]     = useState<CurriculumDay | null>(null)
  const [subtrack, setSubtrack]         = useState<Subtrack | null>(null)

  const phaseColor = currentDay > 0 ? getPhaseColor(currentDay) : getPhaseColor(1)
  const phaseName  = currentDay > 0 ? getPhaseName(currentDay)  : getPhaseName(1)

  useEffect(() => {
    if (!activeJourney) return

    Promise.all([
      getDayContent(activeJourney.subtrack_id, activeJourney.current_day),
      getSubtrackById(activeJourney.subtrack_id),
    ]).then(([{ day }, { subtrack: s }]) => {
      setDayContent(day)
      setSubtrack(s)
    })
  }, [activeJourney])

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
          dayNumber={currentDay}
          phaseColor={phaseColor}
          phaseName={phaseName}
          onCTA={() => router.push('/day')}
        />
      )}

      <View style={{ marginTop: reentryState === 'D' ? 0 : spacing[4] }}>
        <DayCard
          dayNumber={currentDay}
          title={dayContent?.task_title ?? ''}
          phase={phaseName}
          subtractName={subtrack?.name ?? ''}
          durationMinutes={dayContent?.duration_minutes ?? 0}
          phaseColor={phaseColor}
          isCompleted={isCompleted}
          onBegin={() => router.push('/day')}
        />
      </View>
    </ScreenWrapper>
  )
}
