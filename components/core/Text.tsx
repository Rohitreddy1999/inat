import React from 'react'
import { Text as RNText, TextStyle, StyleProp } from 'react-native'
import { colors, typography, fontFamilies } from '@/theme'

export type TextVariant =
  | 'display' | 'title' | 'heading' | 'quote'
  | 'base' | 'body' | 'step' | 'caption' | 'micro' | 'label'

type Props = {
  variant?: TextVariant
  color?: string
  align?: 'left' | 'center' | 'right'
  uppercase?: boolean
  style?: StyleProp<TextStyle>
  children: React.ReactNode
}

const variantStyles: Record<TextVariant, TextStyle> = {
  display: {
    fontSize: typography.size.display,
    fontFamily: fontFamilies.display,
    letterSpacing: typography.tracking.tight * typography.size.display,
    lineHeight: typography.size.display * typography.leading.tight,
  },
  title: {
    fontSize: typography.size.title,
    fontFamily: fontFamilies.heading,
    letterSpacing: typography.tracking.tight * typography.size.title,
    lineHeight: typography.size.title * typography.leading.tight,
  },
  heading: {
    fontSize: typography.size.heading,
    fontFamily: fontFamilies.heading,
    letterSpacing: typography.tracking.tight * typography.size.heading,
    lineHeight: typography.size.heading * typography.leading.heading,
  },
  quote: {
    fontSize: typography.size.quote,
    fontFamily: fontFamilies.medium,
  },
  base: {
    fontSize: typography.size.base,
    fontFamily: fontFamilies.regular,
  },
  body: {
    fontSize: typography.size.body,
    fontFamily: fontFamilies.regular,
    lineHeight: typography.size.body * typography.leading.body,
  },
  step: {
    fontSize: typography.size.step,
    fontFamily: fontFamilies.medium,
    lineHeight: typography.size.step * typography.leading.step,
  },
  caption: {
    fontSize: typography.size.caption,
    fontFamily: fontFamilies.regular,
  },
  micro: {
    fontSize: typography.size.micro,
    fontFamily: fontFamilies.medium,
    letterSpacing: typography.tracking.label * typography.size.micro,
  },
  label: {
    fontSize: typography.size.label,
    fontFamily: fontFamilies.medium,
    letterSpacing: typography.tracking.label * typography.size.label,
  },
}

export function Text({
  variant = 'base',
  color = colors.textHi,
  align,
  uppercase,
  style,
  children,
}: Props) {
  return (
    <RNText
      style={[
        variantStyles[variant],
        { color },
        align ? { textAlign: align } : null,
        uppercase ? { textTransform: 'uppercase' } : null,
        style,
      ]}
    >
      {children}
    </RNText>
  )
}
