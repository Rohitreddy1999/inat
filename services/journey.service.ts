import { supabase } from '@/lib/supabase'
import { Journey } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

export async function createJourney(
  userId: string,
  subtractId: string,
): Promise<{ journey: Journey | null; error: PostgrestError | null }> {
  // Deactivate all other active journeys for this user first
  await supabase
    .from('user_journeys')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true)
    .neq('subtrack_id', subtractId)

  // Upsert: insert fresh or reactivate + reset if the row already exists
  const { data, error } = await supabase
    .from('user_journeys')
    .upsert(
      {
        user_id: userId,
        subtrack_id: subtractId,
        current_day: 1,
        is_active: true,
        is_completed: false,
      },
      { onConflict: 'user_id,subtrack_id' },
    )
    .select()
    .single()

  return { journey: data as Journey | null, error }
}

export async function updateLastActive(
  journeyId: string,
): Promise<void> {
  await supabase
    .from('user_journeys')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', journeyId)
}

export async function getActiveJourney(
  userId: string,
): Promise<{ journey: Journey | null; error: PostgrestError | null }> {
  // Use order + limit + maybeSingle so multiple rows never cause a PGRST116 misread
  const { data, error } = await supabase
    .from('user_journeys')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return { journey: data as Journey | null, error }
}
