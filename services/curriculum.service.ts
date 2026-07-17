import { supabase } from '@/lib/supabase'
import { Track, Subtrack } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

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
