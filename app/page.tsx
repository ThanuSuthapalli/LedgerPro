'use client'

import { useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function RedirectContent() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin inline-block">
          <div className="h-8 w-8 border-4 border-blue-600 border-transparent border-t-blue-600 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectContent />
    </Suspense>
  )
}
