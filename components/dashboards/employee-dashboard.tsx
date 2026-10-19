'use client'

import { useAuthContext } from '@/components/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  BarChart3,
  LogOut,
  Plus,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/mock-auth'

export function EmployeeDashboardContent({ user }: { user: User }) {
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
              <p className="text-gray-600 mt-1">Employee Dashboard</p>
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
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Reimbursements Active
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reimbursed</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Pending</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-600">48-Hour Deadline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card 
            className="border-2 border-dashed hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
            onClick={() => router.push('/employee/raise-request')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Submit Expense
              </CardTitle>
              <CardDescription>Create a new expense request</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={(e) => e.stopPropagation()}>
                Raise New Request
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-2 border-dashed hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
            onClick={() => router.push('/employee/bill-history')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} />
                View History
              </CardTitle>
              <CardDescription>See your submission history</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={(e) => e.stopPropagation()}>
                View All Bills
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Recent Submissions
              </CardTitle>
              <CardDescription>Your latest expense requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">No submissions yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Approval Timeline
              </CardTitle>
              <CardDescription>Track approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">All requests up to date</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
