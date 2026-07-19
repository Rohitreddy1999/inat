import { supabase } from '@/lib/supabase'
import { DayCompletion } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

export async function completeDay(
  journeyId: string,
  dayNumber: number,
  feeling: string,
  reflectionNote: string,
): Promise<{ error: PostgrestError | null }> {
  const completedDate = new Date().toISOString().split('T')[0]

  const { error: insertError } = await supabase
    .from('daily_completions')
    .upsert({
      journey_id: journeyId,
      day_number: dayNumber,
      completed_date: completedDate,
      feeling,
      reflection_note: reflectionNote,
    })

  if (insertError) return { error: insertError }

  const { error: updateError } = await supabase
    .from('user_journeys')
    .update({
      current_day: dayNumber + 1,
      last_active_at: new Date().toISOString(),
    })
    .eq('id', journeyId)

  return { error: updateError }
}

export async function getDayCompletion(
  journeyId: string,
  dayNumber: number,
): Promise<{ completion: DayCompletion | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('daily_completions')
    .select('*')
    .eq('journey_id', journeyId)
    .eq('day_number', dayNumber)
    .maybeSingle()

  return { completion: data as DayCompletion | null, error }
}

export async function getAllCompletions(
  journeyId: string,
): Promise<{ completions: DayCompletion[]; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('daily_completions')
    .select('*')
    .eq('journey_id', journeyId)
    .order('day_number', { ascending: true })

  return { completions: (data as DayCompletion[]) ?? [], error }
}

export async function getLastCompletionDate(
  journeyId: string,
): Promise<{ date: string | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('daily_completions')
    .select('completed_date')
    .eq('journey_id', journeyId)
    .order('completed_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  return { date: (data as { completed_date: string } | null)?.completed_date ?? null, error }
}

// ── Admin-only helpers (dev builds) ─────────────────────────────────────────

type CompletionInsert = {
  journey_id: string
  user_id: string
  day_number: number
  completed_date: string
  feeling: string
  reflection_note: string
}

export async function deleteJourneyCompletions(journeyId: string): Promise<PostgrestError | null> {
  const { error } = await supabase
    .from('daily_completions')
    .delete()
    .eq('journey_id', journeyId)
  return error
}

export async function insertJourneyCompletions(rows: CompletionInsert[]): Promise<PostgrestError | null> {
  const { error } = await supabase.from('daily_completions').insert(rows)
  return error
}

export async function getLatestCompletionId(journeyId: string): Promise<string | null> {
  const { data } = await supabase
    .from('daily_completions')
    .select('id')
    .eq('journey_id', journeyId)
    .order('completed_date', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data as { id: string } | null)?.id ?? null
}

export async function updateCompletionDate(
  completionId: string,
  dateStr: string,
): Promise<PostgrestError | null> {
  const { error } = await supabase
    .from('daily_completions')
    .update({ completed_date: dateStr })
    .eq('id', completionId)
  return error
}

export async function insertSyntheticCompletion(
  journeyId: string,
  userId: string,
  dayNumber: number,
  dateStr: string,
): Promise<PostgrestError | null> {
  const { error } = await supabase.from('daily_completions').insert({
    journey_id: journeyId,
    user_id: userId,
    day_number: dayNumber,
    completed_date: dateStr,
    feeling: 'good',
    reflection_note: '',
  })
  return error
}
