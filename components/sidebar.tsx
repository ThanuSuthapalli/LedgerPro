'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Users, CreditCard, FolderOpen, LogOut, BarChart3 } from 'lucide-react'
import { signOut } from '@/lib/auth-client'
import { useState } from 'react'

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
}

interface SidebarProps {
  role: 'employee' | 'manager' | 'admin'
  userName?: string
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const getMenuItems = (): MenuItem[] => {
    const commonItems: MenuItem[] = [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: `/${role}/dashboard` },
    ]

    switch (role) {
      case 'employee':
        return [
          ...commonItems,
          { icon: <FileText size={20} />, label: 'Raise Request', href: '/employee/raise-request' },
          { icon: <BarChart3 size={20} />, label: 'Bill History', href: '/employee/bill-history' },
        ]
      case 'manager':
        return [
          ...commonItems,
          { icon: <Users size={20} />, label: 'Requests', href: '/manager/requests' },
        ]
      case 'admin':
        return [
          ...commonItems,
          { icon: <FileText size={20} />, label: 'Requests', href: '/admin/requests' },
          { icon: <Users size={20} />, label: 'Employees', href: '/admin/employees' },
          { icon: <CreditCard size={20} />, label: 'Payment Ledger', href: '/admin/ledger' },
          { icon: <BarChart3 size={20} />, label: 'Reports', href: '/admin/reports' },
          { icon: <FolderOpen size={20} />, label: 'Categories', href: '/admin/categories' },
        ]
      default:
        return commonItems
    }
  }

  const menuItems = getMenuItems()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
    }
  }

  return (
    <aside className="flex h-screen w-56 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500"></div>
          <div>
            <div className="text-sm font-bold">HPS</div>
            <div className="text-xs text-gray-400">Finance Systems</div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 px-3 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase text-gray-500">MAIN MENU</p>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="border-t border-slate-700 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-800 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
            {userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{userName || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
