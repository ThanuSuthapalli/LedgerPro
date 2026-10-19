// Mock authentication system for demo purposes
// In production, this would connect to Better Auth + Database

export interface User {
  id: string
  email: string
  name: string
  role: 'employee' | 'manager' | 'admin'
}

export interface AuthSession {
  user: User
  token: string
}

const DEMO_USERS: Record<string, User> = {
  'employee@demo.com': {
    id: 'emp-001',
    email: 'employee@demo.com',
    name: 'John Employee',
    role: 'employee',
  },
  'manager@demo.com': {
    id: 'mgr-001',
    email: 'manager@demo.com',
    name: 'Jane Manager',
    role: 'manager',
  },
  'admin@demo.com': {
    id: 'adm-001',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
  },
}

const STORAGE_KEY = 'ledgerpro_session'

export function saveSession(session: AuthSession) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem(STORAGE_KEY)
  return session ? JSON.parse(session) : null
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export async function mockSignIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if user exists
  const user = DEMO_USERS[email]
  if (!user) {
    return { success: false, error: 'User not found' }
  }

  // For demo, any password works for demo accounts
  if (!password) {
    return { success: false, error: 'Password is required' }
  }

  const session: AuthSession = {
    user,
    token: `token-${Date.now()}`,
  }

  saveSession(session)
  return { success: true, user }
}

export async function mockSignOut(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  clearSession()
}

export async function mockGetSession(): Promise<AuthSession | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return getSession()
}
