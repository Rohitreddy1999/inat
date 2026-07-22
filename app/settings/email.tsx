import { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SettingsHeader } from '@/components/profile/SettingsHeader'
import { Input } from '@/components/core/Input'
import { Button } from '@/components/core/Button'
import { Text } from '@/components/core/Text'
import { getSession, updateEmail } from '@/services/auth.service'
import { colors, profile, spacing } from '@/theme'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ChangeEmailScreen() {
  const [currentEmail, setCurrentEmail] = useState('')
  const [nextEmail, setNextEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void getSession().then(({ session }) => setCurrentEmail(session?.user.email ?? ''))
  }, [])

  async function handleSave() {
    const normalized = nextEmail.trim().toLowerCase()
    if (!EMAIL_PATTERN.test(normalized)) {
      setError('Enter a complete email address, such as name@example.com.')
      return
    }
    if (normalized === currentEmail.toLowerCase()) {
      setError('Enter a different email address.')
      return
    }

    setError(undefined)
    setSaving(true)
    const { error: updateError } = await updateEmail(normalized)
    setSaving(false)
    if (updateError) {
      setError('We could not update your email. Check the address and try again.')
      return
    }

    Alert.alert(
      'Verify your new email',
      `Follow the verification link sent to ${normalized}. Your current email stays active until verification is complete.`,
      [{ text: 'Done', onPress: () => router.back() }],
    )
  }

  return (
    <ScreenWrapper padded scrollable style={styles.content}>
      <SettingsHeader title="Change email" onBack={() => router.back()} />
      <View style={styles.form}>
        <View style={styles.currentEmail}>
          <Text variant="label" color={colors.textLow} uppercase>Current email</Text>
          <Text variant="base" color={colors.textHi}>{currentEmail || 'Unavailable'}</Text>
        </View>
        <View>
          <Text variant="label" color={colors.textMid} uppercase style={styles.inputLabel}>New email</Text>
          <Input
            value={nextEmail}
            onChangeText={setNextEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />
        </View>
        <Text variant="body" color={colors.textMid}>
          Supabase may require verification before your account switches to the new address.
        </Text>
        <Button onPress={() => void handleSave()} loading={saving}>Update email</Button>
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
  form: {
    marginTop: spacing[8],
    gap: spacing[6],
  },
  currentEmail: {
    gap: spacing[2],
    paddingBottom: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  inputLabel: {
    marginBottom: spacing[2],
  },
})
