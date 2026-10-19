import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCSV(data: any[], headers: { label: string; key: string }[], filename: string) {
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(','));
  
  // Add rows
  for (const item of data) {
    const rowValues = headers.map(h => {
      const val = item[h.key];
      const valStr = val === null || val === undefined ? '' : String(val);
      return `"${valStr.replace(/"/g, '""')}"`;
    });
    csvRows.push(rowValues.join(','));
  }
  
  const csvString = csvRows.join('\r\n');
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvString], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
