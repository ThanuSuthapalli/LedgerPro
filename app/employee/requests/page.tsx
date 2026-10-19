'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import { Download, Upload, RefreshCw, Plus, Clock } from 'lucide-react';
import { formatINR, formatDateIndia } from '@/lib/india-locale';
import { getSession } from '@/lib/mock-auth';
import { exportToCSV } from '@/lib/utils';

interface Request {
  id: string;
  title: string;
  amount: string;
  category: string;
  createdAt: string;
  status: string;
  billPath: string | null;
  uploadedAt: string | null;
  description: string;
}

export default function EmployeeRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRequests = useCallback(async () => {
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
    fetchRequests();
  }, [fetchRequests]);

  const handleUploadReceipt = async (requestId: string) => {
    if (!uploadFile) {
      setUploadError('Please select a file first');
      return;
    }
    setUploadError('');

    try {
      // In a real app, upload to blob storage. Here we simulate with the filename.
      const filePath = `/receipts/${requestId}/${uploadFile.name}`;

      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billPath: filePath }),
      });

      if (!res.ok) throw new Error('Upload failed');

      setSuccessMsg(`Receipt uploaded successfully for request!`);
      setUploadingId(null);
      setUploadFile(null);
      fetchRequests();

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setUploadError('Failed to upload receipt. Please try again.');
    }
  };

  const handleExport = () => {
    const headers = [
      { label: 'Request ID', key: 'id' },
      { label: 'Title', key: 'title' },
      { label: 'Amount (INR)', key: 'amount' },
      { label: 'Category', key: 'category' },
      { label: 'Submitted Date', key: 'createdAt' },
      { label: 'Status', key: 'status' },
    ];
    const exportData = requests.map((r) => ({
      ...r,
      amount: `₹${r.amount}`,
      createdAt: formatDateIndia(r.createdAt),
    }));
    exportToCSV(exportData, headers, 'My_Expense_Requests');
  };

  const pendingUpload = requests.filter((r) => !r.billPath && r.status !== 'rejected');

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="My Requests"
        description="View all your expense requests and their status"
        actions={
          <div className="flex gap-2">
            <Link href="/employee/request">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
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
        {/* Receipt Upload Reminder */}
        {pendingUpload.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <Clock className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {pendingUpload.length} request{pendingUpload.length > 1 ? 's' : ''} awaiting receipt upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your receipts within 48 hours of submission to avoid late submission flags.
              </p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-success/10 border border-success text-success rounded-lg text-sm">
            ✓ {successMsg}
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No requests found. Submit your first expense request!</p>
              <Link href="/employee/request">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </Link>
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
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Receipt</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <React.Fragment key={req.id}>
                      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-foreground">{req.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{req.description}</p>
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground">{formatINR(parseFloat(req.amount))}</td>
                        <td className="py-3 px-4 text-muted-foreground">{formatDateIndia(req.createdAt)}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="py-3 px-4">
                          {req.billPath ? (
                            <span className="text-xs text-success font-medium flex items-center gap-1">
                              ✓ Uploaded
                              {req.uploadedAt && (
                                <span className="text-muted-foreground">
                                  ({formatDateIndia(req.uploadedAt)})
                                </span>
                              )}
                            </span>
                          ) : req.status === 'rejected' ? (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          ) : (
                            <span className="text-xs text-warning font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {!req.billPath && req.status !== 'rejected' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => setUploadingId(uploadingId === req.id ? null : req.id)}
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Upload Receipt
                            </Button>
                          )}
                        </td>
                      </tr>
                      {/* Inline upload row */}
                      {uploadingId === req.id && (
                        <tr className="border-b border-border bg-muted/20">
                          <td colSpan={6} className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                className="flex-1 text-sm"
                              />
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 h-9"
                                onClick={() => handleUploadReceipt(req.id)}
                                disabled={!uploadFile}
                              >
                                Confirm Upload
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9"
                                onClick={() => { setUploadingId(null); setUploadFile(null); setUploadError(''); }}
                              >
                                Cancel
                              </Button>
                            </div>
                            {uploadError && (
                              <p className="text-xs text-destructive mt-2">{uploadError}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">Accepted: PDF, JPG, PNG (Max 10MB)</p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
