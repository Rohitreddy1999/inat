import { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { BackButton } from '@/components/navigation/BackButton'
import { TrackCard } from '@/components/shared/TrackCard'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { getAllTracks } from '@/services/curriculum.service'
import { Track } from '@/types'
import { TrackName } from '@/utils/inat-brain'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const TRACK_ONELINERS: Record<string, string> = {
  Move:    'Your body knows before your brain does. Start there.',
  Rhythm:  "You don't need an instrument. Just 21 days and one ear.",
  Express: "You've been seeing it for years. Now put it on paper.",
  Calm:    "Not less. Just quieter. So you can finally hear yourself.",
  Mindful: "You already know what's good. Learn to feel it again.",
}

type ConfidenceCopy = {
  label: string
  heading: string
  subtext: string
}

function getConfidenceCopy(
  confidence: 'high' | 'medium' | 'low' | null,
  healthMode: boolean,
): ConfidenceCopy {
  if (!confidence) {
    return {
      label:   'YOUR MATCH',
      heading: "Here's what we think —\nbut you know yourself best.",
      subtext: "We've highlighted what resonated most from your answers. Choose whatever calls to you.",
    }
  }

  if (confidence === 'high') {
    return {
      label:   'YOUR MATCH',
      heading: healthMode
        ? "You're ready to build something."
        : 'This is clearly you.',
      subtext: 'Your answers pointed here consistently. Trust it.',
    }
  }

  if (confidence === 'medium') {
    return {
      label:   'YOUR MATCH',
      heading: healthMode ? "You're ready to build something." : 'We think it\'s this.',
      subtext: "Here's what we saw in your answers.",
    }
  }

  // low
  return {
    label:   'CLOSE CALL',
    heading: "It's between these two.",
    subtext: "Both fit. Here's how to tell which one is right for you.",
  }
}

export default function Match() {
  const [tracks, setTracks] = useState<Track[]>([])

  const { selectedTrack, setSelectedTrack, matchResult } = useOnboardingStore()

  useEffect(() => {
    getAllTracks().then(({ tracks: t }) => setTracks(t))
  }, [])

  // Auto-select the engine's recommendation once tracks are loaded (quiz path only)
  useEffect(() => {
    if (matchResult.primary && !selectedTrack && tracks.length > 0) {
      setSelectedTrack(matchResult.primary)
    }
  }, [matchResult.primary, selectedTrack, tracks])

  const copy = getConfidenceCopy(matchResult.confidence, matchResult.healthMode)

  const reasons = matchResult.reasons

  return (
    <ScreenWrapper padded scrollable>
      <BackButton onPress={() => router.back()} />

      <Text
        variant="micro"
        color={colors.textLow}
        uppercase
        style={styles.label}
      >
        {copy.label}
      </Text>

      <Text variant="title" color={colors.textHi} style={styles.heading}>
        {copy.heading}
      </Text>

      <Text variant="body" color={colors.textMid} style={styles.subtext}>
        {copy.subtext}
      </Text>

      {reasons.length > 0 && (
        <View style={styles.reasons}>
          <Text variant="caption" color={colors.textMid}>
            {`Because: ${reasons[0].text}`}
          </Text>
          {reasons[1] && (
            <Text variant="caption" color={colors.textMid} style={styles.reason2}>
              {`And: ${reasons[1].text}`}
            </Text>
          )}
        </View>
      )}

      <View style={styles.list}>
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            name={track.name}
            tagline={TRACK_ONELINERS[track.name] ?? track.tagline}
            iconName={(track.icon_name ?? 'ellipse-outline') as IoniconsName}
            isRecommended={track.name === matchResult.primary}
            isSecondary={
              matchResult.confidence === 'low' &&
              track.name === matchResult.secondary
            }
            isSelected={track.name === selectedTrack}
            onPress={() => setSelectedTrack(track.name as TrackName)}
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
  reasons: {
    marginTop: spacing[4],
  },
  reason2: {
    marginTop: spacing[1],
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
