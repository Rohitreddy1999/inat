import { supabase } from '@/lib/supabase'

export async function setJourneyDay(
  journeyId: string,
  userId: string,
  targetDay: number,
): Promise<{ error: string | null }> {
  const { error: updateError } = await supabase
    .from('user_journeys')
    .update({ current_day: targetDay, last_active_at: new Date().toISOString() })
    .eq('id', journeyId)
  if (updateError) return { error: updateError.message }

  const { error: deleteError } = await supabase
    .from('daily_completions')
    .delete()
    .eq('journey_id', journeyId)
  if (deleteError) return { error: deleteError.message }

  if (targetDay > 1) {
    const rows = Array.from({ length: targetDay - 1 }, (_, i) => ({
      journey_id: journeyId,
      user_id: userId,
      day_number: i + 1,
      completed_date: new Date(Date.now() - (targetDay - 1 - i) * 86400000)
        .toISOString()
        .split('T')[0],
      feeling: 'good',
      reflection_note: '',
    }))
    const { error: insertError } = await supabase.from('daily_completions').insert(rows)
    if (insertError) return { error: insertError.message }
  }

  return { error: null }
}

export async function resetJourney(
  userId: string,
  journeyId: string,
): Promise<{ error: string | null }> {
  const { error: deleteError } = await supabase
    .from('daily_completions')
    .delete()
    .eq('journey_id', journeyId)
  if (deleteError) return { error: deleteError.message }

  const { error: updateError } = await supabase
    .from('user_journeys')
    .update({ is_active: false })
    .eq('id', journeyId)
    .eq('user_id', userId)
  if (updateError) return { error: updateError.message }

  return { error: null }
}

export async function setLastCompletionDate(
  journeyId: string,
  when: 'today' | 'yesterday' | '5daysago',
): Promise<{ error: string | null }> {
  const offsets = { today: 0, yesterday: 1, '5daysago': 5 }
  const targetDate = new Date(Date.now() - offsets[when] * 86400000)
    .toISOString()
    .split('T')[0]

  const { data, error: selectError } = await supabase
    .from('daily_completions')
    .select('id')
    .eq('journey_id', journeyId)
    .order('day_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (selectError) return { error: selectError.message }
  if (!data) return { error: 'No completions to update' }

  const { error: updateError } = await supabase
    .from('daily_completions')
    .update({ completed_date: targetDate })
    .eq('id', (data as { id: string }).id)

  if (updateError) return { error: updateError.message }
  return { error: null }
}

export async function clearCompletions(
  journeyId: string,
): Promise<{ error: string | null }> {
  const { error: deleteError } = await supabase
    .from('daily_completions')
    .delete()
    .eq('journey_id', journeyId)
  if (deleteError) return { error: deleteError.message }

  const { error: updateError } = await supabase
    .from('user_journeys')
    .update({ current_day: 1 })
    .eq('id', journeyId)
  if (updateError) return { error: updateError.message }

  return { error: null }
}
