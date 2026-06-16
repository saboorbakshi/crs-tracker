import {
  Round,
  DrawDataPoint,
  StackedInvitationDataPoint,
  PoolDataPoint,
  ApiResponse,
  RawRound,
} from './types'
import { POOL_RANGES, POOL_VIEWS, SHORT_MONTHS } from './constants'

///////////////////////////////////////////////////////////////////////////
// GENERAL
///////////////////////////////////////////////////////////////////////////

export function getCategoryColor(
  category: string,
  categories: string[]
): string {
  if (/canadian experience/i.test(category)) return 'var(--primary)'

  const COLOR_GROUPS: RegExp[] = [/french/i, /^trades/i, /health/i]
  const group = COLOR_GROUPS.find((re) => re.test(category))
  const idx = group
    ? categories.findIndex((c) => group.test(c))
    : categories.indexOf(category)
  const hue = Math.round((idx / (categories.length - 1)) * 330)
  return `hsl(${hue}, 72%, 52%)`
}

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
          .replace(/version /gi, 'V')
          .replace(/trade /gi, 'Trades ')
          .replace(/ occupations/gi, '')
          .replace(/work experience/gi, 'Exp')
          .replace(/French-Language/gi, 'French Language')
          .replace(/,?\s*(20\d\d)-(V\d+)/gi, ' ($2-$1)')
          .replace(/\b\w+\b/g, (word) =>
            ['and', 'with'].includes(word.toLowerCase())
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1)
          ),
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

export function formatStackedInvitationData(
  rounds: Round[],
  years: number[]
): {
  data: StackedInvitationDataPoint[]
  categories: string[]
  yearTotals: Record<number, number>
} {
  const categories = [...new Set(rounds.map((r) => r.category))].sort()

  const data: StackedInvitationDataPoint[] = []
  const yearTotals: Record<number, number> = {}

  for (const year of years) {
    const monthly: Record<number, Record<string, number>> = {}
    for (let i = 0; i < SHORT_MONTHS.length; i++) {
      monthly[i] = Object.fromEntries(categories.map((c) => [c, 0]))
    }
    let yearTotal = 0
    for (const r of rounds) {
      if (r.drawDate.getFullYear() !== year) continue
      monthly[r.drawDate.getMonth()][r.category] += r.invitations
      yearTotal += r.invitations
    }
    yearTotals[year] = yearTotal
    for (let i = 0; i < SHORT_MONTHS.length; i++) {
      data.push({ year, month: i, ...monthly[i] })
    }
  }

  return { data, categories, yearTotals }
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
