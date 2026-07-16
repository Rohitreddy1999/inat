import { SafeAreaView, View, Text } from 'react-native'
import { colors } from '@/theme'

export default function Focus() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textHi, fontSize: 18 }}>Focus</Text>
      </View>
    </SafeAreaView>
  )
}
