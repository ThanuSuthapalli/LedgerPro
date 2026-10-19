import React from 'react';
import { cn } from '@/lib/utils';

type Status = string;

interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}

const statusStyles: Record<string, StatusStyle> = {
  // Legacy
  pending: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-200',
    border: 'border-yellow-200 dark:border-yellow-800',
    label: 'Pending',
  },
  approved: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
    label: 'Approved',
  },
  rejected: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
    label: 'Rejected',
  },
  completed: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
    label: 'Completed',
  },
  draft: {
    bg: 'bg-gray-50 dark:bg-gray-950',
    text: 'text-gray-600 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    label: 'Draft',
  },
  processing: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-800',
    label: 'Processing',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
    label: 'Success',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
    label: 'Error',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-200',
    border: 'border-yellow-200 dark:border-yellow-800',
    label: 'Warning',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-800',
    label: 'Info',
  },
  // DB statuses
  submitted: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-800',
    label: 'Submitted',
  },
  pending_manager: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-200',
    border: 'border-yellow-200 dark:border-yellow-800',
    label: 'Pending Manager',
  },
  manager_approved: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-200',
    border: 'border-emerald-200 dark:border-emerald-800',
    label: 'Manager Approved',
  },
  pending_admin: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-700 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-800',
    label: 'Pending Admin',
  },
  admin_approved: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
    label: 'Admin Approved',
  },
  clarification_needed: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-700 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-800',
    label: 'Clarification Needed',
  },
  paid: {
    bg: 'bg-teal-50 dark:bg-teal-950',
    text: 'text-teal-700 dark:text-teal-200',
    border: 'border-teal-200 dark:border-teal-800',
    label: 'Paid',
  },
};

const fallbackStyle: StatusStyle = {
  bg: 'bg-gray-50 dark:bg-gray-900',
  text: 'text-gray-600 dark:text-gray-300',
  border: 'border-gray-200 dark:border-gray-700',
  label: '',
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = statusStyles[status] || fallbackStyle;
  const displayLabel = label || style.label || (status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '));

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap',
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
