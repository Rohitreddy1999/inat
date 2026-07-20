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
  { value: 'i_discipline', label: "I've never been a disciplined person." },
  { value: 'i_creative',   label: "I'm just not the creative type." },
  { value: 'i_opinions',   label: 'I care too much what people think.' },
  { value: 'i_lostwant',   label: "I've lost touch with what I want." },
  { value: 'i_inhead',     label: "I live in my head. I've left my body behind." },
  { value: 'i_capable',    label: "I know I can do more. I just haven't shown it yet." },
]

const MAX = 2

export default function Identity() {
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
    setAnswer('identity', selected)
    router.push('/(onboarding)/presence')
  }

  return (
    <ScreenWrapper padded>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <StepDots total={7} current={5} style={styles.dots} />
        <View style={styles.spacer} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={4} style={styles.ghost} />
        <QuestionHeading
          text="There's a story behind why you are the way you are. Which one is yours?"
          highlight="story"
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
    flex:       1,
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
