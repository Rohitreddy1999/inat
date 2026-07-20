import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { OptionCard } from '@/components/forms/OptionCard'
import { StepDots } from '@/components/forms/StepDots'
import { useOnboardingStore } from '@/stores/onboarding.store'

const OPTIONS = [
  { label: 'Still studying',       value: 'still_studying' },
  { label: 'Building my career',   value: 'building_career' },
  { label: 'Juggling family life', value: 'juggling_family' },
  { label: 'Reinventing myself',   value: 'reinventing' },
]

export default function LifeStage() {
  const [selected, setSelected] = useState<string | null>(null)
  const { setLifeStage } = useOnboardingStore()

  function handleContinue() {
    if (!selected) return
    setLifeStage(selected)
    router.push('/(onboarding)/bridge')
  }

  return (
    <ScreenWrapper padded>
      <View style={styles.dotsRow}>
        <StepDots total={6} current={1} />
      </View>

      <Text
        variant="heading"
        color={colors.textHi}
        style={styles.heading}
      >
        Where are you in life right now?
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
  dotsRow: {
    alignItems: 'center',
    marginTop: spacing[2],
  },
  heading: {
    marginTop: spacing[8],
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
