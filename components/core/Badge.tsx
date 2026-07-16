import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, typography, fontFamilies } from '@/theme'
import { Text } from './Text'

export type BadgeVariant = 'streak' | 'phase' | 'recommended' | 'comingSoon' | 'pro'

type Props = {
  variant: BadgeVariant
  color?: string
  children: React.ReactNode
}

export function Badge({ variant, color = colors.phase.build, children }: Props) {
  switch (variant) {
    case 'streak':
      return (
        <View style={styles.streakOuter}>
          <View style={[styles.streakDiamond, { backgroundColor: color }]}>
            <View style={styles.streakInner}>
              <Text
                variant="label"
                color={colors.textHi}
                style={styles.streakText}
              >
                {children}
              </Text>
            </View>
          </View>
        </View>
      )

    case 'phase':
      return (
        <View style={[styles.pill, { borderColor: color }]}>
          <Text
            variant="label"
            color={color}
            uppercase
            style={styles.pillText}
          >
            {children}
          </Text>
        </View>
      )

    case 'recommended':
      return (
        <View style={[styles.pill, { backgroundColor: colors.surge, borderColor: colors.surge }]}>
          <Text
            variant="label"
            color={colors.abyss}
            uppercase
            style={[styles.pillText, styles.boldText]}
          >
            RECOMMENDED
          </Text>
        </View>
      )

    case 'comingSoon':
      return (
        <View style={[styles.pill, { borderColor: colors.borderSoft }]}>
          <Text
            variant="label"
            color={colors.textLow}
            uppercase
            style={styles.pillText}
          >
            COMING SOON
          </Text>
        </View>
      )

    case 'pro':
      return (
        <View style={[styles.pill, styles.pillSmall, { backgroundColor: colors.plasma, borderColor: colors.plasma }]}>
          <Text
            variant="label"
            color={colors.abyss}
            uppercase
            style={[styles.pillText, styles.boldText]}
          >
            PRO
          </Text>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  streakOuter: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDiamond: {
    width: 22,
    height: 22,
    borderRadius: 5,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakInner: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.size.badge,
    lineHeight: 11,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  pillSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pillText: {
    fontSize: typography.size.label,
    lineHeight: 14,
  },
  boldText: {
    fontFamily: fontFamilies.bold,
  },
})
