import {
  Round,
  DrawDataPoint,
  InvitationDataPoint,
  PoolDataPoint,
  ApiResponse,
  RawRound,
} from './types'
import { POOL_RANGES, POOL_VIEWS } from './constants'

///////////////////////////////////////////////////////////////////////////
// GENERAL
///////////////////////////////////////////////////////////////////////////

export function extractRounds(data: ApiResponse): Round[] {
  return data.payload.rounds
    .filter((r) => r.drawDate >= new Date('2020-01-01'))
    .map((r) => {
      const pool: Record<string, number> = Object.fromEntries(
        POOL_RANGES.map(({ key, range }) => [
          range,
          r[key as keyof RawRound] as number,
        ])
      )

      return {
        drawDate: r.drawDate,
        drawDateFull: r.drawDateFull,
        invitations: r.drawSize,
        score: r.drawCRS,
        category: r.drawName
          .replace(/Version /gi, 'V')
          .replace(/ occupations/gi, ''),
        distributionDateFull: r.drawDistributionAsOn,
        pool,
        totalCandidates: r.dd18,
      }
    })
}

///////////////////////////////////////////////////////////////////////////
// DRAW CHART
///////////////////////////////////////////////////////////////////////////

export function formatDrawData(
  rounds: Round[]
): Record<string, DrawDataPoint[]> {
  const groups: Record<string, Round[]> = {}
  for (const r of rounds) {
    if (!groups[r.category]) groups[r.category] = []
    groups[r.category].push(r)
  }

  const formattedGroups: Record<string, DrawDataPoint[]> = {}
  const sortedEntries = Object.entries(groups).sort(([a], [b]) =>
    a.localeCompare(b)
  )
  for (const [category, categoryRounds] of sortedEntries) {
    formattedGroups[category] = [...categoryRounds].reverse().map((r, i) => ({
      index: i + 1,
      date: r.drawDate,
      dateFull: r.drawDateFull,
      score: r.score,
      invitations: r.invitations,
      category: r.category,
    }))
  }

  return formattedGroups
}

export function filterByTime(
  data: DrawDataPoint[],
  period: string
): DrawDataPoint[] {
  let filtered
  if (period === 'ALL') {
    filtered = data
  } else if (period === '1Y' || period === '2Y') {
    const cutoff = new Date()
    const years = period === '1Y' ? 1 : 2
    cutoff.setFullYear(cutoff.getFullYear() - years)
    filtered = data.filter((d) => d.date >= cutoff)
  } else {
    const year = Number(period)
    filtered = data.filter((d) => d.date.getFullYear() === year)
  }
  return filtered.map((d, i) => ({ ...d, index: i + 1 }))
}

export function calculateDomain(data: DrawDataPoint[]) {
  if (data.length === 0) return [0, 100]

  const vals = data.map((d) => d.score)
  const min = Math.min(...vals)
  const max = Math.max(...vals)

  const range = max - min || 1
  const mag = 10 ** Math.floor(Math.log10(range))

  // Add padding first (1% of range, minimum 1)
  const padding = Math.max(1, Math.ceil(range * 0.01))
  const paddedMin = min - padding
  const paddedMax = max + padding

  // Round to magnitude boundaries for even numbers
  const lowerBound = Math.floor(paddedMin / mag) * mag
  const upperBound = Math.ceil(paddedMax / mag) * mag

  // Ensure integers
  return [Math.floor(lowerBound), Math.ceil(upperBound)]
}

///////////////////////////////////////////////////////////////////////////
// INVITATION CHART
///////////////////////////////////////////////////////////////////////////

export function formatInvitationData(
  rounds: Round[],
  years: number[]
): InvitationDataPoint[] {
  const formattedData: InvitationDataPoint[] = []

  for (const year of years) {
    const monthlyTotals: Record<number, number> = {}
    for (let i = 0; i < 12; i++) {
      monthlyTotals[i] = 0
    }

    for (const r of rounds) {
      if (r.drawDate.getFullYear() !== year) continue
      const monthIndex = r.drawDate.getMonth()
      const size = r.invitations

      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyTotals[monthIndex] += size
      }
    }

    Object.keys(monthlyTotals).forEach((key) => {
      const mIndex = parseInt(key, 10)
      formattedData.push({
        year: year,
        month: mIndex,
        invitations: monthlyTotals[mIndex],
      })
    })
  }

  return formattedData
}

///////////////////////////////////////////////////////////////////////////
// POOL CHART
///////////////////////////////////////////////////////////////////////////

export function getPoolDistribution(
  round: Round,
  view: keyof typeof POOL_VIEWS
): PoolDataPoint[] {
  const keys = POOL_VIEWS[view]

  return keys.map((key) => {
    const range = POOL_RANGES.find((r) => r.key === key)!.range
    return {
      range,
      count: round.pool[range],
    }
  })
}
