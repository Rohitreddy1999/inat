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
import { colors, radius, spacing, effects } from '@/theme'

type Props = {
  name: string
  tagline: string
  iconName: React.ComponentProps<typeof Ionicons>['name']
  isRecommended: boolean
  isSecondary?: boolean
  isSelected: boolean
  onPress: () => void
}

const SPRING = { stiffness: 400, damping: 20, reduceMotion: ReduceMotion.System }

export function TrackCard({
  name,
  tagline,
  iconName,
  isRecommended,
  isSecondary = false,
  isSelected,
  onPress,
}: Props) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.985, SPRING) }}
        onPressOut={() => { scale.value = withSpring(1, SPRING) }}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${name}, ${tagline}`}
        style={[
          {
            backgroundColor: isSelected ? colors.selectedBg : colors.fathom,
            borderWidth: 1,
            borderColor: isSelected ? colors.borderIris : colors.borderCard,
            borderRadius: radius.card,
            padding: spacing[5],
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[3],
          },
          isRecommended ? effects.glowVolt : undefined,
        ]}
      >
        {/* Icon container */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.md,
            backgroundColor: isSelected ? colors.voltTint : colors.bgRaise,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={iconName}
            size={28}
            color={isSelected ? colors.iris : colors.textMid}
          />
        </View>

        {/* Name + tagline */}
        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text variant="base" color={colors.textHi} style={{ fontWeight: '700' }}>
            {name}
          </Text>
          <Text variant="caption" color={colors.textMid}>
            {tagline}
          </Text>
        </View>

        {/* Recommended / secondary badges */}
        {isRecommended && <Badge variant="recommended">RECOMMENDED</Badge>}
        {isSecondary && !isRecommended && (
          <Badge variant="phase" color={colors.iris}>ALSO YOU</Badge>
        )}
      </Pressable>
    </Animated.View>
  )
}
