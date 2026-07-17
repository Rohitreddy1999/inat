import React from 'react'
import { Text, View, StyleProp, ViewStyle } from 'react-native'
import { colors, typography, fontFamilies } from '@/theme'

type Props = {
  children: string
  style?: StyleProp<ViewStyle>
}

export function SectionLabel({ children, style }: Props) {
  return (
    <View style={style}>
      <Text
        style={{
          fontSize: typography.size.micro,
          fontFamily: fontFamilies.semibold,
          letterSpacing: typography.tracking.wide * typography.size.micro,
          color: colors.textLow,
        }}
      >
        {children}
      </Text>
    </View>
  )
}
