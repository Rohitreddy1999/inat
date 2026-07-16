import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/theme'
import { useState } from 'react'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'
import { Card } from '@/components/core/Card'
import { Input } from '@/components/core/Input'
import { Badge } from '@/components/core/Badge'
import { SkeletonCard } from '@/components/core/SkeletonCard'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.pagePad,
          gap: 32,
        }}
      >
        {/* Text variants */}
        <Text variant="heading" color={colors.surge}>Text Component</Text>
        <View style={{ gap: 12 }}>
          <Text variant="display">Display 52</Text>
          <Text variant="title">Title 34</Text>
          <Text variant="heading">Heading 26</Text>
          <Text variant="quote">Quote 20</Text>
          <Text variant="base">Base 15</Text>
          <Text variant="body">Body 13.5 — leading 1.55 for multi-line readability in long content blocks</Text>
          <Text variant="step">Step 14.5 medium</Text>
          <Text variant="caption" color={colors.textMid}>Caption 12</Text>
          <Text variant="micro" color={colors.textLow} uppercase>Micro 11 uppercase</Text>
          <Text variant="label" color={colors.textLow} uppercase>Label 10 uppercase</Text>
        </View>

        {/* Button variants */}
        <Text variant="heading" color={colors.surge}>Button Component</Text>
        <View style={{ gap: 12 }}>
          <Button variant="primary" onPress={() => {}}>Primary Button</Button>
          <Button variant="primary" onPress={() => {}} glow={false}>Primary — no glow</Button>
          <Button variant="primary" disabled onPress={() => {}}>Primary Disabled</Button>
          <Button variant="primary" loading onPress={() => {}}>Primary Loading</Button>
          <Button variant="secondary" onPress={() => {}}>Secondary Button</Button>
          <Button variant="secondary" disabled onPress={() => {}}>Secondary Disabled</Button>
          <Button
            variant="completed"
            phaseColor={colors.phase.foundation}
          >
            Foundation Complete
          </Button>
          <Button
            variant="completed"
            phaseColor={colors.phase.build}
          >
            Build Complete
          </Button>
          <Button
            variant="completed"
            phaseColor={colors.phase.commit}
          >
            Commit Complete
          </Button>
        </View>

        {/* Card variants */}
        <Text variant="heading" color={colors.surge}>Card Component</Text>
        <View style={{ gap: 12 }}>
          <Card>
            <Text variant="body">Default card — Fathom bg, borderCard border, 20px padding.</Text>
          </Card>
          <Card accent={colors.phase.foundation} strip="left">
            <Text variant="step">Accent left — Foundation blue strip + gradient glow</Text>
          </Card>
          <Card accent={colors.phase.build} strip="left">
            <Text variant="step">Accent left — Build (Surge) strip + gradient glow</Text>
          </Card>
          <Card accent={colors.phase.commit} strip="top">
            <Text variant="step">Accent top — Commit (Plasma) strip at top</Text>
          </Card>
          <Card onPress={() => {}}>
            <Text variant="body">Pressable card — tap to feel scale 0.985 spring</Text>
          </Card>
        </View>

        {/* Input variants */}
        <Text variant="heading" color={colors.surge}>Input Component</Text>
        <View style={{ gap: 14 }}>
          <Input
            placeholder="Default state — tap to focus"
            value={name}
            onChangeText={setName}
            hint="Tap to see the Surge focus glow"
          />
          <Input
            placeholder="With hint text"
            value={email}
            onChangeText={setEmail}
            hint="This is a hint message below the field"
          />
          <Input
            placeholder="Error state"
            value=""
            onChangeText={() => {}}
            error="This field is required"
          />
          <Input
            placeholder="Multiline input..."
            value={notes}
            onChangeText={setNotes}
            multiline
            hint="Multiline expands vertically"
          />
        </View>

        {/* Badge variants */}
        <Text variant="heading" color={colors.surge}>Badge Component</Text>
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Badge variant="streak" color={colors.phase.foundation}>7</Badge>
            <Badge variant="streak" color={colors.phase.build}>14</Badge>
            <Badge variant="streak" color={colors.phase.commit}>21</Badge>
            <Text variant="caption" color={colors.textMid}>streak (diamond)</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            <Badge variant="phase" color={colors.phase.foundation}>Foundation</Badge>
            <Badge variant="phase" color={colors.phase.build}>Build</Badge>
            <Badge variant="phase" color={colors.phase.commit}>Commit</Badge>
          </View>
          <Badge variant="recommended">Recommended</Badge>
          <Badge variant="comingSoon">Coming Soon</Badge>
          <Badge variant="pro">Pro</Badge>
        </View>

        {/* SkeletonCard */}
        <Text variant="heading" color={colors.surge}>SkeletonCard Component</Text>
        <View style={{ gap: 10 }}>
          <SkeletonCard />
          <SkeletonCard height={48} />
          <SkeletonCard height={120} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
