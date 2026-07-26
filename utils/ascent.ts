import type { UserDayLog } from '@/types'
import { getPhaseName } from '@/theme'

export const FEELINGS = ['Felt right', 'Pushed through', 'Just okay', 'Struggled'] as const
export type Feeling = typeof FEELINGS[number]

export type AscentPractice = UserDayLog & {
  feelingLabel: Feeling | 'Not recorded'
  localDateKey: string
  localDayNumber: number
}

export type AscentDiagnostics = {
  invalidRows: number
  duplicateRows: number
  outOfOrderDates: number
}

const DAY_MS = 86_400_000
const MAX_VISUAL_INTERVAL_DAYS = 21

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function getLocalDateKey(value: string | Date): string | null {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function localDateKeyToDayNumber(key: string): number {
  const [year, month, day] = key.split('-').map(Number)
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS)
}

function normalizeFeeling(feeling: string | null): Feeling | 'Not recorded' {
  return FEELINGS.find((candidate) => candidate === feeling) ?? 'Not recorded'
}

export function normalizeAscentLogs(logs: UserDayLog[]): {
  practices: AscentPractice[]
  diagnostics: AscentDiagnostics
} {
  let invalidRows = 0
  let duplicateRows = 0
  let outOfOrderDates = 0
  const byDay = new Map<number, AscentPractice>()

  for (const log of logs) {
    const localDateKey = getLocalDateKey(log.completed_at)
    if (!Number.isInteger(log.day_number) || log.day_number < 1 || log.day_number > 21 || !localDateKey) {
      invalidRows += 1
      continue
    }

    const practice: AscentPractice = {
      ...log,
      feelingLabel: normalizeFeeling(log.feeling),
      localDateKey,
      localDayNumber: localDateKeyToDayNumber(localDateKey),
    }
    const existing = byDay.get(log.day_number)
    if (existing) {
      duplicateRows += 1
      if (new Date(log.completed_at).getTime() < new Date(existing.completed_at).getTime()) {
        byDay.set(log.day_number, practice)
      }
    } else {
      byDay.set(log.day_number, practice)
    }
  }

  const practices = [...byDay.values()].sort((a, b) => a.day_number - b.day_number)
  for (let index = 1; index < practices.length; index += 1) {
    if (practices[index].localDayNumber < practices[index - 1].localDayNumber) {
      outOfOrderDates += 1
    }
  }

  return { practices, diagnostics: { invalidRows, duplicateRows, outOfOrderDates } }
}

export type GraphPoint = AscentPractice & { xRatio: number; yRatio: number }

export function buildGraphPoints(practices: AscentPractice[]): GraphPoint[] {
  if (practices.length === 0) return []
  if (practices.length === 1) {
    return [{ ...practices[0], xRatio: 0.5, yRatio: (practices[0].day_number - 1) / 20 }]
  }

  const visualIntervals = practices.slice(1).map((practice, index) => {
    const rawDays = practice.localDayNumber - practices[index].localDayNumber
    return Math.min(MAX_VISUAL_INTERVAL_DAYS, Math.max(0, rawDays))
  })
  const total = visualIntervals.reduce((sum, interval) => sum + interval, 0)
  const fallbackTotal = total === 0 ? practices.length - 1 : total
  let elapsed = 0

  return practices.map((practice, index) => {
    if (index > 0) elapsed += total === 0 ? 1 : visualIntervals[index - 1]
    return {
      ...practice,
      xRatio: elapsed / fallbackTotal,
      yRatio: (practice.day_number - 1) / 20,
    }
  })
}

export type PracticeSignal = {
  numerator: number
  denominator: number
  ratio: number
  state: 'Forming' | 'Gathering' | 'Steady' | 'Established'
}

export function calculatePracticeSignal(
  practices: AscentPractice[],
  journeyStartedAt: string,
  now: Date = new Date(),
): PracticeSignal {
  const todayKey = getLocalDateKey(now) ?? '1970-01-01'
  const startedKey = getLocalDateKey(journeyStartedAt) ?? todayKey
  const today = localDateKeyToDayNumber(todayKey)
  const started = localDateKeyToDayNumber(startedKey)
  const denominator = Math.max(1, Math.min(7, today - started + 1))
  const firstEligibleDay = today - denominator + 1
  const numerator = new Set(
    practices
      .filter((practice) => practice.localDayNumber >= firstEligibleDay && practice.localDayNumber <= today)
      .map((practice) => practice.localDateKey),
  ).size
  const ratio = Math.min(1, numerator / denominator)
  const state = ratio <= 0.25
    ? 'Forming'
    : ratio <= 0.5
      ? 'Gathering'
      : ratio <= 0.75
        ? 'Steady'
        : 'Established'
  return { numerator, denominator, ratio, state }
}

function countByFeeling(practices: AscentPractice[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const practice of practices) {
    if (practice.feelingLabel === 'Not recorded') continue
    counts.set(practice.feelingLabel, (counts.get(practice.feelingLabel) ?? 0) + 1)
  }
  return counts
}

export function getAscentObservation(practices: AscentPractice[]): { title: string; body: string } {
  const returns = practices.slice(1).flatMap((practice, index) => {
    const separation = practice.localDayNumber - practices[index].localDayNumber
    return separation > 1 ? [{ practice, separation }] : []
  })
  if (returns.length > 0) {
    const latest = returns[returns.length - 1]
    return returns.length === 1
      ? {
          title: 'YOU RETURNED',
          body: `${latest.separation} calendar days separated these practices. You resumed on Day ${latest.practice.day_number}.`,
        }
      : {
          title: 'YOU RETURNED',
          body: `You returned ${returns.length} times. Each time, the circuit continued where you left it.`,
        }
  }

  const phases = ['FOUNDATION', 'BUILD', 'COMMIT'] as const
  const phaseGroups = phases.map((phase) => ({
    phase,
    practices: practices.filter((practice) => getPhaseName(practice.day_number) === phase),
  }))
  for (let index = phaseGroups.length - 1; index > 0; index -= 1) {
    const current = phaseGroups[index]
    const previous = phaseGroups[index - 1]
    if (current.practices.length >= 3 && previous.practices.length >= 3) {
      const currentRight = current.practices.filter((item) => item.feelingLabel === 'Felt right').length
      const previousRight = previous.practices.filter((item) => item.feelingLabel === 'Felt right').length
      if (currentRight / current.practices.length !== previousRight / previous.practices.length) {
        const stronger = currentRight / current.practices.length > previousRight / previous.practices.length
          ? current.phase
          : previous.phase
        const weaker = stronger === current.phase ? previous.phase : current.phase
        return {
          title: 'ONE PATTERN',
          body: `${titleCase(stronger)} contains a higher share of “Felt right” responses than ${titleCase(weaker)}.`,
        }
      }
    }
  }

  const recent = practices.slice(-7)
  if (recent.length >= 3) {
    const counts = countByFeeling(recent)
    const strongest = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]
    if (strongest && strongest[1] >= 2) {
      return {
        title: 'ONE PATTERN',
        body: `${strongest[1]} of your last ${recent.length} practices were recorded as “${strongest[0]}.”`,
      }
    }
  }

  return {
    title: 'STILL FORMING',
    body: practices.length === 0
      ? 'A pattern needs more evidence.'
      : `A pattern needs more evidence. ${practices.length} ${practices.length === 1 ? 'practice' : 'practices'} recorded.`,
  }
}

export function formatPracticeDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase()
}
