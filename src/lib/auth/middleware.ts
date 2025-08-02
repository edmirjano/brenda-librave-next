import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { logSecurity, logWarning } from '@/lib/logging/logger';

export async function authMiddleware(request: NextRequest): Promise<Response | undefined> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/api/auth',
    '/api/health',
    '/books',
    '/blog',
  ];

  // Admin-only paths
  const adminPaths = ['/admin', '/api/admin'];

  // Protected paths that require authentication
  const protectedPaths = ['/profile', '/cart', '/checkout', '/orders', '/api/user'];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path) || pathname === path);

  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // Allow public paths
  if (isPublicPath && !isAdminPath) {
    return NextResponse.next();
  }

  // Check authentication for protected paths
  if ((isProtectedPath || isAdminPath) && !token) {
    logSecurity('Unauthorized access attempt', {
      path: pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent'),
    });

    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Redirect to login for web pages
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin role for admin paths
  if (isAdminPath && token?.role !== 'ADMIN') {
    logSecurity('Unauthorized admin access attempt', {
      path: pathname,
      userId: token?.sub,
      role: token?.role,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });

    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Redirect to home for web pages
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

/**
 * Higher-order function to create role-based API middleware
 */
export function withAuth(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    allowedRoles?: string[];
  } = {}
) {
  return async (request: NextRequest) => {
    const { requireAuth = true, allowedRoles = [] } = options;

    if (!requireAuth) {
      return handler(request);
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      logSecurity('API access without authentication', {
        path: request.nextUrl.pathname,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      });

      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(token.role as string)) {
      logSecurity('API access with insufficient role', {
        path: request.nextUrl.pathname,
        userId: token.sub,
        userRole: token.role,
        requiredRoles: allowedRoles,
      });

      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return handler(request);
  };
}

/**
 * Rate limiting middleware
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    limit: number;
    windowMs: number;
  }
) {
  return async (request: NextRequest) => {
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowMs = options.windowMs;

    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return handler(request);
    }

    if (record.count >= options.limit) {
      logWarning('Rate limit exceeded', {
        ip,
        path: request.nextUrl.pathname,
        limit: options.limit,
        windowMs,
      });

      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    record.count++;
    return handler(request);
  };
}
