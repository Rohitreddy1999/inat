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
import { colors } from '@/theme'

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

const INACTIVE_COLOR = colors.arcLight + '40'  // 25% opacity

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

  const iconColor = isActive ? phaseColor : INACTIVE_COLOR
  const iconName  = isActive ? def.iconActive : def.iconInactive

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
        <Ionicons name={iconName} size={22} color={iconColor} />
        <Text style={[styles.label, { color: iconColor }]}>
          {def.label}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

export function BottomNav({ active, phaseColor = colors.iris }: Props) {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // Position pill above safe area, minimum 24px from bottom
  const bottomPos = Math.max(24, insets.bottom + 8)

  function handlePress(tab: TabDef) {
    router.replace(tab.route as Parameters<typeof router.replace>[0])
  }

  const row = (
    <View
      accessibilityRole="tablist"
      style={styles.row}
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
        intensity={24}
        tint="dark"
        style={[styles.pill, { bottom: bottomPos }]}
      >
        <View style={styles.pillBorder}>
          {row}
        </View>
      </BlurView>
    )
  }

  return (
    <View style={[styles.pill, styles.pillAndroid, { bottom: bottomPos }]}>
      <View style={styles.pillBorder}>
        {row}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    position:     'absolute',
    left:         20,
    right:        20,
    height:       64,
    borderRadius: 32,
    overflow:     'hidden',
  },
  pillAndroid: {
    backgroundColor: 'rgba(15,20,26,0.60)',
  },
  // Inner view carries the visible border (BlurView can't have borderWidth reliably)
  pillBorder: {
    flex:            1,
    borderRadius:    32,
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.07)',
  },
  row: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    paddingTop:    4,
  },
  tab: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabInner: {
    alignItems: 'center',
    gap:        3,
  },
  label: {
    fontFamily:    'DMSans-Medium',
    fontSize:      10,
    letterSpacing: 0.5,
  },
})
