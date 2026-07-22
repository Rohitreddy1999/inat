import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/core/Text'
import { colors, fontFamilies, profile as profileTokens, radius, typography } from '@/theme'

type Props = {
  name: string
  avatarUrl: string | null
  loading?: boolean
  onPress: () => void
}

export function ProfileAvatar({ name, avatarUrl, loading = false, onPress }: Props) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?'

  return (
    <Pressable
      onPress={loading ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={avatarUrl ? 'Change profile picture' : 'Add profile picture'}
      accessibilityState={{ busy: loading }}
      style={styles.touchTarget}
    >
      <View style={styles.avatar}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.image} accessibilityIgnoresInvertColors />
        ) : (
          <Text variant="heading" color={colors.arcLight} style={styles.initials}>
            {initials}
          </Text>
        )}
        {loading ? <ActivityIndicator color={colors.iris} /> : null}
      </View>
      <View style={styles.editBadge} pointerEvents="none">
        <Ionicons name="camera-outline" size={typography.size.base} color={colors.arcLight} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  touchTarget: {
    width: profileTokens.avatarSize + profileTokens.avatarEditSize / 2,
    height: profileTokens.avatarSize + profileTokens.avatarEditSize / 2,
  },
  avatar: {
    width: profileTokens.avatarSize,
    height: profileTokens.avatarSize,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.borderIris,
    backgroundColor: colors.irisTint,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontFamily: fontFamilies.bold,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: profileTokens.avatarEditSize,
    height: profileTokens.avatarEditSize,
    borderRadius: radius.full,
    backgroundColor: colors.iris,
    borderWidth: 2,
    borderColor: colors.abyss,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
