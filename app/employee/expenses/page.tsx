'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import { Download, Plus, Upload, RefreshCw, X, CheckCircle } from 'lucide-react';
import { formatINR, formatDateIndia } from '@/lib/india-locale';
import { getSession } from '@/lib/mock-auth';
import Link from 'next/link';

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: string;
  category: string;
  createdAt: string;
  status: string;
  billPath: string | null;
  uploadedAt: string | null;
}

interface RequestModal {
  open: boolean;
  expense: Expense | null;
  receiptFile: File | null;
  isSubmitting: boolean;
  error: string;
}

export default function EmployeeExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<RequestModal>({
    open: false,
    expense: null,
    receiptFile: null,
    isSubmitting: false,
    error: '',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = getSession();
      const userId = session?.user?.id || 'emp-001';
      const res = await fetch(`/api/requests?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        // Filter only approved expenses for "My Expenses" view
        const approved = (data.requests || []).filter(
          (r: Expense) => r.status === 'approved' || r.status === 'paid' || r.status === 'admin_approved'
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

  const openModal = (expense: Expense) => {
    setModal({ open: true, expense, receiptFile: null, isSubmitting: false, error: '' });
  };

  const closeModal = () => {
    setModal({ open: false, expense: null, receiptFile: null, isSubmitting: false, error: '' });
  };

  const handleSubmitAsRequest = async () => {
    if (!modal.expense) return;
    if (!modal.receiptFile) {
      setModal((prev) => ({ ...prev, error: 'Please select a receipt file. Receipt is mandatory when submitting from My Expenses.' }));
      return;
    }

    setModal((prev) => ({ ...prev, isSubmitting: true, error: '' }));

    try {
      const session = getSession();
      const userId = session?.user?.id || 'emp-001';

      const categoryMap: Record<string, string> = {
        Travel: 'cat-001',
        'Food & Beverages': 'cat-002',
        Accommodation: 'cat-003',
        Equipment: 'cat-004',
      };
      const categoryId = categoryMap[modal.expense.category] || 'cat-005';

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: userId,
          title: modal.expense.title,
          description: modal.expense.description,
          categoryId,
          amount: parseFloat(modal.expense.amount),
        }),
      });

      if (!res.ok) throw new Error('Failed to submit request');

      const data = await res.json();
      const newId = data.request.id;

      // Simulate receipt upload
      await fetch(`/api/requests/${newId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billPath: `/receipts/${newId}/${modal.receiptFile.name}` }),
      });

      setSuccessMsg(`Request submitted successfully with receipt!`);
      closeModal();
      fetchExpenses();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setModal((prev) => ({ ...prev, isSubmitting: false, error: err.message || 'Failed to submit request' }));
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);
  const paidAmount = expenses.filter((e) => e.status === 'paid').reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="My Expenses"
        description="View your approved expenses. Use 'Submit as Request' to create a reimbursement request with a mandatory receipt."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchExpenses} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/employee/request">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-success/10 border border-success text-success rounded-lg text-sm">
            <CheckCircle className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Approved</p>
            <p className="text-2xl font-bold text-foreground mt-1">{formatINR(totalAmount)}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Paid Out</p>
            <p className="text-2xl font-bold text-success mt-1">{formatINR(paidAmount)}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold text-foreground mt-1">{expenses.length}</p>
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
              <p className="text-muted-foreground mb-2">No approved expenses yet.</p>
              <p className="text-xs text-muted-foreground">Approved expenses will appear here once your requests are processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{expense.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{expense.description}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">{formatINR(parseFloat(expense.amount))}</td>
                      <td className="py-3 px-4 text-muted-foreground">{formatDateIndia(expense.createdAt)}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={expense.status} />
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          className="h-8 bg-primary hover:bg-primary/90 text-xs"
                          onClick={() => openModal(expense)}
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Submit as Request
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Submit as Request Modal */}
      {modal.open && modal.expense && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
              <h3 className="text-lg font-bold text-foreground">Submit as Reimbursement Request</h3>
              <Button size="sm" variant="ghost" onClick={closeModal} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-medium text-foreground">{modal.expense.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-lg text-foreground">{formatINR(parseFloat(modal.expense.amount))}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Upload Receipt <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receipt is <strong>mandatory</strong> when submitting from My Expenses.
                </p>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setModal((prev) => ({ ...prev, receiptFile: e.target.files?.[0] || null }))
                  }
                  className="text-sm"
                />
                {modal.receiptFile && (
                  <p className="text-xs text-success">
                    ✓ {modal.receiptFile.name} ({(modal.receiptFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {modal.error && (
                <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-xs">
                  {modal.error}
                </div>
              )}

              <div className="flex gap-3 pt-2 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={closeModal} disabled={modal.isSubmitting}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSubmitAsRequest}
                  disabled={modal.isSubmitting}
                >
                  {modal.isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
