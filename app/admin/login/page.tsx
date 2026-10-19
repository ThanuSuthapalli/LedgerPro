'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockSignIn } from '@/lib/mock-auth'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await mockSignIn(email, password)
      
      if (!result.success) {
        setError(result.error || 'Login failed')
        setIsLoading(false)
        return
      }

      if (result.user?.role !== 'admin') {
        setError('This account is not an admin account')
        setIsLoading(false)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to Login
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mx-auto mb-4">
              <div className="text-lg font-bold text-green-600">🔐</div>
            </div>
            <CardTitle className="text-center">Administrator Login</CardTitle>
            <CardDescription className="text-center">Full system access and controls</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-green-50 rounded-lg text-sm text-gray-600">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>Email: admin@demo.com</p>
              <p>Password: password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
