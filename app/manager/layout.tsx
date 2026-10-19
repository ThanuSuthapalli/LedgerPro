'use client';

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'

export default function ManagerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/manager/login' || pathname.startsWith('/manager/login/');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AppLayout role="manager" userName="Jane Manager">{children}</AppLayout>
}
