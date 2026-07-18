import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { StepDots } from '@/components/forms/StepDots'
import { GhostNumber } from '@/components/shared/GhostNumber'
import { BackButton } from '@/components/navigation/BackButton'
import { useOnboardingStore } from '@/stores/onboarding.store'

export default function Q6() {
  const [text, setText] = useState('')
  const { setOpenAnswer, runMatch } = useOnboardingStore()

  function handleContinue() {
    setOpenAnswer(text)
    runMatch()
    router.push('/(onboarding)/match')
  }

  return (
    <ScreenWrapper padded scrollable>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <StepDots total={6} current={6} style={styles.dots} />
        <View style={styles.spacer} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={5} style={StyleSheet.absoluteFillObject} />
        <Text variant="heading" color={colors.textHi} style={styles.heading}>
          What's the one thing you keep saying you'll start — when life calms
          down, when you're ready, when the time is right?
        </Text>
      </View>

      <Input
        placeholder="The thing you've been putting off the longest..."
        value={text}
        onChangeText={setText}
        multiline
        maxLength={500}
        style={styles.input}
      />

      <Text variant="caption" color={colors.textLow} style={styles.hint}>
        Nobody else sees this. Just be honest.
      </Text>

      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={handleContinue}
        >
          Show my match →
        </Button>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  dots: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: spacing.touchMin,
  },
  headingWrap: {
    marginTop: spacing.touchMin,
    position: 'relative',
  },
  heading: {
    zIndex: 1,
  },
  input: {
    marginTop: spacing[8],
  },
  hint: {
    marginTop: spacing[2],
  },
  cta: {
    marginTop: spacing[8],
    paddingBottom: spacing[10],
  },
})
