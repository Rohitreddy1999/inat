if (!__DEV__) {
  throw new Error('devTestData must only be imported in __DEV__ builds')
}

export type DevScenario = {
  label: string
  email: string
  password: string
  description: string
}

export const DEV_SCENARIOS: Record<string, DevScenario> = {
  newUser: {
    label: 'New User (no journey)',
    email: 'test+new@inat.dev',
    password: 'testpass123',
    description: 'Freshly signed up, no journey',
  },

  dayOne: {
    label: 'Day 1 — First Open',
    email: 'test+day1@inat.dev',
    password: 'testpass123',
    description: 'Has journey, Day 1, never completed',
  },

  dayEight: {
    label: 'Day 8 — Build Phase',
    email: 'test+day8@inat.dev',
    password: 'testpass123',
    description: 'Day 8, 7 days completed yesterday',
  },

  dayTwentyOne: {
    label: 'Day 21 — Final Day',
    email: 'test+day21@inat.dev',
    password: 'testpass123',
    description: 'Day 21, 20 days completed',
  },

  alreadyDoneToday: {
    label: 'State B — Done Today',
    email: 'test+doneb@inat.dev',
    password: 'testpass123',
    description: 'Completed today, re-entry State B',
  },

  gapReturn: {
    label: 'State C — Gap Return',
    email: 'test+gap@inat.dev',
    password: 'testpass123',
    description: 'Last completed 5 days ago',
  },

  graduation: {
    label: 'Day 22 — Graduation',
    email: 'test+grad@inat.dev',
    password: 'testpass123',
    description: 'All 21 days complete, not graduated',
  },
}
