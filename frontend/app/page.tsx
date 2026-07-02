'use client'

import { useState, useMemo, useEffect } from 'react'
import rawData from '../data.json'
import DrawChart from './components/DrawChart'
import StackedInvitationChart from './components/StackedInvitationChart'
import PoolChart from './components/PoolChart'
import Select from './components/Select'
import ExternalLink from './components/ExternalLink'
import {
  extractRounds,
  formatDrawData,
  formatStackedInvitationData,
  getPoolDistribution,
  filterByTime,
} from './utils'
import { ApiResponseSchema, DrawDataPoint } from './types'
import { PERIODS, POOL_VIEWS, LINE_CHART_ASPECT_RATIO } from './constants'
import ChartHeader from './components/ChartHeader'

const data = ApiResponseSchema.parse(rawData)
const rounds = extractRounds(data)
const years = [
  ...new Set(rounds.map((round) => round.drawDate.getFullYear())),
].sort((a, b) => b - a)

const latestRound = rounds[0]
const drawData = formatDrawData(rounds)
const {
  data: invitationData,
  categories: invitationCategories,
  yearTotals: invitationYearTotals,
} = formatStackedInvitationData(rounds, years)

const TIME_OPTIONS = [
  { label: 'Periods', options: PERIODS },
  { label: 'Years', options: years.map(String) },
]

const ChartPlaceholder = ({
  aspectRatio,
  message
}: {
  aspectRatio: number
  message: string
}) => (
  <div
    style={{ aspectRatio }}
    className="w-full flex items-center justify-center text-foreground2 text-sm sm:text-base border border-border rounded-md"
  >
    <p>{message}</p>
  </div>
)

export default function Home() {
  // drawChart
  const categories = Object.keys(drawData)
  const [category, setCategory] = useState(categories[1] || categories[0])
  const [timeOption, setTimeOption] = useState(PERIODS[PERIODS.length - 1])
  const [activeDrawPoint, setActiveDrawPoint] = useState<DrawDataPoint | null>(
    null
  )

  const filteredDrawData = useMemo(() => {
    return filterByTime(drawData[category], timeOption)
  }, [category, timeOption])

  useEffect(() => {
    if (filteredDrawData.length > 0) {
      setActiveDrawPoint(filteredDrawData[filteredDrawData.length - 1])
    } else {
      setActiveDrawPoint(null)
    }
  }, [filteredDrawData])

  // stackedInvitationChart
  const yearOptions = years.map(String)
  const [invitationYear, setInvitationYear] = useState(yearOptions[0])

  const filteredInvitationData = useMemo(() => {
    return invitationData.filter((d) => d.year === Number(invitationYear))
  }, [invitationYear])

  const totalInvitations = invitationYearTotals[Number(invitationYear)]

  const activeCategoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    for (const cat of invitationCategories) {
      const total = filteredInvitationData.reduce((sum, d) => sum + (d[cat] ?? 0), 0)
      if (total > 0) totals[cat] = total
    }
    return totals
  }, [filteredInvitationData])

  // poolChart
  const poolViewOptions = Object.keys(POOL_VIEWS) as (keyof typeof POOL_VIEWS)[]
  const [poolView, setPoolView] = useState(poolViewOptions[0])

  const filteredPoolData = useMemo(() => {
    return getPoolDistribution(latestRound, poolView)
  }, [poolView])

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-xl flex-col py-8 sm:py-14 px-5 gap-14 sm:gap-16">
        <section className="-mb-7 sm:-mb-8">
          <p className="text-4xl sm:text-5xl font-medium mb-8">
            Canada Express Entry Statistics
          </p>
          <p className="mb-6">
            All Express Entry draws since 2020 are tracked and automatically
            updated here to help you better understand your position based on
            your{' '}
            <ExternalLink href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score.html">
              CRS
            </ExternalLink>{' '}
            score, using official data from{' '}
            <ExternalLink href="https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html">
              IRCC’s records
            </ExternalLink>
            . The charts below break this data into three views:
          </p>
          <ol className="list-decimal ml-6 space-y-1 mb-6">
            <li>
              The lowest CRS score required for an invitation in each draw,
              shown chronologically to highlight trends over time.
            </li>
            <li>
              The number of invitations issued each month, broken down into individual categories.
            </li>
            <li>
              The current distribution of candidates by CRS scores in the
              Express Entry pool as of {latestRound.drawDateFull}.
            </li>
          </ol>
          {/* <ExternalLink href="https://saboorbakshi.com/">
            I'm looking for opportunities in Canada!
          </ExternalLink> */}
        </section>

        <section>
          <ChartHeader
            title="Lowest CRS Score"
            value={activeDrawPoint?.score ?? '-'}
            subtitle={activeDrawPoint?.dateFull ?? '-'}
          />
          <div className="flex gap-2 mb-6">
            <Select
              value={category}
              onValueChange={setCategory}
              options={categories}
            />
            <Select
              value={timeOption}
              onValueChange={setTimeOption}
              options={TIME_OPTIONS}
            />
          </div>
          {filteredDrawData.length > 0 ? (
            <DrawChart
              data={filteredDrawData}
              onActiveChange={setActiveDrawPoint}
            />
          ) : (
            <ChartPlaceholder
              aspectRatio={LINE_CHART_ASPECT_RATIO}
              message="No draws available for the selected filters."
            />
          )}
        </section>

        <section>
          <ChartHeader title="Total Invitations" value={totalInvitations} />
          <div className="flex gap-2 mb-6">
            <Select
              value={invitationYear}
              onValueChange={setInvitationYear}
              options={yearOptions}
            />
          </div>
          <StackedInvitationChart
            data={filteredInvitationData}
            year={Number(invitationYear)}
            categories={invitationCategories}
            activeCategoryTotals={activeCategoryTotals}
          />
        </section>

        <section>
          <div className="flex justify-between">
            <ChartHeader
              title="Candidate Distribution"
              value={latestRound.totalCandidates}
              subtitle={latestRound.drawDateFull}
            />
          </div>
          <div className="flex gap-2 mb-6">
            <Select
              value={poolView}
              onValueChange={(v) => setPoolView(v as keyof typeof POOL_VIEWS)}
              options={poolViewOptions}
            />
          </div>
          <PoolChart data={filteredPoolData} />
        </section>
      </main>
    </div>
  )
}
