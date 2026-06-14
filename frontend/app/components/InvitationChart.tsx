'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { SHORT_MONTHS, FULL_MONTHS, CHART_ASPECT_RATIO } from '../constants'
import { InvitationDataPoint } from '../types'
import ChartTooltipComponent from './ChartTooltip'

interface InvitationChartProps {
  data: InvitationDataPoint[]
  year: number
}

function ChartTooltip({
  active,
  payload,
  year,
}: {
  active?: boolean
  payload?: { payload: InvitationDataPoint }[]
  year: number
}) {
  if (!active || !payload?.[0]) return null
  const point = payload[0].payload
  const fullMonth = FULL_MONTHS[point.month]

  return (
    <ChartTooltipComponent
      content={
        <div className="flex flex-col text-foreground2">
          <span>
            <span className="text-foreground">
              {point.invitations.toLocaleString()}
            </span>{' '}
            invitations
          </span>
          <span>
            {fullMonth} {year}
          </span>
        </div>
      }
    />
  )
}

export default function InvitationChart({ data, year }: InvitationChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" aspect={CHART_ASPECT_RATIO}>
        <BarChart
          barCategoryGap="16%"
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="month"
            interval={1}
            tick={{ fontSize: 12, fill: 'var(--foreground2)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => SHORT_MONTHS[val]}
          />
          <YAxis
            orientation="right"
            width={30}
            tick={{ fontSize: 12, fill: 'var(--foreground2)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
          />
          <CartesianGrid
            vertical={false}
            stroke="var(--border2)"
            strokeDasharray="1 2"
          />
          <Tooltip
            isAnimationActive={false}
            cursor={{ fill: 'var(--background2)' }}
            content={<ChartTooltip year={year} />}
          />
          <Bar
            maxBarSize={24}
            dataKey="invitations"
            fill="var(--primary)"
            radius={[2, 2, 2, 2]}
            animationDuration={200}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
