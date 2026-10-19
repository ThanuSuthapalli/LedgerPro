'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/components/auth-context'
import { getSession } from '@/lib/mock-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Calendar, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BillHistoryPage() {
  const router = useRouter()
  const { user, isLoading } = useAuthContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const session = getSession()
    const hasValidSession = session?.user?.role === 'employee'
    const contextHasValidSession = user?.role === 'employee'
    
    if (!hasValidSession && !contextHasValidSession && !isLoading) {
      router.push('/employee/login')
    }
  }, [user, isLoading, mounted, router])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const currentUser = user || getSession()?.user

  if (!currentUser || currentUser.role !== 'employee') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bill History</h1>
              <p className="text-gray-600 mt-1">View all your submitted expense requests</p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1">
                    <option value="">All Status</option>
                    <option>Draft</option>
                    <option>Submitted</option>
                    <option>Pending Manager Approval</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1">
                    <option value="">All Categories</option>
                    <option>Travel</option>
                    <option>Food & Beverages</option>
                    <option>Accommodation</option>
                    <option>Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">From Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">To Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1" />
                </div>
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
            </CardContent>
          </Card>

          {/* Bills Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Expense Requests
              </CardTitle>
              <CardDescription>All your submitted bills and their approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Calendar className="w-12 h-12 text-gray-300 mb-2" />
                          <p>No bills submitted yet. Start by raising a new expense request.</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
      </main>
    </div>
  )
}
