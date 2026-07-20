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
  { value: 'c_sound',  label: 'Playing music or making sounds.' },
  { value: 'c_visual', label: 'Drawing or making something to look at.' },
  { value: 'c_words',  label: 'Writing my thoughts down.' },
  { value: 'c_move',   label: 'Moving. Walk, sport, gym, out of my head.' },
  { value: 'c_rest',   label: 'Switching off. Rest, quiet, no task.' },
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
        <StepDots total={7} current={4} style={styles.dots} />
        <View style={styles.spacer} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={3} style={styles.ghost} />
        <QuestionHeading
          text="If you had a free hour and no pressure, what sounds fun?"
          highlight="fun"
          highlightColor={colors.volt}
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
