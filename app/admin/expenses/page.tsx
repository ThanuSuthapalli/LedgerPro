'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable, Column } from '@/components/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import { formatINR, formatDateIndia } from '@/lib/india-locale';

interface Expense {
  id: string;
  employee: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    employee: 'John Doe',
    description: 'Travel to Client Meeting',
    amount: 450,
    category: 'Travel',
    date: '2024-06-20',
    status: 'approved',
  },
  {
    id: '2',
    employee: 'Jane Smith',
    description: 'Office Equipment',
    amount: 320,
    category: 'Office Supplies',
    date: '2024-06-19',
    status: 'approved',
  },
  {
    id: '3',
    employee: 'Bob Johnson',
    description: 'Conference Registration',
    amount: 1200,
    category: 'Training',
    date: '2024-06-18',
    status: 'pending',
  },
  {
    id: '4',
    employee: 'Alice Brown',
    description: 'Lunch Meeting',
    amount: 85,
    category: 'Meals',
    date: '2024-06-17',
    status: 'approved',
  },
  {
    id: '5',
    employee: 'Charlie Wilson',
    description: 'Miscellaneous Items',
    amount: 45,
    category: 'Other',
    date: '2024-06-16',
    status: 'rejected',
  },
];

const columns: Column<Expense>[] = [
  {
    header: 'Employee',
    accessor: 'employee',
    sortable: true,
  },
  {
    header: 'Description',
    accessor: 'description',
    sortable: true,
  },
  {
    header: 'Category',
    accessor: 'category',
    sortable: true,
  },
  {
    header: 'Amount',
    accessor: 'amount',
    cell: (value) => formatINR(value),
    sortable: true,
  },
  {
    header: 'Date',
    accessor: 'date',
    cell: (value) => formatDateIndia(new Date(value)),
    sortable: true,
  },
  {
    header: 'Status',
    accessor: 'status',
    cell: (value) => <StatusBadge status={value} />,
    sortable: true,
  },
];

export default function AdminExpensesPage() {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expenses] = useState<Expense[]>(mockExpenses);

  const handleSort = (accessor: any, direction: 'asc' | 'desc') => {
    setSortColumn(typeof accessor === 'string' ? accessor : accessor.toString());
    setSortDirection(direction);
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = (a as any)[sortColumn];
    const bValue = (b as any)[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Expenses"
        description="View and manage all employee expenses"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <DataTable<Expense>
          columns={columns}
          data={sortedExpenses}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          emptyMessage="No expenses found"
        />
      </div>
    </div>
  );
}
