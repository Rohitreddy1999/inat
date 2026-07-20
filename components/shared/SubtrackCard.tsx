import React from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ReduceMotion,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/core/Text'
import { Badge } from '@/components/core/Badge'
import { colors, radius, spacing } from '@/theme'

type Props = {
  name: string
  isLive: boolean
  isFree: boolean
  isSelected: boolean
  onPress: () => void
}

const SPRING = { stiffness: 400, damping: 20, reduceMotion: ReduceMotion.System }

export function SubtrackCard({ name, isLive, isFree, isSelected, onPress }: Props) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const isNotLive   = !isLive
  const isLocked    = isLive && !isFree
  const isPressable = isLive

  const cardBg     = isSelected ? colors.selectedBg : colors.fathom
  const cardBorder = isSelected ? colors.borderElectric : colors.borderCard
  const textColor  = isNotLive ? colors.textLow : colors.textHi

  const inner = (
    <View
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: cardBorder,
        borderRadius: radius.card,
        padding: spacing[5],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: isNotLive ? 0.4 : 1,
      }}
    >
      <Text variant="base" color={textColor}>
        {name}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        {isLocked && (
          <Ionicons name="lock-closed-outline" size={16} color={colors.textLow} />
        )}
        {isLocked && <Badge variant="pro">PRO</Badge>}
        {isNotLive && <Badge variant="comingSoon">COMING SOON</Badge>}
      </View>
    </View>
  )

  const a11yLabel = isNotLive
    ? `${name}, coming soon`
    : isLocked
      ? `${name}, Pro feature`
      : name

  if (!isPressable) {
    return (
      <Animated.View
        accessible
        accessibilityState={{ disabled: true }}
        accessibilityLabel={a11yLabel}
      >
        {inner}
      </Animated.View>
    )
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.985, SPRING) }}
        onPressOut={() => { scale.value = withSpring(1, SPRING) }}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={a11yLabel}
      >
        {inner}
      </Pressable>
    </Animated.View>
  )
}
