import { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { AnimatedWordmark } from '@/components/brand/AnimatedWordmark'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { getSession } from '@/services/auth.service'
import { getProfile } from '@/services/profile.service'
import { useJourneyStore } from '@/stores/journey.store'

type RouteTarget =
  | '/(auth)/welcome'
  | '/(onboarding)/life-stage'
  | '/(onboarding)/orientation'
  | '/(tabs)/'

export default function Splash() {
  const [offlineError, setOfflineError] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [routeTarget, setRouteTarget] = useState<RouteTarget | null>(null)
  const hasRouted = useRef(false)
  const userIdRef = useRef<string | null>(null)

  const hydrate       = useJourneyStore((s) => s.hydrate)
  const activeJourney = useJourneyStore((s) => s.activeJourney)
  const isHydrated    = useJourneyStore((s) => s.isHydrated)

  const runAuthCheck = useCallback(async () => {
    const { session, error } = await getSession()

    if (error) {
      setOfflineError(true)
      return
    }

    if (!session) {
      setRouteTarget('/(auth)/welcome')
      return
    }

    userIdRef.current = session.user.id
    await hydrate(session.user.id)
  }, [hydrate])

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true)
  }, [])

  useEffect(() => {
    void runAuthCheck()
  }, [runAuthCheck])

  // Route once hydration completes (triggered by hydrate() resolving)
  useEffect(() => {
    if (!isHydrated || hasRouted.current) return

    if (activeJourney) {
      setRouteTarget('/(tabs)/')
      return
    }

    const userId = userIdRef.current
    if (!userId) return
    hasRouted.current = true

    void (async () => {
      const { profile } = await getProfile(userId)
      if (profile?.life_stage) {
        setRouteTarget('/(onboarding)/life-stage')
      } else {
        setRouteTarget('/(onboarding)/orientation')
      }
    })()
  }, [isHydrated, activeJourney])

  useEffect(() => {
    if (!animationComplete || !routeTarget || hasRouted.current) return
    hasRouted.current = true
    router.replace(routeTarget)
  }, [animationComplete, routeTarget])

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <View style={styles.container}>
        <AnimatedWordmark onComplete={handleAnimationComplete} />

        {offlineError && (
          <View style={styles.errorWrap}>
            <Text variant="caption" color={colors.error} align="center">
              No connection. Please check your internet.
            </Text>
            <View style={styles.retryBtn}>
              <Button
                variant="secondary"
                fullWidth={false}
                onPress={() => {
                  setOfflineError(false)
                  setRouteTarget(null)
                  void runAuthCheck()
                }}
              >
                Retry
              </Button>
            </View>
          </View>
        )}
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.pagePad,
  },
  errorWrap: {
    position: 'absolute',
    bottom: spacing[10],
    left: spacing.pagePad,
    right: spacing.pagePad,
    alignItems: 'center',
    gap: spacing[4],
  },
  retryBtn: {
    minWidth: 120,
  },
})
