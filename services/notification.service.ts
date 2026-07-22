import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'

const PRACTICE_REMINDER_ID = 'inat-daily-practice'
const PRACTICE_CHANNEL_ID = 'practice-reminders'

export type PracticeReminder = {
  enabled: boolean
  hour: number
  minute: number
  permission: Notifications.PermissionStatus
}

function readDailyTrigger(
  trigger: Notifications.NotificationTrigger | null,
): { hour: number; minute: number } | null {
  if (!trigger || typeof trigger !== 'object') return null
  if (!('hour' in trigger) || !('minute' in trigger)) return null
  if (typeof trigger.hour !== 'number' || typeof trigger.minute !== 'number') return null
  return { hour: trigger.hour, minute: trigger.minute }
}

export async function getPracticeReminder(): Promise<PracticeReminder> {
  const [permissions, scheduled] = await Promise.all([
    Notifications.getPermissionsAsync(),
    Notifications.getAllScheduledNotificationsAsync(),
  ])
  const reminder = scheduled.find((request) => request.identifier === PRACTICE_REMINDER_ID)
  const time = readDailyTrigger(reminder?.trigger ?? null)

  return {
    enabled: Boolean(reminder && time),
    hour: time?.hour ?? 7,
    minute: time?.minute ?? 0,
    permission: permissions.status,
  }
}

export async function savePracticeReminder(
  enabled: boolean,
  hour: number,
  minute: number,
): Promise<{ permission: Notifications.PermissionStatus; error: Error | null }> {
  try {
    await Notifications.cancelScheduledNotificationAsync(PRACTICE_REMINDER_ID)
    if (!enabled) {
      const permissions = await Notifications.getPermissionsAsync()
      return { permission: permissions.status, error: null }
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(PRACTICE_CHANNEL_ID, {
        name: 'Practice reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      })
    }

    const permissions = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: true },
    })
    if (permissions.status !== Notifications.PermissionStatus.GRANTED) {
      return {
        permission: permissions.status,
        error: new Error('Notifications are disabled for INAT in your device settings.'),
      }
    }

    await Notifications.scheduleNotificationAsync({
      identifier: PRACTICE_REMINDER_ID,
      content: {
        title: 'Your circuit is waiting.',
        body: 'Return when you are ready to practice.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: Platform.OS === 'android' ? PRACTICE_CHANNEL_ID : undefined,
      },
    })

    return { permission: permissions.status, error: null }
  } catch (error) {
    return {
      permission: Notifications.PermissionStatus.UNDETERMINED,
      error: error instanceof Error ? error : new Error('The reminder could not be saved.'),
    }
  }
}

export function formatReminderTime(hour: number, minute: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2000, 0, 1, hour, minute))
}
