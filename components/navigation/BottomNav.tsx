import React from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing, typography, fontFamilies } from '@/theme'

type TabKey = 'home' | 'ascent' | 'community' | 'profile'

type Props = {
  active: TabKey
  phaseColor?: string
}

type TabDef = {
  key:          TabKey
  label:        string
  iconActive:   keyof typeof Ionicons.glyphMap
  iconInactive: keyof typeof Ionicons.glyphMap
  route:        string
}

const TABS: TabDef[] = [
  {
    key:          'home',
    label:        'Home',
    iconActive:   'home',
    iconInactive: 'home-outline',
    route:        '/(tabs)/',
  },
  {
    key:          'ascent',
    label:        'Ascent',
    iconActive:   'trending-up',
    iconInactive: 'trending-up',
    route:        '/(tabs)/ascent',
  },
  {
    key:          'community',
    label:        'Community',
    iconActive:   'people',
    iconInactive: 'people-outline',
    route:        '/(tabs)/community',
  },
  {
    key:          'profile',
    label:        'Profile',
    iconActive:   'person',
    iconInactive: 'person-outline',
    route:        '/(tabs)/profile',
  },
]

const SELECTION_SPRING = {
  stiffness:    400,
  damping:      20,
  reduceMotion: ReduceMotion.System,
}

function Tab({
  def,
  isActive,
  phaseColor,
  onPress,
}: {
  def:        TabDef
  isActive:   boolean
  phaseColor: string
  onPress:    () => void
}) {
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  function handlePress() {
    scale.value = withSequence(
      withTiming(0.85, { duration: 60, reduceMotion: ReduceMotion.System }),
      withSpring(1, SELECTION_SPRING),
    )
    onPress()
  }

  const iconColor  = isActive ? phaseColor : colors.textLow
  const labelColor = isActive ? phaseColor : colors.textLow
  const iconName   = isActive ? def.iconActive : def.iconInactive

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={{ color: phaseColor + '33', borderless: false, radius: 40 }}
      accessibilityRole="tab"
      accessibilityLabel={`${def.label} tab`}
      accessibilityState={{ selected: isActive }}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
        <Text style={[styles.label, { color: labelColor }]}>
          {def.label}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

export function BottomNav({ active, phaseColor = colors.iris }: Props) {
  const router    = useRouter()
  const insets    = useSafeAreaInsets()
  const navHeight = spacing.navHeight + insets.bottom

  function handlePress(tab: TabDef) {
    router.replace(tab.route as Parameters<typeof router.replace>[0])
  }

  const content = (
    <View
      accessibilityRole="tablist"
      style={[styles.row, { paddingBottom: insets.bottom }]}
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.key}
          def={tab}
          isActive={active === tab.key}
          phaseColor={phaseColor}
          onPress={() => handlePress(tab)}
        />
      ))}
    </View>
  )

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={20}
        tint="dark"
        style={[styles.container, { height: navHeight }]}
      >
        <View style={styles.border} />
        {content}
      </BlurView>
    )
  }

  return (
    <View style={[styles.container, styles.androidBg, { height: navHeight }]}>
      <View style={styles.border} />
      {content}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom:   0,
    left:     0,
    right:    0,
    overflow: 'hidden',
  },
  androidBg: {
    backgroundColor: colors.bgNav,
  },
  border: {
    height:          1,
    backgroundColor: colors.borderSoft,
  },
  row: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'flex-start',
    paddingTop:    spacing[3],
  },
  tab: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'flex-start',
  },
  tabInner: {
    alignItems: 'center',
    gap:        spacing[1],
  },
  label: {
    fontSize:      typography.size.label,
    fontFamily:    fontFamilies.medium,
    letterSpacing: typography.tracking.label,
  },
})
