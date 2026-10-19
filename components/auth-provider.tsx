'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'

interface AuthContextType {
  userId: string | null
  role: string | null
  userName: string | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AuthContext.Provider
      value={{
        userId: session?.user?.id || null,
        role: session?.user?.role || null,
        userName: session?.user?.name || null,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      userId: null,
      role: null,
      userName: null,
      isLoading: false,
    }
  }
  return context
}
