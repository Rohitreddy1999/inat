import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Badge } from '@/components/core/Badge'
import { colors, spacing } from '@/theme'

export default function Community() {
  return (
    <ScreenWrapper padded>
      <View
        style={{
          flex:           1,
          justifyContent: 'center',
          alignItems:     'center',
          paddingBottom:  spacing.navHeight,
        }}
      >
        <Ionicons name="people" size={48} color={colors.textFaint} />
        <Text
          variant="heading"
          color={colors.textMid}
          align="center"
          style={{ marginTop: spacing[4] }}
        >
          Community
        </Text>
        <Text
          variant="body"
          color={colors.textLow}
          align="center"
          style={{ marginTop: spacing[2] }}
        >
          Connect with others on their circuit.
        </Text>
        <View style={{ marginTop: spacing[4] }}>
          <Badge variant="comingSoon">Coming Soon</Badge>
        </View>
      </View>
    </ScreenWrapper>
  )
}
