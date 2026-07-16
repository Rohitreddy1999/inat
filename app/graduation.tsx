import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/theme'

export default function Graduation() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textHi, fontSize: 18 }}>Graduation</Text>
      </View>
    </SafeAreaView>
  )
}
