'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { Download, Filter, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { formatINR, formatDateIndia } from '@/lib/india-locale';
import { ApprovalModal } from '@/components/approval-modal';
import { exportToCSV } from '@/lib/utils';

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
  uploadedAt: string | null;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'pending_manager', label: 'Pending Manager' },
  { value: 'manager_approved', label: 'Manager Approved' },
  { value: 'pending_admin', label: 'Pending Admin' },
  { value: 'admin_approved', label: 'Admin Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'paid', label: 'Paid' },
];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
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
        body: JSON.stringify({ status: 'admin_approved', remarks: notes }),
      });
      setSuccessMsg(`Approved: "${selectedRequest.title}"`);
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
      setSuccessMsg(`Rejected: "${selectedRequest.title}"`);
      fetchRequests();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  const handleMarkPaid = async (req: Request) => {
    try {
      await fetch(`/api/requests/${req.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });
      setSuccessMsg(`Marked as paid: "${req.title}"`);
      fetchRequests();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Mark paid failed:', err);
    }
  };

  const handleExport = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Employee', key: 'employeeName' },
      { label: 'Title', key: 'title' },
      { label: 'Amount', key: 'amount' },
      { label: 'Date', key: 'createdAt' },
      { label: 'Status', key: 'status' },
    ];
    exportToCSV(filteredRequests, headers, 'All_Expense_Requests');
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      (r.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(
    (r) => r.status === 'submitted' || r.status === 'manager_approved' || r.status === 'pending_admin'
  ).length;

  const isApprovable = (status: string) =>
    status === 'submitted' || status === 'manager_approved' || status === 'pending_manager' || status === 'pending_admin';

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="All Expense Requests"
        description={`Manage all expense requests across the organization (${pendingCount} pending action)`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
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

        {/* Filter Bar */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 items-center p-4 bg-card rounded-lg border border-border">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground font-semibold block mb-1">Search</label>
              <Input
                placeholder="Search by employee or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold block mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:border-primary"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Requests', value: requests.length, color: 'text-foreground' },
            { label: 'Pending Action', value: pendingCount, color: 'text-warning' },
            { label: 'Approved', value: requests.filter(r => r.status === 'admin_approved' || r.status === 'paid').length, color: 'text-success' },
            { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, color: 'text-destructive' },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Requests Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />
              Loading requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No requests found matching your filters.</p>
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
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground min-w-[200px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => {
                    const canApprove = isApprovable(req.status);
                    const canMarkPaid = req.status === 'admin_approved';
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
                        <td className="py-3 px-4 font-bold text-foreground text-base">{formatINR(parseFloat(req.amount))}</td>
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
                            {canApprove && (
                              <>
                                <button
                                  className="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
                                  style={{ backgroundColor: '#16a34a' }}
                                  onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </button>
                                <button
                                  className="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-semibold transition-all hover:opacity-90 active:scale-95 shadow-sm"
                                  style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                                  onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                >
                                  <XCircle className="w-3 h-3" />
                                  Reject
                                </button>
                              </>
                            )}
                            {canMarkPaid && (
                              <button
                                className="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
                                style={{ backgroundColor: '#2563eb' }}
                                onClick={() => handleMarkPaid(req)}
                              >
                                Mark Paid
                              </button>
                            )}
                            {!canApprove && !canMarkPaid && (
                              <span className="text-xs text-muted-foreground italic capitalize">
                                {req.status.replace(/_/g, ' ')}
                              </span>
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
