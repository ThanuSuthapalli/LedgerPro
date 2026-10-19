'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Plus } from 'lucide-react';
import { formatINR, formatDateIndia } from '@/lib/india-locale';
import Link from 'next/link';

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: string;
  status: string;
  createdAt: string;
  employeeName: string | null;
  billPath: string | null;
}

export default function ManagerExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        // Show approved/paid expenses for the expenses view
        const approved = (data.requests || []).filter(
          (r: Expense) => r.status === 'admin_approved' || r.status === 'paid'
        );
        setExpenses(approved);
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Team Expenses"
        description="View all approved expenses for your team"
        actions={
          <div className="flex gap-2">
            <Link href="/manager/request">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                My Expense
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={fetchExpenses} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Approved</p>
            <p className="text-2xl font-bold text-foreground mt-1">{formatINR(totalAmount)}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold text-foreground mt-1">{expenses.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Paid Out</p>
            <p className="text-2xl font-bold text-success mt-1">
              {formatINR(expenses.filter(e => e.status === 'paid').reduce((s, e) => s + parseFloat(e.amount), 0))}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />
              Loading expenses...
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No approved expenses yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Expenses appear here once admin-approved.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Employee</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Receipt</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{expense.employeeName || 'Unknown'}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{expense.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">{expense.description}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">{formatINR(parseFloat(expense.amount))}</td>
                      <td className="py-3 px-4 text-muted-foreground">{formatDateIndia(expense.createdAt)}</td>
                      <td className="py-3 px-4">
                        {expense.billPath ? (
                          <span className="text-xs text-success font-medium">✓ Uploaded</span>
                        ) : (
                          <span className="text-xs text-warning font-medium">⚠ Missing</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={expense.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
