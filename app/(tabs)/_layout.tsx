import { Tabs, usePathname, useRouter } from 'expo-router'
import { View, Pressable } from 'react-native'
import { BottomNav } from '@/components/navigation/BottomNav'
import { Text } from '@/components/core/Text'
import { colors, getPhaseColor, spacing, radius } from '@/theme'
import { useJourneyStore } from '@/stores/journey.store'

type ActiveTab = 'home' | 'ascent' | 'community' | 'profile'

function getActiveTab(pathname: string): ActiveTab {
  if (pathname.includes('/ascent'))    return 'ascent'
  if (pathname.includes('/community')) return 'community'
  if (pathname.includes('/profile'))   return 'profile'
  return 'home'
}

export default function TabsLayout() {
  const pathname   = usePathname()
  const router     = useRouter()
  const active     = getActiveTab(pathname)
  const currentDay = useJourneyStore((s) => s.currentDay)
  const phaseColor = currentDay > 0 ? getPhaseColor(currentDay) : colors.iris

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPage }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index"     options={{ title: 'Home' }} />
        <Tabs.Screen name="ascent"    options={{ title: 'Ascent' }} />
        <Tabs.Screen name="community" options={{ title: 'Community' }} />
        <Tabs.Screen name="profile"   options={{ title: 'Profile' }} />
      </Tabs>

      <BottomNav active={active} phaseColor={phaseColor} />

      {__DEV__ && (
        <Pressable
          onPress={() => router.push('/dev-menu')}
          style={{
            position:        'absolute',
            top:             spacing[10] + spacing[2],
            left:            spacing[3],
            backgroundColor: colors.iris + '88',
            borderRadius:    radius.pill,
            paddingHorizontal: spacing[3],
            paddingVertical:   spacing[1],
            zIndex:          9999,
          }}
        >
          <Text variant="label" color={colors.textHi} uppercase>DEV</Text>
        </Pressable>
      )}
    </View>
  )
}
