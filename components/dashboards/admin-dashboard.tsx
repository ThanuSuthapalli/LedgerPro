'use client'

import { useAuthContext } from '@/components/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  AlertCircle,
  BarChart3,
  TrendingUp,
  LogOut,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/mock-auth'

export function AdminDashboardContent({ user }: { user: User }) {
  const { logout } = useAuthContext()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LedgerPro Claims Cockpit</h1>
              <p className="text-gray-600 mt-1">Administrator Dashboard - Full System Control</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Badge */}
        <div className="mb-8">
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Administrator
          </span>
        </div>

        {/* Metrics Grid - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <Users className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Submitted Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <FileText className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Grid - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <XCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Paid Reimbursements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reimbursement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">₹0.00</p>
                <IndianRupee className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Late Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Grid - Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">₹0.00</p>
                <BarChart3 className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">₹0.00</p>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-green-600">Active</p>
                <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="border-2 border-dashed hover:border-green-400 hover:bg-green-50 transition cursor-pointer h-full"
            onClick={() => router.push('/admin/employees')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Employee Management
              </CardTitle>
              <CardDescription>Manage team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={(e) => e.stopPropagation()}>
                View Employees
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-2 border-dashed hover:border-green-400 hover:bg-green-50 transition cursor-pointer h-full"
            onClick={() => router.push('/admin/ledger')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee size={20} />
                Payment Processing
              </CardTitle>
              <CardDescription>Process reimbursements</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={(e) => e.stopPropagation()}>
                View Ledger
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-2 border-dashed hover:border-green-400 hover:bg-green-50 transition cursor-pointer h-full"
            onClick={() => router.push('/admin/reports')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Analytics & Reports
              </CardTitle>
              <CardDescription>View system reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={(e) => e.stopPropagation()}>
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Overview Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                Approval Queue
              </CardTitle>
              <CardDescription>Pending system approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">No pending approvals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee size={20} />
                Payment Queue
              </CardTitle>
              <CardDescription>Ready for payment processing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">No pending payments</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
