import { useEffect, useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import { SubtrackCard } from '@/components/shared/SubtrackCard'
import { BackButton } from '@/components/navigation/BackButton'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useJourneyStore } from '@/stores/journey.store'
import { getSession } from '@/services/auth.service'
import { saveOnboardingAnswers } from '@/services/profile.service'
import { createJourney } from '@/services/journey.service'
import { getSubtracksByTrack } from '@/services/curriculum.service'
import { Subtrack } from '@/types'

export default function Focus() {
  const [subtracks, setSubtracks] = useState<Subtrack[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    selectedTrack,
    selectedTrackId,
    selectedTrackName,
    selectedSubtractId,
    setSelectedSubtractId,
    lifeStage,
    answers,
    scores,
    openAnswer,
    getRecommendedTrack,
    clear,
  } = useOnboardingStore()

  const hydrate = useJourneyStore((s) => s.hydrate)

  useEffect(() => {
    if (!selectedTrackId) return
    getSubtracksByTrack(selectedTrackId).then(({ subtracks: s }) => setSubtracks(s))
  }, [selectedTrackId])

  async function handleBegin() {
    if (!selectedSubtractId) return
    setIsLoading(true)

    const { session } = await getSession()
    if (!session?.user) {
      setIsLoading(false)
      router.replace('/(auth)/login')
      return
    }

    const userId = session.user.id
    const recommendedTrack = getRecommendedTrack() ?? ''

    // Save all onboarding answers to profile
    const { error: profileError } = await saveOnboardingAnswers(
      userId,
      lifeStage ?? '',
      { q2: answers['q2'], q3: answers['q3'], q4: answers['q4'], q5: answers['q5'], scores },
      openAnswer,
      recommendedTrack,
    )

    if (profileError) {
      setIsLoading(false)
      Alert.alert('Error', 'Could not save your answers. Please try again.')
      return
    }

    // Create the journey
    const { error: journeyError } = await createJourney(userId, selectedSubtractId)

    if (journeyError) {
      setIsLoading(false)
      Alert.alert('Error', 'Could not create your journey. Please try again.')
      return
    }

    // Hydrate journey store and clear onboarding state
    await hydrate(userId)
    clear()

    router.replace('/(tabs)/')
  }

  return (
    <ScreenWrapper padded scrollable>
      <BackButton onPress={() => router.back()} />

      {selectedTrackName ? (
        <View style={styles.pill}>
          <Badge variant="phase" color={colors.surge}>
            {selectedTrackName.toUpperCase()}
          </Badge>
        </View>
      ) : null}

      <Text variant="title" color={colors.textHi} style={styles.heading}>
        Pick your focus
      </Text>

      <Text variant="body" color={colors.textMid} style={styles.subtext}>
        Choose what you want to work on for the next 21 days.
      </Text>

      <View style={styles.list}>
        {subtracks.map((sub) => (
          <SubtrackCard
            key={sub.id}
            name={sub.name}
            isLive={sub.is_live}
            isFree={sub.is_free}
            isSelected={sub.id === selectedSubtractId}
            onPress={() => setSelectedSubtractId(sub.id)}
          />
        ))}
      </View>

      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={handleBegin}
          disabled={!selectedSubtractId}
          loading={isLoading}
        >
          Begin my 21 days →
        </Button>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  pill: {
    marginTop: spacing[8],
    alignSelf: 'flex-start',
  },
  heading: {
    marginTop: spacing[4],
  },
  subtext: {
    marginTop: spacing[2],
  },
  list: {
    marginTop: spacing[8],
    gap: spacing[3],
  },
  cta: {
    marginTop: 'auto',
    paddingBottom: spacing[10],
  },
})
