if (!__DEV__) {
  throw new Error('admin screen must not be bundled in production')
}

import { useEffect, useState } from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { Card } from '@/components/core/Card'
import { getSession, signOut } from '@/services/auth.service'
import { deactivateJourney, setJourneyDay } from '@/services/journey.service'
import {
  deleteJourneyCompletions,
  insertJourneyCompletions,
  getLatestCompletionId,
  updateCompletionDate,
  insertSyntheticCompletion,
} from '@/services/completion.service'
import { useJourneyStore } from '@/stores/journey.store'
import { colors, spacing } from '@/theme'

const DAY_PRESETS = [1, 2, 3, 7, 8, 14, 15, 20, 21]

export default function Admin() {
  const router = useRouter()
  const { activeJourney, currentDay, hydrate, reset } = useJourneyStore()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    getSession().then(({ session }) => setUserId(session?.user?.id ?? null))
  }, [])

  async function rehydrate() {
    if (!userId) return
    await hydrate(userId)
  }

  // ── Section 1: Journey State ─────────────────────────────────────────────

  async function handleSetDay(day: number) {
    if (!activeJourney) {
      Alert.alert('No journey', 'No active journey to modify.')
      return
    }

    const dayErr = await setJourneyDay(activeJourney.id, day)
    if (dayErr) {
      Alert.alert('Error', `Failed to set day: ${dayErr.message}`)
      return
    }

    const delErr = await deleteJourneyCompletions(activeJourney.id)
    if (delErr) {
      Alert.alert('Error', `Failed to clear completions: ${delErr.message}`)
      return
    }

    if (day > 1) {
      const rows = []
      for (let i = 1; i < day; i++) {
        const d = new Date()
        d.setDate(d.getDate() - (day - i))
        rows.push({
          journey_id: activeJourney.id,
          user_id: activeJourney.user_id,
          day_number: i,
          completed_date: d.toISOString().split('T')[0],
          feeling: 'good',
          reflection_note: '',
        })
      }
      const insErr = await insertJourneyCompletions(rows)
      if (insErr) {
        Alert.alert('Error', `Failed to insert completions: ${insErr.message}`)
        return
      }
    }

    await rehydrate()
    Alert.alert('Done', `Day set to ${day}`)
  }

  // ── Section 2: Re-entry State ────────────────────────────────────────────

  async function updateLatestCompletionDate(dateStr: string): Promise<boolean> {
    if (!activeJourney) return false

    const latestId = await getLatestCompletionId(activeJourney.id)

    if (latestId) {
      const err = await updateCompletionDate(latestId, dateStr)
      if (err) {
        Alert.alert('Error', `Failed to update completion: ${err.message}`)
        return false
      }
      return true
    }

    if (activeJourney.current_day <= 1) {
      Alert.alert('Set day first', 'Tap a day button (2 or higher) before simulating re-entry states.')
      return false
    }

    const err = await insertSyntheticCompletion(
      activeJourney.id,
      activeJourney.user_id,
      activeJourney.current_day - 1,
      dateStr,
    )
    if (err) {
      Alert.alert('Error', `Failed to insert completion: ${err.message}`)
      return false
    }
    return true
  }

  async function handleStateA() {
    if (!activeJourney) { Alert.alert('No journey'); return }
    const d = new Date()
    d.setDate(d.getDate() - 1)
    const ok = await updateLatestCompletionDate(d.toISOString().split('T')[0])
    if (!ok) return
    await rehydrate()
    Alert.alert('State A set', 'Last completion: yesterday')
  }

  async function handleStateB() {
    if (!activeJourney) { Alert.alert('No journey'); return }
    const today = new Date().toISOString().split('T')[0]
    const ok = await updateLatestCompletionDate(today)
    if (!ok) return
    await rehydrate()
    Alert.alert('State B set', 'Last completion: today')
  }

  async function handleStateC() {
    if (!activeJourney) { Alert.alert('No journey'); return }
    const d = new Date()
    d.setDate(d.getDate() - 5)
    const ok = await updateLatestCompletionDate(d.toISOString().split('T')[0])
    if (!ok) return
    await rehydrate()
    Alert.alert('State C set', 'Last completion: 5 days ago')
  }

  async function handleStateD() {
    if (!activeJourney) { Alert.alert('No journey'); return }
    const delErr = await deleteJourneyCompletions(activeJourney.id)
    if (delErr) { Alert.alert('Error', delErr.message); return }
    const dayErr = await setJourneyDay(activeJourney.id, 1)
    if (dayErr) { Alert.alert('Error', dayErr.message); return }
    await rehydrate()
    Alert.alert('State D set', 'No completions, day reset to 1')
  }

  // ── Section 4: Danger ────────────────────────────────────────────────────

  function handleResetJourney() {
    if (!userId) return
    Alert.alert(
      'Reset Journey',
      'Deactivates your journey and sends you back to onboarding.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const deactivateErr = await deactivateJourney(userId)
            if (deactivateErr) {
              Alert.alert('Error', `Could not deactivate journey: ${deactivateErr.message}`)
              return
            }
            if (activeJourney) {
              const delErr = await deleteJourneyCompletions(activeJourney.id)
              if (delErr) {
                Alert.alert('Error', `Could not clear completions: ${delErr.message}`)
                return
              }
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
        <Text variant="heading" color={colors.surge}>ADMIN</Text>
        <Text variant="caption" color={colors.textLow}>Development controls only</Text>
      </View>

      {/* Section 1 — Journey State */}
      <SectionLabel>SET JOURNEY STATE</SectionLabel>

      <Card style={styles.stateCard}>
        <Text variant="caption" color={colors.textLow}>Current user_id</Text>
        <Text variant="body" color={colors.textMid}>{userId ?? 'not logged in'}</Text>
        <Text variant="caption" color={colors.textLow} style={styles.mt8}>Active journey</Text>
        <Text variant="body" color={colors.textMid}>{activeJourney?.id ?? 'none'}</Text>
        <Text variant="caption" color={colors.textLow} style={styles.mt8}>Current day</Text>
        <Text variant="body" color={colors.surge}>{currentDay.toString()}</Text>
      </Card>

      <Text variant="body" color={colors.textHi} style={styles.dayLabel}>Set current day:</Text>
      <View style={styles.dayRow}>
        {DAY_PRESETS.map((day) => (
          <View key={day} style={styles.dayButton}>
            <Button variant="secondary" onPress={() => handleSetDay(day)}>
              {day.toString()}
            </Button>
          </View>
        ))}
      </View>

      {/* Section 2 — Re-entry State */}
      <SectionLabel style={styles.sectionGap}>SIMULATE RE-ENTRY</SectionLabel>

      <View style={styles.col}>
        <Button variant="secondary" onPress={handleStateA}>State A — New day</Button>
        <Button variant="secondary" onPress={handleStateB}>State B — Done today</Button>
        <Button variant="secondary" onPress={handleStateC}>State C — Gap (5 days)</Button>
        <Button variant="secondary" onPress={handleStateD}>State D — No completions</Button>
      </View>

      {/* Section 3 — Navigation */}
      <SectionLabel style={styles.sectionGap}>JUMP TO SCREEN</SectionLabel>

      <View style={styles.col}>
        <Button variant="secondary" onPress={() => router.replace('/(auth)/')}>Splash</Button>
        <Button variant="secondary" onPress={() => router.replace('/(auth)/welcome')}>Welcome</Button>
        <Button variant="secondary" onPress={() => router.replace('/(onboarding)/life-stage')}>Onboarding</Button>
        <Button variant="secondary" onPress={() => router.replace('/(tabs)/')}>Home</Button>
        <Button variant="secondary" onPress={() => router.push('/day')}>Day</Button>
        <Button variant="secondary" onPress={() => router.replace('/(tabs)/ascent')}>Ascent</Button>
        <Button variant="secondary" onPress={() => router.push('/graduation')}>Graduation</Button>
      </View>

      {/* Section 4 — Danger */}
      <SectionLabel style={styles.sectionGap}>DANGER</SectionLabel>

      <View style={[styles.col, styles.dangerSection]}>
        <Button variant="primary" onPress={handleResetJourney}>Reset Journey</Button>
        <Button variant="secondary" onPress={handleSignOut}>Sign Out</Button>
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
  },
  mt8: {
    marginTop: spacing[2],
  },
  dayLabel: {
    marginBottom: spacing[3],
  },
  dayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  dayButton: {
    minWidth: 64,
  },
  sectionGap: {
    marginTop: spacing[8],
  },
  col: {
    gap: spacing[2],
  },
  dangerSection: {
    marginBottom: spacing[10],
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: spacing[4],
  },
})
