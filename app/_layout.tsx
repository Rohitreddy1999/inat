import '../global.css'
import { Stack } from 'expo-router'
import { colors } from '@/theme'

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPage },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="day" />
      <Stack.Screen name="graduation" />
    </Stack>
  )
}
