'use client'

import { useAuthContext } from '@/components/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  IndianRupee,
  Users,
  LogOut,
  Eye,
  CheckIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/mock-auth'

export function ManagerDashboardContent({ user }: { user: User }) {
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
              <p className="text-gray-600 mt-1">Manager Dashboard - Review & Approve</p>
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
          <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            Team Manager
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-gray-600">Approved Amount</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-600">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">₹0.00</p>
                <AlertCircle className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <Users className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card 
            className="border-2 border-dashed hover:border-orange-400 hover:bg-orange-50 transition cursor-pointer h-full"
            onClick={() => router.push('/manager/requests')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckIcon size={20} />
                Pending Approvals
              </CardTitle>
              <CardDescription>Review team requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={(e) => e.stopPropagation()}>
                View Requests
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-2 border-dashed hover:border-orange-400 hover:bg-orange-50 transition cursor-pointer h-full"
            onClick={() => router.push('/manager/team-analytics')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} />
                Team Performance
              </CardTitle>
              <CardDescription>See submission analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={(e) => e.stopPropagation()}>
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Request Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                Pending Requests
              </CardTitle>
              <CardDescription>Waiting for your review</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">No pending requests to review</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                Late Submissions
              </CardTitle>
              <CardDescription>Past 48-hour window</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">No late submissions from team</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
