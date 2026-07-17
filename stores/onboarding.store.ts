import { create } from 'zustand'

type TrackSlug = 'move' | 'rhythm' | 'express' | 'calm' | 'mindful'

interface Scores {
  Move: number
  Rhythm: number
  Express: number
  Calm: number
  Mindful: number
}

const INITIAL_SCORES: Scores = {
  Move: 0,
  Rhythm: 0,
  Express: 0,
  Calm: 0,
  Mindful: 0,
}

const SLUG_MAP: Record<keyof Scores, TrackSlug> = {
  Move: 'move',
  Rhythm: 'rhythm',
  Express: 'express',
  Calm: 'calm',
  Mindful: 'mindful',
}

interface OnboardingState {
  lifeStage: string | null
  answers: Record<string, string[]>
  scores: Scores
  openAnswer: string
  selectedTrack: string | null
  selectedSubtractId: string | null

  setLifeStage: (value: string) => void
  setAnswer: (question: string, selections: string[]) => void
  calculateScores: () => void
  setSelectedTrack: (slug: string) => void
  setSelectedSubtractId: (id: string) => void
  setOpenAnswer: (text: string) => void
  getRecommendedTrack: () => TrackSlug | null
  clear: () => void
}

const initialState = {
  lifeStage: null,
  answers: {} as Record<string, string[]>,
  scores: { ...INITIAL_SCORES },
  openAnswer: '',
  selectedTrack: null,
  selectedSubtractId: null,
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setLifeStage: (value) => set({ lifeStage: value }),

  setAnswer: (question, selections) =>
    set((state) => ({
      answers: { ...state.answers, [question]: selections },
    })),

  calculateScores: () => {
    const { answers } = get()
    const scores: Scores = { ...INITIAL_SCORES }

    // Q2 weights
    const q2 = answers['q2'] ?? []
    for (const v of q2) {
      if (v === 'move_body')    { scores.Move    += 3 }
      if (v === 'rituals')      { scores.Calm    += 2; scores.Mindful += 1 }
      if (v === 'create_daily') { scores.Express += 2; scores.Rhythm  += 1 }
      if (v === 'write_thoughts'){ scores.Mindful += 3 }
    }

    // Q3 weights
    const q3 = answers['q3'] ?? []
    for (const v of q3) {
      if (v === 'fumes')   { scores.Calm    += 3 }
      if (v === 'restless'){ scores.Move    += 3 }
      if (v === 'numb')    { scores.Mindful += 2; scores.Express += 1 }
      if (v === 'anxious') { scores.Mindful += 3; scores.Calm    += 1 }
      if (v === 'okay')    { scores.Express += 2; scores.Rhythm  += 2 }
    }

    // Q4 weights
    const q4 = answers['q4'] ?? []
    for (const v of q4) {
      if (v === 'lose_thread')     { scores.Calm    += 2 }
      if (v === 'no_beginning')    { scores.Move    += 2 }
      if (v === 'wrong_thing')     { scores.Mindful += 2 }
      if (v === 'life_interrupts') { scores.Rhythm  += 2 }
      if (v === 'afraid')          { scores.Express += 2 }
    }

    // Q5 weights
    const q5 = answers['q5'] ?? []
    for (const v of q5) {
      if (v === 'not_creative')  { scores.Express += 3 }
      if (v === 'lazy')          { scores.Move    += 2 }
      if (v === 'care_opinions') { scores.Mindful += 2; scores.Express += 1 }
      if (v === 'lost_touch')    { scores.Mindful += 3 }
      if (v === 'capable_more')  { scores.Move    += 2; scores.Rhythm  += 1 }
    }

    set({ scores })
  },

  getRecommendedTrack: () => {
    const { scores } = get()
    const entries = Object.entries(scores) as [keyof Scores, number][]
    // Sort by score desc, then alphabetically for tie-break
    entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    const top = entries[0]
    return top ? SLUG_MAP[top[0]] : null
  },

  setSelectedTrack: (slug) => set({ selectedTrack: slug }),

  setSelectedSubtractId: (id) => set({ selectedSubtractId: id }),

  setOpenAnswer: (text) => set({ openAnswer: text }),

  clear: () => set({ ...initialState, scores: { ...INITIAL_SCORES } }),
}))
