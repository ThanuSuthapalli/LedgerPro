'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';

import { formatINR } from '@/lib/india-locale';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  totalExpenses: number;
  pendingApprovals: number;
  status: 'active' | 'inactive';
}

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Senior Developer',
    totalExpenses: 3500,
    pendingApprovals: 1,
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'Developer',
    totalExpenses: 2100,
    pendingApprovals: 2,
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    role: 'QA Engineer',
    totalExpenses: 1800,
    pendingApprovals: 0,
    status: 'active',
  },
];

const columns: Column<TeamMember>[] = [
  {
    header: 'Name',
    accessor: 'name',
    sortable: true,
  },
  {
    header: 'Email',
    accessor: 'email',
    sortable: true,
  },
  {
    header: 'Role',
    accessor: 'role',
    sortable: true,
  },
  {
    header: 'Total Expenses',
    accessor: 'totalExpenses',
    cell: (value) => formatINR(value),
    sortable: true,
  },
  {
    header: 'Pending Approvals',
    accessor: 'pendingApprovals',
    cell: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value > 0
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }`}>
        {value}
      </span>
    ),
    sortable: true,
  },
  {
    header: 'Actions',
    accessor: (item: TeamMember) => item.id,
    cell: (id, item) => (
      <Button size="sm" variant="outline" className="h-8" onClick={() => window.location.href = `mailto:${item.email}`}>
        <Mail className="w-3 h-3 mr-1" />
        Contact
      </Button>
    ),
  },
];

export default function ManagerTeamPage() {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [team] = useState<TeamMember[]>(mockTeam);

  const handleSort = (accessor: any, direction: 'asc' | 'desc') => {
    setSortColumn(typeof accessor === 'string' ? accessor : accessor.toString());
    setSortDirection(direction);
  };

  const totalPending = team.reduce((sum, member) => sum + member.pendingApprovals, 0);

  const sortedTeam = [...team].sort((a, b) => {
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
        title="Team Members"
        description="View and manage your team members and their expense tracking"
        actions={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Summary */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Team Members</p>
            <p className="text-2xl font-bold text-foreground mt-1">{team.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {formatINR(team.reduce((sum, m) => sum + m.totalExpenses, 0))}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Pending Approvals</p>
            <p className="text-2xl font-bold text-warning mt-1">{totalPending}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <DataTable<TeamMember>
          columns={columns}
          data={sortedTeam}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          emptyMessage="No team members found"
        />
      </div>
    </div>
  );
}
