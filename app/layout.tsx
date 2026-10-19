import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
// Google Font imports removed to avoid network dependency
import './globals.css'
import { AuthProvider } from '@/components/auth-context'

// Font loading omitted for offline use

export const metadata: Metadata = {
  title: 'LedgerPro - Claims Cockpit',
  description: 'Corporate reimbursement dashboard and expense claim management system',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [{ color: 'white' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background">
        <AuthProvider>{children}</AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
