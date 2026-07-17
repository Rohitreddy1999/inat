import { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { TrackCard } from '@/components/shared/TrackCard'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { getAllTracks } from '@/services/curriculum.service'
import { Track } from '@/types'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

// Hardcoded UI copy — not stored in DB
const TRACK_ONELINERS: Record<string, string> = {
  move:    'Your body knows before your brain does. Start there.',
  rhythm:  "You don't need an instrument. Just 21 days and one ear.",
  express: "You've been seeing it for years. Now put it on paper.",
  calm:    "Not less. Just quieter. So you can finally hear yourself.",
  mindful: "You already know what's good. Learn to feel it again.",
}

export default function Match() {
  const [tracks, setTracks] = useState<Track[]>([])

  const { selectedTrack, setSelectedTrack, getRecommendedTrack } = useOnboardingStore()
  const recommendedTrack = getRecommendedTrack()

  useEffect(() => {
    getAllTracks().then(({ tracks: t }) => setTracks(t))
  }, [])

  // Auto-select recommended if nothing selected yet
  useEffect(() => {
    if (recommendedTrack && !selectedTrack) {
      setSelectedTrack(recommendedTrack)
    }
  }, [recommendedTrack])

  return (
    <ScreenWrapper padded scrollable>
      <Text
        variant="micro"
        color={colors.textLow}
        uppercase
        style={styles.label}
      >
        YOUR MATCH
      </Text>

      <Text variant="title" color={colors.textHi} style={styles.heading}>
        Here's what we think —{'\n'}but you know yourself best.
      </Text>

      <Text variant="body" color={colors.textMid} style={styles.subtext}>
        We've highlighted what resonated most from your answers. Choose
        whatever calls to you.
      </Text>

      <View style={styles.list}>
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            name={track.name}
            tagline={TRACK_ONELINERS[track.slug] ?? track.tagline}
            iconName={(track.icon_name ?? 'ellipse-outline') as IoniconsName}
            isRecommended={track.slug === recommendedTrack}
            isSelected={track.slug === selectedTrack}
            onPress={() => setSelectedTrack(track.slug)}
          />
        ))}
      </View>

      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={() => router.push('/(onboarding)/focus')}
          disabled={!selectedTrack}
        >
          Start this track →
        </Button>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  label: {
    marginTop: spacing[8],
    letterSpacing: 1.5,
  },
  heading: {
    marginTop: spacing[2],
  },
  subtext: {
    marginTop: spacing[2],
  },
  list: {
    marginTop: spacing[8],
    gap: spacing[3],
  },
  cta: {
    marginTop: spacing[8],
    paddingBottom: spacing[10],
  },
})
