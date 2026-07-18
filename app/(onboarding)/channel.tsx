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
  { value: 'c_sound',  label: 'Playing music or making sounds.' },
  { value: 'c_visual', label: 'Drawing or making something to look at.' },
  { value: 'c_words',  label: 'Writing my thoughts down.' },
  { value: 'c_move',   label: 'Moving — walk, sport, gym, out of my head.' },
  { value: 'c_rest',   label: 'Switching off — rest, quiet, no task.' },
]

export default function Channel() {
  const [selected, setSelected] = useState<string | null>(null)
  const { setAnswer } = useOnboardingStore()

  function handleContinue() {
    if (!selected) return
    setAnswer('channel', [selected])
    router.push('/(onboarding)/identity')
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
          If you had a free hour and no pressure, which sounds fun?
        </Text>
      </View>

      <Text variant="caption" color={colors.textMid} style={styles.hint}>
        Pick one.
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
    gap: spacing[2],
  },
  cta: {
    marginTop: 'auto',
    paddingBottom: spacing[10],
  },
})
