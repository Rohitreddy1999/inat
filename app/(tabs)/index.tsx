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
import { OptionCard } from '@/components/forms/OptionCard'
import { StepDots } from '@/components/forms/StepDots'
import { StepCard } from '@/components/tasks/StepCard'
import { HoldButton } from '@/components/tasks/HoldButton'
import { BackButton } from '@/components/navigation/BackButton'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [optionA, setOptionA] = useState(false)
  const [optionB, setOptionB] = useState(true)
  const [step, setStep] = useState(3)
  const [step1Done, setStep1Done] = useState(false)
  const [step2Done, setStep2Done] = useState(true)
  const [step3Done, setStep3Done] = useState(false)
  const [holdCount, setHoldCount] = useState(0)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.pagePad,
          gap: 32,
        }}
      >
        {/* BackButton — Level 4 navigation test */}
        <Text variant="heading" color={colors.surge}>BackButton Component</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <BackButton onPress={() => {}} />
          <Text variant="caption" color={colors.textMid}>44×44 touch target, chevron-back icon</Text>
        </View>

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

        {/* OptionCard */}
        <Text variant="heading" color={colors.surge}>OptionCard Component</Text>
        <View style={{ gap: 9 }}>
          <Text variant="caption" color={colors.textMid}>1. Default unselected</Text>
          <OptionCard
            label="I want to move my body and build energy"
            selected={optionA}
            onPress={() => setOptionA(v => !v)}
          />
          <Text variant="caption" color={colors.textMid}>2. Selected (tap to deselect)</Text>
          <OptionCard
            label="I want to find my creative voice"
            selected={optionB}
            onPress={() => setOptionB(v => !v)}
          />
          <Text variant="caption" color={colors.textMid}>3. Disabled (max reached — tap to see shake)</Text>
          <OptionCard
            label="I want to build a daily rhythm"
            selected={false}
            onPress={() => {}}
            disabled
          />
          <Text variant="caption" color={colors.textMid}>4. Selected + tap disabled card above to trigger shake</Text>
          <OptionCard
            label="I want to quiet the noise and focus"
            selected
            onPress={() => {}}
          />
        </View>

        {/* StepDots */}
        <Text variant="heading" color={colors.surge}>StepDots Component</Text>
        <View style={{ gap: 20, alignItems: 'center' }}>
          <StepDots total={6} current={step} />
          <Text variant="caption" color={colors.textMid}>
            Step {step} of 6
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              variant="secondary"
              onPress={() => setStep(s => Math.max(1, s - 1))}
              fullWidth={false}
            >
              ← Back
            </Button>
            <Button
              variant="secondary"
              onPress={() => setStep(s => Math.min(6, s + 1))}
              fullWidth={false}
            >
              Forward →
            </Button>
          </View>
        </View>

        {/* StepCard */}
        <Text variant="heading" color={colors.surge}>StepCard Component</Text>
        <Text variant="caption" color={colors.textMid}>
          Tap step 1 or 3 to toggle done state. Step 2 starts done.
        </Text>
        <View>
          <StepCard
            index={1}
            text="Find a quiet space and set a timer for 5 minutes"
            done={step1Done}
            phaseColor={colors.phase.build}
            onToggle={() => setStep1Done(v => !v)}
          />
          <StepCard
            index={2}
            text="Close your eyes and take three deep breaths to centre yourself"
            done={step2Done}
            phaseColor={colors.phase.build}
            onToggle={() => setStep2Done(v => !v)}
          />
          <StepCard
            index={3}
            text="Begin moving at whatever pace feels right — no wrong answer"
            done={step3Done}
            phaseColor={colors.phase.build}
            onToggle={() => setStep3Done(v => !v)}
            isLast
          />
        </View>

        {/* HoldButton — scroll padding so it clears the fixed button */}
        <Text variant="heading" color={colors.surge}>HoldButton Component</Text>
        <Text variant="caption" color={colors.textMid}>
          Completed: {holdCount} {holdCount === 1 ? 'time' : 'times'}
        </Text>
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* HoldButton fixed at bottom — NEVER inside ScrollView */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: spacing.pagePad,
          paddingBottom: spacing[5],
          paddingTop: spacing[3],
          backgroundColor: colors.abyss,
        }}
      >
        <HoldButton
          phaseColor={colors.phase.build}
          onComplete={() => setHoldCount(c => c + 1)}
        />
      </View>
    </SafeAreaView>
  )
}
