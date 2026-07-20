import { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { BackButton } from '@/components/navigation/BackButton'
import { signIn, resetPassword } from '@/services/auth.service'
import { useJourneyStore } from '@/stores/journey.store'

export default function Login() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState('')
  const [resetMsg,  setResetMsg]  = useState('')

  const handleSignIn = async () => {
    setIsLoading(true)
    setError('')
    setResetMsg('')

    const { user, error: authError } = await signIn(email, password)

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    if (user) {
      await useJourneyStore.getState().hydrate(user.id)
      const { activeJourney } = useJourneyStore.getState()
      if (activeJourney) {
        router.replace('/(tabs)/')
      } else {
        router.replace('/(onboarding)/life-stage')
      }
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setResetMsg('')

    if (!email.trim()) {
      setError('Enter your email above, then tap "Forgot password?"')
      return
    }

    const { error: resetError } = await resetPassword(email)
    if (resetError) {
      setError(resetError.message)
    } else {
      setResetMsg('Check your inbox for a reset link.')
    }
  }

  return (
    <ScreenWrapper padded scrollable>
      <View style={styles.backRow}>
        <BackButton onPress={() => router.back()} />
      </View>

      <Text variant="heading" color={colors.textHi} style={styles.heading}>
        Welcome back.
      </Text>
      <Text variant="body" color={colors.textMid} style={styles.subtext}>
        Sign in to continue your circuit.
      </Text>

      <View style={styles.form}>
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
        />
      </View>

      {!!error && (
        <Text variant="caption" color={colors.error} style={styles.message}>
          {error}
        </Text>
      )}

      {!!resetMsg && (
        <Text variant="caption" color={colors.iris} style={styles.message}>
          {resetMsg}
        </Text>
      )}

      <View style={styles.cta}>
        <Button
          variant="primary"
          onPress={handleSignIn}
          loading={isLoading}
          disabled={!email || !password || isLoading}
        >
          Sign in
        </Button>
      </View>

      <TouchableOpacity
        style={styles.forgotWrap}
        onPress={handleForgotPassword}
        accessibilityRole="button"
        accessibilityLabel="Forgot password"
      >
        <Text variant="caption" color={colors.textMid} align="center">
          Forgot password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchWrap}
        onPress={() => router.replace('/(auth)/signup')}
        accessibilityRole="button"
        accessibilityLabel="Sign up"
      >
        <View style={styles.switchRow}>
          <Text variant="caption" color={colors.textMid}>
            Don't have an account?{' '}
          </Text>
          <Text variant="caption" color={colors.iris}>
            Sign up
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
  forgotWrap: {
    marginTop: spacing[4],
    alignItems: 'center',
    paddingVertical: spacing[2],
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
