'use client';

// Force recompile: v6
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, LogOut, Home, FileText, Users, DollarSign, BarChart3, Clock, FolderOpen, Moon, Sun, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SettingsModal } from '@/components/settings-modal';
import { useAuthContext } from '@/components/auth-context';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AppLayoutProps {
  children: React.ReactNode;
  role?: 'admin' | 'employee' | 'manager';
  userName?: string;
}

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

export function AppLayout({ children, role = 'employee', userName = 'User' }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('user@company.com');
  const [userId, setUserId] = useState('EMP001');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const notifRef = useRef<HTMLDivElement>(null);

  // Authentication Context
  const { user } = useAuthContext();
  const activeUserName = user?.name || userName;
  const activeUserEmail = user?.email || userEmail;
  const activeUserId = user?.id || userId;

  // Role-based notification states
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // On larger screens default sidebar open
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setSidebarOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Populate role-based notifications
    let mockNotifs: NotificationItem[] = [];
    if (role === 'employee') {
      mockNotifs = [
        { id: '1', text: 'Expense claim for Travel approved (₹450.00)', time: '2 hours ago', read: false },
        { id: '2', text: 'Policy reminder: Upload receipts within 48 working hours', time: '1 day ago', read: false },
        { id: '3', text: 'Reimbursement processed (₹1,200.00)', time: '3 days ago', read: true },
      ];
    } else if (role === 'manager') {
      mockNotifs = [
        { id: '1', text: 'New Travel Request pending from John Doe (₹450.00)', time: '1 hour ago', read: false },
        { id: '2', text: 'Policy alert: Jane Smith submitted a receipt on Sunday', time: '4 hours ago', read: false },
        { id: '3', text: 'Monthly spend report is ready to review', time: '1 day ago', read: true },
      ];
    } else if (role === 'admin') {
      mockNotifs = [
        { id: '1', text: 'New Manager account created: Jane Manager', time: '30 mins ago', read: false },
        { id: '2', text: 'Security warning: Multiple login failures from 192.168.1.3', time: '2 hours ago', read: false },
        { id: '3', text: 'Database backup completed successfully', time: '12 hours ago', read: true },
      ];
    }
    setNotifications(mockNotifs);
  }, [role]);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    // Get user email and ID from localStorage if available
    const session = localStorage.getItem('ledgerpro_session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        setUserEmail(sessionData.user?.email || 'user@company.com');
        setUserId(sessionData.user?.id || 'EMP001');
      } catch (e) {
        // Fallback to default
      }
    }
    
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Toggle dark class on html element
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems: NavItem[] =
    role === 'admin'
      ? [
          { label: 'Dashboard', href: '/admin/dashboard', icon: <Home className="w-5 h-5" /> },
          { label: 'Employees', href: '/admin/employees', icon: <Users className="w-5 h-5" /> },
          { label: 'Expenses', href: '/admin/expenses', icon: <DollarSign className="w-5 h-5" /> },
          { label: 'Requests', href: '/admin/requests', icon: <Clock className="w-5 h-5" /> },
          { label: 'Ledger', href: '/admin/ledger', icon: <FileText className="w-5 h-5" /> },
          { label: 'Reports', href: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
          { label: 'Categories', href: '/admin/categories', icon: <FolderOpen className="w-5 h-5" /> },
        ]
      : role === 'manager'
        ? [
            { label: 'Dashboard', href: '/manager/dashboard', icon: <Home className="w-5 h-5" /> },
            { label: 'My Expenses', href: '/manager/expenses', icon: <DollarSign className="w-5 h-5" /> },
            { label: 'Submit Expense', href: '/manager/request', icon: <FileText className="w-5 h-5" /> },
            { label: 'Team Requests', href: '/manager/requests', icon: <Clock className="w-5 h-5" /> },
            { label: 'Approvals', href: '/manager/approvals', icon: <BarChart3 className="w-5 h-5" /> },
            { label: 'Reports', href: '/manager/reports', icon: <BarChart3 className="w-5 h-5" /> },
            { label: 'Team', href: '/manager/team', icon: <Users className="w-5 h-5" /> },
          ]
        : [
            { label: 'Dashboard', href: '/employee/dashboard', icon: <Home className="w-5 h-5" /> },
            { label: 'My Expenses', href: '/employee/expenses', icon: <DollarSign className="w-5 h-5" /> },
            { label: 'New Request', href: '/employee/request', icon: <FileText className="w-5 h-5" /> },
            { label: 'My Requests', href: '/employee/requests', icon: <Clock className="w-5 h-5" /> },
            { label: 'Ledger', href: '/employee/ledger', icon: <BarChart3 className="w-5 h-5" /> },
          ];

  const isActive = (href: string) => {
    // Exact match for dashboard pages
    if (href.endsWith('/dashboard')) {
      return pathname === href;
    }
    
    // For other pages, check if pathname starts with href but exclude false positives
    // e.g., /employee/requests should not match /employee/request
    if (pathname.startsWith(href)) {
      const nextChar = pathname[href.length];
      // If next character is undefined (exact match) or '/' (child route), it's a match
      return nextChar === undefined || nextChar === '/';
    }
    
    return false;
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col z-50',
          // Desktop: collapsible
          'hidden lg:flex',
          sidebarOpen ? 'lg:w-64' : 'lg:w-20',
          // Mobile: drawer overlay
          mobileSidebarOpen && 'flex fixed inset-y-0 left-0 w-64 shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {(sidebarOpen || mobileSidebarOpen) && <div className="font-bold text-lg">Ledger Pro</div>}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileSidebarOpen(false);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            {(sidebarOpen || mobileSidebarOpen) ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                isActive(item.href)
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {(sidebarOpen || mobileSidebarOpen) && (
                <>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="bg-accent text-accent-foreground text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto border-t border-sidebar-border">
          {/* Dark Mode Toggle */}
          <div className="px-2 py-3 border-b border-sidebar-border">
            <button
              onClick={handleDarkModeToggle}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Moon className="w-5 h-5 flex-shrink-0" />
              )}
              {(sidebarOpen || mobileSidebarOpen) && <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 space-y-3">
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-full flex items-center gap-3 transition-all hover:opacity-80"
              title="Open profile settings"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                {activeUserName.charAt(0).toUpperCase()}
              </div>
              {(sidebarOpen || mobileSidebarOpen) && (
                <div className="text-left flex-1 min-w-0">
                  <div className="text-sm font-semibold text-sidebar-foreground truncate">{activeUserName.toUpperCase()}</div>
                  <div className="text-xs text-sidebar-foreground/60 truncate">{activeUserId}</div>
                </div>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('ledgerpro_session');
                router.push(`/${role}/login`);
              }}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors',
                'bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground text-sm font-medium'
              )}
            >
              <LogOut className="w-4 h-4" />
              {(sidebarOpen || mobileSidebarOpen) && 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Desktop sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-xs sm:max-w-sm bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-border">
                  <div className="p-3 bg-muted/35 flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground uppercase tracking-wider">Notifications</span>
                    <div className="flex items-center gap-2">
                      {unreadNotifsCount > 0 && (
                        <button onClick={handleMarkAllAsRead} className="text-[10px] text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer">
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                        title="Close"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-border">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n.id)}
                          className={cn(
                            "p-3 text-xs cursor-pointer transition-colors hover:bg-muted/40",
                            !n.read && "bg-primary/5 font-medium border-l-2 border-l-primary"
                          )}
                        >
                          <p className="text-foreground">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:block text-sm text-muted-foreground whitespace-nowrap">Welcome, {activeUserName}</div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold hover:bg-primary/90 transition-colors"
              title="Open profile settings"
            >
              {activeUserName.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userName={activeUserName}
        userEmail={activeUserEmail}
        userRole={role}
      />
    </div>
  );
}
