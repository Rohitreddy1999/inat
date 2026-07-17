import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { OptionCard } from '@/components/forms/OptionCard'
import { StepDots } from '@/components/forms/StepDots'
import { GhostNumber } from '@/components/shared/GhostNumber'
import { BackButton } from '@/components/navigation/BackButton'
import { useOnboardingStore } from '@/stores/onboarding.store'

const OPTIONS = [
  {
    value: 'fumes',
    label: "Running on fumes. I'm more tired than I let on.",
  },
  {
    value: 'restless',
    label: 'Restless. I have energy but nowhere to put it.',
  },
  {
    value: 'numb',
    label: 'Numb. Not low, not high. Just flat.',
  },
  {
    value: 'anxious',
    label: "Anxious. My mind doesn't stop even when my body does.",
  },
  {
    value: 'okay',
    label: 'Actually okay. I just want to build something real.',
  },
]

export default function Q3() {
  const [selected, setSelected] = useState<string | null>(null)
  const { setAnswer } = useOnboardingStore()

  function handleContinue() {
    if (!selected) return
    setAnswer('q3', [selected])
    router.push('/(onboarding)/q4')
  }

  return (
    <ScreenWrapper padded>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <StepDots total={6} current={3} style={styles.dots} />
        <View style={styles.spacer} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={2} style={StyleSheet.absoluteFillObject} />
        <Text variant="heading" color={colors.textHi} style={styles.heading}>
          Honestly — where are you running on right now?
        </Text>
      </View>

      <Text variant="caption" color={colors.textMid} style={styles.hint}>
        Pick one. The honest one.
      </Text>

      <View style={styles.options}>
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onPress={() => setSelected(opt.value)}
          />
        ))}
      </View>

      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={handleContinue}
          disabled={!selected}
        >
          Continue
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
  hint: {
    marginTop: spacing[2],
  },
  options: {
    marginTop: spacing[8],
    gap: 9,
  },
  cta: {
    marginTop: 'auto',
    paddingBottom: spacing[10],
  },
})
