import { create } from 'zustand'
import { TrackName } from '@/utils/inat-brain'
import { runMatch as computeMatch, MatchResult } from '@/utils/inat-engine'

interface StoredMatchResult {
  primary: TrackName | null
  secondary: TrackName | null
  confidence: 'high' | 'medium' | 'low' | null
  scores: Record<TrackName, number> | null
  reasons: Array<{ id: string; text: string }>
  healthMode: boolean
}

const INITIAL_MATCH: StoredMatchResult = {
  primary: null,
  secondary: null,
  confidence: null,
  scores: null,
  reasons: [],
  healthMode: false,
}

interface OnboardingState {
  lifeStage: string | null
  answers: Record<string, string[]>
  openAnswer: string
  matchResult: StoredMatchResult
  selectedTrack: TrackName | null

  setLifeStage: (value: string) => void
  setAnswer: (question: string, selections: string[]) => void
  runMatch: () => void
  setSelectedTrack: (track: TrackName) => void
  setOpenAnswer: (text: string) => void
  clear: () => void
}

const initialState = {
  lifeStage: null,
  answers: {} as Record<string, string[]>,
  openAnswer: '',
  matchResult: { ...INITIAL_MATCH },
  selectedTrack: null,
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setLifeStage: (value) => set({ lifeStage: value }),

  setAnswer: (question, selections) =>
    set((state) => ({
      answers: { ...state.answers, [question]: selections },
    })),

  runMatch: () => {
    const result: MatchResult = computeMatch(get().answers)
    set({
      matchResult: result,
      selectedTrack: result.primary,
    })
  },

  setSelectedTrack: (track) => set({ selectedTrack: track }),

  setOpenAnswer: (text) => set({ openAnswer: text }),

  clear: () => set({ ...initialState, matchResult: { ...INITIAL_MATCH } }),
}))

export type { StoredMatchResult }
