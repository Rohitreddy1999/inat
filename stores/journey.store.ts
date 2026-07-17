import { create } from 'zustand'
import { Journey } from '@/types'
import { getActiveJourney, updateLastActive } from '@/services/journey.service'
import { getAllCompletions } from '@/services/completion.service'
import { getReentryState } from '@/utils/dayUnlock'

interface JourneyState {
  activeJourney: Journey | null
  currentDay: number
  completedDays: number[]
  lastCompletionDate: Date | null
  reentryState: 'A' | 'B' | 'C' | 'D' | null
  isHydrated: boolean

  hydrate: (userId: string) => Promise<void>
  reset: () => void
  devOverride: (patch: Partial<Pick<JourneyState, 'currentDay' | 'completedDays' | 'reentryState'>>) => void
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

    if (!journey) {
      set({ ...initialState, isHydrated: true })
      return
    }

    const [reentryState, { completions }] = await Promise.all([
      getReentryState(journey.id),
      getAllCompletions(journey.id),
    ])

    // fire and forget — do not block hydration
    updateLastActive(journey.id)

    const completedDays = completions.map((c) => c.day_number)
    const lastCompletion = completions[completions.length - 1]
    const lastCompletionDate = lastCompletion
      ? new Date(lastCompletion.completed_date)
      : null

    set({
      activeJourney: journey,
      currentDay: journey.current_day,
      completedDays,
      lastCompletionDate,
      reentryState,
      isHydrated: true,
    })
  },

  reset: () => set({ ...initialState }),

  devOverride: (patch) => set(patch),
}))
