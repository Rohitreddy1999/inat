import { useCallback, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SettingsHeader } from '@/components/profile/SettingsHeader'
import { SettingsGroup, SettingsRow } from '@/components/profile/SettingsGroup'
import { deleteAccount, getSession, resetPassword, signOut } from '@/services/auth.service'
import { formatReminderTime, getPracticeReminder } from '@/services/notification.service'
import { useJourneyStore } from '@/stores/journey.store'
import { colors, profile, spacing } from '@/theme'

export default function SettingsScreen() {
  const resetJourney = useJourneyStore((state) => state.reset)
  const [email, setEmail] = useState('')
  const [notificationSummary, setNotificationSummary] = useState('Off')
  const [deleting, setDeleting] = useState(false)

  useFocusEffect(useCallback(() => {
    void getSession().then((sessionResult) => {
      setEmail(sessionResult.session?.user.email ?? '')
    })
    void getPracticeReminder().then((reminder) => {
      setNotificationSummary(
        reminder.enabled ? `Daily · ${formatReminderTime(reminder.hour, reminder.minute)}` : 'Off',
      )
    }).catch(() => {
      setNotificationSummary('Unavailable')
    })
  }, []))

  async function handleResetPassword() {
    if (!email) {
      Alert.alert('Email unavailable', 'We could not find the email address for this account.')
      return
    }
    const { error } = await resetPassword(email)
    Alert.alert(
      error ? 'Reset email not sent' : 'Check your email',
      error
        ? 'We could not send the reset email. Check your connection and try again.'
        : `We sent password reset instructions to ${email}.`,
    )
  }

  async function handleSignOut() {
    const { error } = await signOut()
    if (error) {
      Alert.alert('Sign out failed', 'We could not sign you out. Check your connection and try again.')
      return
    }
    resetJourney()
    router.replace('/(auth)/welcome')
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Delete your account?',
      'This permanently deletes your profile, circuit history, and practice records. This cannot be undone.',
      [
        { text: 'Keep account', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => void handleDeleteAccount(),
        },
      ],
    )
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    const { error } = await deleteAccount()
    setDeleting(false)
    if (error) {
      Alert.alert(
        'Account not deleted',
        'We could not delete your account. Nothing was removed. Try again later.',
      )
      return
    }
    resetJourney()
    router.replace('/(auth)/welcome')
  }

  return (
    <ScreenWrapper padded scrollable style={styles.content}>
      <SettingsHeader title="Settings" onBack={() => router.back()} />

      <View style={styles.groups}>
        <SettingsGroup title="Preferences">
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            value={notificationSummary}
            onPress={() => router.push('/settings/notifications')}
            accessibilityHint="Opens daily practice reminder settings"
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Account">
          <SettingsRow
            icon="mail-outline"
            label="Change email"
            onPress={() => router.push('/settings/email')}
          />
          <SettingsRow
            icon="lock-closed-outline"
            label="Reset password"
            onPress={() => void handleResetPassword()}
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Membership">
          <SettingsRow
            icon="diamond-outline"
            label="INAT Membership"
            value="Not active"
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Session">
          <SettingsRow
            icon="log-out-outline"
            label="Sign out"
            onPress={() => void handleSignOut()}
            last
          />
        </SettingsGroup>

        <View style={styles.dangerZone}>
          <SettingsGroup>
            <SettingsRow
              icon="trash-outline"
              label={deleting ? 'Deleting account…' : 'Delete account'}
              onPress={deleting ? undefined : confirmDeleteAccount}
              destructive
              disabled={deleting}
              last
            />
          </SettingsGroup>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing[3],
    paddingBottom: spacing[10],
    alignSelf: 'center',
    width: '100%',
    maxWidth: profile.maxContentWidth,
  },
  groups: {
    marginTop: spacing[8],
    gap: spacing[6],
  },
  dangerZone: {
    marginTop: spacing[2],
  },
})
