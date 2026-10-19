'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StatCard } from '@/components/stat-card';
import { PageHeader } from '@/components/page-header';
import { DollarSign, FileText, CheckCircle, Clock, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatINR, formatDateIndia } from '@/lib/india-locale';
import { StatusBadge } from '@/components/ui/status-badge';
import { getSession } from '@/lib/mock-auth';

interface Request {
  id: string;
  title: string;
  amount: string;
  status: string;
  createdAt: string;
  billPath: string | null;
}

function EmployeeDashboardNewBase() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sessionData = getSession();
  const employeeName = sessionData?.user?.name || 'Employee';

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = getSession();
      const userId = session?.user?.id || 'emp-001';
      const res = await fetch(`/api/requests?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Re-fetch when the tab becomes visible again (e.g. user submitted a request
    // in another page and came back to the dashboard)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    // Re-fetch when the window regains focus
    const handleFocus = () => {
      fetchData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchData]);

  const totalSpent = requests
    .filter((r) => r.status === 'admin_approved' || r.status === 'paid')
    .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

  const pendingCount = requests.filter(
    (r) => r.status === 'submitted' || r.status === 'pending_manager' || r.status === 'manager_approved'
  ).length;

  const approvedCount = requests.filter(
    (r) => r.status === 'admin_approved' || r.status === 'paid'
  ).length;

  const pendingReceiptCount = requests.filter((r) => !r.billPath && r.status !== 'rejected').length;

  const recentRequests = requests.slice(0, 4);

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title={`Welcome, ${employeeName}`}
        description="Submit and track your expense claims. Upload receipts within 48 hours of submission."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
              className="text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/employee/request">
              <Button className="bg-primary hover:bg-primary/90">
                <FileText className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Receipt Upload Reminder */}
        {pendingReceiptCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <Upload className="w-5 h-5 text-warning flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {pendingReceiptCount} request{pendingReceiptCount > 1 ? 's' : ''} pending receipt upload
              </p>
              <p className="text-xs text-muted-foreground">Upload within 48 hours to avoid late submission flag.</p>
            </div>
            <Link href="/employee/requests">
              <Button size="sm" variant="outline" className="text-xs h-8">Upload Now</Button>
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Approved"
            value={formatINR(totalSpent)}
            icon={<DollarSign className="w-6 h-6" />}
            color="primary"
          />
          <StatCard
            label="Pending Review"
            value={pendingCount}
            icon={<Clock className="w-6 h-6" />}
            color="warning"
          />
          <StatCard
            label="Approved"
            value={approvedCount}
            icon={<CheckCircle className="w-6 h-6" />}
            color="success"
          />
          <StatCard
            label="Total Requests"
            value={requests.length}
            icon={<FileText className="w-6 h-6" />}
            color="secondary"
          />
        </div>

        {/* Recent Requests & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Requests</h2>
              <Link href="/employee/requests">
                <Button variant="ghost" size="sm" className="text-xs text-primary">View All →</Button>
              </Link>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">No requests yet.</p>
                <Link href="/employee/request">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">Submit First Request</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{req.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatINR(parseFloat(req.amount))} · {formatDateIndia(req.createdAt)}
                        {!req.billPath && req.status !== 'rejected' && (
                          <span className="ml-2 text-warning">· No receipt</span>
                        )}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/employee/request" className="group relative block p-5 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 hover:to-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">Submit Request</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">File a new expense claim. Receipt optional at submission.</p>
                  </div>
                </div>
              </Link>

              <Link href="/employee/requests" className="group relative block p-5 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 hover:to-warning/5 hover:border-warning/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-warning/10 text-warning group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-warning transition-colors">My Requests</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Track status and upload receipts for pending requests.</p>
                  </div>
                </div>
              </Link>

              <Link href="/employee/expenses" className="group relative block p-5 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 hover:to-success/5 hover:border-success/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-success/10 text-success group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-success transition-colors">My Expenses</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">View approved expenses and submit as reimbursement requests.</p>
                  </div>
                </div>
              </Link>

              <Link href="/employee/ledger" className="group relative block p-5 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 hover:to-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">View Ledger</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Check your personal balance sheet and payment history.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const EmployeeDashboardNew = EmployeeDashboardNewBase;
