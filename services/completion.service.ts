import { supabase } from '@/lib/supabase'
import { UserDayLog } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

export async function completeDay(
  journeyId: string,
  arc: string,
  focus: string,
  dayNumber: number,
  feeling: string,
): Promise<{ error: PostgrestError | string | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error: insertError } = await supabase
    .from('user_day_logs')
    .insert({
      journey_id: journeyId,
      user_id: user.id,
      arc,
      focus,
      day_number: dayNumber,
      feeling,
    })

  if (insertError) return { error: insertError }

  const journeyUpdate = dayNumber >= 21
    ? {
        current_day: 22,
        completed_at: new Date().toISOString(),
      }
    : { current_day: dayNumber + 1 }

  const { error: updateError } = await supabase
    .from('user_journeys')
    .update(journeyUpdate)
    .eq('id', journeyId)

  return { error: updateError }
}

export async function getDayCompletion(
  journeyId: string,
  dayNumber: number,
): Promise<{ completion: UserDayLog | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('user_day_logs')
    .select('*')
    .eq('journey_id', journeyId)
    .eq('day_number', dayNumber)
    .maybeSingle()

  return { completion: data as UserDayLog | null, error }
}

export async function getAllCompletions(
  journeyId: string,
): Promise<{ completions: UserDayLog[]; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('user_day_logs')
    .select('*')
    .eq('journey_id', journeyId)
    .order('day_number', { ascending: true })

  return { completions: (data as UserDayLog[]) ?? [], error }
}

export async function getLastCompletionDate(
  journeyId: string,
): Promise<{ date: string | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('user_day_logs')
    .select('completed_at')
    .eq('journey_id', journeyId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Extract date-only portion from the timestamptz
  const raw = (data as { completed_at: string } | null)?.completed_at ?? null
  const date = raw ? raw.split('T')[0] : null

  return { date, error }
}
