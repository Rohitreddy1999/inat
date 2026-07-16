import { SafeAreaView, View, Text } from 'react-native'
import { colors } from '@/theme'

export default function Ascent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textHi, fontSize: 18 }}>Ascent</Text>
      </View>
    </SafeAreaView>
  )
}
