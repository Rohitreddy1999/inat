import { create } from 'zustand'
import { Journey } from '@/types'
import { getActiveJourney } from '@/services/journey.service'

interface JourneyState {
  activeJourney: Journey | null
  currentDay: number
  completedDays: number[]
  lastCompletionDate: Date | null
  reentryState: 'A' | 'B' | 'C' | 'D' | null
  isHydrated: boolean

  hydrate: (userId: string) => Promise<void>
  reset: () => void
}

const initialState = {
  activeJourney: null,
  currentDay: 0,
  completedDays: [],
  lastCompletionDate: null,
  reentryState: null as 'A' | 'B' | 'C' | 'D' | null,
  isHydrated: false,
}

export const useJourneyStore = create<JourneyState>((set) => ({
  ...initialState,

  hydrate: async (userId: string) => {
    const { journey } = await getActiveJourney(userId)

    set({
      activeJourney: journey,
      currentDay: journey?.current_day ?? 0,
      completedDays: [],
      lastCompletionDate: null,
      reentryState: journey ? 'D' : null,
      isHydrated: true,
    })
  },

  reset: () => set({ ...initialState }),
}))
