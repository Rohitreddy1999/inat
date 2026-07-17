import { supabase } from '@/lib/supabase'
import { Track, Subtrack, CurriculumDay } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

export async function getDayContent(
  subtrackId: string,
  dayNumber: number,
): Promise<{ day: CurriculumDay | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('curriculum_days')
    .select('*')
    .eq('subtrack_id', subtrackId)
    .eq('day_number', dayNumber)
    .maybeSingle()

  return { day: data as CurriculumDay | null, error }
}

export async function getSubtrackById(
  subtrackId: string,
): Promise<{ subtrack: Subtrack | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('subtracks')
    .select('*')
    .eq('id', subtrackId)
    .maybeSingle()

  return { subtrack: data as Subtrack | null, error }
}

export async function getAllTracks(): Promise<{
  tracks: Track[]
  error: PostgrestError | null
}> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('sort_order')

  return { tracks: (data as Track[]) ?? [], error }
}

export async function getSubtracksByTrack(trackId: string): Promise<{
  subtracks: Subtrack[]
  error: PostgrestError | null
}> {
  const { data, error } = await supabase
    .from('subtracks')
    .select('*')
    .eq('track_id', trackId)
    .order('sort_order')

  return { subtracks: (data as Subtrack[]) ?? [], error }
}
