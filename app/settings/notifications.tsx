import { useEffect, useState } from 'react'
import { Linking, Pressable, StyleSheet, Switch, View } from 'react-native'
import { router } from 'expo-router'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SettingsHeader } from '@/components/profile/SettingsHeader'
import { Button } from '@/components/core/Button'
import { Text } from '@/components/core/Text'
import {
  formatReminderTime,
  getPracticeReminder,
  savePracticeReminder,
} from '@/services/notification.service'
import { colors, fontFamilies, profile, radius, spacing } from '@/theme'

const TIMES = [
  { hour: 7, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 19, minute: 0 },
]

export default function NotificationsScreen() {
  const [enabled, setEnabled] = useState(false)
  const [hour, setHour] = useState(7)
  const [minute, setMinute] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  useEffect(() => {
    void getPracticeReminder()
      .then((reminder) => {
        setEnabled(reminder.enabled)
        setHour(reminder.hour)
        setMinute(reminder.minute)
        setPermissionDenied(reminder.permission === 'denied')
      })
      .catch(() => setError('We could not read your reminder settings. Try again.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setError(null)
    const result = await savePracticeReminder(enabled, hour, minute)
    setSaving(false)
    setPermissionDenied(result.permission === 'denied')
    if (result.error) {
      setError(result.error.message)
      return
    }
    router.back()
  }

  return (
    <ScreenWrapper padded scrollable style={styles.content}>
      <SettingsHeader title="Notifications" onBack={() => router.back()} />
      <View style={styles.body}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleCopy}>
            <Text variant="quote" color={colors.textHi}>Daily practice reminder</Text>
            <Text variant="body" color={colors.textMid}>
              One reminder. No streak pressure. The circuit waits.
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            disabled={loading}
            trackColor={{ false: colors.borderStrong, true: colors.borderIris }}
            thumbColor={enabled ? colors.iris : colors.textMid}
            accessibilityLabel="Daily practice reminder"
          />
        </View>

        <View style={[styles.timeSection, !enabled && styles.disabled]}>
          <Text variant="micro" color={colors.textLow} uppercase>Reminder time</Text>
          <View style={styles.timeOptions}>
            {TIMES.map((time) => {
              const selected = time.hour === hour && time.minute === minute
              return (
                <Pressable
                  key={time.hour}
                  onPress={() => {
                    setHour(time.hour)
                    setMinute(time.minute)
                  }}
                  disabled={!enabled}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: !enabled }}
                  style={[styles.timeOption, selected && styles.timeOptionSelected]}
                >
                  <Text
                    variant="base"
                    color={selected ? colors.iris : colors.textMid}
                    style={selected ? styles.timeOptionLabel : undefined}
                  >
                    {formatReminderTime(time.hour, time.minute)}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {error ? <Text variant="body" color={colors.error}>{error}</Text> : null}
        {permissionDenied ? (
          <Pressable onPress={() => void Linking.openSettings()} accessibilityRole="button" style={styles.settingsLink}>
            <Text variant="base" color={colors.iris} style={styles.linkLabel}>Open device settings</Text>
          </Pressable>
        ) : null}

        <Button onPress={() => void handleSave()} loading={saving} disabled={loading}>
          Save reminder
        </Button>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing[3],
    paddingBottom: spacing[8],
    alignSelf: 'center',
    width: '100%',
    maxWidth: profile.maxContentWidth,
  },
  body: {
    marginTop: spacing[8],
    gap: spacing[8],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[5],
    paddingBottom: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  toggleCopy: {
    flex: 1,
    gap: spacing[2],
  },
  timeSection: {
    gap: spacing[3],
  },
  disabled: {
    opacity: 0.4,
  },
  timeOptions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  timeOption: {
    flex: 1,
    minHeight: profile.iconButtonSize,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.fathom,
  },
  timeOptionSelected: {
    borderColor: colors.borderIris,
    backgroundColor: colors.irisTint,
  },
  timeOptionLabel: {
    fontFamily: fontFamilies.semibold,
  },
  settingsLink: {
    minHeight: profile.iconButtonSize,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  linkLabel: {
    fontFamily: fontFamilies.semibold,
  },
})
