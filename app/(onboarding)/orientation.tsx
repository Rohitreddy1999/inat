import { useEffect } from 'react'
import { View, StyleSheet, TextStyle } from 'react-native'
import { router } from 'expo-router'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'
import { colors, spacing, fontFamilies, typography } from '@/theme'
import { ScreenWrapper } from '@/components/shared/ScreenWrapper'
import { Text } from '@/components/core/Text'
import { Button } from '@/components/core/Button'

const DUR  = 500
const EASE = Easing.out(Easing.cubic)

function fadeUp(sv: { value: number }, ty: { value: number }, delay: number) {
  sv.value = withDelay(delay, withTiming(1, { duration: DUR, easing: EASE, reduceMotion: ReduceMotion.System }))
  ty.value = withDelay(delay, withTiming(0, { duration: DUR, easing: EASE, reduceMotion: ReduceMotion.System }))
}

export default function Orientation() {
  const wOpacity  = useSharedValue(0);  const wTy  = useSharedValue(16)
  const c1Opacity = useSharedValue(0);  const c1Ty = useSharedValue(16)
  const dvOpacity = useSharedValue(0);  const dvTy = useSharedValue(16)
  const c2Opacity = useSharedValue(0);  const c2Ty = useSharedValue(16)
  const c3Opacity = useSharedValue(0);  const c3Ty = useSharedValue(16)
  const btOpacity = useSharedValue(0);  const btTy = useSharedValue(16)

  useEffect(() => {
    fadeUp(wOpacity,  wTy,  0)
    fadeUp(c1Opacity, c1Ty, 200)
    fadeUp(dvOpacity, dvTy, 400)
    fadeUp(c2Opacity, c2Ty, 500)
    fadeUp(c3Opacity, c3Ty, 700)
    fadeUp(btOpacity, btTy, 900)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wStyle  = useAnimatedStyle(() => ({ opacity: wOpacity.value,  transform: [{ translateY: wTy.value  }] }))
  const c1Style = useAnimatedStyle(() => ({ opacity: c1Opacity.value, transform: [{ translateY: c1Ty.value }] }))
  const dvStyle = useAnimatedStyle(() => ({ opacity: dvOpacity.value, transform: [{ translateY: dvTy.value }] }))
  const c2Style = useAnimatedStyle(() => ({ opacity: c2Opacity.value, transform: [{ translateY: c2Ty.value }] }))
  const c3Style = useAnimatedStyle(() => ({ opacity: c3Opacity.value, transform: [{ translateY: c3Ty.value }] }))
  const btStyle = useAnimatedStyle(() => ({ opacity: btOpacity.value, transform: [{ translateY: btTy.value }] }))

  return (
    <ScreenWrapper padded>
      <View style={styles.top}>

        {/* Wordmark */}
        <Animated.View style={[styles.wordmarkRow, wStyle]}>
          <Text style={styles.letterI}>i</Text>
          <Text style={styles.letterN}>N</Text>
          <Text style={styles.letterA}>A</Text>
          <Text style={styles.letterT}>T</Text>
        </Animated.View>

        {/* Lines 1 + 2 */}
        <Animated.View style={[styles.copyBlock, c1Style]}>
          <Text variant="heading" color={colors.textHi} align="center">
            You&apos;ve been here before.
          </Text>
          <Text
            variant="body"
            color={colors.textMid}
            align="center"
            style={styles.line2}
          >
            That feeling of almost starting.
          </Text>
        </Animated.View>

        {/* Divider */}
        <Animated.View style={dvStyle}>
          <View style={styles.divider} />
        </Animated.View>

        {/* Lines 3 + 4 */}
        <Animated.View style={[styles.copyBlock, c2Style]}>
          <Text
            align="center"
            style={styles.voltHeading}
          >
            21 days. One Arc.
          </Text>
          <Text
            variant="body"
            color={colors.textMid}
            align="center"
            style={styles.line4}
          >
            A system built to find{'\n'}your flow state.
          </Text>
        </Animated.View>

        {/* Line 5 */}
        <Animated.View style={[styles.copyBlock, c3Style]}>
          <Text
            variant="body"
            color={colors.textHi}
            align="center"
            style={styles.line5}
          >
            By the end you&apos;ll know something{'\n'}real about yourself and the thing{'\n'}you chose to begin.
          </Text>
        </Animated.View>

      </View>

      {/* CTA */}
      <Animated.View style={[styles.bottom, btStyle]}>
        <Button
          variant="primary"
          onPress={() => router.replace('/(onboarding)/life-stage')}
        >
          {"Let's begin →"}
        </Button>
      </Animated.View>
    </ScreenWrapper>
  )
}

const LETTER_BASE: TextStyle = {
  fontFamily: fontFamilies.display,
  fontSize:   42,
  lineHeight: 42 * 1.1,
}

const styles = StyleSheet.create({
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordmarkRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    marginBottom:   spacing[10] + spacing[2],
  },
  letterI: { ...LETTER_BASE, color: colors.arcLight },
  letterN: { ...LETTER_BASE, color: colors.iris },
  letterA: { ...LETTER_BASE, color: colors.volt },
  letterT: { ...LETTER_BASE, color: colors.plasma },
  copyBlock: {
    alignItems: 'center',
  },
  line2: {
    marginTop: spacing[1],
  },
  divider: {
    width:           40,
    height:          1,
    backgroundColor: colors.borderStrong,
    alignSelf:       'center',
    marginTop:       spacing[8],
    marginBottom:    spacing[8],
  },
  voltHeading: {
    fontFamily: fontFamilies.heading,
    fontSize:   typography.size.heading,
    lineHeight: typography.size.heading * typography.leading.heading,
    color:      colors.volt,
    textAlign:  'center',
  },
  line4: {
    marginTop: spacing[2],
  },
  line5: {
    marginTop: spacing[8],
  },
  bottom: {
    paddingBottom: spacing[10] + spacing[2],
  },
})
