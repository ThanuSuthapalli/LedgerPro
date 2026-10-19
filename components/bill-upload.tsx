'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  validateFile,
  formatFileSize,
  calculateRemainingTime,
  isWithinSubmissionWindow,
  BILL_SUBMISSION_DEADLINE_HOURS,
} from '@/lib/file-validator';

interface BillUploadProps {
  paymentDate: Date;
  onFileSelected: (file: File) => void;
  onFileRemoved: () => void;
  uploadedFile?: File | null;
  disabled?: boolean;
}

export function BillUpload({
  paymentDate,
  onFileSelected,
  onFileRemoved,
  uploadedFile,
  disabled,
}: BillUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<{
    hoursRemaining: number;
    minutesRemaining: number;
    isExpired: boolean;
    deadlineDate: Date;
  }>({
    hoursRemaining: 0,
    minutesRemaining: 0,
    isExpired: false,
    deadlineDate: new Date(),
  });

  // Calculate and update remaining time
  useEffect(() => {
    const updateTime = () => {
      const remaining = calculateRemainingTime(paymentDate);
      setTimeRemaining(remaining);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [paymentDate]);

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      return;
    }

    // Check if within submission window
    if (!isWithinSubmissionWindow(paymentDate)) {
      setError(`⏰ The 48-hour submission deadline has passed. Deadline was: ${timeRemaining.deadlineDate.toLocaleString()}`);
      return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError('');
    onFileSelected(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !timeRemaining.isExpired) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || timeRemaining.isExpired) {
      return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Deadline Warning */}
      <div
        className={`p-4 rounded-lg border flex items-start gap-3 ${
          timeRemaining.isExpired
            ? 'bg-accent/10 border-accent text-accent'
            : timeRemaining.hoursRemaining < 2
              ? 'bg-warning/10 border-warning text-warning'
              : 'bg-success/10 border-success text-success'
        }`}
      >
        <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          {timeRemaining.isExpired ? (
            <p>
              <span className="font-semibold">Submission Deadline Expired</span>
              <br />
              The 48-hour deadline for bill submission has passed. Contact your manager for options.
            </p>
          ) : (
            <p>
              <span className="font-semibold">Time Remaining:</span>{' '}
              <span className="font-mono">
                {timeRemaining.hoursRemaining}h {timeRemaining.minutesRemaining}m
              </span>
              <br />
              <span className="text-xs opacity-75">
                Deadline: {timeRemaining.deadlineDate.toLocaleString()}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* File Upload Area */}
      {!uploadedFile ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : disabled || timeRemaining.isExpired
                ? 'border-muted bg-muted/30 opacity-60'
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            disabled={disabled || timeRemaining.isExpired}
          />

          <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-foreground font-medium mb-1">
            {isDragging ? 'Drop your bill here' : 'Choose a file or drag it here'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Accepted formats: PDF, JPG, PNG (Max 5MB)
          </p>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || timeRemaining.isExpired}
            variant="outline"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        </div>
      ) : (
        /* Uploaded File Display */
        <div className="bg-success/10 border border-success rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(uploadedFile.size)} • Uploaded
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onFileRemoved();
              setError('');
            }}
            className="p-1 hover:bg-success/20 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5 text-success" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-accent/10 border border-accent rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-accent">{error}</p>
        </div>
      )}

      {/* File Requirements */}
      <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">Requirements:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>File must be uploaded within {BILL_SUBMISSION_DEADLINE_HOURS} working hours of payment (Sundays are excluded)</li>
          <li>Accepted formats: PDF, JPG, PNG only</li>
          <li>Maximum file size: 5MB</li>
          <li>File must clearly show the bill amount and payment details</li>
        </ul>
      </div>
    </div>
  );
}
