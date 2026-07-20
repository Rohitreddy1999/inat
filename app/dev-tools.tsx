import { useState } from 'react'
import { View, ScrollView, Pressable, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Card } from '@/components/core/Card'
import { Button } from '@/components/core/Button'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { useJourneyStore } from '@/stores/journey.store'
import { colors, spacing, radius, getPhaseColor, getPhaseName } from '@/theme'

const REENTRY_STATES = [
  { key: 'A', label: 'A — New day', desc: 'Yesterday was the last completion' },
  { key: 'B', label: 'B — Done today', desc: 'Already completed today' },
  { key: 'C', label: 'C — Gap return', desc: 'Missed multiple days' },
  { key: 'D', label: 'D — First open', desc: 'No completions yet' },
] as const

const SCREENS = [
  { label: 'Home',        route: '/(tabs)/' },
  { label: 'Day',         route: '/day' },
  { label: 'Ascent',      route: '/(tabs)/ascent' },
  { label: 'Community',   route: '/(tabs)/community' },
  { label: 'Profile',     route: '/(tabs)/profile' },
  { label: 'Welcome',     route: '/(auth)/welcome' },
  { label: 'Graduation',  route: '/graduation' },
  { label: 'Life Stage',  route: '/(onboarding)/life-stage' },
  { label: 'Match',       route: '/(onboarding)/match' },
] as const

export default function DevTools() {
  const router = useRouter()
  const { currentDay, completedDays, reentryState, activeJourney, devOverride } = useJourneyStore()
  const [localDay, setLocalDay] = useState(currentDay || 1)

  const phaseColor = getPhaseColor(localDay)

  function applyDay(day: number) {
    const clamped = Math.min(21, Math.max(1, day))
    setLocalDay(clamped)
    devOverride({ currentDay: clamped })
  }

  function applyCompletions(upToDay: number) {
    const days = Array.from({ length: upToDay }, (_, i) => i + 1)
    devOverride({ completedDays: days, currentDay: upToDay + 1 <= 21 ? upToDay + 1 : 21 })
    setLocalDay(upToDay + 1 <= 21 ? upToDay + 1 : 21)
  }

  function clearCompletions() {
    devOverride({ completedDays: [], currentDay: 1, reentryState: 'D' })
    setLocalDay(1)
  }

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      {/* Header */}
      <View
        style={{
          flexDirection:   'row',
          alignItems:      'center',
          paddingTop:      spacing[6],
          paddingBottom:   spacing[3],
          paddingHorizontal: spacing.pagePad,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderSoft,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing[3] }}>
          <Text variant="body" color={colors.electric}>← Back</Text>
        </Pressable>
        <Text variant="heading" color={colors.electric}>Dev Tools</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.pagePad, paddingBottom: spacing.pageBottom, gap: spacing[6] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current state */}
        <View>
          <SectionLabel>CURRENT STORE STATE</SectionLabel>
          <Card style={{ marginTop: spacing[3], gap: spacing[2] }}>
            <Row label="Journey ID"     value={activeJourney ? activeJourney.id.slice(0, 8) + '...' : 'none'} />
            <Row label="Current day"    value={String(currentDay)} />
            <Row label="Reentry state"  value={reentryState ?? 'null'} />
            <Row label="Completed days" value={completedDays.length > 0 ? completedDays.join(', ') : 'none'} />
            <Row label="Phase"          value={getPhaseName(currentDay || 1)} color={getPhaseColor(currentDay || 1)} />
          </Card>
        </View>

        {/* Day picker */}
        <View>
          <SectionLabel>SIMULATE DAY</SectionLabel>
          <Card style={{ marginTop: spacing[3] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable
                onPress={() => applyDay(localDay - 1)}
                style={[styles.stepper, { borderColor: colors.borderStrong }]}
              >
                <Text variant="heading" color={colors.textHi}>−</Text>
              </Pressable>

              <View style={{ alignItems: 'center' }}>
                <Text variant="display" color={phaseColor}>{String(localDay)}</Text>
                <Text variant="caption" color={colors.textMid}>{getPhaseName(localDay)}</Text>
              </View>

              <Pressable
                onPress={() => applyDay(localDay + 1)}
                style={[styles.stepper, { borderColor: colors.borderStrong }]}
              >
                <Text variant="heading" color={colors.textHi}>+</Text>
              </Pressable>
            </View>

            {/* Quick jump rows */}
            <View style={{ marginTop: spacing[4], gap: spacing[2] }}>
              <Text variant="caption" color={colors.textLow}>Quick jump</Text>
              <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
                {[1, 7, 8, 14, 15, 21].map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => applyDay(d)}
                    style={[
                      styles.chip,
                      { borderColor: localDay === d ? getPhaseColor(d) : colors.borderSoft },
                    ]}
                  >
                    <Text
                      variant="caption"
                      color={localDay === d ? getPhaseColor(d) : colors.textMid}
                    >
                      Day {d}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* Reentry state */}
        <View>
          <SectionLabel>SIMULATE RE-ENTRY STATE</SectionLabel>
          <View style={{ marginTop: spacing[3], gap: spacing[2] }}>
            {REENTRY_STATES.map(({ key, label, desc }) => (
              <Pressable
                key={key}
                onPress={() => devOverride({ reentryState: key })}
              >
                <Card
                  accent={reentryState === key ? colors.electric : undefined}
                  style={{ opacity: reentryState === key ? 1 : 0.6 }}
                >
                  <Text variant="base" color={reentryState === key ? colors.textHi : colors.textMid}>
                    {label}
                  </Text>
                  <Text variant="caption" color={colors.textLow} style={{ marginTop: spacing[1] }}>
                    {desc}
                  </Text>
                </Card>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Completion presets */}
        <View>
          <SectionLabel>SIMULATE COMPLETIONS</SectionLabel>
          <View style={{ marginTop: spacing[3], gap: spacing[2] }}>
            <Button variant="secondary" onPress={clearCompletions}>
              Clear all (Day 1, State D)
            </Button>
            {[3, 7, 8, 14, 15, 20].map((n) => (
              <Button
                key={n}
                variant="secondary"
                onPress={() => applyCompletions(n)}
              >
                Complete days 1–{n} → Day {Math.min(n + 1, 21)}
              </Button>
            ))}
          </View>
        </View>

        {/* Screen navigation */}
        <View>
          <SectionLabel>JUMP TO SCREEN</SectionLabel>
          <View style={{ marginTop: spacing[3], gap: spacing[2] }}>
            {SCREENS.map(({ label, route }) => (
              <Button
                key={route}
                variant="secondary"
                onPress={() => router.push(route as Parameters<typeof router.push>[0])}
              >
                {label}
              </Button>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text variant="caption" color={colors.textLow}>{label}</Text>
      <Text variant="caption" color={color ?? colors.textMid}>{value}</Text>
    </View>
  )
}

const styles = {
  stepper: {
    width:           52,
    height:          52,
    borderRadius:    radius.md,
    borderWidth:     1,
    alignItems:      'center' as const,
    justifyContent:  'center' as const,
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical:   spacing[1],
    borderRadius:      radius.pill,
    borderWidth:       1,
  },
}
