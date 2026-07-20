import { useEffect, useState } from 'react'
import { View, Alert, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { Text } from '@/components/core/Text'
import { Card } from '@/components/core/Card'
import { PhaseProgressRing } from '@/components/shared/PhaseProgressRing'
import { useJourneyStore } from '@/stores/journey.store'
import { getProfile } from '@/services/profile.service'
import { getSubtrackById } from '@/services/curriculum.service'
import { getSession, signOut } from '@/services/auth.service'
import { colors, getPhaseColor, spacing, radius } from '@/theme'
import { Profile, Subtrack } from '@/types'

const LIFE_STAGE_LABELS: Record<string, string> = {
  still_studying:   'Still studying',
  building_career:  'Building my career',
  juggling_family:  'Juggling family life',
  reinventing:      'Reinventing myself',
}

function SettingRow({
  icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
  destructive?: boolean
}) {
  return (
    <Card onPress={onPress} style={{ borderRadius: 0, borderWidth: 0, borderBottomWidth: 1, borderBottomColor: colors.borderSoft }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? colors.error : colors.textMid}
        />
        <Text
          variant="base"
          color={destructive ? colors.error : colors.textHi}
          style={{ flex: 1 }}
        >
          {label}
        </Text>
        {!destructive && (
          <Ionicons name="chevron-forward" size={16} color={colors.textLow} />
        )}
      </View>
    </Card>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const { activeJourney, currentDay, reset } = useJourneyStore()

  const [profile, setProfile]   = useState<Profile | null>(null)
  const [subtrack, setSubtrack] = useState<Subtrack | null>(null)

  const phaseColor  = currentDay > 0 ? getPhaseColor(currentDay) : getPhaseColor(1)
  const dayInPhase  = currentDay > 0 ? ((currentDay - 1) % 7) + 1 : 1

  useEffect(() => {
    getSession().then(({ session }) => {
      if (!session?.user?.id) return
      getProfile(session.user.id).then(({ profile: p }) => setProfile(p))
    })

    if (activeJourney) {
      getSubtrackById(activeJourney.subtrack_id).then(({ subtrack: s }) => setSubtrack(s))
    }
  }, [activeJourney])

  async function handleSignOut() {
    await signOut()
    reset()
    router.replace('/(auth)/welcome')
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This permanently deletes all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleSignOut,
        },
      ],
    )
  }

  const initials = profile?.full_name
    ? profile.full_name.trim().charAt(0).toUpperCase()
    : '?'

  return (
    <ScreenWrapper padded scrollable style={{ paddingTop: spacing[6], paddingBottom: spacing.pageBottom }}>
      {/* Profile header */}
      <View style={{ marginTop: spacing[6], alignItems: 'flex-start' }}>
        {/* Avatar circle */}
        <View
          style={{
            width:           60,
            height:          60,
            borderRadius:    30,
            backgroundColor: colors.voltTint,
            borderWidth:     2,
            borderColor:     colors.borderIris,
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          <Text variant="heading" color={colors.iris}>
            {initials}
          </Text>
        </View>

        <Text variant="title" color={colors.textHi} style={{ marginTop: spacing[3] }}>
          {profile?.full_name ?? ''}
        </Text>

        {profile?.life_stage ? (
          <Text variant="body" color={colors.textMid} style={{ marginTop: spacing[1] }}>
            {LIFE_STAGE_LABELS[profile.life_stage] ?? profile.life_stage}
          </Text>
        ) : null}
      </View>

      {/* Active journey card */}
      {activeJourney ? (
        <View style={{ marginTop: spacing[8] }}>
          <SectionLabel>ACTIVE CIRCUIT</SectionLabel>
          <Card accent={phaseColor} style={{ marginTop: spacing[3] }}>
            <Text variant="base" color={colors.textHi} style={{ fontWeight: '700' }}>
              {subtrack?.name ?? ''}
            </Text>
            <Text variant="body" color={colors.textMid} style={{ marginTop: spacing[1] }}>
              Day {currentDay} of 21
            </Text>
            <View style={{ marginTop: spacing[3] }}>
              <PhaseProgressRing dayInPhase={dayInPhase} phaseColor={phaseColor} />
            </View>
          </Card>
        </View>
      ) : null}

      {/* Settings */}
      <View style={{ marginTop: spacing[8] }}>
        <SectionLabel>SETTINGS</SectionLabel>
        <Card style={{ marginTop: spacing[3], padding: 0, overflow: 'hidden' }}>
          <SettingRow
            icon="notifications-outline"
            label="Notifications"
            onPress={() => {}}
          />
          <SettingRow
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => {}}
          />
          <SettingRow
            icon="mail-outline"
            label="Change Email"
            onPress={() => {}}
          />
        </Card>

        <Card
          onPress={handleSignOut}
          style={{ marginTop: spacing[4] }}
        >
          <Text variant="base" color={colors.error}>Sign out</Text>
        </Card>

        <View style={{ marginTop: spacing[2], alignItems: 'center' }}>
          <Pressable onPress={handleDeleteAccount} accessibilityRole="button">
            <Text
              variant="caption"
              color={colors.textLow}
              style={{ textDecorationLine: 'underline' }}
            >
              Delete account
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}
