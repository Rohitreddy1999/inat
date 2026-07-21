import { supabase } from '@/lib/supabase'
import { UserJourney } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

export async function createJourney(
  userId: string,
  arc: string,
  focus: string,
): Promise<{ journey: UserJourney | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('user_journeys')
    .insert({ user_id: userId, arc, focus, current_day: 1, is_active: true })
    .select()
    .single()

  if (error) return { journey: null, error }

  // Deactivate every other active journey for this user
  await supabase
    .from('user_journeys')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true)
    .neq('id', data.id)

  return { journey: data as UserJourney, error: null }
}

export async function deactivateJourney(userId: string): Promise<PostgrestError | null> {
  const { error } = await supabase
    .from('user_journeys')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true)
  return error
}

export async function setJourneyDay(journeyId: string, day: number): Promise<PostgrestError | null> {
  const { error } = await supabase
    .from('user_journeys')
    .update({ current_day: day })
    .eq('id', journeyId)
  return error
}

export async function markJourneyComplete(journeyId: string): Promise<PostgrestError | null> {
  const { error } = await supabase
    .from('user_journeys')
    .update({ is_active: false, completed_at: new Date().toISOString() })
    .eq('id', journeyId)
  return error
}

export async function getActiveJourney(
  userId: string,
): Promise<{ journey: UserJourney | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('user_journeys')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return { journey: data as UserJourney | null, error }
}
