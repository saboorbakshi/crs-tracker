interface ChartHeaderProps {
  title: string
  value: number | string
  subtitle?: string
}

export default function ChartHeader({
  title,
  value,
  subtitle,
}: ChartHeaderProps) {
  const displayValue =
    typeof value === 'number' ? value.toLocaleString() : value

  return (
    <div className="mb-4">
      <p className="text-lg">{title}</p>
      <p className="text-5xl">{displayValue}</p>
      {subtitle && <p className="text-foreground2 mt-1">{subtitle}</p>}
    </div>
  )
}
