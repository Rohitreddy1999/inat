// utils/inat-brain.ts
// All matching intelligence lives here.
// To tune: change numbers in this file only. Never touch inat-engine.ts.

export type TrackName = 'Move' | 'Calm' | 'Mindful' | 'Rhythm' | 'Express'

export type OptionVector = Record<TrackName, number>

export interface QuestionOption {
  id: string
  text: string
  vector: OptionVector
  diagnostic: number
  healthFlag: boolean
}

export interface Question {
  id: string
  text: string
  subtext: string
  type: 'single' | 'multi'
  options: QuestionOption[]
}

export const TRACKS: TrackName[] = ['Move', 'Calm', 'Mindful', 'Rhythm', 'Express']

export const QUESTIONS: Question[] = [
  {
    id: 'energy',
    text: "How's your energy right now?",
    subtext: 'Pick up to two that feel true.',
    type: 'multi',
    options: [
      {
        id: 'e_empty',
        text: "I've got nothing left.",
        vector: { Move: 0, Calm: 3, Mindful: 0, Rhythm: 0, Express: 0 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'e_restless',
        text: 'Restless — energy but nowhere to put it.',
        vector: { Move: 3, Calm: -1, Mindful: 1, Rhythm: 0, Express: 0 },
        diagnostic: 2.5,
        healthFlag: false,
      },
      {
        id: 'e_motions',
        text: 'Just going through the motions.',
        vector: { Move: 1, Calm: 0, Mindful: 3, Rhythm: 0, Express: 0 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'e_mindrace',
        text: "My mind won't slow down.",
        vector: { Move: 0, Calm: 2, Mindful: 2, Rhythm: 0, Express: 0 },
        diagnostic: 2.5,
        healthFlag: false,
      },
      {
        id: 'e_steady',
        text: "Steady — I've got energy and want to use it.",
        vector: { Move: 0, Calm: 0, Mindful: 0, Rhythm: 0, Express: 0 },
        diagnostic: 0,
        healthFlag: true,
      },
    ],
  },

  {
    id: 'barrier',
    text: "When you start something and it doesn't stick, what happens?",
    subtext: 'Pick up to two that sound like you.',
    type: 'multi',
    options: [
      {
        id: 'b_burnout',
        text: 'I go all-in, then burn out and stop.',
        vector: { Move: -1, Calm: 3, Mindful: 1, Rhythm: 0, Express: 0 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'b_scatter',
        text: 'I jump to the next thing before I finish.',
        vector: { Move: 3, Calm: -1, Mindful: 1, Rhythm: 0, Express: 0 },
        diagnostic: 2.5,
        healthFlag: false,
      },
      {
        id: 'b_drift',
        text: "It stops feeling worth it, so I drift away.",
        vector: { Move: 1, Calm: -1, Mindful: 3, Rhythm: 0, Express: 0 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'b_notbuilt',
        text: "I decide I'm just not built for it.",
        vector: { Move: 1, Calm: 0, Mindful: 0, Rhythm: 2, Express: 1 },
        diagnostic: 1.5,
        healthFlag: false,
      },
      {
        id: 'b_judged',
        text: 'I stop the moment someone might see it.',
        vector: { Move: -1, Calm: 1, Mindful: 1, Rhythm: 0, Express: 3 },
        diagnostic: 2.5,
        healthFlag: false,
      },
      {
        id: 'b_nothing',
        text: "Nothing stops me — I just haven't started yet.",
        vector: { Move: 0, Calm: 0, Mindful: 0, Rhythm: 0, Express: 0 },
        diagnostic: 0,
        healthFlag: true,
      },
    ],
  },

  {
    id: 'channel',
    text: 'If you had a free hour and no pressure, which sounds fun?',
    subtext: 'Pick one.',
    type: 'single',
    options: [
      {
        id: 'c_sound',
        text: 'Playing music or making sounds.',
        vector: { Move: 0, Calm: 1, Mindful: 0, Rhythm: 3, Express: -1 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'c_visual',
        text: 'Drawing or making something to look at.',
        vector: { Move: 0, Calm: 0, Mindful: 1, Rhythm: -1, Express: 3 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'c_words',
        text: 'Writing my thoughts down.',
        vector: { Move: 0, Calm: 0, Mindful: 2, Rhythm: 0, Express: 1 },
        diagnostic: 2,
        healthFlag: false,
      },
      {
        id: 'c_move',
        text: 'Moving — walk, sport, gym, out of my head.',
        vector: { Move: 2, Calm: 0, Mindful: 0, Rhythm: -1, Express: -1 },
        diagnostic: 2.5,
        healthFlag: false,
      },
      {
        id: 'c_rest',
        text: 'Switching off — rest, quiet, no task.',
        vector: { Move: 0, Calm: 2, Mindful: 0, Rhythm: -1, Express: -1 },
        diagnostic: 2.5,
        healthFlag: false,
      },
    ],
  },

  {
    id: 'identity',
    text: 'There is a story you tell about why you are like this.',
    subtext: 'Which ones sound like yours? Pick up to two.',
    type: 'multi',
    options: [
      {
        id: 'i_discipline',
        text: 'I have never been a disciplined person.',
        vector: { Move: 1, Calm: 2, Mindful: 1, Rhythm: 0, Express: 0 },
        diagnostic: 1.5,
        healthFlag: false,
      },
      {
        id: 'i_creative',
        text: 'I am just not the creative type.',
        vector: { Move: 1, Calm: 0, Mindful: 1, Rhythm: 2, Express: 2 },
        diagnostic: 2,
        healthFlag: false,
      },
      {
        id: 'i_opinions',
        text: 'I care too much what people think.',
        vector: { Move: -1, Calm: 1, Mindful: 1, Rhythm: 1, Express: 3 },
        diagnostic: 2.5,
        healthFlag: false,
      },
      {
        id: 'i_lostwant',
        text: 'I have lost touch with what I want.',
        vector: { Move: 0, Calm: 1, Mindful: 3, Rhythm: 0, Express: 1 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'i_inhead',
        text: 'I live in my head. I have left my body behind.',
        vector: { Move: 3, Calm: 1, Mindful: 1, Rhythm: 0, Express: 0 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'i_capable',
        text: 'I know I can do more. I just have not shown it yet.',
        vector: { Move: 1, Calm: 1, Mindful: 1, Rhythm: 1, Express: 1 },
        diagnostic: 0.5,
        healthFlag: false,
      },
    ],
  },

  {
    id: 'presence',
    text: 'When did you last really notice something good in a normal day?',
    subtext: 'Pick one.',
    type: 'single',
    options: [
      {
        id: 'p_recent',
        text: 'Not long ago. I still notice small good things.',
        vector: { Move: 0, Calm: 0, Mindful: 1, Rhythm: 0, Express: 0 },
        diagnostic: 0,
        healthFlag: true,
      },
      {
        id: 'p_blur',
        text: 'Not often. My days all feel the same.',
        vector: { Move: 0, Calm: 1, Mindful: 3, Rhythm: 0, Express: 0 },
        diagnostic: 3,
        healthFlag: false,
      },
      {
        id: 'p_inside',
        text: 'I feel things, but I keep them inside.',
        vector: { Move: 0, Calm: 0, Mindful: 1, Rhythm: 0, Express: 3 },
        diagnostic: 2.5,
        healthFlag: false,
      },
      {
        id: 'p_cantremember',
        text: 'I can not remember. I am just getting through each day.',
        vector: { Move: 1, Calm: 1, Mindful: 3, Rhythm: 0, Express: 0 },
        diagnostic: 3,
        healthFlag: false,
      },
    ],
  },
]

// Tuning constants — change these to adjust engine behavior
export const CONSISTENCY = {
  one_question:  1.0,   // track appeared in 1 question
  two_questions: 1.15,  // track appeared in 2 questions
  three_plus:    1.3,   // track appeared in 3+ questions
  min_threshold: 1.5,   // minimum meaningful contribution per question
} as const

export const CONFIDENCE_BANDS = {
  high:   0.25,  // gap ≥ 25% of leader's score → "This is clearly you"
  medium: 0.10,  // gap 10–25% → "We think it's this"
  low:    0.10,  // gap < 10% → "It's one of these two — here's how to tell"
} as const
