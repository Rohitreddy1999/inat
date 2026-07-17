import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Svg, { Path, ClipPath, Rect, Defs, G } from 'react-native-svg'
import { colors } from '@/theme'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'

let _silhouetteId = 0

const SILHOUETTE_PATH =
  'M100,20 C115,20 128,33 128,48 C128,63 115,76 ' +
  '100,76 C85,76 72,63 72,48 C72,33 85,20 100,20 Z ' +
  'M75,80 C55,85 45,100 45,120 L45,200 C45,210 ' +
  '52,218 62,218 L62,320 C62,330 70,338 80,338 ' +
  'L90,338 L90,380 C90,390 95,395 100,395 ' +
  'C105,395 110,390 110,380 L110,338 L120,338 ' +
  'C130,338 138,330 138,320 L138,218 C148,218 ' +
  '155,210 155,200 L155,120 C155,100 145,85 ' +
  '125,80 Z'

type Props = {
  completedDays: number
  phaseColor: string
  totalDays?: number
  size?: 'full' | 'mini'
  animated?: boolean
}

export function Silhouette({
  completedDays,
  phaseColor,
  totalDays = 21,
  size = 'full',
  animated = true,
}: Props) {
  const isMini   = size === 'mini'
  const svgW     = isMini ? 100 : 200
  const svgH     = isMini ? 200 : 400
  const viewBox  = '0 0 200 400'

  const ratio    = Math.min(completedDays / totalDays, 1)
  const clipY    = 400 * (1 - ratio)
  const clipH    = 400 * ratio

  const clipId     = useRef(`litClip_${++_silhouetteId}`).current
  const translateY = useSharedValue(0)

  useEffect(() => {
    if (!animated) return
    translateY.value = withRepeat(
      withTiming(-8, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    )
  }, [animated, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View
      style={[{ width: svgW, height: svgH }, animatedStyle]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${completedDays} of ${totalDays} days completed`}
    >
      <Svg width={svgW} height={svgH} viewBox={viewBox}>
        <Defs>
          <ClipPath id={clipId}>
            <Rect x="0" y={clipY} width="200" height={clipH} />
          </ClipPath>
        </Defs>

        {/* Base layer — always visible at 4% white */}
        <Path d={SILHOUETTE_PATH} fill={colors.textGhost} />

        {/* Lit layer — phaseColor, clipped from bottom up */}
        <G clipPath={`url(#${clipId})`}>
          <Path d={SILHOUETTE_PATH} fill={phaseColor} />
        </G>
      </Svg>
    </Animated.View>
  )
}
