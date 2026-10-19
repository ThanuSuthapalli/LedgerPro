'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, FileText, PieChart, TrendingUp, Clock } from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

const reports = [
  {
    title: 'Expense Summary Report',
    description: 'Total expenses by category, department, and status',
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    formats: ['PDF', 'Excel', 'CSV'],
  },
  {
    title: 'Employee Reimbursement Report',
    description: 'Individual employee expense history and reimbursement status',
    icon: <FileText className="w-8 h-8 text-success" />,
    formats: ['PDF', 'Excel', 'CSV'],
  },
  {
    title: 'Department Analysis',
    description: 'Expenses by department with breakdown and trends',
    icon: <PieChart className="w-8 h-8 text-secondary" />,
    formats: ['PDF', 'Excel', 'CSV'],
  },
  {
    title: 'Approval Timeline Report',
    description: 'Average approval times and bottleneck analysis',
    icon: <Clock className="w-8 h-8 text-warning" />,
    formats: ['PDF', 'Excel', 'CSV'],
  },
  {
    title: 'Trend Analysis',
    description: 'Month-over-month expense trends and forecasting',
    icon: <TrendingUp className="w-8 h-8 text-accent" />,
    formats: ['PDF', 'Excel', 'CSV'],
  },
  {
    title: 'Budget vs Actual',
    description: 'Budget allocation and actual spending comparison',
    icon: <BarChart3 className="w-8 h-8 text-info" />,
    formats: ['PDF', 'Excel', 'CSV'],
  },
];

export default function AdminReportsPage() {
  const [selectedDateFrom, setSelectedDateFrom] = React.useState('');
  const [selectedDateTo, setSelectedDateTo] = React.useState('');

  const handlePrint = (reportTitle: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            h1 { color: #1e3a8a; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          <p><strong>Date range:</strong> ${selectedDateFrom || 'All Time'} to ${selectedDateTo || 'All Time'}</p>
          <p>Generated on: ${new Date().toLocaleDateString('en-IN')}</p>
          <p>This is a mock admin report summary generated for LedgerPro.</p>
          <table>
            <thead>
              <tr><th>Metric</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Total Requests analyzed</td><td>248</td></tr>
              <tr><td>Total Expenses Value</td><td>₹2,34,560.00</td></tr>
              <tr><td>Reimbursed to date</td><td>₹1,98,200.00</td></tr>
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

  const handleExport = (reportTitle: string) => {
    const headers = [
      { label: 'Category Metric', key: 'metric' },
      { label: 'Calculated Value', key: 'value' },
      { label: 'Period Covered', key: 'period' }
    ];
    const data = [
      { metric: 'Report Classification', value: reportTitle, period: `${selectedDateFrom || 'All'} to ${selectedDateTo || 'All'}` },
      { metric: 'Total Tracked Cost', value: '₹2,34,560.00', period: `${selectedDateFrom || 'All'} to ${selectedDateTo || 'All'}` },
      { metric: 'Volume of Claims', value: '248 Claims', period: `${selectedDateFrom || 'All'} to ${selectedDateTo || 'All'}` }
    ];
    exportToCSV(data, headers, reportTitle.replace(/\s+/g, '_') + '_Report');
  };

  const handleAction = (reportTitle: string, format: string) => {
    if (format === 'PDF') {
      handlePrint(reportTitle);
    } else {
      handleExport(reportTitle);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Reports & Analytics"
        description="Generate and export comprehensive expense reports on various metrics"
      />

      <div className="p-6 space-y-6">
        {/* Global Filters */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Global Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">From Date</label>
              <input
                type="date"
                value={selectedDateFrom}
                onChange={(e) => setSelectedDateFrom(e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-sm bg-card text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">To Date</label>
              <input
                type="date"
                value={selectedDateTo}
                onChange={(e) => setSelectedDateTo(e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-sm bg-card text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Department</label>
              <select className="w-full border border-border rounded px-3 py-2 text-sm bg-card text-foreground">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Operations</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{report.description}</p>
                </div>
                <div className="ml-3 p-2 bg-muted rounded-lg flex-shrink-0">{report.icon}</div>
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {report.formats.map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center gap-1 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleAction(report.title, format)}
                      >
                        <Download className="w-3 h-3" />
                        {format}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handlePrint(report.title)}
                  className="w-full bg-primary hover:bg-primary/90 text-sm font-medium transition-all"
                >
                  Generate & Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
