import { supabase } from '@/lib/supabase'
import { PostgrestError } from '@supabase/supabase-js'

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
    .eq('id', userId)

  return { error }
}
