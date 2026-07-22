import type { ComponentProps } from 'react'
import { StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/core/Text'
import { colors, fontFamilies, getPhaseColor, getPhaseName, profile, radius, spacing } from '@/theme'
import type { UserJourney } from '@/types'

type Props = {
  journey: UserJourney
  currentDay: number
}

type IconName = ComponentProps<typeof Ionicons>['name']

const ARC_ICONS: Record<string, IconName> = {
  move: 'body-outline',
  rhythm: 'pulse-outline',
  express: 'mic-outline',
  calm: 'water-outline',
  mindful: 'eye-outline',
}

export function ActiveCircuitCard({ journey, currentDay }: Props) {
  const isComplete = currentDay > 21 || Boolean(journey.completed_at)
  const safeDay = Math.min(Math.max(currentDay, 1), 21)
  const phaseColor = getPhaseColor(safeDay)
  const phaseName = isComplete ? 'COMPLETE' : getPhaseName(safeDay)
  const dayInPhase = isComplete ? 7 : ((safeDay - 1) % 7) + 1
  const arcIcon = ARC_ICONS[journey.arc.toLowerCase()] ?? 'compass-outline'

  return (
    <View
      style={[styles.card, { borderColor: `${phaseColor}33` }]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={
        isComplete
          ? `${journey.arc}, ${journey.focus}, circuit complete`
          : `${journey.arc}, ${journey.focus}, day ${safeDay} of 21, ${phaseName}`
      }
    >
      <View style={styles.circuitDetail}>
        <View style={styles.detailCopy}>
          <Text variant="label" color={colors.textLow} uppercase>Arc</Text>
          <Text variant="quote" color={colors.textHi} style={styles.detailValue}>{journey.arc}</Text>
        </View>
        <View style={[styles.detailIcon, { borderColor: `${phaseColor}99` }]}>
          <Ionicons name={arcIcon} size={22} color={phaseColor} />
        </View>
      </View>

      <View style={[styles.circuitDetail, styles.detailDivider]}>
        <View style={styles.detailCopy}>
          <Text variant="label" color={colors.textLow} uppercase>Focus</Text>
          <Text variant="quote" color={colors.textHi} style={styles.detailValue}>{journey.focus}</Text>
        </View>
        <View style={[styles.detailIcon, { borderColor: `${phaseColor}99` }]}>
          <Ionicons name="flag-outline" size={22} color={phaseColor} />
        </View>
      </View>

      <View style={styles.positionHeader}>
        <View>
          <Text variant="label" color={phaseColor} uppercase>{phaseName}</Text>
          <Text variant="heading" color={colors.textHi} style={styles.positionValue}>
            {isComplete ? 'Circuit complete' : `Day ${safeDay} of 21`}
          </Text>
        </View>
        <Text variant="caption" color={colors.textMid}>
          {isComplete ? '21 days' : `Position ${dayInPhase} of 7`}
        </Text>
      </View>

      <View
        style={styles.progress}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {Array.from({ length: 7 }, (_, index) => {
          const filled = index < dayInPhase
          const current = index === dayInPhase - 1
          const lineFilled = index < dayInPhase - 1
          return (
            <View key={index} style={[styles.progressStep, index < 6 && styles.progressStepFlexible]}>
              <View
                style={[
                  styles.dot,
                  { borderColor: filled ? phaseColor : colors.borderStrong },
                  filled && { backgroundColor: phaseColor },
                  current && styles.currentDot,
                ]}
              >
                <Text
                  variant="caption"
                  color={filled ? colors.abyss : colors.textMid}
                  style={styles.dotLabel}
                >
                  {index + 1}
                </Text>
              </View>
              {index < 6 ? (
                <View style={[styles.line, lineFilled && { backgroundColor: phaseColor }]} />
              ) : null}
            </View>
          )
        })}
      </View>

      <View style={styles.phaseLegend}>
        <Text variant="caption" color={colors.iris}>Foundation</Text>
        <Text variant="caption" color={colors.volt}>Build</Text>
        <Text variant="caption" color={colors.plasma}>Commit</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.fathom,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing[4],
  },
  circuitDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingVertical: spacing[3],
  },
  detailCopy: {
    flex: 1,
    gap: spacing[1],
  },
  detailValue: {
    fontFamily: fontFamilies.semibold,
  },
  detailIcon: {
    width: profile.circuitIconSize,
    height: profile.circuitIconSize,
    borderRadius: radius.full,
    borderWidth: 1,
    backgroundColor: colors.bgRaise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  positionHeader: {
    marginTop: spacing[2],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  positionValue: {
    marginTop: spacing[1],
    fontFamily: fontFamilies.bold,
  },
  progress: {
    marginTop: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStepFlexible: {
    flex: 1,
  },
  line: {
    height: profile.progressLineHeight,
    flex: 1,
    backgroundColor: colors.borderStrong,
  },
  dot: {
    width: profile.progressDotSize,
    height: profile.progressDotSize,
    borderRadius: radius.full,
    borderWidth: 1,
    backgroundColor: colors.fathom,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: {
    borderWidth: 2,
  },
  dotLabel: {
    fontFamily: fontFamilies.semibold,
  },
  phaseLegend: {
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
