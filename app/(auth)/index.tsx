import { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated'
import { colors, typography, spacing, fontFamilies } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { getSession } from '@/services/auth.service'
import { useJourneyStore } from '@/stores/journey.store'

export default function Splash() {
  const wordmarkOpacity = useSharedValue(0)
  const taglineOpacity  = useSharedValue(0)
  const [offlineError, setOfflineError] = useState(false)
  const hasRouted = useRef(false)

  const hydrate       = useJourneyStore((s) => s.hydrate)
  const activeJourney = useJourneyStore((s) => s.activeJourney)
  const isHydrated    = useJourneyStore((s) => s.isHydrated)

  const wordmarkStyle = useAnimatedStyle(() => ({ opacity: wordmarkOpacity.value }))
  const taglineStyle  = useAnimatedStyle(() => ({ opacity: taglineOpacity.value }))

  const runAuthCheck = async () => {
    const { session, error } = await getSession()

    if (error) {
      setOfflineError(true)
      return
    }

    if (!session) {
      router.replace('/(auth)/welcome')
      return
    }

    await hydrate(session.user.id)
  }

  const afterAnimation = () => {
    setTimeout(() => {
      void runAuthCheck()
    }, 2000)
  }

  useEffect(() => {
    wordmarkOpacity.value = withTiming(1, { duration: 600 }, () => {
      taglineOpacity.value = withDelay(400, withTiming(1, { duration: 400 }, () => {
        runOnJS(afterAnimation)()
      }))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Route once hydration completes (triggered by hydrate() resolving)
  useEffect(() => {
    if (!isHydrated || hasRouted.current) return
    hasRouted.current = true

    if (activeJourney) {
      router.replace('/(tabs)/')
    } else {
      router.replace('/(onboarding)/life-stage')
    }
  }, [isHydrated, activeJourney])

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <View style={styles.container}>
        <Animated.View style={wordmarkStyle}>
          <Text
            variant="display"
            color={colors.iris}
            style={styles.wordmark}
          >
            INAT
          </Text>
        </Animated.View>

        <Animated.View style={[styles.taglineWrap, taglineStyle]}>
          <Text
            variant="caption"
            color={colors.textMid}
            align="center"
            uppercase
            style={styles.tagline}
          >
            I Never Accept Theoretical Limits
          </Text>
        </Animated.View>

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
  wordmark: {
    letterSpacing: typography.tracking.wide * typography.size.display,
  },
  taglineWrap: {
    marginTop: spacing[2],
  },
  tagline: {
    letterSpacing: typography.tracking.label * typography.size.caption,
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
