import { Tabs, usePathname } from 'expo-router'
import { View } from 'react-native'
import { BottomNav } from '@/components/navigation/BottomNav'
import { colors } from '@/theme'

type ActiveTab = 'home' | 'ascent' | 'community' | 'profile'

function getActiveTab(pathname: string): ActiveTab {
  if (pathname.includes('/ascent'))    return 'ascent'
  if (pathname.includes('/community')) return 'community'
  if (pathname.includes('/profile'))   return 'profile'
  return 'home'
}

export default function TabsLayout() {
  const pathname = usePathname()
  const active   = getActiveTab(pathname)

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

      <BottomNav active={active} />
    </View>
  )
}
