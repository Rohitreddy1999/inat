import { supabase } from '@/lib/supabase'
import { Arc, Focus, Day, DayStep } from '@/types'
import { PostgrestError } from '@supabase/supabase-js'

export async function getAllArcs(): Promise<{
  arcs: Arc[]
  error: PostgrestError | null
}> {
  const { data, error } = await supabase
    .from('arcs')
    .select('*')
    .order('name')

  return { arcs: (data as Arc[]) ?? [], error }
}

export async function getFocusesByArc(arc: string): Promise<{
  focuses: Focus[]
  error: PostgrestError | null
}> {
  const { data, error } = await supabase
    .from('focuses')
    .select('*')
    .eq('arc', arc)
    .order('name')

  return { focuses: (data as Focus[]) ?? [], error }
}

export async function getDayWithSteps(
  arc: string,
  focus: string,
  dayNumber: number,
): Promise<{ day: Day | null; steps: DayStep[]; error: PostgrestError | null }> {
  const { data: dayData, error: dayError } = await supabase
    .from('days')
    .select('*')
    .eq('arc', arc)
    .eq('focus', focus)
    .eq('day_number', dayNumber)
    .maybeSingle()

  if (dayError || !dayData) return { day: null, steps: [], error: dayError }

  const { data: stepsData, error: stepsError } = await supabase
    .from('day_steps')
    .select('*')
    .eq('day_id', dayData.id)
    .order('step_number')

  if (stepsError) return { day: dayData as Day, steps: [], error: stepsError }

  return { day: dayData as Day, steps: (stepsData as DayStep[]) ?? [], error: null }
}
