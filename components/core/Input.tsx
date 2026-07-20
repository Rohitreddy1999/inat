import React, { useEffect, useRef, useState } from 'react'
import {
  TextInput,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated'
import { colors, typography, fontFamilies, radius, spacing } from '@/theme'
import { Text } from './Text'

type Props = {
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  multiline?: boolean
  maxLength?: number
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  error?: string
  hint?: string
  style?: StyleProp<ViewStyle>
}

export function Input({
  placeholder,
  value,
  onChangeText,
  multiline = false,
  maxLength,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  hint,
  style,
}: Props) {
  const [focused, setFocused] = useState(false)
  const translateX = useSharedValue(0)
  const prevError = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (error && error !== prevError.current) {
      translateX.value = withSequence(
        withTiming(6,  { duration: 50,  reduceMotion: ReduceMotion.System }),
        withTiming(-6, { duration: 60,  reduceMotion: ReduceMotion.System }),
        withTiming(4,  { duration: 60,  reduceMotion: ReduceMotion.System }),
        withTiming(-4, { duration: 60,  reduceMotion: ReduceMotion.System }),
        withTiming(0,  { duration: 70,  reduceMotion: ReduceMotion.System }),
      )
    }
    prevError.current = error
  }, [error])

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const borderColor = error
    ? colors.error
    : focused
    ? colors.borderStrong
    : colors.borderCard

  const focusGlow = focused && !error
    ? {
        shadowColor: colors.iris,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
      }
    : {}

  return (
    <View style={style}>
      <Animated.View style={shakeStyle}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLow}
          multiline={multiline}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            { borderColor },
            focusGlow,
            multiline && styles.multiline,
          ]}
        />
      </Animated.View>

      {error ? (
        <Text
          variant="caption"
          color={colors.error}
          style={styles.message}
        >
          {error}
        </Text>
      ) : hint ? (
        <Text
          variant="caption"
          color={colors.textLow}
          style={styles.message}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing.inputPadV,
    minHeight: 52,
    color: colors.textHi,
    fontFamily: fontFamilies.regular,
    fontSize: typography.size.base,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  message: {
    marginTop: spacing.inputHint,
    marginLeft: spacing[1],
  },
})
