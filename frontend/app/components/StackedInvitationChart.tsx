'use client'

import { Fragment } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  SHORT_MONTHS,
  FULL_MONTHS,
  CHART_ASPECT_RATIO,
} from '../constants'
import { StackedInvitationDataPoint } from '../types'
import { getCategoryColor } from '../utils'
import ChartTooltipComponent from './ChartTooltip'

interface StackedInvitationChartProps {
  data: StackedInvitationDataPoint[]
  year: number
  categories: string[]
  activeCategoryTotals: Record<string, number>
}

function ChartTooltip({
  active,
  payload,
  year,
  categories,
}: {
  active?: boolean
  payload?: { payload: StackedInvitationDataPoint }[]
  year: number
  categories: string[]
}) {
  if (!active || !payload?.[0]) return null
  const point = payload[0].payload
  const fullMonth = FULL_MONTHS[point.month]

  const entries = categories
    .map((cat) => ({ cat, val: point[cat] ?? 0 }))
    .filter((e) => e.val > 0)

  if (entries.length === 0) return null

  const total = entries.reduce((sum, e) => sum + e.val, 0)

  return (
    <ChartTooltipComponent
      content={
        <div className="flex flex-col">
          <span className="mb-1.5">
            {fullMonth} {year}
          </span>
          <div
            className="grid gap-y-0.75"
            style={{ gridTemplateColumns: '1fr auto' }}
          >
            {entries.map((e) => (
              <Fragment key={e.cat}>
                <span className="flex items-center gap-2 pr-4 min-w-0">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-xs"
                    style={{ backgroundColor: getCategoryColor(e.cat, categories) }}
                  />
                  <span className="text-foreground2 truncate">{e.cat}</span>
                </span>
                <span className="tabular-nums text-right">
                  {e.val.toLocaleString()}
                </span>
              </Fragment>
            ))}
            <div className="border-t border-border col-span-2 my-0.75"/>
            <span>Total</span>
            <span className="tabular-nums text-foreground">
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      }
    />
  )
}

export default function StackedInvitationChart({
  data,
  year,
  categories,
  activeCategoryTotals,
}: StackedInvitationChartProps) {
  return (
    <div className="flex flex-col gap-3">
      <ResponsiveContainer width="100%" aspect={CHART_ASPECT_RATIO}>
        <BarChart
          barCategoryGap="15%"
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
            content={<ChartTooltip year={year} categories={categories} />}
          />
          {categories.map((cat, idx) => (
            <Bar
              key={cat}
              stackId="stack"
              dataKey={cat}
              fill={getCategoryColor(cat, categories)}
              maxBarSize={26}
              animationDuration={200}
              animationEasing="ease-out"
              shape={(props: any) => {
                const isTopmost = categories
                  .slice(idx + 1)
                  .every((c) => (props[c] ?? 0) === 0)
                const { x, y, width: w, height: h, fill } = props
                const adjY = y + 1
                const adjH = h - 1
                if (adjH <= 0) return <g />
                const r = isTopmost ? Math.min(2, w / 2, adjH) : 0
                const d = `M${x},${adjY + adjH} L${x},${adjY + r} Q${x},${adjY} ${
                  x + r
                },${adjY} L${x + w - r},${adjY} Q${x + w},${adjY} ${x + w},${
                  adjY + r
                } L${x + w},${adjY + adjH} Z`
                return <path d={d} fill={fill} />
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <div
        className="grid gap-y-1.5 text-sm"
        style={{ gridTemplateColumns: '1fr auto' }}
      >
        {Object.entries(activeCategoryTotals).map(([cat, total]) => (
          <Fragment key={cat}>
            <span className="flex items-center gap-2 pr-4 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-xs"
                style={{ backgroundColor: getCategoryColor(cat, categories) }}
              />
              <span className="text-foreground2 truncate">{cat}</span>
            </span>
            <span className="tabular-nums text-right">
              {total.toLocaleString()}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
