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
import { QuestionHeading } from '@/components/shared/QuestionHeading'
import { useOnboardingStore } from '@/stores/onboarding.store'

const OPTIONS = [
  { value: 'p_recent',       label: 'Not long ago. I still notice small things.' },
  { value: 'p_blur',         label: 'Not often. My days all feel the same.' },
  { value: 'p_inside',       label: 'I feel things but I keep them inside.' },
  { value: 'p_cantremember', label: "I can't remember. I'm just getting through." },
]

export default function Presence() {
  const [selected, setSelected] = useState<string | null>(null)
  const { setAnswer } = useOnboardingStore()

  function handleContinue() {
    if (!selected) return
    setAnswer('presence', [selected])
    router.push('/(onboarding)/q6')
  }

  return (
    <ScreenWrapper padded>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <StepDots total={7} current={6} style={styles.dots} />
        <View style={styles.spacer} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={5} style={styles.ghost} />
        <QuestionHeading
          text="When did you last notice something good in an ordinary day?"
          highlight="good"
          highlightColor={colors.plasma}
          style={styles.heading}
        />
      </View>

      <Text variant="caption" color={colors.textLow} style={styles.hint}>
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
  hint: {
    marginTop: spacing[2],
  },
  options: {
    marginTop: spacing[6],
    gap:       spacing[2] + spacing[1],
  },
  cta: {
    position: 'absolute',
    bottom:   spacing[10],
    left:     spacing.pagePad,
    right:    spacing.pagePad,
  },
})
