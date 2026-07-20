import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Button } from '@/components/core/Button'
import { OptionCard } from '@/components/forms/OptionCard'
import { StepDots } from '@/components/forms/StepDots'
import { GhostNumber } from '@/components/shared/GhostNumber'
import { QuestionHeading } from '@/components/shared/QuestionHeading'
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
        <StepDots total={7} current={1} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={1} style={styles.ghost} />
        <QuestionHeading
          text="Where are you in life right now?"
          highlight="life"
          highlightColor={colors.volt}
          style={styles.heading}
        />
      </View>

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
    marginTop:  spacing[8],
  },
  headingWrap: {
    marginTop: spacing[10],
    position:  'relative',
  },
  ghost: {
    position: 'absolute',
    top:      -spacing[6],
    right:    -spacing[5],
  },
  heading: {
    zIndex: 1,
  },
  options: {
    marginTop: spacing[8],
    gap:       spacing[2] + spacing[1],
  },
  cta: {
    position: 'absolute',
    bottom:   spacing[10],
    left:     spacing.pagePad,
    right:    spacing.pagePad,
  },
})
