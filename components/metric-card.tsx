import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  borderColor?: 'blue' | 'brown' | 'green' | 'red' | 'yellow'
  backgroundColor?: string
}

const borderColorMap = {
  blue: 'border-blue-400',
  brown: 'border-amber-600',
  green: 'border-green-600',
  red: 'border-red-500',
  yellow: 'border-yellow-400',
}

const bgColorMap = {
  blue: 'bg-blue-50',
  brown: 'bg-amber-50',
  green: 'bg-green-50',
  red: 'bg-red-50',
  yellow: 'bg-yellow-50',
}

export function MetricCard({
  title,
  value,
  icon,
  borderColor = 'blue',
  backgroundColor,
}: MetricCardProps) {
  return (
    <div className={`rounded-2xl border-2 ${borderColorMap[borderColor]} ${backgroundColor || bgColorMap[borderColor]} p-6`}>
      <p className="mb-4 text-sm font-medium text-gray-600">{title}</p>
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white opacity-80">{icon}</div>
      </div>
    </div>
  )
}
