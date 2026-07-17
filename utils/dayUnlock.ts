import { getLastCompletionDate } from '@/services/completion.service'

export type ReentryState = 'A' | 'B' | 'C' | 'D'

export async function getReentryState(
  journeyId: string,
): Promise<ReentryState> {
  const { date: lastDate } = await getLastCompletionDate(journeyId)

  if (!lastDate) return 'D'

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (lastDate === today) return 'B'
  if (lastDate === yesterday) return 'A'
  return 'C'
}
