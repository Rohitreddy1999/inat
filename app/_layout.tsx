import '../global.css'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { colors } from '@/theme'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'HankenGrotesk-Regular':  require('../assets/fonts/HankenGrotesk-Regular.ttf'),
    'HankenGrotesk-Medium':   require('../assets/fonts/HankenGrotesk-Medium.ttf'),
    'HankenGrotesk-SemiBold': require('../assets/fonts/HankenGrotesk-SemiBold.ttf'),
    'HankenGrotesk-Bold':     require('../assets/fonts/HankenGrotesk-Bold.ttf'),
    'HankenGrotesk-Black':    require('../assets/fonts/HankenGrotesk-Black.ttf'),
  })

  useEffect(() => {
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
      }}
    >
      {/* Auth group — no header, no back gesture (Splash controls routing) */}
      <Stack.Screen
        name="(auth)"
        options={{ gestureEnabled: false }}
      />

      {/* Onboarding group — no header, gesture enabled for back */}
      <Stack.Screen
        name="(onboarding)"
        options={{ gestureEnabled: true }}
      />

      {/* Main tabs — no header, no back gesture */}
      <Stack.Screen
        name="(tabs)"
        options={{ gestureEnabled: false }}
      />

      {/* Day screen — pushed from Home, back gesture enabled */}
      <Stack.Screen
        name="day"
        options={{ gestureEnabled: true }}
      />

      {/* Graduation — no back gesture, cannot swipe back */}
      <Stack.Screen
        name="graduation"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  )
}
