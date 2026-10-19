'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import { formatINR, formatDateIndia } from '@/lib/india-locale';
import { exportToCSV } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface LedgerEntry {
  id: string;
  date: string;
  employee: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  reference: string;
}

const mockLedger: LedgerEntry[] = [
  {
    id: '1',
    date: '2024-06-20',
    employee: 'John Doe',
    description: 'Expense Reimbursement',
    type: 'debit',
    amount: 450,
    reference: 'EXP-001',
  },
  {
    id: '2',
    date: '2024-06-19',
    employee: 'Jane Smith',
    description: 'Travel Request Approved',
    type: 'debit',
    amount: 800,
    reference: 'REQ-002',
  },
  {
    id: '3',
    date: '2024-06-18',
    employee: 'Bob Johnson',
    description: 'Request Submitted',
    type: 'credit',
    amount: 1200,
    reference: 'REQ-003',
  },
  {
    id: '4',
    date: '2024-06-17',
    employee: 'Alice Brown',
    description: 'Equipment Purchase',
    type: 'debit',
    amount: 320,
    reference: 'EXP-004',
  },
];

export default function AdminLedgerPage() {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [ledger, setLedger] = useState<LedgerEntry[]>(mockLedger);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);

  const handleSort = (accessor: any, direction: 'asc' | 'desc') => {
    setSortColumn(typeof accessor === 'string' ? accessor : accessor.toString());
    setSortDirection(direction);
  };

  const handleExport = () => {
    const headers = [
      { label: 'Date', key: 'date' },
      { label: 'Employee Name', key: 'employee' },
      { label: 'Description', key: 'description' },
      { label: 'Transaction Type', key: 'type' },
      { label: 'Amount (INR)', key: 'amount' },
      { label: 'Reference Code', key: 'reference' }
    ];
    const exportData = ledger.map(e => ({
      ...e,
      amount: `₹${e.amount}`,
      date: formatDateIndia(e.date),
      type: e.type === 'credit' ? 'Submitted' : 'Paid'
    }));
    exportToCSV(exportData, headers, 'Master_Ledger_Report');
  };

  const totalDebits = ledger.filter((e) => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = ledger.filter((e) => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);

  const filteredLedger = ledger.filter(e => {
    const matchesSearch = e.employee.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedLedger = [...filteredLedger].sort((a, b) => {
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

  const columns: Column<LedgerEntry>[] = [
    {
      header: 'Date',
      accessor: 'date',
      cell: (value) => formatDateIndia(value),
      sortable: true,
    },
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
      header: 'Type',
      accessor: 'type',
      cell: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'credit'
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {value === 'credit' ? 'Submitted' : 'Paid'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (value) => formatINR(value),
      sortable: true,
    },
    {
      header: 'Reference',
      accessor: 'reference',
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Master Ledger"
        description="View all financial transactions and ledger entries"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilterBar(!showFilterBar)}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Payments</p>
            <p className="text-2xl font-bold text-success mt-1">{formatINR(totalDebits)}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Submitted</p>
            <p className="text-2xl font-bold text-accent mt-1">{formatINR(totalCredits)}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p className="text-2xl font-bold text-primary mt-1">{formatINR(totalCredits - totalDebits)}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Interactive Filter Bar */}
        {showFilterBar && (
          <div className="bg-card border border-border p-4 rounded-lg flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground font-semibold block mb-1">Search Ledger</label>
              <Input
                placeholder="Search by name, reference, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold block mb-1">Transaction Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none"
              >
                <option value="all">All Types</option>
                <option value="credit">Submitted (Credit)</option>
                <option value="debit">Paid (Debit)</option>
              </select>
            </div>
          </div>
        )}

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
