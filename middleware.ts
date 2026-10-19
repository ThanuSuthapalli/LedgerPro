import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protected routes - redirect to appropriate login if not authenticated
  const protectedRoutes = {
    '/employee': '/employee/login',
    '/manager': '/manager/login',
    '/admin': '/admin/login',
  }

  // Check if the route is protected
  for (const [route, loginRedirect] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) && !pathname.startsWith(`${route}/login`)) {
      // In a real app, you'd check the auth session here
      // For now, we'll just allow all requests to pass through
      // The actual auth check happens in components via useAuth()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/employee/:path*', '/manager/:path*', '/admin/:path*'],
}
