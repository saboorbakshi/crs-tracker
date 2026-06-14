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
import { PoolDataPoint } from '../types'
import ChartTooltipComponent from './ChartTooltip'
import { CHART_ASPECT_RATIO, POOL_VIEWS } from '../constants'

interface PoolChartProps {
  data: PoolDataPoint[]
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: PoolDataPoint }[]
}) {
  if (!active || !payload?.[0]) return null
  const point = payload[0].payload

  return (
    <ChartTooltipComponent
      content={
        <div className="flex flex-col text-foreground2">
          <span>
            <span className="text-foreground">
              {point.count.toLocaleString()}
            </span>{' '}
            candidates
          </span>
          <span>
            <span className="text-foreground">{point.range}</span> CRS score
          </span>
        </div>
      }
    />
  )
}

export default function PoolChart({ data }: PoolChartProps) {
  const isDetailed = data.length > POOL_VIEWS.Compact.length
  return (
    <div>
      <ResponsiveContainer width="100%" aspect={CHART_ASPECT_RATIO}>
        <BarChart
          barCategoryGap="16%"
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis
            interval={'equidistantPreserveEnd'}
            dataKey="range"
            tick={{ fontSize: 12, fill: 'var(--foreground2)' }}
            tickLine={false}
            axisLine={false}
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
            content={<ChartTooltip />}
          />
          <Bar
            maxBarSize={isDetailed ? 20 : 48}
            dataKey="count"
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
