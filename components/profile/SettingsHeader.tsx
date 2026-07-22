import { StyleSheet, View } from 'react-native'
import { BackButton } from '@/components/navigation/BackButton'
import { Text } from '@/components/core/Text'
import { colors, fontFamilies, profile } from '@/theme'

export function SettingsHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <BackButton onPress={onBack} />
      <Text variant="heading" color={colors.textHi} style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamilies.bold,
  },
  spacer: {
    width: profile.iconButtonSize,
    height: profile.iconButtonSize,
  },
})
