import { useCallback, useState } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SkeletonCard } from '@/components/core/SkeletonCard'
import { Text } from '@/components/core/Text'
import { ProfileAvatar } from '@/components/profile/ProfileAvatar'
import { ActiveCircuitCard } from '@/components/profile/ActiveCircuitCard'
import { SettingsGroup, SettingsRow } from '@/components/profile/SettingsGroup'
import { getProfile, uploadAvatar } from '@/services/profile.service'
import { getSession } from '@/services/auth.service'
import { useJourneyStore } from '@/stores/journey.store'
import { colors, fontFamilies, profile as profileTokens, radius, spacing, typography } from '@/theme'
import type { Profile } from '@/types'

type ProfileState = {
  profile: Profile | null
  userId: string | null
  email: string
  authFullName: string
}

const EMPTY_PROFILE: ProfileState = {
  profile: null,
  userId: null,
  email: '',
  authFullName: '',
}

export default function ProfileScreen() {
  const { activeJourney, currentDay } = useJourneyStore()
  const [data, setData] = useState<ProfileState>(EMPTY_PROFILE)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    const { session, error: sessionError } = await getSession()
    if (sessionError || !session?.user.id) {
      setLoadError('We could not load your account. Check your connection and try again.')
      setLoading(false)
      return
    }

    const { profile, error } = await getProfile(session.user.id)
    if (error) {
      setLoadError('We could not load your profile. Check your connection and try again.')
      setLoading(false)
      return
    }

    setData({
      profile,
      userId: session.user.id,
      email: session.user.email ?? '',
      authFullName: typeof session.user.user_metadata.full_name === 'string'
        ? session.user.user_metadata.full_name
        : '',
    })
    setLoading(false)
  }, [])

  useFocusEffect(useCallback(() => {
    void loadProfile()
  }, [loadProfile]))

  const handleAvatarPress = useCallback(async () => {
    if (!data.userId) return
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert(
        'Photo access is off',
        'Allow photo access in your device settings to choose a profile picture.',
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (result.canceled) return

    setAvatarLoading(true)
    const asset = result.assets[0]
    const { avatarUrl, error } = await uploadAvatar(
      data.userId,
      asset.uri,
      asset.mimeType ?? 'image/jpeg',
    )
    setAvatarLoading(false)

    if (error || !avatarUrl) {
      Alert.alert(
        'Profile picture not saved',
        'We could not save that picture. Your current profile picture is unchanged.',
      )
      return
    }

    setData((current) => ({
      ...current,
      profile: current.profile ? { ...current.profile, avatar_url: avatarUrl } : current.profile,
    }))
  }, [data.userId])

  const displayName = data.profile?.full_name?.trim() || data.authFullName.trim() || 'Your name'

  return (
    <ScreenWrapper
      padded
      scrollable
      style={styles.content}
    >
      <View style={styles.titleRow}>
        <Text variant="heading" color={colors.textHi} style={styles.title}>Profile</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          style={styles.settingsButton}
          android_ripple={{ color: colors.irisTint, borderless: true }}
        >
          <Ionicons name="settings-outline" size={typography.size.heading} color={colors.textMid} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingStack} accessibilityLabel="Loading profile">
          <SkeletonCard height={116} />
          <SkeletonCard height={252} />
        </View>
      ) : loadError ? (
        <View style={styles.errorState}>
          <Text variant="heading" color={colors.textHi}>Profile unavailable</Text>
          <Text variant="body" color={colors.textMid}>{loadError}</Text>
          <Pressable onPress={() => void loadProfile()} accessibilityRole="button" style={styles.retryButton}>
            <Text variant="base" color={colors.iris} style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.identity}>
            <ProfileAvatar
              name={displayName}
              avatarUrl={data.profile?.avatar_url ?? null}
              loading={avatarLoading}
              onPress={() => void handleAvatarPress()}
            />
            <View style={styles.identityCopy}>
              <Text variant="quote" color={colors.textHi} style={styles.identityName} numberOfLines={2}>{displayName}</Text>
              <Text variant="body" color={colors.textMid} numberOfLines={2}>{data.email}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="micro" color={colors.textLow} uppercase>Active circuit</Text>
            <View style={styles.sectionBody}>
              {activeJourney ? (
                <ActiveCircuitCard journey={activeJourney} currentDay={currentDay} />
              ) : (
                <View style={styles.emptyCircuit}>
                  <Text variant="quote" color={colors.textHi}>No active circuit</Text>
                  <Text variant="body" color={colors.textMid}>
                    Your next circuit will appear here when you choose a direction.
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <SettingsGroup title="Membership">
              <SettingsRow
                icon="diamond-outline"
                label="INAT Membership"
                value="Not active"
                last
              />
            </SettingsGroup>
          </View>
        </>
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing[6],
    paddingBottom: spacing.pageBottom + spacing[8],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamilies.bold,
  },
  settingsButton: {
    width: profileTokens.iconButtonSize,
    height: profileTokens.iconButtonSize,
    borderRadius: profileTokens.iconButtonSize / 2,
    borderWidth: 1,
    borderColor: colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingStack: {
    marginTop: spacing[6],
    gap: spacing[5],
  },
  identity: {
    marginTop: spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  identityCopy: {
    flex: 1,
    gap: spacing[1],
  },
  identityName: {
    fontFamily: fontFamilies.bold,
  },
  section: {
    marginTop: spacing[6],
  },
  sectionBody: {
    marginTop: spacing[3],
  },
  emptyCircuit: {
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.card,
    backgroundColor: colors.fathom,
    padding: spacing[5],
    gap: spacing[2],
  },
  errorState: {
    marginTop: spacing[8],
    borderWidth: 1,
    borderColor: colors.borderCard,
    backgroundColor: colors.fathom,
    borderRadius: radius.card,
    padding: spacing[5],
    gap: spacing[3],
  },
  retryButton: {
    alignSelf: 'flex-start',
    minHeight: profileTokens.iconButtonSize,
    justifyContent: 'center',
  },
  retryLabel: {
    fontFamily: fontFamilies.semibold,
  },
})
