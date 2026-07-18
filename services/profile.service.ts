import { supabase } from '@/lib/supabase'
import { Profile } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'
import { TrackName } from '@/utils/inat-brain'

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
  answers: Record<string, string[]>,
  openAnswer: string,
  matchResult: {
    primary: TrackName
    secondary: TrackName
    confidence: string
    scores: Record<TrackName, number>
    reasons: Array<{ id: string; text: string }>
    healthMode: boolean
  } | null,
): Promise<{ error: PostgrestError | null }> {
  const discoveryAnswer: Record<string, unknown> = {
    version: 2,
    answers,
    openAnswer,
  }

  if (matchResult) {
    discoveryAnswer.scores      = matchResult.scores
    discoveryAnswer.confidence  = matchResult.confidence
    discoveryAnswer.primary     = matchResult.primary
    discoveryAnswer.secondary   = matchResult.secondary
    discoveryAnswer.reasons     = matchResult.reasons
    discoveryAnswer.healthMode  = matchResult.healthMode
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      life_stage: lifeStage,
      discovery_answer: discoveryAnswer,
      open_answer: openAnswer,
      recommended_track: matchResult?.primary ?? null,
    })

  return { error }
}
