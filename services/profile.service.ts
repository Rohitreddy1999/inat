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

export async function updateProfile(
  userId: string,
  patch: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'timezone'>>,
): Promise<{ profile: Profile | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select('*')
    .single()

  return { profile: data as Profile | null, error }
}

export async function uploadAvatar(
  userId: string,
  imageUri: string,
  mimeType = 'image/jpeg',
): Promise<{ avatarUrl: string | null; error: Error | null }> {
  try {
    const response = await fetch(imageUri)
    if (!response.ok) {
      return { avatarUrl: null, error: new Error('The selected image could not be read.') }
    }

    const body = await response.arrayBuffer()
    const extension = mimeType === 'image/png' ? 'png' : 'jpg'
    const path = `${userId}/profile.${extension}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, body, { contentType: mimeType, upsert: true })

    if (uploadError) return { avatarUrl: null, error: uploadError }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`
    const { error: profileError } = await updateProfile(userId, { avatar_url: avatarUrl })

    return profileError
      ? { avatarUrl: null, error: profileError }
      : { avatarUrl, error: null }
  } catch (error) {
    return {
      avatarUrl: null,
      error: error instanceof Error ? error : new Error('The profile picture could not be saved.'),
    }
  }
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
