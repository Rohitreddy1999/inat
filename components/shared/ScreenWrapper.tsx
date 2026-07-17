import React, { useEffect } from 'react'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated'
import { colors, spacing } from '@/theme'

type Props = {
  children: React.ReactNode
  padded?: boolean
  scrollable?: boolean
  style?: StyleProp<ViewStyle>
}

export function ScreenWrapper({ children, padded, scrollable, style }: Props) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, reduceMotion: ReduceMotion.System })
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const content = scrollable ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          padded ? { paddingHorizontal: spacing.pagePad } : undefined,
          style,
        ]}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <View
      style={[
        { flex: 1 },
        padded ? { paddingHorizontal: spacing.pagePad } : undefined,
        style,
      ]}
    >
      {children}
    </View>
  )

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: colors.abyss }, animatedStyle]}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        {content}
      </SafeAreaView>
    </Animated.View>
  )
}
