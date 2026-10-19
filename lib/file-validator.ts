export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

// File validation constants
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const BILL_SUBMISSION_DEADLINE_HOURS = 48;

export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Accepted formats: PDF, JPG, PNG`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Invalid file extension. Accepted: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
    };
  }

  return {
    isValid: true,
    file,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getWorkingDeadline(paymentDate: Date): Date {
  const deadline = new Date(paymentDate.getTime());
  let minutesAdded = 0;
  const targetMinutes = BILL_SUBMISSION_DEADLINE_HOURS * 60; // 48 * 60 = 2880 minutes

  while (minutesAdded < targetMinutes) {
    deadline.setTime(deadline.getTime() + 60 * 1000); // add 1 minute
    if (deadline.getDay() !== 0) { // 0 is Sunday
      minutesAdded++;
    }
  }
  return deadline;
}

export function calculateRemainingTime(paymentDate: Date): {
  hoursRemaining: number;
  minutesRemaining: number;
  isExpired: boolean;
  deadlineDate: Date;
} {
  const now = new Date();
  const deadlineDate = getWorkingDeadline(paymentDate);
  const diffMs = deadlineDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      hoursRemaining: 0,
      minutesRemaining: 0,
      isExpired: true,
      deadlineDate,
    };
  }

  // Count working minutes between now and deadlineDate
  let workingMinutes = 0;
  const temp = new Date(now.getTime());
  while (temp < deadlineDate) {
    if (temp.getDay() !== 0) { // 0 is Sunday
      workingMinutes++;
    }
    temp.setTime(temp.getTime() + 60 * 1000); // add 1 minute
  }

  const hoursRemaining = Math.floor(workingMinutes / 60);
  const minutesRemaining = workingMinutes % 60;

  return {
    hoursRemaining,
    minutesRemaining,
    isExpired: false,
    deadlineDate,
  };
}

export function isWithinSubmissionWindow(paymentDate: Date): boolean {
  const { isExpired } = calculateRemainingTime(paymentDate);
  return !isExpired;
}
