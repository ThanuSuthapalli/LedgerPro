/**
 * Indian Locale Utilities
 * Provides formatting for currency (INR ₹) and date (DD/MM/YYYY)
 */

/**
 * Format amount as Indian Rupees (₹)
 * Example: 1234567.89 -> ₹12,34,567.89
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number as Indian currency (without symbol, just with commas)
 * Example: 1234567 -> 12,34,567
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format date as DD/MM/YYYY (Indian format)
 * Example: new Date('2024-06-20') -> '20/06/2024'
 */
export function formatDateIndia(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format date and time as DD/MM/YYYY HH:MM (Indian format)
 * Example: new Date('2024-06-20 14:30:00') -> '20/06/2024 14:30'
 */
export function formatDateTimeIndia(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Parse DD/MM/YYYY format to Date object
 * Example: '20/06/2024' -> Date object
 */
export function parseDateIndia(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get remaining hours until deadline (48 hours after payment)
 */
export function getRemainingHours(paymentDate: Date): number {
  const deadline = new Date(paymentDate);
  deadline.setHours(deadline.getHours() + 48);
  
  const now = new Date();
  const remainingMs = deadline.getTime() - now.getTime();
  const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
  
  return Math.max(0, remainingHours);
}

/**
 * Check if bill submission is still within 48-hour window
 */
export function isWithin48Hours(paymentDate: Date): boolean {
  return getRemainingHours(paymentDate) > 0;
}
