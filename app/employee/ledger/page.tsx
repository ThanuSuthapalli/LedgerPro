'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

import { formatINR, formatDateIndia } from '@/lib/india-locale';

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
}

const mockLedger: LedgerEntry[] = [
  {
    id: '1',
    date: '2024-06-20',
    description: 'Expense Reimbursement',
    type: 'credit',
    amount: 500,
    balance: 2500,
  },
  {
    id: '2',
    date: '2024-06-19',
    description: 'Travel Request Submitted',
    type: 'debit',
    amount: 350,
    balance: 2000,
  },
  {
    id: '3',
    date: '2024-06-18',
    description: 'Monthly Allowance',
    type: 'credit',
    amount: 2000,
    balance: 2350,
  },
  {
    id: '4',
    date: '2024-06-17',
    description: 'Equipment Purchase',
    type: 'debit',
    amount: 250,
    balance: 350,
  },
];

const columns: Column<LedgerEntry>[] = [
  {
    header: 'Date',
    accessor: 'date',
    cell: (value) => formatDateIndia(value),
    sortable: true,
  },
  {
    header: 'Description',
    accessor: 'description',
    sortable: true,
  },
  {
    header: 'Type',
    accessor: 'type',
    cell: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'credit'
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        {value === 'credit' ? 'Credit' : 'Debit'}
      </span>
    ),
  },
  {
    header: 'Amount',
    accessor: 'amount',
    cell: (value, item) => (
      <span className={item.type === 'credit' ? 'text-success font-semibold' : 'text-accent font-semibold'}>
        {item.type === 'credit' ? '+' : '-'}{formatINR(value)}
      </span>
    ),
    sortable: true,
  },
  {
    header: 'Balance',
    accessor: 'balance',
    cell: (value) => formatINR(value),
    sortable: true,
  },
];

export default function EmployeeLedgerPage() {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [ledger] = useState<LedgerEntry[]>(mockLedger);

  const handleSort = (accessor: any, direction: 'asc' | 'desc') => {
    setSortColumn(typeof accessor === 'string' ? accessor : accessor.toString());
    setSortDirection(direction);
  };

  const currentBalance = mockLedger[0]?.balance || 0;
  const totalCredits = mockLedger.filter((e) => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);
  const totalDebits = mockLedger.filter((e) => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);

  const sortedLedger = [...ledger].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = (a as any)[sortColumn];
    const bValue = (b as any)[sortColumn];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Ledger"
        description="View your financial transactions and balance history"
        actions={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold text-primary mt-1">{formatINR(currentBalance)}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-2xl font-bold text-success mt-1">{formatINR(totalCredits)}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Debits</p>
            <p className="text-2xl font-bold text-accent mt-1">{formatINR(totalDebits)}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold text-foreground mt-1">{ledger.length}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <DataTable<LedgerEntry>
          columns={columns}
          data={sortedLedger}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          emptyMessage="No ledger entries found"
        />
      </div>
    </div>
  );
}
