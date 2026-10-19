'use client';

import React, { useState, useEffect } from 'react';
import { StatCard } from '@/components/stat-card';
import { PageHeader } from '@/components/page-header';
import { Users, DollarSign, FileText, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatINR } from '@/lib/india-locale';
import { ApprovalModal } from '@/components/approval-modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { getSession } from '@/lib/mock-auth';

interface Request {
  id: string;
  title: string;
  amount: string;
  status: string;
  employeeName: string | null;
  createdAt: string;
}

function ManagerDashboardNewBase() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const session = getSession();
  const managerName = session?.user?.name || 'Manager';

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
      body: JSON.stringify({ status: 'manager_approved', remarks: notes }),
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
    (r) => r.status === 'submitted' || r.status === 'pending_manager'
  );
  const approvedCount = requests.filter((r) => r.status === 'manager_approved').length;
  const totalSpend = requests
    .filter((r) => r.status === 'manager_approved' || r.status === 'admin_approved' || r.status === 'paid')
    .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title={`Welcome, ${managerName}`}
        description={`You have ${pendingRequests.length} pending requests from your team. Review and approve expense claims to keep your department moving forward.`}
        actions={
          <div className="flex gap-2">
            <Link href="/manager/request">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Plus className="w-4 h-4 mr-2" />
                My Expense
              </Button>
            </Link>
            <Link href="/manager/approvals">
              <Button className="bg-primary hover:bg-primary/90">
                <AlertCircle className="w-4 h-4 mr-2" />
                Review Pending ({pendingRequests.length})
              </Button>
            </Link>
          </div>
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
            label="Total Requests"
            value={requests.length}
            icon={<FileText className="w-6 h-6" />}
            color="primary"
          />
          <StatCard
            label="Pending Approvals"
            value={pendingRequests.length}
            icon={<AlertCircle className="w-6 h-6" />}
            color="warning"
          />
          <StatCard
            label="Manager Approved"
            value={approvedCount}
            icon={<CheckCircle className="w-6 h-6" />}
            color="success"
          />
          <StatCard
            label="Total Team Spend"
            value={formatINR(totalSpend)}
            icon={<DollarSign className="w-6 h-6" />}
            color="secondary"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/manager/approvals">
              <Button variant="outline" className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                Review Requests
              </Button>
            </Link>
            <Link href="/manager/requests">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                All Team Requests
              </Button>
            </Link>
            <Link href="/manager/request">
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Submit My Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Pending Approvals Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Pending Approvals</h2>
              <Link href="/manager/approvals">
                <Button variant="ghost" size="sm" className="text-xs text-primary">View All →</Button>
              </Link>
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">All caught up! No pending approvals.</p>
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
                  <Link href="/manager/approvals">
                    <p className="text-xs text-center text-primary cursor-pointer hover:underline">
                      +{pendingRequests.length - 5} more pending
                    </p>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Recent Requests */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <Link href="/manager/requests">
                <Button variant="ghost" size="sm" className="text-xs text-primary">View All →</Button>
              </Link>
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
            ) : requests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No requests yet.</p>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 5).map((req) => (
                  <div key={req.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{req.title}</p>
                      <p className="text-xs text-muted-foreground">{req.employeeName || 'Employee'}</p>
                    </div>
                    <div className="ml-3 text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-foreground">{formatINR(parseFloat(req.amount))}</p>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
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

export const ManagerDashboardNew = React.memo(ManagerDashboardNewBase);
