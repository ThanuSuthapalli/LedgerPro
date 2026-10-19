'use client'

import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'paid'
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

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <Badge className={config.color}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}
