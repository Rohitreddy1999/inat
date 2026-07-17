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

export interface Journey {
  id: string
  user_id: string
  subtrack_id: string
  current_day: number
  is_active: boolean
  is_completed: boolean
  started_at: string
  completed_at: string | null
  last_active_at: string | null
  graduation_seen: boolean
  reflections: Record<string, unknown> | null
  created_at: string
}

export interface DayCompletion {
  id: string
  journey_id: string
  day_number: number
  completed_date: string
  feeling: string | null
  reflection_note: string | null
  duration_actual: number | null
  created_at: string
}

export interface Track {
  id: string
  slug: string
  name: string
  tagline: string
  icon_name: string
  color: string
  sort_order: number
}

export interface Subtrack {
  id: string
  track_id: string
  slug: string
  name: string
  description: string | null
  is_live: boolean
  is_free: boolean
  sort_order: number
}

export interface CurriculumDay {
  id: string
  subtrack_id: string
  day_number: number
  phase: string
  task_title: string
  task_description: string | null
  duration_minutes: number
  difficulty: string | null
  steps: string[] | Array<{ order: number; instruction: string }>
  why_text: string | null
  quote_text: string | null
  quote_author: string | null
  youtube_url: string | null
  must_watch_label: string | null
  reference_url_1: string | null
  reference_url_2: string | null
  reference_url_3: string | null
  ref_label_1: string | null
  ref_label_2: string | null
  ref_label_3: string | null
  source_credits: string | null
}

export type ReentryState = 'A' | 'B' | 'C' | 'D'
