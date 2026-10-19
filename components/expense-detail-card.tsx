'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface ExpenseDetailCardProps {
  id: string
  title: string
  description: string
  amount: number
  category: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  submittedDate: Date
  approvedDate?: Date
  dueDate?: Date
  attachments?: string[]
  notes?: string
  isLateSubmission?: boolean
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

export function ExpenseDetailCard({ 
  id, 
  title, 
  description, 
  amount, 
  category, 
  status, 
  submittedDate, 
  approvedDate, 
  dueDate,
  attachments,
  notes,
  isLateSubmission 
}: ExpenseDetailCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <Badge className={config.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Amount</p>
            <p className="text-2xl font-bold text-gray-900">₹{amount.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Category</p>
            <p className="text-lg text-gray-900">{category}</p>
          </div>
        </div>

        {/* Late Submission Warning */}
        {isLateSubmission && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Late Submission</p>
              <p className="text-sm text-red-700">This expense was submitted more than 48 hours after the transaction date.</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Submitted</span>
            <span className="text-sm font-medium">{format(submittedDate, 'dd MMM yyyy, HH:mm')}</span>
          </div>
          {approvedDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approved</span>
              <span className="text-sm font-medium">{format(approvedDate, 'dd MMM yyyy, HH:mm')}</span>
            </div>
          )}
          {dueDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expected Payment</span>
              <span className="text-sm font-medium">{format(dueDate, 'dd MMM yyyy')}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {notes && (
          <div className="bg-gray-50 rounded-lg p-3 border-t">
            <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
            <p className="text-sm text-gray-600">{notes}</p>
          </div>
        )}

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Attachments ({attachments.length})</p>
            <div className="space-y-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{file}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          {status === 'pending' && (
            <>
              <Button className="flex-1 bg-green-600 hover:bg-green-700">Approve</Button>
              <Button variant="outline" className="flex-1">Reject</Button>
            </>
          )}
          {status === 'approved' && (
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Process Payment</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
