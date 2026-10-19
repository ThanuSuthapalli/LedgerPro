'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export interface ExpenseRow {
  id: string
  employeeId?: string
  employeeName?: string
  title: string
  amount: number
  category: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  submittedDate: Date
  isLate?: boolean
}

interface ExpenseTableProps {
  expenses: ExpenseRow[]
  onViewDetails: (expense: ExpenseRow) => void
  showEmployee?: boolean
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending',
  },
  approved: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    label: 'Approved',
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    label: 'Rejected',
  },
  paid: {
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800',
    label: 'Paid',
  },
}

export function ExpenseTable({ expenses, onViewDetails, showEmployee }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-gray-500">No expenses found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {showEmployee ? 'Employee' : 'Title'}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const config = statusConfig[expense.status]
                const StatusIcon = config.icon
                return (
                  <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {showEmployee ? expense.employeeName : expense.title}
                        </p>
                        {showEmployee && (
                          <p className="text-xs text-gray-500">{expense.title}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{expense.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge className={config.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                        {expense.isLate && (
                          <AlertCircle className="w-4 h-4 text-red-600" title="Late submission" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {format(new Date(expense.submittedDate), 'dd MMM yyyy')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(expense)}
                        className="hover:bg-gray-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
