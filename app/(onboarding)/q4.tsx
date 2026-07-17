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
    value: 'lose_thread',
    label: 'I start strong then lose the thread after a few days.',
  },
  {
    value: 'no_beginning',
    label: "I don't know where to begin so I don't begin.",
  },
  {
    value: 'wrong_thing',
    label: "I pick the wrong thing and quit when it doesn't feel right.",
  },
  {
    value: 'life_interrupts',
    label: 'Life interrupts and I never restart after.',
  },
  {
    value: 'afraid',
    label: "I'm afraid of finding out I can't stick to anything.",
  },
]

const MAX = 2

export default function Q4() {
  const [selected, setSelected] = useState<string[]>([])
  const { setAnswer } = useOnboardingStore()

  function toggle(value: string) {
    setSelected((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value)
      if (prev.length >= MAX) return prev
      return [...prev, value]
    })
  }

  function handleContinue() {
    setAnswer('q4', selected)
    router.push('/(onboarding)/q5')
  }

  return (
    <ScreenWrapper padded>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <StepDots total={6} current={4} style={styles.dots} />
        <View style={styles.spacer} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={3} style={StyleSheet.absoluteFillObject} />
        <Text variant="heading" color={colors.textHi} style={styles.heading}>
          What actually stops you — be honest.
        </Text>
      </View>

      <Text variant="caption" color={colors.textMid} style={styles.hint}>
        Pick up to 2.
      </Text>

      <View style={styles.options}>
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={selected.includes(opt.value)}
            disabled={!selected.includes(opt.value) && selected.length >= MAX}
            onPress={() => toggle(opt.value)}
          />
        ))}
      </View>

      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={handleContinue}
          disabled={selected.length === 0}
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
    gap: spacing[2],
  },
  cta: {
    marginTop: 'auto',
    paddingBottom: spacing[10],
  },
})
