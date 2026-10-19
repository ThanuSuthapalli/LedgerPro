'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { CheckCircle, XCircle, RefreshCw, Plus, Download } from 'lucide-react';
import { formatINR, formatDateIndia } from '@/lib/india-locale';
import { ApprovalModal } from '@/components/approval-modal';
import Link from 'next/link';

interface Request {
  id: string;
  title: string;
  description: string;
  amount: string;
  category: string;
  createdAt: string;
  status: string;
  employeeId: string;
  employeeName: string | null;
  employeeEmail: string | null;
  billPath: string | null;
}

export default function ManagerRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
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
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (notes: string) => {
    if (!selectedRequest) return;
    try {
      await fetch(`/api/requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'manager_approved', remarks: notes }),
      });
      setSuccessMsg(`Request approved: "${selectedRequest.title}"`);
      fetchRequests();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedRequest) return;
    try {
      await fetch(`/api/requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', remarks: reason }),
      });
      setSuccessMsg(`Request rejected: "${selectedRequest.title}"`);
      fetchRequests();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      (r.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === 'submitted' || r.status === 'pending_manager').length;

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'pending_manager', label: 'Pending Approval' },
    { value: 'manager_approved', label: 'Manager Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'paid', label: 'Paid' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Team Expense Requests"
        description={`Review and manage your team's expense requests (${pendingCount} pending approval)`}
        actions={
          <div className="flex gap-2">
            <Link href="/manager/request">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                My Expense Request
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-4">
        {successMsg && (
          <div className="p-3 bg-success/10 border border-success text-success rounded-lg text-sm">
            ✓ {successMsg}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center p-4 bg-card rounded-lg border border-border">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by employee name or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:border-primary"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />
              Loading team requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-2">No requests found.</p>
              <p className="text-xs text-muted-foreground">Requests submitted by your team members will appear here.</p>
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
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground min-w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => {
                    const isPending = req.status === 'submitted' || req.status === 'pending_manager';
                    return (
                      <tr key={req.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-foreground">{req.employeeName || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{req.employeeEmail}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-foreground max-w-[160px] truncate">{req.title}</p>
                          <p className="text-xs text-muted-foreground max-w-[160px] truncate">{req.description}</p>
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">{formatINR(parseFloat(req.amount))}</td>
                        <td className="py-3 px-4 text-muted-foreground">{formatDateIndia(req.createdAt)}</td>
                        <td className="py-3 px-4">
                          {req.billPath ? (
                            <span className="text-xs text-success font-medium">✓ Uploaded</span>
                          ) : (
                            <span className="text-xs text-warning font-medium">⚠ Missing</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 flex-wrap">
                            {isPending && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-8 bg-success hover:bg-success/90 text-white text-xs"
                                  onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-destructive border-destructive hover:bg-destructive/10 text-xs"
                                  onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {!isPending && (
                              <span className="text-xs text-muted-foreground italic capitalize">{req.status.replace(/_/g, ' ')}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
