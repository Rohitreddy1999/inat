import { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { BackButton } from '@/components/navigation/BackButton'
import { signUp } from '@/services/auth.service'

export default function Signup() {
  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState('')

  const isDisabled = !fullName || !email || password.length < 6 || isLoading

  const handleSignUp = async () => {
    setIsLoading(true)
    setError('')

    const { error: authError } = await signUp(email, password, fullName)

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    router.replace('/(onboarding)/life-stage')
  }

  return (
    <ScreenWrapper padded scrollable>
      <View style={styles.backRow}>
        <BackButton onPress={() => router.back()} />
      </View>

      <Text variant="heading" color={colors.textHi} style={styles.heading}>
        Create your account.
      </Text>
      <Text variant="body" color={colors.textMid} style={styles.subtext}>
        Start your first circuit today.
      </Text>

      <View style={styles.form}>
        <Input
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          hint="Minimum 6 characters"
        />
      </View>

      {!!error && (
        <Text variant="caption" color={colors.error} style={styles.message}>
          {error}
        </Text>
      )}

      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={handleSignUp}
          loading={isLoading}
          disabled={isDisabled}
        >
          Create account
        </Button>
      </View>

      <TouchableOpacity
        style={styles.switchWrap}
        onPress={() => router.replace('/(auth)/login')}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
      >
        <View style={styles.switchRow}>
          <Text variant="caption" color={colors.textMid}>
            Already have an account?{' '}
          </Text>
          <Text variant="caption" color={colors.iris}>
            Sign in
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.bottomPad} />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  backRow: {
    marginTop: spacing[3],
  },
  heading: {
    marginTop: spacing[10] + spacing[2],
  },
  subtext: {
    marginTop: spacing[2],
  },
  form: {
    marginTop: spacing[10],
    gap: spacing[4],
  },
  message: {
    marginTop: spacing[2],
  },
  cta: {
    marginTop: spacing[6],
  },
  switchWrap: {
    marginTop: spacing[8],
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  switchRow: {
    flexDirection: 'row',
  },
  bottomPad: {
    height: spacing[10],
  },
})
