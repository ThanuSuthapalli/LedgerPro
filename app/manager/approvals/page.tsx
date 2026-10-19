'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { Download, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
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
  employeeName: string | null;
  employeeEmail: string | null;
  billPath: string | null;
}

export default function ManagerApprovalsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleExport = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Employee', key: 'employeeName' },
      { label: 'Title', key: 'title' },
      { label: 'Amount', key: 'amount' },
      { label: 'Date', key: 'createdAt' },
      { label: 'Status', key: 'status' },
    ];
    exportToCSV(requests, headers, 'Manager_Approvals');
  };

  const pendingRequests = requests.filter(
    (r) => r.status === 'submitted' || r.status === 'pending_manager'
  );
  const filteredPending = pendingRequests.filter(
    (r) =>
      (r.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Approvals"
        description={`Review and approve expense requests (${pendingRequests.length} pending)`}
        actions={
          <div className="flex gap-2">
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

        {/* Pending Summary */}
        {pendingRequests.length > 0 && (
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <p className="text-sm font-semibold text-foreground">
              {pendingRequests.length} request{pendingRequests.length > 1 ? 's' : ''} awaiting your approval
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Review each request and approve or reject with a reason.
            </p>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by employee or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-card"
          />
        </div>

        {/* Pending Approvals Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h2 className="text-sm font-semibold text-foreground">Pending Approvals ({filteredPending.length})</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />
              Loading...
            </div>
          ) : filteredPending.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-10 h-10 text-success mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No pending approvals. All caught up!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/20 border-b border-border">
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
                  {filteredPending.map((req) => (
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
                        <div className="flex gap-2">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Requests history */}
        {requests.filter((r) => r.status !== 'submitted' && r.status !== 'pending_manager').length > 0 && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <h2 className="text-sm font-semibold text-foreground">
                Processed Requests ({requests.filter((r) => r.status !== 'submitted' && r.status !== 'pending_manager').length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/20 border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Employee</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests
                    .filter((r) => r.status !== 'submitted' && r.status !== 'pending_manager')
                    .map((req) => (
                      <tr key={req.id} className="border-b border-border hover:bg-muted/20 transition-colors opacity-75">
                        <td className="py-2 px-4 text-foreground">{req.employeeName || 'Unknown'}</td>
                        <td className="py-2 px-4 text-foreground max-w-[200px] truncate">{req.title}</td>
                        <td className="py-2 px-4 text-foreground">{formatINR(parseFloat(req.amount))}</td>
                        <td className="py-2 px-4"><StatusBadge status={req.status} /></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
