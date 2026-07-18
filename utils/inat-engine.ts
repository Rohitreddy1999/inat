// utils/inat-engine.ts
// Matching logic only. Never edit this file to change scoring behavior.
// All tuning belongs in inat-brain.ts.

import {
  TRACKS,
  QUESTIONS,
  CONSISTENCY,
  CONFIDENCE_BANDS,
  TrackName,
  QuestionOption,
} from './inat-brain'

export interface AnswerOption extends QuestionOption {
  questionId: string
}

export interface MatchResult {
  primary: TrackName
  secondary: TrackName
  confidence: 'high' | 'medium' | 'low'
  scores: Record<TrackName, number>
  reasons: Array<{ id: string; text: string }>
  healthMode: boolean
}

export function matchTrack(answers: AnswerOption[]): MatchResult {

  // ── STEP 1 — Raw scores ──────────────────────────────────────────────────
  const raw: Record<TrackName, number> = {
    Move: 0, Calm: 0, Mindful: 0, Rhythm: 0, Express: 0,
  }

  for (const option of answers) {
    for (const track of TRACKS) {
      raw[track] += option.vector[track] * option.diagnostic
    }
  }

  // ── STEP 2 — Consistency multiplier ─────────────────────────────────────
  const questionContributions: Record<TrackName, Set<string>> = {
    Move: new Set(), Calm: new Set(), Mindful: new Set(),
    Rhythm: new Set(), Express: new Set(),
  }

  for (const option of answers) {
    for (const track of TRACKS) {
      const contribution = option.vector[track] * option.diagnostic
      if (contribution >= CONSISTENCY.min_threshold) {
        questionContributions[track].add(option.questionId)
      }
    }
  }

  const strength: Record<TrackName, number> = {
    Move: 0, Calm: 0, Mindful: 0, Rhythm: 0, Express: 0,
  }
  for (const track of TRACKS) {
    const count = questionContributions[track].size
    const multiplier =
      count >= 3 ? CONSISTENCY.three_plus :
      count === 2 ? CONSISTENCY.two_questions :
      CONSISTENCY.one_question
    strength[track] = raw[track] * multiplier
  }

  // ── STEP 3 — Health mode ─────────────────────────────────────────────────
  const healthFlagsSelected = answers.filter(a => a.healthFlag).length
  const strengthValues = Object.values(strength).sort((a, b) => b - a)
  const maxStrength = strengthValues[0]
  const secondStrength = strengthValues[1]
  const earlyGap = maxStrength > 0
    ? (maxStrength - secondStrength) / maxStrength
    : 0

  let healthMode = false

  if (healthFlagsSelected >= 1 && earlyGap < CONFIDENCE_BANDS.high) {
    healthMode = true
    const channelAnswers = answers.filter(a => a.questionId === 'channel')
    for (const option of channelAnswers) {
      for (const track of TRACKS) {
        strength[track] += (option.vector[track] * option.diagnostic) * 0.5
      }
    }
  }

  // ── STEP 4 — Rank and confidence ────────────────────────────────────────
  const ranked = TRACKS
    .map(track => ({ track, score: strength[track] }))
    .sort((a, b) => b.score - a.score)

  const primary   = ranked[0].track
  const secondary = ranked[1].track

  const gap = ranked[0].score > 0
    ? (ranked[0].score - ranked[1].score) / ranked[0].score
    : 0

  const confidence: 'high' | 'medium' | 'low' =
    gap >= CONFIDENCE_BANDS.high   ? 'high'   :
    gap >= CONFIDENCE_BANDS.medium ? 'medium' :
    'low'

  // ── STEP 5 — Reasons ────────────────────────────────────────────────────
  const contributions = answers
    .map(option => ({
      id: option.id,
      text: option.text,
      contribution: option.vector[primary] * option.diagnostic,
    }))
    .filter(o => o.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)

  const reasons = contributions.slice(0, 2).map(o => ({
    id: o.id,
    text: o.text,
  }))

  return {
    primary,
    secondary,
    confidence,
    scores: strength,
    reasons,
    healthMode,
  }
}

export function runMatch(userSelections: Record<string, string[]>): MatchResult {
  const answers: AnswerOption[] = []

  for (const [questionId, selectedIds] of Object.entries(userSelections)) {
    const question = QUESTIONS.find(q => q.id === questionId)
    if (!question) continue
    for (const optionId of selectedIds) {
      const option = question.options.find(o => o.id === optionId)
      if (option) answers.push({ ...option, questionId })
    }
  }

  return matchTrack(answers)
}
