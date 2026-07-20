import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Button } from '@/components/core/Button'
import { OptionCard } from '@/components/forms/OptionCard'
import { StepDots } from '@/components/forms/StepDots'
import { GhostNumber } from '@/components/shared/GhostNumber'
import { BackButton } from '@/components/navigation/BackButton'
import { QuestionHeading } from '@/components/shared/QuestionHeading'
import { useOnboardingStore } from '@/stores/onboarding.store'

const OPTIONS = [
  { value: 'e_empty',    label: "I've got nothing left." },
  { value: 'e_restless', label: 'Restless. Energy but nowhere to put it.' },
  { value: 'e_motions',  label: 'Just going through the motions.' },
  { value: 'e_mindrace', label: "My mind won't slow down." },
  { value: 'e_steady',   label: "Steady. I've got energy and want to use it." },
]

const MAX = 2

export default function Energy() {
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
    setAnswer('energy', selected)
    router.push('/(onboarding)/barrier')
  }

  return (
    <ScreenWrapper padded>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <StepDots total={7} current={2} style={styles.dots} />
        <View style={styles.spacer} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={1} style={styles.ghost} />
        <QuestionHeading
          text="How's your energy right now?"
          highlight="energy"
          highlightColor={colors.iris}
          style={styles.heading}
        />
      </View>

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
    alignItems:   'center',
    marginTop:    spacing[2],
  },
  dots: {
    flex:        1,
    alignItems: 'center',
  },
  spacer: {
    width: spacing.touchMin,
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
