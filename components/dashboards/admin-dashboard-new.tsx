'use client';

import React, { useState, useEffect } from 'react';
import { StatCard } from '@/components/stat-card';
import { PageHeader } from '@/components/page-header';
import { Users, DollarSign, FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatINR } from '@/lib/india-locale';
import { StatusBadge } from '@/components/ui/status-badge';
import { ApprovalModal } from '@/components/approval-modal';
import { getSession } from '@/lib/mock-auth';

interface Request {
  id: string;
  title: string;
  amount: string;
  status: string;
  employeeName: string | null;
  createdAt: string;
}

function AdminDashboardNewBase() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const session = getSession();
  const adminName = session?.user?.name || 'Administrator';

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (notes: string) => {
    if (!selectedRequest) return;
    await fetch(`/api/requests/${selectedRequest.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'admin_approved', remarks: notes }),
    });
    setSuccessMsg(`Approved: "${selectedRequest.title}"`);
    fetchRequests();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleReject = async (reason: string) => {
    if (!selectedRequest) return;
    await fetch(`/api/requests/${selectedRequest.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', remarks: reason }),
    });
    setSuccessMsg(`Rejected: "${selectedRequest.title}"`);
    fetchRequests();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const pendingRequests = requests.filter(
    (r) => r.status === 'submitted' || r.status === 'manager_approved' || r.status === 'pending_admin'
  );
  const approvedCount = requests.filter(
    (r) => r.status === 'admin_approved' || r.status === 'paid'
  ).length;
  const totalExpenses = requests
    .filter((r) => r.status === 'admin_approved' || r.status === 'paid')
    .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title={`Welcome back, ${adminName}`}
        description="You have full control over the expense management system. Manage employees, approve requests, and generate reports."
        actions={
          <Link href="/admin/requests">
            <Button className="bg-primary hover:bg-primary/90">
              <AlertCircle className="w-4 h-4 mr-2" />
              Pending Requests ({pendingRequests.length})
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {successMsg && (
          <div className="p-3 bg-success/10 border border-success text-success rounded-lg text-sm">
            ✓ {successMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Expenses"
            value={formatINR(totalExpenses)}
            icon={<DollarSign className="w-6 h-6" />}
            color="primary"
          />
          <StatCard
            label="Pending Requests"
            value={pendingRequests.length}
            icon={<FileText className="w-6 h-6" />}
            color="warning"
          />
          <StatCard
            label="Approved Expenses"
            value={approvedCount}
            icon={<CheckCircle className="w-6 h-6" />}
            color="success"
          />
          <StatCard
            label="Total Requests"
            value={requests.length}
            icon={<TrendingUp className="w-6 h-6" />}
            color="secondary"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/admin/requests">
              <Button variant="outline" className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                Review Pending Requests
              </Button>
            </Link>
            <Link href="/admin/employees">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Manage Employees
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Requests + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests Preview */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Pending Action</h2>
              <Link href="/admin/requests">
                <Button variant="ghost" size="sm" className="text-xs text-primary">View All →</Button>
              </Link>
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No pending requests. All caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 5).map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{req.employeeName || 'Employee'}</p>
                      <p className="text-xs text-muted-foreground truncate">{req.title} — {formatINR(parseFloat(req.amount))}</p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-success hover:bg-success/90 text-white"
                        onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-destructive hover:bg-destructive/90 text-white"
                        onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingRequests.length > 5 && (
                  <Link href="/admin/requests">
                    <p className="text-xs text-center text-primary cursor-pointer hover:underline">
                      +{pendingRequests.length - 5} more pending
                    </p>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* System Stats */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">System Overview</h2>
            <div className="space-y-4">
              {[
                { label: 'Total Requests', value: requests.length.toString(), color: 'text-foreground' },
                { label: 'Pending Review', value: pendingRequests.length.toString(), color: 'text-warning' },
                { label: 'Approved This Period', value: approvedCount.toString(), color: 'text-success' },
                { label: 'Total Approved Spend', value: formatINR(totalExpenses), color: 'text-primary' },
                { label: 'Rejected Requests', value: requests.filter(r => r.status === 'rejected').length.toString(), color: 'text-destructive' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedRequest && (
        <ApprovalModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedRequest(null); }}
          title={`${selectedRequest.employeeName} — ${selectedRequest.title}`}
          amount={parseFloat(selectedRequest.amount)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export const AdminDashboardNew = React.memo(AdminDashboardNewBase);
