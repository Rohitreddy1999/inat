import { supabase } from '@/lib/supabase'
import { Journey } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

export async function getActiveJourney(
  userId: string,
): Promise<{ journey: Journey | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('user_journeys')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error?.code === 'PGRST116') {
    // No rows found — not a real error
    return { journey: null, error: null }
  }

  return { journey: data as Journey | null, error }
}
