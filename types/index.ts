export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  life_stage: string | null
  discovery_answer: Record<string, unknown> | null
  open_answer: string | null
  recommended_track: string | null
  timezone: string
  created_at: string
}

export interface Arc {
  id: string
  name: string
  description: string | null
  icon_key: string | null
  created_at: string
}

export interface Focus {
  id: string
  arc: string
  name: string
  description: string | null
  icon_key: string | null
  is_active: boolean
  created_at: string
}

export interface Day {
  id: string
  arc: string
  focus: string
  day_number: number
  title: string
  subtitle: string | null
  duration_mins: number | null
  phase: string
  quote: string | null
  quote_author: string | null
  why_this_matters: string | null
  created_at: string
}

export interface DayStep {
  id: string
  day_id: string
  step_number: number
  title: string
  instruction: string
  has_video: boolean
  video_url: string | null
  video_label: string | null
  created_at: string
}

export interface UserJourney {
  id: string
  user_id: string
  arc: string
  focus: string
  current_day: number
  is_active: boolean
  started_at: string
  completed_at: string | null
  created_at: string
}

export interface UserDayLog {
  id: string
  user_id: string
  journey_id: string
  arc: string
  focus: string
  day_number: number
  feeling: string | null
  completed_at: string
  created_at: string
}

export interface UserOnboarding {
  id: string
  user_id: string
  energy_response: string | null
  barrier_response: string | null
  channel_response: string | null
  identity_response: string | null
  presence_response: string | null
  matched_arc: string | null
  matched_focus: string | null
  confidence_score: number | null
  completed_at: string | null
  created_at: string
}

export type ReentryState = 'A' | 'B' | 'C' | 'D'
