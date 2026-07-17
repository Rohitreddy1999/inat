import { supabase } from '@/lib/supabase'
import { Profile } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

export async function getProfile(
  userId: string,
): Promise<{ profile: Profile | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  return { profile: data as Profile | null, error }
}

export async function saveOnboardingAnswers(
  userId: string,
  lifeStage: string,
  discoveryAnswer: object,
  openAnswer: string,
  recommendedTrack: string,
): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      life_stage: lifeStage,
      discovery_answer: discoveryAnswer,
      open_answer: openAnswer,
      recommended_track: recommendedTrack,
    })

  return { error }
}
