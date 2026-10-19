'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/components/auth-context'
import { getSession } from '@/lib/mock-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Upload, CheckCircle } from 'lucide-react'

export default function RaiseRequestPage() {
  const router = useRouter()
  const { user, isLoading } = useAuthContext()
  const [mounted, setMounted] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      router.push('/employee/dashboard')
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</p>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Raise Expense Request</h1>
              <p className="text-gray-600 mt-1">Submit a new claim for reimbursement</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}

      <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>New Expense Request</CardTitle>
                  <CardDescription>Fill in all required fields to submit your claim</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input id="employeeId" placeholder="Auto-filled" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Employee Name</Label>
                        <Input id="name" placeholder="Auto-filled" disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" placeholder="Auto-filled" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input id="designation" placeholder="Auto-filled" disabled />
                      </div>
                    </div>

                    <hr />

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="">Select a category</option>
                        <option>Travel</option>
                        <option>Food & Beverages</option>
                        <option>Accommodation</option>
                        <option>Equipment</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title/Description *</Label>
                      <Input id="title" placeholder="Brief description of the expense" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="details">Detailed Description *</Label>
                      <textarea
                        id="details"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows={4}
                        placeholder="Provide detailed information about the expense"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹) *</Label>
                        <Input id="amount" type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor">Vendor/Supplier *</Label>
                        <Input id="vendor" placeholder="Vendor name" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project">Project Code</Label>
                        <Input id="project" placeholder="Project code (optional)" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Payment Date *</Label>
                        <Input id="date" type="date" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <textarea
                        id="remarks"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows={2}
                        placeholder="Additional remarks (optional)"
                      />
                    </div>

                    <div className="pt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Submit Request</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Bill Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-100 transition">
                    <Upload className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-medium text-blue-900">Click to upload bill</p>
                    <p className="text-xs text-blue-700 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong>Important:</strong> Upload your bill within 48 hours of the payment date to avoid late submission penalties.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">1. Category:</span> Select the appropriate expense category
                  </p>
                  <p>
                    <span className="font-semibold">2. Details:</span> Provide clear description and project details
                  </p>
                  <p>
                    <span className="font-semibold">3. Amount:</span> Enter the expense amount in INR
                  </p>
                  <p>
                    <span className="font-semibold">4. Bill:</span> Attach supporting bill/invoice
                  </p>
                  <p>
                    <span className="font-semibold">5. 48-Hour Rule:</span> Submit bill within 48 hours of payment date
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
      </main>
    </div>
  )
}
