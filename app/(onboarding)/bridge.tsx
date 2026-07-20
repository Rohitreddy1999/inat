import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing, radius } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Card } from '@/components/core/Card'
import { Badge } from '@/components/core/Badge'
import { BackButton } from '@/components/navigation/BackButton'

export default function Bridge() {
  return (
    <ScreenWrapper padded>
      <BackButton onPress={() => router.back()} />

      <Text variant="heading" color={colors.textHi} style={styles.heading}>
        How would you like to find your track?
      </Text>

      <View style={styles.options}>
        {/* Option 1 — Quiz path */}
        <Card
          onPress={() => router.push('/(onboarding)/energy')}
          style={styles.card}
        >
          <View style={styles.badgeRow}>
            <Badge variant="recommended">RECOMMENDED</Badge>
          </View>
          <Text variant="base" color={colors.textHi} style={styles.cardTitle}>
            Answer a few questions
          </Text>
          <Text variant="body" color={colors.textMid} style={styles.cardBody}>
            We use your answers to suggest the perfect track for you.
          </Text>
          <Text variant="caption" color={colors.iris} style={styles.cardCaption}>
            Takes less than 2 minutes
          </Text>
        </Card>

        {/* Option 2 — Direct path */}
        <Card
          onPress={() => router.push('/(onboarding)/match')}
          style={styles.card}
        >
          <Text variant="base" color={colors.textHi} style={styles.cardTitle}>
            I know what I want
          </Text>
          <Text variant="body" color={colors.textMid} style={styles.cardBody}>
            Browse all tracks and choose what calls to you directly.
          </Text>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text variant="caption" color={colors.textLow} align="center">
          You can always retake the questions later from settings.
        </Text>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  heading: {
    marginTop: spacing[10] + spacing[2],
  },
  options: {
    marginTop: spacing[8],
    gap: spacing[3],
  },
  card: {
    padding: spacing[5],
    borderRadius: radius.card,
  },
  badgeRow: {
    marginBottom: spacing[3],
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontWeight: '700',
  },
  cardBody: {
    marginTop: spacing[2],
  },
  cardCaption: {
    marginTop: spacing[2],
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing[10],
  },
})
