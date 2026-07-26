import React, { useEffect, useState } from 'react'
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Text as SvgText,
} from 'react-native-svg'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  ReduceMotion,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import {
  brandMotion,
  colors,
  fontFamilies,
  radius,
  typography,
} from '@/theme'

const VIEWBOX_WIDTH = 760
const VIEWBOX_HEIGHT = 300

const I_PATH = 'M 92 218 L 92 104'

const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedG = Animated.createAnimatedComponent(G)
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText)
const AnimatedLine = Animated.createAnimatedComponent(Line)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const ORBIT_INPUT = [0.54, 0.58, 0.66, 0.74, 0.80, 0.86, 0.91]
const ORBIT_X = [92, 220, 470, 700, 700, 360, 92]
const ORBIT_Y = [235, 255, 255, 235, 96, 68, 72]

type AnimatedWordmarkProps = {
  animated?: boolean
  onComplete?: () => void
  showDeclaration?: boolean
  style?: StyleProp<ViewStyle>
}

type WritingStrokeProps = {
  d: string
  length: number
  start: number
  end: number
  strokeWidth: number
  timeline: SharedValue<number>
}

type LetterGlyphProps = {
  glyph: 'N' | 'A' | 'T'
  x: number
  length: number
  start: number
  end: number
  color: string
  ignitionStart: number
  timeline: SharedValue<number>
}

type MagicParticlesProps = {
  timeline: SharedValue<number>
  start: number
  end: number
  x: number
  y: number
}

function WritingStroke({
  d,
  length,
  start,
  end,
  strokeWidth,
  timeline,
}: WritingStrokeProps) {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(
      timeline.value,
      [start, end],
      [length, 0],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      timeline.value,
      [start, start + 0.015],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }))

  return (
    <AnimatedPath
      d={d}
      fill="none"
      stroke={colors.arcLight}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeDasharray={`${length} ${length}`}
      animatedProps={animatedProps}
    />
  )
}

function LetterGlyph({
  glyph,
  x,
  length,
  start,
  end,
  color,
  ignitionStart,
  timeline,
}: LetterGlyphProps) {
  const paleProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(
      timeline.value,
      [start, end],
      [length, 0],
      Extrapolation.CLAMP,
    ),
    fillOpacity: interpolate(
      timeline.value,
      [end - 0.025, end],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      timeline.value,
      [start, start + 0.015, ignitionStart, ignitionStart + 0.035],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    ),
  }))

  const colorProps = useAnimatedProps(() => ({
    opacity: interpolate(
      timeline.value,
      [ignitionStart, ignitionStart + 0.035],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }))

  return (
    <>
      <AnimatedSvgText
        x={x}
        y={219}
        fill={colors.arcLight}
        stroke={colors.arcLight}
        strokeWidth={2}
        strokeDasharray={`${length} ${length}`}
        fontFamily={fontFamilies.display}
        fontSize={172}
        fontWeight="800"
        animatedProps={paleProps}
      >
        {glyph}
      </AnimatedSvgText>
      <AnimatedSvgText
        x={x}
        y={219}
        fill={color}
        fontFamily={fontFamilies.display}
        fontSize={172}
        fontWeight="800"
        animatedProps={colorProps}
      >
        {glyph}
      </AnimatedSvgText>
    </>
  )
}

function MagicParticles({
  timeline,
  start,
  end,
  x,
  y,
}: MagicParticlesProps) {
  const animatedProps = useAnimatedProps(() => ({
    opacity: interpolate(
      timeline.value,
      [start, start + 0.02, end - 0.02, end],
      [0, 0.85, 0.55, 0],
      Extrapolation.CLAMP,
    ),
  }))

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Circle cx={x} cy={y} r={5} fill={colors.arcLight} opacity={0.8} />
      <Circle cx={x - 17} cy={y + 8} r={3} fill={colors.arcLight} opacity={0.55} />
      <Circle cx={x + 15} cy={y - 11} r={2.5} fill={colors.arcLight} opacity={0.4} />
      <Circle cx={x - 8} cy={y - 19} r={2} fill={colors.arcLight} opacity={0.28} />
      <Path
        d={`M ${x - 34} ${y + 13} L ${x - 13} ${y + 4} M ${x + 12} ${y - 4} L ${x + 31} ${y - 17}`}
        stroke={colors.arcLight}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.32}
      />
    </AnimatedG>
  )
}

export function AnimatedWordmark({
  animated = true,
  onComplete,
  showDeclaration = true,
  style,
}: AnimatedWordmarkProps) {
  const timeline = useSharedValue(animated ? 0 : 1)
  const reducedMotion = useReducedMotion()
  const [layoutWidth, setLayoutWidth] = useState(0)

  useEffect(() => {
    if (!animated || reducedMotion) {
      timeline.value = 1
      const immediate = setTimeout(() => onComplete?.(), 0)
      return () => clearTimeout(immediate)
    }

    timeline.value = 0
    timeline.value = withTiming(1, {
      duration: brandMotion.firstLaunchDuration,
      easing: Easing.linear,
      reduceMotion: ReduceMotion.System,
    })

    const completion = setTimeout(
      () => onComplete?.(),
      brandMotion.firstLaunchDuration,
    )
    return () => clearTimeout(completion)
  }, [animated, onComplete, reducedMotion, timeline])

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width)
  }

  const orbStyle = useAnimatedStyle(() => {
    const progress = timeline.value
    const scale = layoutWidth / VIEWBOX_WIDTH
    const x = interpolate(progress, ORBIT_INPUT, ORBIT_X, Extrapolation.CLAMP)
    const y = interpolate(progress, ORBIT_INPUT, ORBIT_Y, Extrapolation.CLAMP)
    const visible = progress >= ORBIT_INPUT[0] ? 1 : 0

    return {
      opacity: visible,
      transform: [
        { translateX: x * scale },
        { translateY: y * scale },
        { rotate: `${interpolate(progress, [0.54, 0.91], [0, 720], Extrapolation.CLAMP)}deg` },
        {
          scale: interpolate(
            progress,
            [0.54, 0.57],
            [0.2, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }
  }, [layoutWidth])

  const orbEnergyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      timeline.value,
      [0.54, 0.56, 0.87, 0.91],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [{
      scale: interpolate(
        timeline.value,
        [0.87, 0.91],
        [1, 0.35],
        Extrapolation.CLAMP,
      ),
    }],
  }))

  const landingAuraStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      timeline.value,
      [0.86, 0.89, 0.94],
      [0, 0.28, 0],
      Extrapolation.CLAMP,
    ),
    transform: [{
      scale: interpolate(
        timeline.value,
        [0.86, 0.94],
        [0.7, 1.4],
        Extrapolation.CLAMP,
      ),
    }],
  }))

  const declarationStyle = useAnimatedStyle(() => ({
    opacity: showDeclaration && timeline.value >= 0.95 ? 1 : 0,
  }), [showDeclaration])

  const separatorProps = useAnimatedProps(() => ({
    x2: interpolate(
      timeline.value,
      [0.90, 0.94],
      [132, 628],
      Extrapolation.CLAMP,
    ),
    opacity: showDeclaration
      ? interpolate(
          timeline.value,
          [0.90, 0.92],
          [0, 0.22],
          Extrapolation.CLAMP,
        )
      : 0,
  }), [showDeclaration])

  const separatorGlowProps = useAnimatedProps(() => ({
    opacity: showDeclaration
      ? interpolate(
          timeline.value,
          [0.90, 0.93, 0.97, 1],
          [0, 0.72, 0.24, 0.18],
          Extrapolation.CLAMP,
        )
      : 0,
  }), [showDeclaration])

  const componentHeight = layoutWidth > 0
    ? layoutWidth / brandMotion.wordmarkAspectRatio
    : undefined

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="INAT. Initiate, Nurture, Adapt, Transcend."
      onLayout={handleLayout}
      style={[styles.container, componentHeight ? { height: componentHeight } : null, style]}
    >
      <Animated.View pointerEvents="none" style={[styles.landingAura, landingAuraStyle]} />

      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        importantForAccessibility="no-hide-descendants"
      >
        <WritingStroke
          d={I_PATH}
          length={115}
          start={0}
          end={0.12}
          strokeWidth={46}
          timeline={timeline}
        />
        <LetterGlyph
          glyph="N"
          x={144}
          length={720}
          start={0.12}
          end={0.27}
          color={colors.iris}
          ignitionStart={0.60}
          timeline={timeline}
        />
        <LetterGlyph
          glyph="A"
          x={348}
          length={680}
          start={0.27}
          end={0.41}
          color={colors.volt}
          ignitionStart={0.68}
          timeline={timeline}
        />
        <LetterGlyph
          glyph="T"
          x={548}
          length={620}
          start={0.41}
          end={0.54}
          color={colors.plasma}
          ignitionStart={0.76}
          timeline={timeline}
        />

        <MagicParticles timeline={timeline} start={0} end={0.12} x={92} y={94} />
        <MagicParticles timeline={timeline} start={0.12} end={0.27} x={302} y={112} />
        <MagicParticles timeline={timeline} start={0.27} end={0.41} x={500} y={178} />
        <MagicParticles timeline={timeline} start={0.41} end={0.54} x={668} y={116} />

        <AnimatedLine
          x1={132}
          y1={251}
          y2={251}
          stroke={colors.arcLight}
          strokeWidth={1.5}
          animatedProps={separatorProps}
        />
        <AnimatedCircle
          cx={628}
          cy={251}
          r={5}
          fill={colors.arcLight}
          animatedProps={separatorGlowProps}
        />
      </Svg>

      <Animated.View pointerEvents="none" style={[styles.orb, orbStyle]}>
        <View style={styles.orbCore} />
        <Animated.View style={[styles.orbEnergy, orbEnergyStyle]}>
          <View style={[styles.atomicRing, styles.atomicRingOne]} />
          <View style={[styles.atomicRing, styles.atomicRingTwo]} />
          <View style={[styles.atomParticle, styles.atomIris]} />
          <View style={[styles.atomParticle, styles.atomVolt]} />
          <View style={[styles.atomParticle, styles.atomPlasma]} />
        </Animated.View>
      </Animated.View>

      <Animated.Text
        importantForAccessibility="no-hide-descendants"
        style={[styles.declaration, declarationStyle]}
      >
        INITIATE · NURTURE · ADAPT · TRANSCEND
      </Animated.Text>
    </View>
  )
}

const orbOffset = brandMotion.orbSize / 2
const declarationStyle: TextStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  color: colors.textMid,
  fontFamily: fontFamilies.medium,
  fontSize: typography.size.label,
  letterSpacing: typography.size.label * brandMotion.declarationTracking,
  textAlign: 'center',
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: brandMotion.wordmarkMaxWidth,
    minHeight: 166,
    alignSelf: 'center',
    position: 'relative',
  },
  landingAura: {
    position: 'absolute',
    width: '72%',
    aspectRatio: 2.4,
    left: '14%',
    top: '23%',
    backgroundColor: colors.textFaint,
    borderRadius: radius.full,
    shadowColor: colors.arcLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },
  orb: {
    position: 'absolute',
    left: -orbOffset,
    top: -orbOffset,
    width: brandMotion.orbSize,
    height: brandMotion.orbSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCore: {
    width: brandMotion.orbSize,
    height: brandMotion.orbSize,
    borderRadius: radius.full,
    backgroundColor: colors.arcLight,
    shadowColor: colors.arcLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
  orbEnergy: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atomicRing: {
    position: 'absolute',
    width: 34,
    height: 13,
    borderWidth: 1,
    borderColor: colors.arcLight,
    borderRadius: radius.full,
    opacity: 0.65,
  },
  atomicRingOne: {
    transform: [{ rotate: '26deg' }],
  },
  atomicRingTwo: {
    transform: [{ rotate: '-38deg' }],
    opacity: 0.42,
  },
  atomParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: radius.full,
  },
  atomIris: {
    backgroundColor: colors.iris,
    transform: [{ translateX: 13 }, { translateY: 5 }],
  },
  atomVolt: {
    backgroundColor: colors.volt,
    transform: [{ translateX: -12 }, { translateY: -4 }],
  },
  atomPlasma: {
    backgroundColor: colors.plasma,
    transform: [{ translateX: 4 }, { translateY: -10 }],
  },
  declaration: declarationStyle,
})
