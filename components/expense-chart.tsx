'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface CategoryData {
  name: string
  value: number
}

interface TrendData {
  date: string
  amount: number
}

interface ChartProps {
  type: 'bar' | 'line' | 'pie'
  title: string
  data: CategoryData[] | TrendData[]
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export function ExpenseChart({ type, title, data }: ChartProps) {
  const height = 300

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === 'bar' && (
            <BarChart data={data as CategoryData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
          {type === 'line' && (
            <LineChart data={data as TrendData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          )}
          {type === 'pie' && (
            <PieChart>
              <Pie
                data={data as CategoryData[]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(data as CategoryData[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
