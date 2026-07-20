import React from 'react'
import { Text, StyleProp, TextStyle } from 'react-native'
import { colors, typography, fontFamilies } from '@/theme'

type Props = {
  text: string
  highlight: string
  highlightColor: string
  style?: StyleProp<TextStyle>
}

export function QuestionHeading({ text, highlight, highlightColor, style }: Props) {
  const idx = text.indexOf(highlight)

  if (idx === -1) {
    return (
      <Text style={[baseStyle, style]}>
        {text}
      </Text>
    )
  }

  const before = text.slice(0, idx)
  const after  = text.slice(idx + highlight.length)

  return (
    <Text style={[baseStyle, style]}>
      {before !== '' && (
        <Text style={{ color: colors.textHi }}>{before}</Text>
      )}
      <Text style={{ color: highlightColor }}>{highlight}</Text>
      {after !== '' && (
        <Text style={{ color: colors.textHi }}>{after}</Text>
      )}
    </Text>
  )
}

const baseStyle: TextStyle = {
  fontFamily:  fontFamilies.heading,
  fontSize:    typography.size.question,
  lineHeight:  typography.size.question * 1.15,
  color:       colors.textHi,
}
