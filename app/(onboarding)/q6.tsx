import { useState } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing, radius, typography, fontFamilies } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { StepDots } from '@/components/forms/StepDots'
import { GhostNumber } from '@/components/shared/GhostNumber'
import { BackButton } from '@/components/navigation/BackButton'
import { QuestionHeading } from '@/components/shared/QuestionHeading'
import { useOnboardingStore } from '@/stores/onboarding.store'

export default function Q6() {
  const [text,    setText]    = useState('')
  const [focused, setFocused] = useState(false)
  const { setOpenAnswer, runMatch } = useOnboardingStore()

  function handleContinue() {
    setOpenAnswer(text)
    runMatch()
    router.push('/(onboarding)/match')
  }

  const borderColor = focused ? colors.borderIris : colors.borderCard
  const focusGlow   = focused
    ? {
        shadowColor:   colors.iris,
        shadowOffset:  { width: 0, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius:  12,
        elevation:     4,
      }
    : {}

  return (
    <ScreenWrapper padded scrollable>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <StepDots total={7} current={7} style={styles.dots} />
        <View style={styles.spacer} />
      </View>

      <View style={styles.headingWrap}>
        <GhostNumber number={6} style={styles.ghost} />
        <QuestionHeading
          text="What's the thing you keep saying you'll start when the time is right?"
          highlight="start"
          highlightColor={colors.volt}
          style={styles.heading}
        />
      </View>

      <TextInput
        value={text}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="The thing you've been putting off the longest..."
        placeholderTextColor={colors.textLow}
        multiline
        maxLength={500}
        textAlignVertical="top"
        style={[styles.inputWrap, { borderColor }, focusGlow]}
      />

      <Text variant="caption" color={colors.textLow} style={styles.hint}>
        Nobody else sees this. Just be honest.
      </Text>

      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={handleContinue}
          disabled={text.trim().length <= 3}
        >
          Show my match
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
  inputWrap: {
    marginTop:        spacing[8],
    backgroundColor:  colors.bgInput,
    borderWidth:      1,
    borderRadius:     radius.md,
    padding:          spacing[4],
    minHeight:        120,
    color:            colors.textHi,
    fontFamily:       fontFamilies.regular,
    fontSize:         typography.size.base,
    lineHeight:       typography.size.base * typography.leading.body,
  },
  hint: {
    marginTop: spacing[2],
  },
  cta: {
    marginTop:     spacing[8],
    paddingBottom: spacing[10],
  },
})
