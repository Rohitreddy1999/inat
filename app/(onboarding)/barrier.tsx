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
  { value: 'b_burnout',  label: 'I go all-in, then burn out and stop.' },
  { value: 'b_scatter',  label: 'I jump to the next thing before I finish.' },
  { value: 'b_drift',    label: "It stops feeling worth it, so I drift away." },
  { value: 'b_notbuilt', label: "I decide I'm just not built for it." },
  { value: 'b_judged',   label: 'I stop the moment someone might see it.' },
  { value: 'b_nothing',  label: "Nothing stops me — I just haven't started yet." },
]

const MAX = 2

export default function Barrier() {
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
    setAnswer('barrier', selected)
    router.push('/(onboarding)/channel')
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
          When you start something and it doesn't stick, what happens?
        </Text>
      </View>

      <Text variant="caption" color={colors.textMid} style={styles.hint}>
        Pick up to two that sound like you.
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
