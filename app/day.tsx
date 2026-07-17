import { useEffect, useState } from 'react'
import { View, ScrollView, Alert, Pressable, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { BackButton } from '@/components/navigation/BackButton'
import { Badge } from '@/components/core/Badge'
import { Text } from '@/components/core/Text'
import { Card } from '@/components/core/Card'
import { Button } from '@/components/core/Button'
import { StepCard } from '@/components/tasks/StepCard'
import { HoldButton } from '@/components/tasks/HoldButton'
import { useJourneyStore } from '@/stores/journey.store'
import { getDayContent, getSubtrackById } from '@/services/curriculum.service'
import { getDayCompletion, completeDay } from '@/services/completion.service'
import { getSession } from '@/services/auth.service'
import { getPhaseColor, getPhaseName, colors, spacing } from '@/theme'

const HOLD_PANEL_HEIGHT = 130
import { CurriculumDay } from '@/types'

export default function Day() {
  const router = useRouter()
  const { activeJourney, currentDay, hydrate } = useJourneyStore()

  const [dayContent, setDayContent] = useState<CurriculumDay | null>(null)
  const [subtractName, setSubtractName] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [stepsDone, setStepsDone] = useState<Record<number, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  const phaseColor = currentDay > 0 ? getPhaseColor(currentDay) : getPhaseColor(1)
  const phaseName  = currentDay > 0 ? getPhaseName(currentDay)  : getPhaseName(1)

  useEffect(() => {
    if (!activeJourney) return

    Promise.all([
      getDayContent(activeJourney.subtrack_id, activeJourney.current_day),
      getDayCompletion(activeJourney.id, activeJourney.current_day),
      getSubtrackById(activeJourney.subtrack_id),
    ]).then(([{ day }, { completion }, { subtrack }]) => {
      setDayContent(day)
      setSubtractName(subtrack?.name ?? '')
      if (completion) setIsCompleted(true)
      setIsLoading(false)
    })
  }, [activeJourney])

  function toggleStep(order: number) {
    setStepsDone((prev) => ({ ...prev, [order]: !prev[order] }))
  }

  async function handleComplete() {
    if (!activeJourney) return

    setIsCompleted(true)

    await completeDay(activeJourney.id, currentDay, 'good', '')

    const { session } = await getSession()
    if (session?.user?.id) {
      await hydrate(session.user.id)
    }

    if (currentDay === 21) {
      router.push('/graduation')
    } else {
      setTimeout(() => router.back(), 1000)
    }
  }

  const steps: string[] = (dayContent?.steps ?? []).map((item) =>
    typeof item === 'string' ? item : (item as { instruction: string }).instruction,
  )

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      {/* Fixed header */}
      <View
        style={{
          paddingTop: spacing[6],
          paddingHorizontal: spacing.pagePad,
        }}
      >
        {/* Decorative radial bloom */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: phaseColor + '0F',
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BackButton onPress={() => router.back()} />
          <View style={{ flex: 1 }} />
          <Badge variant="phase" color={phaseColor}>
            {`DAY ${currentDay} · ${phaseName}`}
          </Badge>
        </View>
      </View>

      {/* Scrollable content area */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: HOLD_PANEL_HEIGHT }}
        showsVerticalScrollIndicator={false}
      >
        {/* Day number + title */}
        <View style={{ paddingTop: spacing[6], paddingHorizontal: spacing.pagePad }}>
          <Text variant="display" color={phaseColor}>
            {String(currentDay)}
          </Text>
          <Text variant="title" color={colors.textHi} style={{ marginTop: spacing[1] }}>
            {isLoading ? '' : (dayContent?.task_title ?? '')}
          </Text>
        </View>

        {/* Metadata */}
        <View style={{ marginTop: spacing[2], paddingHorizontal: spacing.pagePad }}>
          <Text variant="caption" color={colors.textMid}>
            {subtractName}{dayContent?.duration_minutes ? ` · ${dayContent.duration_minutes} min` : ''}
          </Text>
        </View>

        {/* What to do */}
        <SectionLabel style={{ marginTop: spacing[8], paddingHorizontal: spacing.pagePad }}>
          WHAT TO DO
        </SectionLabel>

        <View style={{ paddingHorizontal: spacing.pagePad }}>
          {steps.map((text, i) => (
            <StepCard
              key={i}
              index={i + 1}
              text={text}
              done={!!stepsDone[i]}
              phaseColor={phaseColor}
              onToggle={() => toggleStep(i)}
              isLast={i === steps.length - 1}
            />
          ))}
        </View>

        {/* Why this matters */}
        {dayContent?.why_text ? (
          <>
            <SectionLabel
              style={{ marginTop: spacing[8], paddingHorizontal: spacing.pagePad }}
            >
              WHY THIS MATTERS
            </SectionLabel>
            <Card
              accent={phaseColor}
              style={{ margin: spacing[2], marginHorizontal: spacing.pagePad }}
            >
              <Text variant="body" color={colors.textHi}>
                {dayContent.why_text}
              </Text>
            </Card>
          </>
        ) : null}

        {/* Quote */}
        {dayContent?.quote_text ? (
          <View
            style={{
              marginTop: spacing[6],
              paddingHorizontal: spacing.pagePad,
            }}
          >
            <Text
              variant="quote"
              color={colors.textMid}
              style={{ fontStyle: 'italic' }}
            >
              {`"${dayContent.quote_text}"`}
            </Text>
            {dayContent.quote_author ? (
              <Text
                variant="caption"
                color={colors.textLow}
                style={{ marginTop: spacing[1] }}
              >
                {`— ${dayContent.quote_author}`}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Video link */}
        {dayContent?.youtube_url ? (
          <View style={{ marginTop: spacing[6], paddingHorizontal: spacing.pagePad }}>
            <SectionLabel>WATCH</SectionLabel>
            <Pressable
              onPress={() => Linking.openURL(dayContent.youtube_url!)}
              accessibilityRole="link"
              accessibilityLabel={dayContent.must_watch_label ?? 'Watch video'}
            >
              <Card style={{ marginTop: spacing[3] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                  <View
                    style={{
                      width: spacing[10],
                      height: spacing[10],
                      borderRadius: spacing[2],
                      backgroundColor: phaseColor + '1A',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="play-circle" size={28} color={phaseColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="base" color={colors.textHi}>
                      {dayContent.must_watch_label ?? 'Watch video'}
                    </Text>
                    <Text variant="caption" color={colors.textMid} style={{ marginTop: spacing[1] }}>
                      Tap to open
                    </Text>
                  </View>
                  <Ionicons name="open-outline" size={18} color={colors.textLow} />
                </View>
              </Card>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {/* Fixed bottom — NEVER inside ScrollView */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        pointerEvents="box-none"
      >
        <LinearGradient
          colors={['transparent', colors.abyss]}
          style={{ height: HOLD_PANEL_HEIGHT }}
          pointerEvents="none"
        />
        <View
          style={{
            backgroundColor: colors.abyss,
            paddingHorizontal: spacing.pagePad,
            paddingBottom: spacing[10],
          }}
        >
          {isCompleted ? (
            <Button variant="completed" phaseColor={phaseColor}>
              Day {currentDay} Complete
            </Button>
          ) : (
            <HoldButton
              phaseColor={phaseColor}
              holdMs={1000}
              onComplete={handleComplete}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  )
}
