import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { logSecurity } from '@/lib/logging/logger';

export default withAuth(
  function middleware(request: NextRequest) {
    const token = request.nextauth.token;
    const { pathname } = request.nextUrl;

    // Admin-only paths
    const adminPaths = ['/admin'];
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

    // Check admin role for admin paths
    if (isAdminPath && token?.role !== 'ADMIN') {
      logSecurity('Unauthorized admin access attempt', {
        path: pathname,
        userId: token?.sub,
        role: token?.role,
      });

      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public paths that don't require authentication
        const publicPaths = [
          '/',
          '/auth/login',
          '/auth/register',
          '/auth/error',
          '/books',
          '/blog',
        ];

        // API routes that don't require authentication
        const publicApiPaths = ['/api/auth', '/api/health'];

        const isPublicPath = publicPaths.some(
          (path) => pathname === path || pathname.startsWith(path + '/')
        );

        const isPublicApiPath = publicApiPaths.some((path) => pathname.startsWith(path));

        // Allow access to public paths
        if (isPublicPath || isPublicApiPath) {
          return true;
        }

        // Require authentication for all other paths
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
