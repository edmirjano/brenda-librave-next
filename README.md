# 📚 Brënda Librave - Albanian Bookshop

> **"Inside Books"** - Your Albanian online bookstore for physical and digital
> books

A modern, mobile-first web application built with Next.js 14+ specifically
designed for Albanian book lovers worldwide. Features Albanian Lek pricing,
bilingual support (Albanian/English), and Apple Liquid Glass design aesthetics.

## 🎯 Project Overview

**Brënda Librave** is a comprehensive Albanian bookshop platform that combines:

- 📚 Physical and digital book sales
- 💰 Albanian Lek (ALL) and Euro (EUR) currency support
- 🌍 Albanian/English internationalization
- 📱 Mobile-first design with Apple Liquid Glass aesthetics
- 🛒 Complete e-commerce functionality
- ✍️ Blog system with user-generated content
- 👥 Community features and book discussions
- 🎛️ Comprehensive admin dashboard

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd brenda-librave-next
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example file (when available)
   cp .env.example .env.local

   # Or create .env.local manually with:
   echo 'DATABASE_URL="file:./dev.db"' > .env.local
   echo 'NEXTAUTH_SECRET="your-development-secret-key"' >> .env.local
   echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env.local
   echo 'NODE_ENV="development"' >> .env.local
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to SQLite database
   npm run db:push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser** Navigate to
   [http://localhost:3000](http://localhost:3000)

You should see the Albanian welcome page: "Mirë se vini në Brënda Librave" 🇦🇱

## 🧪 Testing

This project follows strict quality standards with comprehensive testing:

### Run Tests

```bash
# Unit tests with Jest
npm test

# Unit tests with coverage
npm run test:coverage

# End-to-end tests with Playwright
npm run test:e2e

# All quality checks
npm run quality-gate
```

### Test Requirements

- ✅ **80% test coverage** minimum
- ✅ **All tests must pass** before deployment
- ✅ **ESLint security rules** enforced
- ✅ **TypeScript strict mode** enabled

### Example Test Commands

```bash
# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- health.test.ts

# Generate coverage report
npm run test:coverage

# Run E2E tests on specific browser
npx playwright test --project=chromium
```

## 🛠️ Development

### Code Quality

```bash
# Lint and fix code
npm run lint:fix

# Type checking
npm run type-check

# Run all quality checks
npm run quality-gate
```

### Database Operations

```bash
# View database in browser
npm run db:studio

# Reset database
npm run db:push --force-reset

# Create migration
npm run db:migrate
```

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
npm run type-check   # TypeScript validation
```

## 📁 Project Structure

```
brenda-librave-next/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── api/            # API routes
│   │   │   └── health/     # Health check endpoint
│   │   ├── globals.css     # Global styles with Albanian colors
│   │   ├── layout.tsx      # Root layout with Albanian metadata
│   │   └── page.tsx        # Homepage with Albanian content
│   ├── components/         # Reusable React components
│   ├── lib/               # Utility libraries
│   │   └── logging/       # Pino structured logging
│   ├── types/             # TypeScript type definitions
│   └── __tests__/         # Unit and integration tests
├── e2e/                   # Playwright end-to-end tests
├── prisma/                # Database schema and migrations
│   └── schema.prisma      # Prisma schema with Albanian-specific models
├── docs/                  # Project documentation
├── .eslintrc.json         # ESLint configuration with security rules
├── jest.config.js         # Jest testing configuration
├── playwright.config.ts   # Playwright E2E testing
├── tailwind.config.ts     # Tailwind with Albanian color palette
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

### Albanian Cultural Colors

```css
--albanian-red: #e41e20 /* Albanian flag red */ --albanian-red-dark: #c41e3a
  /* Darker red variant */ --mountain-gray: #6b7280 /* Albanian mountains */
  --adriatic-blue: #0ea5e9 /* Adriatic Sea */ --olive-green: #84cc16
  /* Albanian olive trees */ --golden-eagle: #f59e0b /* Golden eagle */;
```

### Mobile-First Approach

- 📱 **Primary target**: Mobile users (Albanian diaspora)
- 💻 **Progressive enhancement**: Desktop features
- ⚡ **Performance**: < 3 second load times
- ♿ **Accessibility**: WCAG 2.1 AA compliance

## 💰 Currency System

- **Primary**: Albanian Lek (ALL) - `1.500 L`
- **Secondary**: Euro (EUR) - `€10.50`
- **Conversion**: Admin-configurable exchange rates
- **Display**: Shows both currencies with preference

## 🌍 Internationalization

- **Albanian (sq)**: Primary language - default
- **English (en)**: Secondary language for diaspora
- **URLs**: `/sq/libra/...` and `/en/books/...`
- **Content**: Fully localized including currency

## 📊 Monitoring & Error Tracking

### Health Check

```bash
# Check application health
curl http://localhost:3000/api/health
```

Returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "brenda-librave",
  "environment": "development",
  "uptime": 1234.56,
  "memory": {
    "used": 45,
    "total": 128
  }
}
```

### Error Tracking

- **Sentry**: Configured for error tracking
- **Pino**: Structured logging
- **Development**: Pretty-printed logs
- **Production**: JSON structured logs

## 🔒 Security

### Security Features

- ✅ **Security headers** (XSS, CSRF, etc.)
- ✅ **Input validation** with Zod schemas
- ✅ **Rate limiting** on API endpoints
- ✅ **ESLint security rules** enforced
- ✅ **Environment variable** validation

### Security Testing

```bash
# Security audit
npm audit

# Security linting
npm run lint -- --ext .ts,.tsx
```

## 🚀 Deployment

### Phase 1 Deployment Checklist

- ✅ Health check endpoint working
- ✅ All tests passing (80%+ coverage)
- ✅ ESLint security rules passing
- ✅ TypeScript compilation successful
- ✅ Database connection established
- ✅ Error tracking configured
- ✅ Mobile responsiveness verified

### Production Environment

- **Platform**: Vercel or Netlify with Next.js optimization
- **Database**: PostgreSQL (Neon, Railway, or PlanetScale)
- **Storage**: Vercel Blob or S3-compatible for eBooks
- **CDN**: Global CDN for Albanian diaspora
- **Monitoring**: Comprehensive health checks

## 📋 Phase Development

This is **Phase 1** of a multi-phase development approach:

### ✅ Phase 1: Foundation (CURRENT)

- Next.js 14+ setup with TypeScript
- Database foundation with Prisma
- Health monitoring and error tracking
- Comprehensive testing setup
- Security and code quality standards

### 🔄 Upcoming Phases

- **Phase 2**: Authentication & User Management
- **Phase 3**: Book Catalog System
- **Phase 4**: Shopping Cart & Checkout
- **Phase 5**: Admin Dashboard
- **Phase 6**: Blog System
- **Phase 7**: Community Features
- **Phase 8**: AI Recommendations

## 📞 Support

### Development Support

- **Health Check**: [/api/health](http://localhost:3000/api/health)
- **Documentation**: See `/docs` folder
- **Database GUI**: `npm run db:studio`

### Troubleshooting

**Database issues:**

```bash
# Reset database
npm run db:push --force-reset
npm run db:generate
```

**Test failures:**

```bash
# Run tests with verbose output
npm run test -- --verbose
npm run test:coverage
```

**TypeScript errors:**

```bash
# Check types
npm run type-check
```

## 🎯 Success Criteria - Phase 1

- ✅ **Working Next.js application** that starts without errors
- ✅ **Database connection** established with Prisma
- ✅ **Health check endpoint** at `/api/health`
- ✅ **Error tracking** configured with Sentry
- ✅ **Comprehensive testing** setup (Jest + Playwright)
- ✅ **Code quality** enforced (ESLint + TypeScript strict)
- ✅ **80% test coverage** achieved and maintained
- ✅ **Security measures** implemented and tested
- ✅ **Albanian content** and cultural design elements
- ✅ **Mobile-first** responsive design

## 🇦🇱 Albanian Market Focus

This application is specifically designed for:

- **🏠 Albanian users** in Albania and Kosovo
- **🌍 Albanian diaspora** worldwide
- **📚 Albanian literature** enthusiasts
- **💰 Albanian Lek** as primary currency
- **📱 Mobile-first** usage patterns

---

**Mirë se vini në Brënda Librave!** 📚🇦🇱

_Welcome to the foundation of your Albanian digital bookstore._
