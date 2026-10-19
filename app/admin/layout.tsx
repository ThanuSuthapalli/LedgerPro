'use client';

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login/');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AppLayout role="admin" userName="Admin Kumar">{children}</AppLayout>
}
