import React from 'react'
import { Pressable, StyleProp, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '@/theme'

type Props = {
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export function BackButton({ onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        {
          width:          spacing.touchMin,
          height:         spacing.touchMin,
          alignItems:     'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Ionicons
        name="chevron-back"
        size={26}
        color={colors.textMid}
      />
    </Pressable>
  )
}
