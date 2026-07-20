if (!__DEV__) {
  throw new Error('admin screen must not be bundled in production')
}

import { useEffect, useState } from 'react'
import { View, Alert, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { Card } from '@/components/core/Card'
import { getSession, signOut } from '@/services/auth.service'
import * as adminService from '@/services/admin.service'
import { useJourneyStore } from '@/stores/journey.store'
import { colors, spacing } from '@/theme'

const DAYS = Array.from({ length: 21 }, (_, i) => i + 1)

export default function Admin() {
  if (!__DEV__) return null

  const router = useRouter()
  const { activeJourney, currentDay, completedDays, reentryState, hydrate, reset } =
    useJourneyStore()
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getSession().then(({ session }) => setUserId(session?.user?.id ?? null))
  }, [])

  // ── Section 2: Jump to Day ───────────────────────────────────────────────

  async function handleJumpToDay(day: number) {
    if (!activeJourney) {
      Alert.alert('No journey', 'Complete onboarding first')
      return
    }
    if (!userId) return
    setIsLoading(true)
    const { error } = await adminService.setJourneyDay(activeJourney.id, userId, day)
    if (error) {
      Alert.alert('Error', error)
      setIsLoading(false)
      return
    }
    await hydrate(userId)
    setIsLoading(false)
    Alert.alert('Done', `Jumped to Day ${day}`)
  }

  // ── Section 3: Re-entry States ───────────────────────────────────────────

  async function handleStateA() {
    if (!activeJourney) { Alert.alert('No journey'); return }
    if (completedDays.length === 0) {
      Alert.alert('No completions', 'Complete at least Day 1 first')
      return
    }
    const { error } = await adminService.setLastCompletionDate(activeJourney.id, 'yesterday')
    if (error) { Alert.alert('Error', error); return }
    if (userId) await hydrate(userId)
    Alert.alert('Done', 'State A set — new day available')
  }

  async function handleStateB() {
    if (!activeJourney) { Alert.alert('No journey'); return }
    const { error } = await adminService.setLastCompletionDate(activeJourney.id, 'today')
    if (error) { Alert.alert('Error', error); return }
    if (userId) await hydrate(userId)
    Alert.alert('Done', 'State B set — done today')
  }

  async function handleStateC() {
    if (!activeJourney) { Alert.alert('No journey'); return }
    const { error } = await adminService.setLastCompletionDate(activeJourney.id, '5daysago')
    if (error) { Alert.alert('Error', error); return }
    if (userId) await hydrate(userId)
    Alert.alert('Done', 'State C set — gap return')
  }

  async function handleStateD() {
    if (!activeJourney) { Alert.alert('No journey'); return }
    const { error } = await adminService.clearCompletions(activeJourney.id)
    if (error) { Alert.alert('Error', error); return }
    if (userId) await hydrate(userId)
    Alert.alert('Done', 'State D set — first time')
  }

  // ── Section 5: Danger ────────────────────────────────────────────────────

  function handleResetJourney() {
    if (!activeJourney || !userId) return
    Alert.alert(
      'Reset journey?',
      'Deletes all progress. Cannot undo.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const { error } = await adminService.resetJourney(userId, activeJourney.id)
            if (error) {
              Alert.alert('Error', error)
              return
            }
            reset()
            router.replace('/(onboarding)/life-stage')
          },
        },
      ],
    )
  }

  async function handleSignOut() {
    await signOut()
    reset()
    router.replace('/(auth)/welcome')
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ScreenWrapper padded scrollable>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="heading" color={colors.iris}>DEV ADMIN</Text>
        <Text variant="caption" color={colors.textLow}>dev@inat.app only</Text>
      </View>

      {/* Section 1 — Current State */}
      <SectionLabel>CURRENT STATE</SectionLabel>

      <Card style={styles.stateCard}>
        <Text variant="caption" color={colors.textMid}>Day: {currentDay} / 21</Text>
        <Text variant="caption" color={colors.textMid}>
          Journey ID: {activeJourney?.id.slice(0, 8) ?? 'none'}
        </Text>
        <Text variant="caption" color={colors.textMid}>
          Re-entry: State {reentryState ?? '—'}
        </Text>
        <Text variant="caption" color={colors.textMid}>
          Completions: {completedDays.length}
        </Text>
      </Card>

      {/* Section 2 — Jump to Day */}
      <SectionLabel style={styles.sectionGap}>JUMP TO DAY</SectionLabel>
      <Text variant="caption" color={colors.textLow} style={styles.hint}>
        Sets current_day and inserts completion history automatically
      </Text>

      <View style={styles.dayGrid}>
        {DAYS.map((day) => (
          <Pressable
            key={day}
            style={[
              styles.dayBtn,
              { backgroundColor: day === currentDay ? colors.iris : colors.fathom },
            ]}
            onPress={() => handleJumpToDay(day)}
            disabled={isLoading}
          >
            <Text
              variant="micro"
              color={day === currentDay ? colors.abyss : colors.textMid}
              align="center"
            >
              {day.toString()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Section 3 — Simulate Re-entry */}
      <SectionLabel style={styles.sectionGap}>SIMULATE RE-ENTRY</SectionLabel>
      <Text variant="caption" color={colors.textLow} style={styles.hint}>
        Changes last completion date only
      </Text>

      <View style={styles.col}>
        <Button variant="secondary" onPress={handleStateA}>
          State A — New day ready
        </Button>
        <Button variant="secondary" onPress={handleStateB}>
          State B — Already done today
        </Button>
        <Button variant="secondary" onPress={handleStateC}>
          State C — Gap (5 days ago)
        </Button>
        <Button variant="secondary" onPress={handleStateD}>
          State D — No completions
        </Button>
      </View>

      {/* Section 4 — Jump to Screen */}
      <SectionLabel style={styles.sectionGap}>JUMP TO SCREEN</SectionLabel>

      <View style={styles.screenRow}>
        <View style={styles.screenBtn}>
          <Button variant="secondary" onPress={() => router.replace('/(tabs)/')}>Home</Button>
        </View>
        <View style={styles.screenBtn}>
          <Button variant="secondary" onPress={() => router.push('/day')}>Day</Button>
        </View>
        <View style={styles.screenBtn}>
          <Button variant="secondary" onPress={() => router.replace('/(tabs)/ascent')}>Ascent</Button>
        </View>
        <View style={styles.screenBtn}>
          <Button variant="secondary" onPress={() => router.push('/graduation')}>Graduation</Button>
        </View>
        <View style={styles.screenBtn}>
          <Button variant="secondary" onPress={() => router.replace('/(onboarding)/life-stage')}>Onboarding</Button>
        </View>
        <View style={styles.screenBtn}>
          <Button variant="secondary" onPress={() => router.replace('/(onboarding)/match')}>Match</Button>
        </View>
        <View style={styles.screenBtn}>
          <Button variant="secondary" onPress={() => router.replace('/(auth)/welcome')}>Welcome</Button>
        </View>
      </View>

      {/* Section 5 — Danger */}
      <SectionLabel style={styles.sectionGap}>DANGER</SectionLabel>

      <View style={[styles.col, styles.dangerSection]}>
        <Button variant="primary" onPress={handleResetJourney}>
          Reset Journey → Re-onboard
        </Button>
        <Button variant="secondary" onPress={handleSignOut}>
          Sign Out
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
  stateCard: {
    marginBottom: spacing[4],
    gap: spacing[1],
  },
  sectionGap: {
    marginTop: spacing[8],
  },
  hint: {
    marginBottom: spacing[2],
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  dayBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  col: {
    gap: spacing[2],
  },
  screenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  screenBtn: {
    flexShrink: 1,
  },
  dangerSection: {
    marginBottom: spacing[10],
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: spacing[4],
  },
})
