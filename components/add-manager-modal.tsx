'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManager: (manager: ManagerFormData) => void;
}

export interface ManagerFormData {
  fullName: string;
  email: string;
  department: string;
  phone: string;
}

export function AddManagerModal({ isOpen, onClose, onAddManager }: AddManagerModalProps) {
  const [formData, setFormData] = useState<ManagerFormData>({
    fullName: '',
    email: '',
    department: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      onAddManager(formData);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        department: '',
        phone: '',
      });
      setErrors({});

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Add New Manager</h2>
              <p className="text-sm text-muted-foreground">Create a new manager account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              className={`w-full border rounded px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground transition-colors ${
                errors.fullName ? 'border-accent' : 'border-border'
              }`}
              disabled={isSubmitting}
            />
            {errors.fullName && <p className="text-xs text-accent mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
              className={`w-full border rounded px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground transition-colors ${
                errors.email ? 'border-accent' : 'border-border'
              }`}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-xs text-accent mt-1">{errors.email}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className={`w-full border rounded px-3 py-2 text-sm bg-card text-foreground transition-colors ${
                errors.department ? 'border-accent' : 'border-border'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.department && <p className="text-xs text-accent mt-1">{errors.department}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className={`w-full border rounded px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground transition-colors ${
                errors.phone ? 'border-accent' : 'border-border'
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-xs text-accent mt-1">{errors.phone}</p>}
          </div>

          {/* Password Info */}
          <div className="p-3 bg-muted rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Note:</span> A temporary password will be sent to the email address provided.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Creating...' : 'Create Manager'}
          </Button>
        </div>
      </div>
    </div>
  );
}
