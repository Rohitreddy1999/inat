import { getLastCompletionDate } from '@/services/completion.service'

export type ReentryState = 'A' | 'B' | 'C' | 'D'

export async function getReentryState(
  journeyId: string,
): Promise<ReentryState> {
  const { date: lastDate } = await getLastCompletionDate(journeyId)

  if (!lastDate) return 'D'

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // LAUNCH FEATURE — RE-ENABLE BEFORE RELEASE
  // After a day is marked complete, immediately unlock the next day.
  // Removing the 24-hour gate so current_day (already incremented) is
  // available on the Home screen straight away.
  // if (lastDate === today) return 'B'
  if (lastDate === today || lastDate === yesterday) return 'A'
  // Original: if (lastDate === yesterday) return 'A'
  return 'C'
}
