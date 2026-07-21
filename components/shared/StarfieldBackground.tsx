import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import Svg, { Circle, Line } from 'react-native-svg'
import { colors } from '@/theme'

const { width: SW, height: SH } = Dimensions.get('window')

interface Props {
  phaseColor: string
  brighterStars?: boolean
}

interface StarData {
  x: number; y: number; r: number
  baseOpacity: number; vx: number; vy: number
  twinkleOffset: number; twinkleSpeed: number
}

interface ClusterStarData {
  dx: number; dy: number; r: number; baseOpacity: number
}

interface ClusterData {
  cx: number; cy: number; vx: number; vy: number
  stars: ClusterStarData[]
}

interface StreakData {
  x: number; y: number; length: number; angle: number
  progress: number; active: boolean; duration: number
}

function makeStars(): StarData[] {
  return Array.from({ length: 180 }, () => ({
    x: Math.random() * SW,
    y: Math.random() * SH,
    r: 0.2 + Math.random() * 1.1,
    baseOpacity: 0.08 + Math.random() * 0.52,
    vx: (Math.random() - 0.5) * 0.16,
    vy: (Math.random() - 0.5) * 0.16,
    twinkleOffset: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.5 + Math.random() * 1.5,
  }))
}

function makeClusters(): ClusterData[] {
  return Array.from({ length: 3 }, () => ({
    cx: Math.random() * SW,
    cy: Math.random() * SH,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
    stars: Array.from({ length: 22 }, () => ({
      dx: (Math.random() - 0.5) * 50,
      dy: (Math.random() - 0.5) * 50,
      r: 0.2 + Math.random() * 0.8,
      baseOpacity: 0.1 + Math.random() * 0.4,
    })),
  }))
}

export function StarfieldBackground({ phaseColor: _phaseColor, brighterStars }: Props) {
  const starsRef     = useRef<StarData[]>(makeStars())
  const clustersRef  = useRef<ClusterData[]>(makeClusters())
  const streakRef    = useRef<StreakData>({
    x: 0, y: 0, length: 40, angle: 0.4,
    progress: 0, active: false, duration: 1000,
  })
  const rafRef           = useRef<number | null>(null)
  const lastTsRef        = useRef(0)
  const elapsedRef       = useRef(0)
  const lastStreakTsRef  = useRef(-1)
  const nextDelayRef     = useRef(3000 + Math.random() * 1000)
  const frameCountRef    = useRef(0)

  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const loop = (ts: number) => {
      if (lastTsRef.current === 0) {
        lastTsRef.current = ts
        lastStreakTsRef.current = ts
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const dt = Math.min(ts - lastTsRef.current, 50)
      lastTsRef.current = ts
      elapsedRef.current += dt * 0.001

      const stars = starsRef.current
      for (let i = 0; i < stars.length; i++) {
        stars[i].x += stars[i].vx
        stars[i].y += stars[i].vy
        if (stars[i].x < -2) stars[i].x += SW + 4
        if (stars[i].x > SW + 2) stars[i].x -= SW + 4
        if (stars[i].y < -2) stars[i].y += SH + 4
        if (stars[i].y > SH + 2) stars[i].y -= SH + 4
      }

      const clusters = clustersRef.current
      for (let i = 0; i < clusters.length; i++) {
        clusters[i].cx += clusters[i].vx
        clusters[i].cy += clusters[i].vy
        if (clusters[i].cx < -60) clusters[i].cx += SW + 120
        if (clusters[i].cx > SW + 60) clusters[i].cx -= SW + 120
        if (clusters[i].cy < -60) clusters[i].cy += SH + 120
        if (clusters[i].cy > SH + 60) clusters[i].cy -= SH + 120
      }

      const sk = streakRef.current
      if (sk.active) {
        sk.progress += dt / sk.duration
        if (sk.progress >= 1) {
          sk.active = false
          lastStreakTsRef.current = ts
          nextDelayRef.current = 3000 + Math.random() * 1000
        }
      } else if (ts - lastStreakTsRef.current > nextDelayRef.current) {
        sk.x        = 30 + Math.random() * (SW - 60)
        sk.y        = 20 + Math.random() * (SH * 0.45)
        sk.length   = 20 + Math.random() * 40
        sk.angle    = (20 + Math.random() * 15) * (Math.PI / 180)
        sk.progress = 0
        sk.active   = true
        sk.duration = 800 + Math.random() * 400
        lastStreakTsRef.current = ts
      }

      frameCountRef.current++
      if (frameCountRef.current % 2 === 0) {
        forceUpdate(n => n + 1)
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const t    = elapsedRef.current
  const mult = brighterStars ? 1.4 : 1.0
  const sk   = streakRef.current

  let streakOp = 0
  if (sk.active) {
    const p = sk.progress
    if (p < 0.3)      streakOp = (p / 0.3) * 0.55
    else if (p <= 0.7) streakOp = 0.55
    else               streakOp = ((1 - p) / 0.3) * 0.55
    streakOp = Math.max(0, Math.min(0.55, streakOp))
  }

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.abyss }]}>
      <Svg width={SW} height={SH} style={StyleSheet.absoluteFill}>
        {/* Layer 1 — individual stars */}
        {starsRef.current.map((star, i) => {
          const tw = Math.sin(t * star.twinkleSpeed + star.twinkleOffset) * 0.3
          const op = Math.min(1, Math.max(0, (star.baseOpacity + tw) * mult))
          return (
            <Circle key={`s${i}`} cx={star.x} cy={star.y} r={star.r} fill={colors.arcLight} fillOpacity={op} />
          )
        })}

        {/* Layer 2 — star clusters */}
        {clustersRef.current.flatMap((cl, ci) =>
          cl.stars.map((cs, si) => (
            <Circle
              key={`c${ci}_${si}`}
              cx={cl.cx + cs.dx}
              cy={cl.cy + cs.dy}
              r={cs.r}
              fill={colors.arcLight}
              fillOpacity={Math.min(1, cs.baseOpacity * mult)}
            />
          ))
        )}

        {/* Layer 3 — shooting streak */}
        {sk.active && streakOp > 0.01 && (
          <Line
            x1={sk.x}
            y1={sk.y}
            x2={sk.x + Math.cos(sk.angle) * sk.length}
            y2={sk.y + Math.sin(sk.angle) * sk.length}
            stroke={colors.arcLight}
            strokeWidth={0.7}
            strokeOpacity={streakOp}
          />
        )}
      </Svg>
    </View>
  )
}
