import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { Card } from '@/components/core/Card'
import { Badge } from '@/components/core/Badge'
import { signIn, signOut } from '@/services/auth.service'
import { useJourneyStore } from '@/stores/journey.store'
import { DEV_SCENARIOS, DevScenario } from '@/utils/devTestData'

if (!__DEV__) {
  // Should never be reached — Stack.Screen is also gated by __DEV__
  throw new Error('dev-menu must not be bundled in production')
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      variant="caption"
      color={colors.textLow}
      style={styles.sectionLabel}
      uppercase
    >
      {children}
    </Text>
  )
}

export default function DevMenu() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const hydrate = useJourneyStore((s) => s.hydrate)
  const reset = useJourneyStore((s) => s.reset)

  async function handleScenarioLogin(key: string, scenario: DevScenario) {
    setLoadingKey(key)
    setErrorMsg(null)
    const { user, error } = await signIn(scenario.email, scenario.password)
    setLoadingKey(null)
    if (error || !user) {
      setErrorMsg(`Login failed: ${error?.message ?? 'unknown error'} — account may not exist yet`)
      return
    }
    await hydrate(user.id)
    const { activeJourney } = useJourneyStore.getState()
    if (activeJourney) {
      router.replace('/(tabs)/')
    } else {
      router.replace('/(onboarding)/life-stage')
    }
  }

  async function handleSignOutReset() {
    await signOut()
    reset()
    router.replace('/(auth)/welcome')
  }

  return (
    <ScreenWrapper padded scrollable>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="heading" color={colors.surge}>DEV MENU</Text>
        <Text variant="caption" color={colors.textLow} style={styles.headerSub}>
          Only visible in development
        </Text>
        <Badge variant="recommended">DEV ONLY</Badge>
      </View>

      {/* Quick Login */}
      <View style={styles.section}>
        <SectionLabel>Test Scenarios</SectionLabel>
        {errorMsg && (
          <Text variant="caption" color={colors.plasma} style={styles.error}>
            {errorMsg}
          </Text>
        )}
        {Object.entries(DEV_SCENARIOS).map(([key, scenario]) => (
          <Card
            key={key}
            onPress={loadingKey ? undefined : () => handleScenarioLogin(key, scenario)}
            style={styles.scenarioCard}
          >
            <View style={styles.scenarioRow}>
              <View style={styles.scenarioText}>
                <Text variant="base" color={colors.textHi} style={styles.bold}>
                  {scenario.label}
                </Text>
                <Text variant="caption" color={colors.textMid}>
                  {scenario.description}
                </Text>
                {loadingKey === key && (
                  <Text variant="caption" color={colors.surge}>Signing in…</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textLow} />
            </View>
          </Card>
        ))}
      </View>

      {/* Quick Navigation */}
      <View style={styles.section}>
        <SectionLabel>Jump to Screen</SectionLabel>
        <View style={styles.navButtons}>
          <Button variant="secondary" onPress={() => router.replace('/(auth)/')}>
            → Splash
          </Button>
          <Button variant="secondary" onPress={() => router.replace('/(auth)/welcome')}>
            → Welcome
          </Button>
          <Button variant="secondary" onPress={() => router.replace('/(onboarding)/life-stage')}>
            → Life Stage
          </Button>
          <Button variant="secondary" onPress={() => router.replace('/(onboarding)/bridge')}>
            → Bridge
          </Button>
          <Button variant="secondary" onPress={() => router.replace('/(onboarding)/match')}>
            → Match
          </Button>
          <Button variant="secondary" onPress={() => router.replace('/(tabs)/')}>
            → Home
          </Button>
          <Button variant="secondary" onPress={() => router.push('/day')}>
            → Day Screen
          </Button>
          <Button variant="secondary" onPress={() => router.replace('/(tabs)/ascent')}>
            → Ascent
          </Button>
          <Button variant="secondary" onPress={() => router.push('/graduation')}>
            → Graduation
          </Button>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={[styles.section, styles.danger]}>
        <SectionLabel>Reset</SectionLabel>
        <Button variant="primary" onPress={handleSignOutReset}>
          Sign Out + Reset Store
        </Button>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[2],
  },
  headerSub: {
    marginBottom: spacing[1],
  },
  section: {
    marginBottom: spacing[8],
    gap: spacing[3],
  },
  sectionLabel: {
    marginBottom: spacing[1],
  },
  scenarioCard: {
    marginBottom: spacing[2],
  },
  scenarioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scenarioText: {
    flex: 1,
    gap: spacing[1],
  },
  bold: {
    fontWeight: '700',
  },
  navButtons: {
    gap: spacing[2],
  },
  danger: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: spacing[6],
    marginBottom: spacing[10],
  },
  error: {
    marginBottom: spacing[2],
  },
})
