import { View } from 'react-native'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { colors } from '@/theme'

export default function Graduation() {
  return (
    <ScreenWrapper padded>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="heading" color={colors.textHi}>Graduation</Text>
      </View>
    </ScreenWrapper>
  )
}
