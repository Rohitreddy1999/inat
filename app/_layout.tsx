import '../global.css'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import * as Notifications from 'expo-notifications'
import { colors } from '@/theme'

SplashScreen.preventAutoHideAsync()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'HankenGrotesk-Regular':  require('../assets/fonts/HankenGrotesk-Regular.ttf'),
    'HankenGrotesk-Medium':   require('../assets/fonts/HankenGrotesk-Medium.ttf'),
    'HankenGrotesk-SemiBold': require('../assets/fonts/HankenGrotesk-SemiBold.ttf'),
    'HankenGrotesk-Bold':     require('../assets/fonts/HankenGrotesk-Bold.ttf'),
    'HankenGrotesk-Black':    require('../assets/fonts/HankenGrotesk-Black.ttf'),
    'Syne-Bold':              require('../assets/fonts/Syne-Bold.ttf'),
    'Syne-ExtraBold':         require('../assets/fonts/Syne-ExtraBold.ttf'),
    'DMSans-Regular':  require('../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium':   require('../assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('../assets/fonts/DMSans-SemiBold.ttf'),
    'DMSans-Bold':     require('../assets/fonts/DMSans-Bold.ttf'),
    'DMSans-Black':    require('../assets/fonts/DMSans-Black.ttf'),
  })

  useEffect(() => {
    if (error) console.error('[fonts] load error:', error)
    if (loaded) console.log('[fonts] all loaded ok')
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) return null

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPage },
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      {/* Splash — no back gesture, controls all routing */}
      <Stack.Screen name="(auth)/index"   options={{ gestureEnabled: false }} />

      {/* Auth screens — no back gesture (no prior stack to return to) */}
      <Stack.Screen
        name="(auth)/welcome"
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
      <Stack.Screen name="(auth)/login"   options={{ gestureEnabled: false }} />
      <Stack.Screen name="(auth)/signup"  options={{ gestureEnabled: false }} />

      {/* Orientation — shows once for new users (life_stage null), no back gesture */}
      <Stack.Screen name="(onboarding)/orientation" options={{ gestureEnabled: false }} />

      {/* Main tabs — no back gesture */}
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />

      {/* Account settings — pushed from Profile */}
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/notifications" />
      <Stack.Screen name="settings/email" />

      {/* Graduation — no back gesture */}
      <Stack.Screen name="graduation" options={{ gestureEnabled: false }} />

      {/* Admin panel — only registered in __DEV__ builds */}
      {__DEV__ && (
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      )}
    </Stack>
  )
}
