'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

const reports = [
  {
    title: 'Team Expense Report',
    description: 'Summary of all team member expenses',
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    formats: ['PDF', 'Excel'],
  },
  {
    title: 'Approval Performance',
    description: 'Your approval and rejection rates',
    icon: <FileText className="w-8 h-8 text-success" />,
    formats: ['PDF', 'Excel'],
  },
  {
    title: 'Budget Analysis',
    description: 'Team spending vs budget allocation',
    icon: <TrendingUp className="w-8 h-8 text-warning" />,
    formats: ['PDF', 'Excel'],
  },
];

export default function ManagerReportsPage() {
  const handlePrint = (reportTitle: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            h1 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          <p>This report contains a summary overview of active employee expense transactions and approvals.</p>
          <table>
            <thead>
              <tr><th>Metric</th><th>Details</th></tr>
            </thead>
            <tbody>
              <tr><td>Report Type</td><td>${reportTitle}</td></tr>
              <tr><td>Status</td><td>Active</td></tr>
              <tr><td>Total Expenses Summed</td><td>₹45,200.00</td></tr>
              <tr><td>Authorized Signatory</td><td>Team Manager</td></tr>
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportExcel = (reportTitle: string) => {
    const headers = [
      { label: 'Metric Name', key: 'metric' },
      { label: 'Value Detail', key: 'value' },
      { label: 'Generated Date', key: 'date' }
    ];
    const data = [
      { metric: 'Report Title', value: reportTitle, date: new Date().toLocaleDateString('en-IN') },
      { metric: 'Total Processed Amount', value: '₹45,200.00', date: new Date().toLocaleDateString('en-IN') },
      { metric: 'Active Staff Count', value: '15 Members', date: new Date().toLocaleDateString('en-IN') }
    ];
    exportToCSV(data, headers, reportTitle.replace(/\s+/g, '_') + '_Report');
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Reports" description="Generate reports for your team's expense data" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, idx) => (
            <div key={idx} className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                </div>
                <div className="ml-2">{report.icon}</div>
              </div>

              <div className="flex gap-2">
                {report.formats.map((format) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 text-xs"
                    onClick={() => format === 'PDF' ? handlePrint(report.title) : handleExportExcel(report.title)}
                  >
                    <Download className="w-3 h-3" />
                    {format}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
