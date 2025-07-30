# Brënda Librave - Netlify Deployment Guide

Complete deployment strategy for Netlify platform with Next.js optimization and PostgreSQL integration.

## 🌐 Netlify Deployment Architecture

### **Platform Overview**
- **Framework**: Next.js 14+ with App Router
- **Hosting**: Netlify with automatic deployments
- **Database**: Neon PostgreSQL (serverless, perfect for Netlify)
- **CDN**: Netlify's global CDN + Edge Functions
- **Storage**: Netlify Large Media or external S3-compatible
- **Analytics**: Netlify Analytics + Google Analytics 4

## ⚙️ Netlify Configuration

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Next.js specific settings
[[plugins]]
  package = "@netlify/plugin-nextjs"

# Large Media for book covers and assets
[[plugins]]
  package = "netlify-plugin-large-media"
  
# Performance optimizations
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache static assets
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache images with shorter duration
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"

# API routes
[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"

# Redirects for SEO
[[redirects]]
  from = "/books/:slug"
  to = "/en/books/:slug"
  status = 302
  conditions = {Language = ["en"]}

[[redirects]]
  from = "/libra/:slug"
  to = "/sq/books/:slug"
  status = 302
  conditions = {Language = ["sq"]}

# PWA support
[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"
    Cache-Control = "public, max-age=86400"

# Security headers for payment pages
[[headers]]
  for = "/checkout*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' *.paypal.com *.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.paypal.com; connect-src 'self' *.paypal.com api.paypal.com"

# Albanian language redirects
[[redirects]]
  from = "/"
  to = "/sq"
  status = 302
  conditions = {Country = ["AL", "XK", "ME", "MK"]}

[[redirects]]
  from = "/"
  to = "/en"
  status = 302
```

## 📦 Package.json Updates for Netlify

### Updated Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "type-check": "tsc --noEmit",
    "netlify:build": "npm run type-check && npm run lint && npm run build",
    "netlify:dev": "netlify dev",
    "db:migrate": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    // ... existing dependencies
    "@netlify/functions": "^2.4.0"
  },
  "devDependencies": {
    // ... existing dev dependencies
    "netlify-cli": "^17.0.0",
    "@netlify/plugin-nextjs": "^4.40.0"
  }
}
```

## 🗄️ Database Strategy: SQLite → PostgreSQL

### Development vs Production Database Strategy

**Why SQLite for Development?**
- ✅ **Zero Setup**: No database server installation required
- ✅ **Fast Development**: Instant startup, no connection overhead
- ✅ **Portable**: Database file can be easily shared and backed up
- ✅ **Testing**: Perfect for unit tests and CI/CD pipelines
- ✅ **Offline Development**: Work without internet connection

**Why Neon PostgreSQL for Production?**
- ✅ **Serverless**: Perfect match for Netlify Functions
- ✅ **Auto-scaling**: Handles traffic spikes automatically
- ✅ **Global Performance**: Edge regions for Albanian diaspora
- ✅ **Advanced Features**: Full-text search, JSON support, complex queries
- ✅ **Backup & Recovery**: Automated backups and point-in-time recovery

### Prisma Configuration for Dual Database Support

#### Dynamic Database Provider
```typescript
// lib/db/config.ts
const databaseProvider = process.env.NODE_ENV === 'production' ? 'postgresql' : 'sqlite';

export const prismaConfig = {
  provider: databaseProvider,
  url: process.env.DATABASE_URL,
  // SQLite specific optimizations
  ...(databaseProvider === 'sqlite' && {
    connectionLimit: 1,
    pool: { min: 0, max: 1 }
  }),
  // PostgreSQL specific optimizations
  ...(databaseProvider === 'postgresql' && {
    connectionLimit: 5,
    pool: { min: 0, max: 5 }
  })
};
```

### Neon PostgreSQL Setup
```typescript
// lib/db/connection.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Optimize for Netlify Functions
const prisma = globalThis.__prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Graceful shutdown for Netlify Functions
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
```

### Database Migration Workflow

#### Development Workflow
```bash
# 1. Develop with SQLite
npm run dev

# 2. Create migration
npx prisma migrate dev --name add_user_feature

# 3. Test locally
npm run test

# 4. Commit and push (triggers Netlify deployment)
git add .
git commit -m "Add user feature"
git push origin main
```

#### Automatic Production Migration
```bash
# netlify.toml handles this automatically:
[build]
  command = "npm run db:migrate && npm run build"

# This runs:
# 1. npx prisma migrate deploy (applies migrations to Neon PostgreSQL)
# 2. npx prisma generate (updates Prisma client)
# 3. npm run build (builds Next.js app)
```

#### Migration Compatibility
```prisma
// Examples of SQLite → PostgreSQL compatible schemas:

// ✅ Compatible data types
model User {
  id        String   @id @default(cuid())  // Works in both
  email     String   @unique               // Works in both
  name      String                         // Works in both
  createdAt DateTime @default(now())       // Works in both
}

// ✅ Compatible indexes
@@index([email])          // Works in both
@@unique([email, name])   // Works in both

// ⚠️ Avoid SQLite-specific features:
// - ALTER TABLE limitations
// - Foreign key constraint names
// - Specific JSON operators
```

### Environment Variables

#### Local Development (.env.local)
```env
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"
```

#### Production (Netlify Environment Variables)
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-cool-name.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="https://brendalibrave.netlify.app"

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"
PAYPAL_MODE="sandbox" # or "live" for production

# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# S3 Storage (for eBooks and large media)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_BUCKET_NAME="brenda-librave-media"
AWS_REGION="us-east-1"

# Netlify (automatically provided)
NETLIFY_SITE_ID="auto-provided"
NETLIFY_AUTH_TOKEN="auto-provided"

# Email (for newsletters)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🚀 Netlify Edge Functions

### Middleware for Performance
```typescript
// netlify/edge-functions/middleware.ts
import type { Context } from "@netlify/edge-functions";

export default async function middleware(
  request: Request,
  context: Context
) {
  const url = new URL(request.url);
  
  // Redirect based on geolocation for Albanian users
  const country = context.geo?.country?.code;
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Albanian countries get Albanian by default
  if (['AL', 'XK', 'ME', 'MK'].includes(country || '') && 
      !url.pathname.startsWith('/sq') && 
      !url.pathname.startsWith('/en')) {
    return Response.redirect(new URL('/sq' + url.pathname, url), 302);
  }
  
  // Add security headers
  const response = await context.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = { 
  path: "/*" 
};
```

### Book Search Edge Function
```typescript
// netlify/edge-functions/book-search.ts
import type { Context } from "@netlify/edge-functions";

export default async function bookSearch(
  request: Request,
  context: Context
) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  
  if (!query) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Fast edge-based search caching
  const cacheKey = `search:${query}`;
  const cached = await context.storage.get(cacheKey);
  
  if (cached) {
    return new Response(cached, {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
  
  // Fallback to origin for complex search
  return context.next();
}

export const config = { 
  path: "/api/search" 
};
```

## 📁 File Storage Strategy

### Netlify Large Media + External Storage
```typescript
// lib/storage/config.ts
interface StorageConfig {
  provider: 'netlify' | 's3';
  maxSize: number;
  allowedTypes: string[];
}

const STORAGE_CONFIG: Record<string, StorageConfig> = {
  bookCovers: {
    provider: 'netlify', // Small images via Netlify Large Media
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/webp', 'image/jpeg', 'image/png']
  },
  eBooks: {
    provider: 's3', // Large files via S3
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'application/epub+zip']
  },
  blogImages: {
    provider: 'netlify',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/webp', 'image/jpeg', 'image/png']
  }
};

export { STORAGE_CONFIG };
```

## 🔧 Next.js Configuration for Netlify

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  // Netlify optimization
  output: 'standalone',
  
  // Image optimization for Netlify
  images: {
    domains: [
      'brendalibrave.netlify.app',
      's3.amazonaws.com',
      'brenda-librave-media.s3.amazonaws.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Internationalization
  i18n: {
    locales: ['sq', 'en'],
    defaultLocale: 'sq',
    localeDetection: false, // Handle via Edge Functions
  },
  
  // Security headers (complementing netlify.toml)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/sq/admin',
        permanent: false,
      },
      {
        source: '/blog',
        destination: '/sq/blog',
        permanent: false,
      },
    ];
  },
  
  // Webpack optimization for Netlify Functions
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Optimize for Netlify Functions
      config.externals = [...config.externals, '@prisma/client'];
    }
    return config;
  },
};

module.exports = nextConfig;
```

## 📊 Performance Optimization for Netlify

### Critical Performance Settings
```typescript
// lib/performance/netlify-optimizations.ts

// Optimize Prisma for Netlify Functions
export const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Reduce connection pool for Netlify Functions
  connectionLimit: 5,
  // Enable query engine caching
  engineType: 'library',
};

// Image optimization utilities
export const netlifyImageOptimization = {
  // Use Netlify's built-in image transformation
  transformImage: (src: string, width: number, quality = 80) => {
    if (src.includes('netlify.app')) {
      return `${src}?nf_resize=fit&w=${width}&q=${quality}&fm=webp`;
    }
    return src;
  },
  
  // Generate responsive srcSet for Netlify
  generateSrcSet: (src: string, sizes: number[]) => {
    return sizes
      .map(size => `${netlifyImageOptimization.transformImage(src, size)} ${size}w`)
      .join(', ');
  }
};
```

## 🔄 Deployment Workflow

### Automatic Deployment Pipeline
```yaml
# .github/workflows/netlify-deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/build@master
        with:
          publish-dir: .next
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🛡️ Security Configuration

### Enhanced Security for Netlify
```typescript
// lib/security/netlify-security.ts

// Rate limiting using Netlify Edge
export const rateLimitConfig = {
  // API endpoints rate limits
  '/api/auth': { requests: 10, window: '1m' },
  '/api/orders': { requests: 20, window: '1m' },
  '/api/search': { requests: 100, window: '1m' },
  
  // Admin endpoints
  '/api/admin': { requests: 30, window: '1m' },
};

// CSRF protection for forms
export const csrfConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  cookie: {
    name: '__Host-csrf-token',
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
  },
};
```

## 📈 Analytics and Monitoring

### Netlify Analytics Integration
```typescript
// lib/analytics/netlify-analytics.ts

// Custom events for Netlify Analytics
export const trackNetlifyEvent = (eventName: string, data: any) => {
  if (typeof window !== 'undefined' && window.netlifyIdentity) {
    // Track custom events
    window.netlifyAnalytics?.track(eventName, data);
  }
};

// Performance monitoring
export const monitorNetlifyPerformance = () => {
  if (typeof window !== 'undefined') {
    // Monitor Core Web Vitals specifically for Netlify
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          trackNetlifyEvent('page_load', {
            duration: entry.duration,
            path: window.location.pathname
          });
        }
      }
    }).observe({ entryTypes: ['navigation'] });
  }
};
```

## 🎯 Netlify-Specific Optimizations

### Edge Functions for Albanian Users
- **Geo-based Routing**: Automatic Albanian language detection
- **Search Optimization**: Edge-cached search results
- **Image Optimization**: Netlify's built-in image transformation
- **CDN Performance**: Global CDN with edge locations

### Database Optimization
- **Development**: SQLite for fast local development and testing
- **Production**: Neon PostgreSQL optimized for Netlify Functions
- **Connection Pooling**: Optimized for serverless architecture
- **Query Caching**: Redis-like caching at the edge
- **Migration Strategy**: Automated SQLite → PostgreSQL deployment

### SEO Benefits
- **Fast Global Loading**: Netlify's CDN for international Albanian diaspora
- **Automatic HTTPS**: SSL certificates for better search ranking
- **Form Handling**: Built-in form processing for newsletters
- **Analytics**: Built-in Netlify Analytics + GA4 integration

This Netlify deployment strategy ensures Brënda Librave will have excellent performance for Albanian users worldwide while maintaining cost-effectiveness and scalability.