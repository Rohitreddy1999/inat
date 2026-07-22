import type { ComponentProps, ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/core/Text'
import { colors, profile, radius, spacing, typography } from '@/theme'

type IconName = ComponentProps<typeof Ionicons>['name']

export function SettingsGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View>
      {title ? <Text variant="micro" color={colors.textLow} uppercase>{title}</Text> : null}
      <View style={[styles.group, !title && styles.groupWithoutTitle]}>{children}</View>
    </View>
  )
}

type RowProps = {
  icon: IconName
  label: string
  value?: string
  onPress?: () => void
  destructive?: boolean
  disabled?: boolean
  last?: boolean
  accessibilityHint?: string
}

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  destructive = false,
  disabled = false,
  last = false,
  accessibilityHint,
}: RowProps) {
  const contentColor = destructive ? colors.error : disabled ? colors.textLow : colors.textHi

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={[
        styles.row,
        !last && styles.rowDivider,
      ]}
      android_ripple={onPress && !disabled ? { color: colors.irisTint } : undefined}
    >
      <Ionicons name={icon} size={typography.size.quote} color={destructive ? colors.error : colors.textMid} />
      <Text variant="base" color={contentColor} style={styles.label}>{label}</Text>
      {value ? (
        <Text variant="caption" color={colors.textMid} numberOfLines={1} style={styles.value}>{value}</Text>
      ) : null}
      {onPress && !disabled ? (
        <Ionicons name="chevron-forward" size={typography.size.base} color={colors.textLow} />
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  group: {
    marginTop: spacing[3],
    backgroundColor: colors.fathom,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  groupWithoutTitle: {
    marginTop: 0,
  },
  row: {
    minHeight: profile.settingRowMinHeight,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  label: {
    flex: 1,
  },
  value: {
    maxWidth: '44%',
    textAlign: 'right',
  },
})
