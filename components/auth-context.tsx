'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/lib/mock-auth'
import { getSession, clearSession, saveSession } from '@/lib/mock-auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  logout: () => Promise<void>
  updateProfile?: (name: string, email: string) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state on mount and listen for storage changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = getSession()
        if (session) {
          setUser(session.user)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Listen for storage changes (for cross-tab sync and immediate updates)
    const handleStorageChange = () => {
      const session = getSession()
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const logout = async () => {
    clearSession()
    setUser(null)
  }

  const updateProfile = (name: string, email: string) => {
    if (!user) return
    const updatedUser = { ...user, name, email }
    setUser(updatedUser)
    const session = getSession()
    if (session) {
      session.user = updatedUser
      saveSession(session)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
