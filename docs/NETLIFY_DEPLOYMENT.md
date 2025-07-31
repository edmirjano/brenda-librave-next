# Brënda Librave - Netlify Deployment Guide

Complete deployment strategy for Netlify platform with Next.js optimization, PostgreSQL integration, and comprehensive security and monitoring setup.

## 🌐 Netlify Deployment Architecture

### **Platform Overview**
- **Framework**: Next.js 14+ with App Router
- **Hosting**: Netlify with automatic deployments
- **Database**: Neon PostgreSQL (serverless, perfect for Netlify)
- **CDN**: Netlify's global CDN + Edge Functions
- **Storage**: Netlify Large Media or external S3-compatible
- **Analytics**: Netlify Analytics + Google Analytics 4

## 🔐 Enhanced Security & Credential Management

### Secure API Key Management Strategy

#### Primary Method: Netlify Environment Variables
- **Storage**: Netlify provides secure environment variable storage in site settings
- **Access Control**: Team-based permissions for variable access
- **Runtime Injection**: Variables injected into build process and serverless functions
- **Repository Safety**: No secrets stored in code repository

#### Enhanced Security Practices
```typescript
// lib/security/credential-management.ts
export const CredentialManager = {
  // Validate required environment variables at startup
  validateRequiredEnvVars: () => {
    const required = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'PAYPAL_CLIENT_SECRET',
      'FIREBASE_PRIVATE_KEY',
      'SENTRY_DSN'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  },
  
  // Secure credential rotation workflow
  rotateCredentials: async (service: string) => {
    logger.info(`Rotating credentials for ${service}`);
    // Implementation for automated credential rotation
    // This would integrate with external secret management services
  },
  
  // Audit credential access
  auditCredentialAccess: (service: string, action: string) => {
    logger.info('Credential access audit', {
      service,
      action,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }
};
```

#### Advanced Security Integration Options
```typescript
// lib/security/external-secret-management.ts
export const ExternalSecretManager = {
  // Integration with HashiCorp Vault (optional for high-security needs)
  async getSecretFromVault(secretPath: string) {
    // Implementation for Vault integration
    // Only needed for enterprise-level security requirements
  },
  
  // Integration with AWS Secrets Manager (optional)
  async getSecretFromAWS(secretName: string) {
    // Implementation for AWS Secrets Manager
    // For automated credential rotation
  },
  
  // Service account management
  createServiceAccount: (service: string, permissions: string[]) => {
    // Create dedicated service accounts with minimal permissions
  }
};
```

### Security Best Practices Implementation
```typescript
// lib/security/security-headers.ts
export const SecurityHeaders = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "*.paypal.com", "*.googletagmanager.com"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "*.paypal.com", "*.google-analytics.com"],
    'connect-src': ["'self'", "*.paypal.com", "api.paypal.com", "*.google-analytics.com"],
    'frame-src': ["*.paypal.com"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  },
  
  // Security headers for all responses
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  }
};
```

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
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' *.paypal.com *.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.paypal.com *.google-analytics.com; connect-src 'self' *.paypal.com api.paypal.com *.google-analytics.com; frame-src *.paypal.com; object-src 'none'; base-uri 'self'; form-action 'self'"

# Enhanced security headers for admin pages
[[headers]]
  for = "/admin*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

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

# Health check endpoint (always accessible)
[[headers]]
  for = "/api/health"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET"
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
    "postinstall": "prisma generate",
    "security:audit": "npm audit --audit-level moderate",
    "security:check": "npm run security:audit && npm run lint:security",
    "lint:security": "eslint . --ext .ts,.tsx,.js,.jsx --config .eslintrc.security.json"
  },
  "dependencies": {
    // ... existing dependencies
    "@netlify/functions": "^2.4.0",
    "@sentry/nextjs": "^7.0.0",
    "pino": "^8.0.0",
    "pino-pretty": "^10.0.0"
  },
  "devDependencies": {
    // ... existing dev dependencies
    "netlify-cli": "^17.0.0",
    "@netlify/plugin-nextjs": "^4.40.0",
    "eslint-plugin-security": "^1.7.1"
  }
}
```

## 🚀 Rollback Strategy for Critical Bugs

### Netlify Instant Rollbacks
```typescript
// lib/deployment/rollback-strategy.ts
export const RollbackStrategy = {
  // Automated rollback triggers
  healthCheckFailure: {
    threshold: 3, // consecutive failures
    timeWindow: '5m',
    action: 'auto-rollback',
    notification: ['slack', 'email', 'sms']
  },
  
  // Error rate thresholds
  errorRateThreshold: {
    rate: 5, // 5% error rate
    timeWindow: '2m',
    action: 'alert-and-prepare-rollback',
    autoRollback: false // Manual approval required
  },
  
  // Database migration considerations
  migrationStrategy: {
    type: 'additive-only', // Avoid destructive changes
    backwardCompatible: true,
    rollbackPlan: 'manual-review-required',
    testingRequired: true
  },
  
  // Communication plan
  communicationPlan: {
    stakeholders: ['dev-team', 'product-owner', 'customer-support'],
    channels: ['slack', 'email'],
    template: 'deployment-rollback-notification'
  }
};
```

### Rollback Process Documentation
```typescript
// lib/deployment/rollback-procedures.ts
export const RollbackProcedures = {
  // Step-by-step rollback process
  immediateRollback: {
    steps: [
      '1. Navigate to Netlify dashboard > Site > Deploys',
      '2. Find the last known good deployment',
      '3. Click "Publish deploy" next to that deployment',
      '4. Verify rollback success via health checks',
      '5. Notify stakeholders of rollback completion'
    ],
    estimatedTime: '2-3 minutes',
    prerequisites: ['Admin access to Netlify', 'Incident response team notified']
  },
  
  // Database rollback considerations
  databaseRollback: {
    additiveChanges: 'Safe to rollback code only',
    destructiveChanges: 'Requires manual database rollback',
    procedure: [
      '1. Assess migration impact',
      '2. Create reverse migration if needed',
      '3. Test reverse migration in staging',
      '4. Apply reverse migration to production',
      '5. Rollback application code'
    ]
  },
  
  // Post-rollback actions
  postRollback: {
    actions: [
      'Verify all critical functionality',
      'Monitor error rates and performance',
      'Investigate root cause of issue',
      'Plan fix and re-deployment',
      'Update incident documentation'
    ]
  }
};
```

### Automated Rollback Monitoring
```typescript
// lib/monitoring/rollback-monitoring.ts
export const RollbackMonitoring = {
  // Health check endpoints for rollback decisions
  healthChecks: [
    { endpoint: '/api/health', critical: true },
    { endpoint: '/api/books', critical: true },
    { endpoint: '/api/auth/session', critical: false },
    { endpoint: '/api/orders', critical: true }
  ],
  
  // Monitoring thresholds
  thresholds: {
    responseTime: 5000, // 5 seconds max
    errorRate: 0.05, // 5% error rate
    consecutiveFailures: 3
  },
  
  // Automated monitoring script
  monitorDeployment: async (deploymentId: string) => {
    // Implementation for automated post-deployment monitoring
    // This would run health checks and trigger rollback if needed
  }
};
```

## 📊 Technical Health Monitoring Strategy

### Comprehensive Monitoring Stack
```typescript
// lib/monitoring/health-monitoring.ts
export const HealthMonitoring = {
  // Uptime monitoring configuration
  uptimeChecks: {
    endpoints: [
      { url: '/api/health', frequency: '1m', timeout: '10s' },
      { url: '/api/books', frequency: '2m', timeout: '15s' },
      { url: '/api/auth/session', frequency: '5m', timeout: '10s' },
      { url: '/', frequency: '1m', timeout: '20s' }
    ],
    alertThreshold: 3, // consecutive failures
    escalationTime: '5m'
  },
  
  // Performance monitoring
  performanceMetrics: {
    apiResponseTime: { 
      threshold: 200, // milliseconds
      percentile: 95,
      alert: 'slack'
    },
    databaseQueryTime: { 
      threshold: 100, // milliseconds
      alert: 'email'
    },
    errorRate: { 
      threshold: 0.01, // 1%
      timeWindow: '5m',
      alert: 'immediate'
    },
    memoryUsage: {
      threshold: 0.85, // 85%
      alert: 'warning'
    }
  },
  
  // Database health monitoring
  databaseMonitoring: {
    connectionPool: {
      monitor: true,
      maxConnections: 10,
      alertThreshold: 8
    },
    slowQueries: {
      threshold: 1000, // 1 second
      action: 'log-and-alert'
    },
    deadlocks: {
      action: 'immediate-alert',
      escalation: 'phone-call'
    }
  },
  
  // Custom business metrics
  businessMetrics: {
    orderProcessingTime: {
      threshold: 30000, // 30 seconds
      alert: 'business-team'
    },
    paymentFailureRate: {
      threshold: 0.02, // 2%
      alert: 'immediate'
    },
    searchResponseTime: {
      threshold: 500, // milliseconds
      alert: 'performance-team'
    }
  }
};
```

### Monitoring Tools Integration
```typescript
// lib/monitoring/monitoring-integrations.ts
export const MonitoringIntegrations = {
  // Sentry configuration for error tracking
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend: (event) => {
      // Filter sensitive data
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      return event;
    }
  },
  
  // UptimeRobot configuration
  uptimeRobot: {
    monitors: [
      { name: 'Main Site', url: 'https://brendalibrave.netlify.app' },
      { name: 'API Health', url: 'https://brendalibrave.netlify.app/api/health' },
      { name: 'Book Search', url: 'https://brendalibrave.netlify.app/api/books' }
    ],
    alertContacts: ['email', 'slack', 'sms']
  },
  
  // Custom logging with Pino
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    formatters: {
      level: (label) => ({ level: label }),
      bindings: (bindings) => ({
        pid: bindings.pid,
        hostname: bindings.hostname,
        environment: process.env.NODE_ENV
      })
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`
  }
};
```

### Health Check API Implementation
```typescript
// app/api/health/detailed/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logging/logger';

export async function GET() {
  const startTime = Date.now();
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || 'unknown',
    environment: process.env.NODE_ENV,
    checks: {}
  };

  try {
    // Database connectivity check
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbTime = Date.now() - dbStart;
    
    healthStatus.checks.database = {
      status: 'healthy',
      responseTime: `${dbTime}ms`,
      connection: 'active'
    };

    // Memory usage check
    const memUsage = process.memoryUsage();
    healthStatus.checks.memory = {
      status: memUsage.heapUsed / memUsage.heapTotal < 0.9 ? 'healthy' : 'warning',
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      utilization: `${Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)}%`
    };

    // External services check (PayPal, Firebase, etc.)
    healthStatus.checks.externalServices = {
      paypal: process.env.PAYPAL_CLIENT_ID ? 'configured' : 'missing',
      firebase: process.env.FIREBASE_PROJECT_ID ? 'configured' : 'missing',
      sentry: process.env.SENTRY_DSN ? 'configured' : 'missing'
    };

    const totalTime = Date.now() - startTime;
    healthStatus.responseTime = `${totalTime}ms`;

    logger.info('Detailed health check completed', healthStatus);
    return NextResponse.json(healthStatus);

  } catch (error) {
    logger.error('Detailed health check failed', { error });
    
    healthStatus.status = 'unhealthy';
    healthStatus.checks.database = {
      status: 'unhealthy',
      error: error.message
    };

    return NextResponse.json(healthStatus, { status: 503 });
  }
}
```

### Alerting Configuration
```typescript
// lib/monitoring/alerting.ts
export const AlertingConfig = {
  // Alert channels
  channels: {
    slack: {
      webhook: process.env.SLACK_WEBHOOK_URL,
      channel: '#alerts',
      severity: ['critical', 'high']
    },
    email: {
      recipients: ['dev-team@brendalibrave.al', 'ops@brendalibrave.al'],
      severity: ['critical', 'high', 'medium']
    },
    sms: {
      numbers: ['+355XXXXXXXXX'], // Albanian phone numbers
      severity: ['critical']
    }
  },
  
  // Alert rules
  rules: {
    criticalErrors: {
      condition: 'error_rate > 5% for 2 minutes',
      severity: 'critical',
      channels: ['slack', 'email', 'sms']
    },
    highResponseTime: {
      condition: 'avg_response_time > 2000ms for 5 minutes',
      severity: 'high',
      channels: ['slack', 'email']
    },
    databaseIssues: {
      condition: 'database_connection_failures > 3',
      severity: 'critical',
      channels: ['slack', 'email', 'sms']
    },
    deploymentFailure: {
      condition: 'deployment_health_check_failure',
      severity: 'critical',
      channels: ['slack', 'email']
    }
  },
  
  // Escalation procedures
  escalation: {
    timeouts: {
      critical: '5m', // Escalate if not acknowledged in 5 minutes
      high: '15m',
      medium: '1h'
    },
    oncall: {
      primary: 'dev-lead',
      secondary: 'ops-lead',
      tertiary: 'cto'
    }
  }
};
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
    pool: { min: 0, max: 5 },
    // Enhanced monitoring for production
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn']
  })
};
```

### Data Migration & Schema Evolution Strategy

#### Migration Workflow with Monitoring
```bash
# Enhanced development workflow with validation
# 1. Develop with SQLite locally
npm run dev

# 2. Create schema changes with validation
npx prisma migrate dev --name add_user_feature

# 3. Validate migration compatibility
npm run db:validate-migration

# 4. Test locally with comprehensive tests
npm run test:migration

# 5. Deploy with monitoring
git add .
git commit -m "Add user feature with validated migration"
git push origin main
```

#### Complex Migration Handling
```typescript
// lib/db/migration-validator.ts
export const MigrationValidator = {
  // Validate migration compatibility between SQLite and PostgreSQL
  validateCompatibility: (migrationFile: string) => {
    const incompatiblePatterns = [
      /ALTER TABLE.*RENAME COLUMN/i, // SQLite limitation
      /DROP CONSTRAINT/i, // Different syntax
      /AUTOINCREMENT/i // SQLite-specific
    ];
    
    const content = fs.readFileSync(migrationFile, 'utf8');
    const issues = incompatiblePatterns.filter(pattern => pattern.test(content));
    
    if (issues.length > 0) {
      throw new Error(`Migration contains incompatible patterns: ${issues}`);
    }
  },
  
  // Test migration on both databases
  testMigration: async (migrationName: string) => {
    // Test on SQLite first
    await testOnSQLite(migrationName);
    
    // Test on PostgreSQL staging
    await testOnPostgreSQL(migrationName);
  }
};
```

#### Migration Monitoring
```typescript
// lib/db/migration-monitoring.ts
export const MigrationMonitoring = {
  // Monitor migration performance
  trackMigrationPerformance: async (migrationName: string, startTime: number) => {
    const duration = Date.now() - startTime;
    
    logger.info('Migration completed', {
      migration: migrationName,
      duration: `${duration}ms`,
      environment: process.env.NODE_ENV
    });
    
    // Alert if migration takes too long
    if (duration > 30000) { // 30 seconds
      logger.warn('Slow migration detected', {
        migration: migrationName,
        duration: `${duration}ms`
      });
    }
  },
  
  // Validate post-migration state
  validatePostMigration: async () => {
    try {
      // Run basic queries to ensure database is functional
      await prisma.user.count();
      await prisma.book.count();
      
      logger.info('Post-migration validation successful');
    } catch (error) {
      logger.error('Post-migration validation failed', { error });
      throw error;
    }
  }
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
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Enhanced connection monitoring
prisma.$on('error', (e) => {
  logger.error('Prisma error', { error: e });
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma warning', { warning: e });
});

// Monitor slow queries in production
if (process.env.NODE_ENV === 'production') {
  prisma.$on('query', (e) => {
    if (e.duration > 1000) { // Log queries taking more than 1 second
      logger.warn('Slow query detected', {
        query: e.query,
        duration: `${e.duration}ms`,
        params: e.params
      });
    }
  });
}

// Graceful shutdown for Netlify Functions
process.on('beforeExit', async () => {
  logger.info('Shutting down Prisma connection');
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
  command = "npm run security:check && npm run db:migrate && npm run build"

# This runs:
# 1. npm run security:check (security audit and linting)
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

# Monitoring & Error Tracking
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
SENTRY_ORG="your-org"
SENTRY_PROJECT="brenda-librave"
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

# Uptime Monitoring
UPTIMEROBOT_API_KEY="your-uptimerobot-api-key"

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
import { logger } from "../../lib/logging/logger";

export default async function middleware(
  request: Request,
  context: Context
) {
  const startTime = Date.now();
  const url = new URL(request.url);
  
  // Redirect based on geolocation for Albanian users
  const country = context.geo?.country?.code;
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Albanian countries get Albanian by default
  if (['AL', 'XK', 'ME', 'MK'].includes(country || '') && 
      !url.pathname.startsWith('/sq') && 
      !url.pathname.startsWith('/en')) {
    logger.info('Geo-based redirect', { country, path: url.pathname });
    return Response.redirect(new URL('/sq' + url.pathname, url), 302);
  }
  
  // Add security headers
  const response = await context.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
  
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
import { logger } from "../../lib/logging/logger";

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
    logger.info('Search cache hit', { query, cached: true });
    return new Response(cached, {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
        'X-Cache': 'HIT'
      }
    });
  }
  
  logger.info('Search cache miss', { query, cached: false });
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
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
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
    
    // Add source maps for better error tracking
    if (process.env.NODE_ENV === 'production') {
      config.devtool = 'source-map';
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
import { logger } from '../logging/logger';

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
  // Enhanced logging for performance monitoring
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
};

// Performance monitoring
export const performanceMonitor = {
  trackApiCall: (endpoint: string, startTime: number) => {
    const duration = Date.now() - startTime;
    
    logger.info('API call performance', {
      endpoint,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
    
    // Alert on slow API calls
    if (duration > 2000) {
      logger.warn('Slow API call detected', {
        endpoint,
        duration: `${duration}ms`
      });
    }
  }
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
      
      - name: Security audit
        run: npm run security:audit
        
      - name: Run linting
        run: npm run lint
        
      - name: Run security linting
        run: npm run lint:security
      
      - name: Run type checking
        run: npm run type-check
        
      - name: Run tests
        run: npm run test
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/build@master
        with:
          publish-dir: .next
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          
      - name: Post-deployment health check
        run: |
          sleep 30 # Wait for deployment to be live
          curl -f https://brendalibrave.netlify.app/api/health || exit 1
          
      - name: Notify deployment success
        if: success()
        run: |
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"✅ Deployment successful to production"}' \
            ${{ secrets.SLACK_WEBHOOK_URL }}
            
      - name: Notify deployment failure
        if: failure()
        run: |
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"❌ Deployment failed - immediate attention required"}' \
            ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 🛡️ Security Configuration

### Enhanced Security for Netlify
```typescript
// lib/security/netlify-security.ts
import { logger } from '../logging/logger';

// Rate limiting using Netlify Edge
export const rateLimitConfig = {
  // API endpoints rate limits
  '/api/auth': { requests: 10, window: '1m' },
  '/api/orders': { requests: 20, window: '1m' },
  '/api/search': { requests: 100, window: '1m' },
  
  // Admin endpoints
  '/api/admin': { requests: 30, window: '1m' },
  
  // Health check endpoints (higher limits)
  '/api/health': { requests: 1000, window: '1m' }
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

// Security monitoring
export const securityMonitor = {
  logSecurityEvent: (event: string, details: any) => {
    logger.warn('Security event detected', {
      event,
      details,
      timestamp: new Date().toISOString(),
      severity: 'security'
    });
  },
  
  detectSuspiciousActivity: (request: Request) => {
    // Implementation for detecting suspicious patterns
    const suspiciousPatterns = [
      /\b(union|select|insert|delete|drop|create|alter)\b/i,
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/i
    ];
    
    const url = request.url;
    const body = request.body;
    
    // Check for SQL injection or XSS attempts
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(url) || (body && pattern.test(body.toString()))) {
        this.logSecurityEvent('suspicious_request', {
          url,
          pattern: pattern.toString(),
          userAgent: request.headers.get('user-agent')
        });
      }
    });
  }
};
```

## 📈 Analytics and Monitoring

### Netlify Analytics Integration
```typescript
// lib/analytics/netlify-analytics.ts
import { logger } from '../logging/logger';

// Custom events for Netlify Analytics
export const trackNetlifyEvent = (eventName: string, data: any) => {
  if (typeof window !== 'undefined' && window.netlifyIdentity) {
    // Track custom events
    window.netlifyAnalytics?.track(eventName, data);
    
    logger.info('Analytics event tracked', {
      event: eventName,
      data,
      timestamp: new Date().toISOString()
    });
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
          
          // Log slow page loads
          if (entry.duration > 3000) {
            logger.warn('Slow page load detected', {
              path: window.location.pathname,
              duration: entry.duration
            });
          }
        }
      }
    }).observe({ entryTypes: ['navigation'] });
  }
};

// Business metrics tracking
export const businessMetrics = {
  trackConversion: (type: string, value: number) => {
    trackNetlifyEvent('conversion', { type, value });
    
    logger.info('Conversion tracked', {
      type,
      value,
      timestamp: new Date().toISOString()
    });
  },
  
  trackUserEngagement: (action: string, duration: number) => {
    trackNetlifyEvent('engagement', { action, duration });
  }
};
```

## 🎯 Netlify-Specific Optimizations

### Edge Functions for Albanian Users
- **Geo-based Routing**: Automatic Albanian language detection
- **Search Optimization**: Edge-cached search results
- **Image Optimization**: Netlify's built-in image transformation
- **CDN Performance**: Global CDN with edge locations
- **Security Monitoring**: Edge-based threat detection
- **Performance Tracking**: Real-time performance monitoring

### Database Optimization
- **Development**: SQLite for fast local development and testing
- **Production**: Neon PostgreSQL optimized for Netlify Functions
- **Connection Pooling**: Optimized for serverless architecture
- **Query Caching**: Redis-like caching at the edge
- **Migration Strategy**: Automated SQLite → PostgreSQL deployment
- **Performance Monitoring**: Database query performance tracking
- **Health Checks**: Continuous database connectivity monitoring

### SEO Benefits
- **Fast Global Loading**: Netlify's CDN for international Albanian diaspora
- **Automatic HTTPS**: SSL certificates for better search ranking
- **Form Handling**: Built-in form processing for newsletters
- **Analytics**: Built-in Netlify Analytics + GA4 integration
- **Performance Monitoring**: Core Web Vitals tracking and optimization
- **Security**: Enhanced security headers for better search ranking

This comprehensive Netlify deployment strategy ensures Brënda Librave will have excellent performance, security, and reliability for Albanian users worldwide while maintaining cost-effectiveness, scalability, and enterprise-grade monitoring capabilities.