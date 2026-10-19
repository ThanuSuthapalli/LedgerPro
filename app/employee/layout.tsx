'use client';

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/employee/login' || pathname.startsWith('/employee/login/');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AppLayout role="employee" userName="Alex Johnson">{children}</AppLayout>
}
