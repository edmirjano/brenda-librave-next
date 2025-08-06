import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, pathnames } from '@/lib/i18n/config';
import { logSecurity } from '@/lib/logging/logger';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  pathnames,
  localePrefix: 'as-needed'
});

// Create the auth middleware
const authMiddleware = withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    const { pathname } = request.nextUrl;

    // Admin-only paths (with locale support)
    const adminPaths = ['/admin', '/sq/admin', '/en/admin'];
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

    // Check admin role for admin paths
    if (isAdminPath && token?.role !== 'ADMIN') {
      logSecurity('Unauthorized admin access attempt', {
        path: pathname,
        userId: token?.sub,
        role: token?.role,
      });

      // Redirect to home with proper locale
      const locale = pathname.startsWith('/sq') ? 'sq' : 
                   pathname.startsWith('/en') ? 'en' : defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public paths that don't require authentication (with locale support)
        const publicPaths = [
          '/',
          '/sq', '/en',
          '/sq/', '/en/',
          '/auth/login', '/sq/auth/login', '/en/auth/login',
          '/auth/register', '/sq/auth/register', '/en/auth/register',
          '/auth/error', '/sq/auth/error', '/en/auth/error',
          '/books', '/sq/books', '/en/books', '/sq/libra', '/en/books',
          '/blog', '/sq/blog', '/en/blog',
          '/debug', '/sq/debug', '/en/debug',
        ];

        // API routes that don't require authentication
        const publicApiPaths = [
          '/api/auth',
          '/api/health',
          '/api/books',
          '/api/categories',
          '/api/blog',
          '/api/exchange-rate',
        ];

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

export default function middleware(request: NextRequest) {
  // Set custom header with pathname for locale detection
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Handle internationalization first
  const response = intlMiddleware(request);
  
  // If intl middleware redirects, return that response
  if (response instanceof Response && response.status >= 300 && response.status < 400) {
    return response;
  }

  // Apply auth middleware
  return authMiddleware(request);
}

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