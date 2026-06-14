'use client'

import { useEffect, useRef, useMemo } from 'react'
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { DrawDataPoint } from '../types'
import ChartTooltipComponent from './ChartTooltip'
import { calculateDomain } from '../utils'
import { CHART_ASPECT_RATIO } from '../constants'

interface DrawChartProps {
  data: DrawDataPoint[]
  onActiveChange?: (point: DrawDataPoint) => void
}

function ChartTooltip({
  active,
  payload,
  onActiveChange = () => {},
  fallback,
}: {
  active?: boolean
  payload?: any[]
  onActiveChange?: (point: DrawDataPoint) => void
  fallback: DrawDataPoint
}) {
  const point =
    active && payload && payload.length > 0
      ? (payload[0].payload as DrawDataPoint)
      : null

  const prevRef = useRef<DrawDataPoint | null>(null)

  useEffect(() => {
    const next = point ?? fallback
    if (prevRef.current !== next) {
      prevRef.current = next
      onActiveChange(next)
    }
  }, [point, fallback, onActiveChange])

  if (!point) return null

  return (
    <ChartTooltipComponent
      content={
        <div className="flex flex-col text-foreground2">
          <span>
            <span className="text-foreground">{point.score}</span> CRS score
          </span>
          <span>
            <span className="text-foreground">
              {point.invitations.toLocaleString()}
            </span>{' '}
            invitations
          </span>
          <span>{point.dateFull}</span>
        </div>
      }
    />
  )
}

export default function DrawChart({
  data,
  onActiveChange = () => {},
}: DrawChartProps) {
  const fallback = data[data.length - 1]
  const domain = useMemo(() => calculateDomain(data), [data])

  useEffect(() => {
    if (fallback) {
      onActiveChange(fallback)
    }
  }, [fallback, onActiveChange])

  return (
    <ResponsiveContainer width="100%" aspect={CHART_ASPECT_RATIO}>
      <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 4 }}>
        <YAxis
          orientation="right"
          width={32}
          domain={domain}
          allowDecimals={false}
          tick={{ fontSize: 12, fill: 'var(--foreground2)' }}
          tickLine={false}
          axisLine={false}
        />
        <CartesianGrid
          vertical={false}
          stroke="var(--border2)"
          strokeDasharray="1 2"
        />
        <Tooltip
          isAnimationActive={false}
          cursor={{ stroke: 'var(--border2)', strokeDasharray: '1 2' }}
          content={
            <ChartTooltip onActiveChange={onActiveChange} fallback={fallback} />
          }
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 2, fill: 'var(--primary)' }}
          animationDuration={200}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
