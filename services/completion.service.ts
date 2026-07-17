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
