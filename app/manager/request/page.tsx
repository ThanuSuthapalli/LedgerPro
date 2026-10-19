'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle, AlertCircle, Upload,
  FileText, Tag, DollarSign, Calendar, Store, Code, MessageSquare, Send
} from 'lucide-react';
import { getSession } from '@/lib/mock-auth';

export default function ManagerRequestPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    amount: '',
    date: '',
    vendor: '',
    projectCode: '',
    remarks: '',
  });
  const [otherCategory, setOtherCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.category === 'other' && !otherCategory.trim()) {
      setError('Please describe the "Other" category');
      setIsLoading(false);
      return;
    }

    try {
      const session = getSession();
      const userId = session?.user?.id || 'mgr-001';

      const categoryMap: Record<string, string> = {
        travel: 'cat-001',
        meals: 'cat-002',
        accommodation: 'cat-003',
        equipment: 'cat-004',
        other: 'cat-005',
        office: 'cat-004',
        training: 'cat-005',
      };

      const categoryId = categoryMap[formData.category] || 'cat-005';

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: userId,
          title: formData.title,
          description: formData.description,
          categoryId,
          amount: parseFloat(formData.amount),
          vendor: formData.vendor,
          projectCode: formData.projectCode,
          remarks: formData.remarks,
          paymentDate: formData.date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit request');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full">
          <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Request Submitted!</h2>
              <p className="text-violet-100 text-sm">Your expense will go to Admin for approval</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Upload className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Upload Receipt Within 48 Hours</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Go to Team Requests to upload your receipt before the deadline.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/manager/requests">
                  <button className="w-full h-11 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                    View Team Requests
                  </button>
                </Link>
                <Link href="/manager/dashboard">
                  <button className="w-full h-11 rounded-xl border border-border text-sm font-medium text-foreground bg-transparent hover:bg-muted transition-all">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inputBase = (field: string) =>
    `w-full px-4 py-3 pl-11 border rounded-xl bg-background text-foreground text-sm outline-none transition-all duration-200 ${
      focusedField === field
        ? 'border-violet-500 ring-2 ring-violet-500/15 shadow-sm'
        : 'border-border hover:border-violet-400/50'
    }`;

  const iconClass = 'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none';

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Submit My Expense Request"
        description="Submit your own expense request for reimbursement. Your request goes directly to admin for approval."
        actions={
          <Link href="/manager/requests">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team Requests
            </Button>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 max-w-2xl">
        {/* Info banner */}
        <div className="mb-6 flex items-start gap-3 p-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl">
          <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">Manager Expense Request</p>
            <p className="text-xs text-violet-700 dark:text-violet-400 mt-0.5">
              Your request will go to the <strong>Admin</strong> for approval. Upload your receipt within 48 hours of submission.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Card Header with gradient */}
          <div className="relative bg-gradient-to-r from-violet-500/15 via-violet-500/8 to-transparent px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/15 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">New Expense Request</h2>
                <p className="text-xs text-muted-foreground">Fill in the details. Your request goes directly to admin for approval.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* Request Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Request Title <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <FileText className={iconClass} />
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., Team Offsite Travel"
                  required
                  className={inputBase('title')}
                />
              </div>
            </div>

            {/* Category & Amount row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="category" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Category <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Tag className={iconClass} />
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('category')}
                    onBlur={() => setFocusedField(null)}
                    className={inputBase('category') + ' appearance-none cursor-pointer'}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="travel">✈️ Travel</option>
                    <option value="meals">🍽️ Meals &amp; Entertainment</option>
                    <option value="accommodation">🏨 Accommodation</option>
                    <option value="office">📦 Office Supplies</option>
                    <option value="equipment">💻 Equipment</option>
                    <option value="training">📚 Training &amp; Development</option>
                    <option value="other">📋 Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="amount" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Amount (₹) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <DollarSign className={iconClass} />
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('amount')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0.00"
                    required
                    className={inputBase('amount')}
                  />
                </div>
              </div>
            </div>

            {/* Other category */}
            {formData.category === 'other' && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 rounded-xl space-y-2">
                <label htmlFor="otherCategory" className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Describe Category <span className="text-destructive">*</span>
                </label>
                <input
                  id="otherCategory"
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  placeholder="e.g., Client gifts"
                  required={formData.category === 'other'}
                  className="w-full px-4 py-2.5 border border-amber-300 dark:border-amber-700 rounded-lg bg-background text-foreground text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-900 transition-all"
                />
              </div>
            )}

            {/* Vendor & Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="vendor" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Vendor / Supplier
                </label>
                <div className="relative">
                  <Store className={iconClass} />
                  <input
                    id="vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('vendor')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Vendor name"
                    className={inputBase('vendor')}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="date" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Expense Date
                </label>
                <div className="relative">
                  <Calendar className={iconClass} />
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('date')}
                    onBlur={() => setFocusedField(null)}
                    className={inputBase('date')}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Description <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Describe the expense purpose..."
                  rows={4}
                  required
                  className={`w-full px-4 py-3 pl-11 border rounded-xl bg-background text-foreground text-sm outline-none resize-none transition-all duration-200 ${
                    focusedField === 'description'
                      ? 'border-violet-500 ring-2 ring-violet-500/15 shadow-sm'
                      : 'border-border hover:border-violet-400/50'
                  }`}
                />
              </div>
            </div>

            {/* Project Code & Remarks row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="projectCode" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Project Code <span className="text-muted-foreground font-normal normal-case">(Optional)</span>
                </label>
                <div className="relative">
                  <Code className={iconClass} />
                  <input
                    id="projectCode"
                    name="projectCode"
                    value={formData.projectCode}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('projectCode')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g., PROJ-001"
                    className={inputBase('projectCode')}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="remarks" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Remarks <span className="text-muted-foreground font-normal normal-case">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className={iconClass} />
                  <input
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('remarks')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Any additional remarks"
                    className={inputBase('remarks')}
                  />
                </div>
              </div>
            </div>

            {/* Receipt Notice */}
            <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl border border-border/60">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Receipt Upload — After Submission</p>
                <p className="text-xs text-muted-foreground mt-0.5">Go to Team Requests after submitting to upload your receipt within 48 hours.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/60">
              <Link href="/manager/requests" className="flex-1">
                <button
                  type="button"
                  className="w-full h-11 rounded-xl border border-border text-sm font-medium text-foreground bg-transparent hover:bg-muted transition-all"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
