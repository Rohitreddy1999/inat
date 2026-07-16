import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { colors } from '@/theme'

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        color: focused ? colors.surge : colors.textLow,
        fontSize: 10,
        fontWeight: focused ? '600' : '400',
      }}
    >
      {label}
    </Text>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgNav,
          borderTopColor: colors.border,
          height: 72,
        },
        tabBarActiveTintColor: colors.surge,
        tabBarInactiveTintColor: colors.textLow,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ascent"
        options={{
          title: 'Ascent',
          tabBarIcon: ({ focused }) => <TabIcon label="Ascent" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => <TabIcon label="Community" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  )
}
