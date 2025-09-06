# 🛠️ Brënda Librave - Technical Guidelines & Best Practices

> **Development Standards for Albanian Community Book Platform**

## 🎯 Overview

This document outlines the technical standards, coding practices, and architectural guidelines for **Brënda Librave**. All developers must follow these guidelines to ensure code quality, maintainability, and consistency across the platform.

---

## 🏗️ Architecture & Tech Stack

### **Core Technologies**
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Package Manager**: Yarn (latest version)
- **Database**: Prisma ORM with PostgreSQL (development & production)
- **Authentication**: NextAuth.js v4
- **Styling**: Tailwind CSS v4 with custom Albanian theme & unique custom font
- **Animations**: Framer Motion
- **State Management**: React built-in (useState, useReducer, Context) + Zustand + React Query
- **Forms**: React Hook Form
- **Media**: WebP images, WebM videos for optimal performance
- **Testing**: Jest + Playwright
- **Deployment**: Vercel/Netlify with PWA support
- **PWA**: Progressive Web App with offline capabilities

### **Project Structure**
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Auth route groups
│   ├── (admin)/           # Admin route groups
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── auth/             # Authentication components
│   ├── books/            # Book-related components
│   ├── admin/            # Admin components
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── auth/             # Authentication logic
│   ├── db/               # Database utilities
│   ├── validations/      # Zod schemas
│   └── utils.ts          # Common utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── __tests__/            # Test files
```

---

## 🏗️ Clear Layer & Code Organization

### **Architectural Layers**

#### **1. Presentation Layer (Components)**
```typescript
// ✅ Good: Clear component hierarchy
src/components/
├── ui/                    # Base UI components (reusable)
│   ├── GlassCard.tsx     # Glass morphism card
│   ├── LiquidButton.tsx  # Animated button
│   ├── LoadingSpinner.tsx
│   └── index.ts          # Barrel exports
├── layout/               # Layout components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── ConditionalLayout.tsx
├── books/                # Domain-specific components
│   ├── BookCard.tsx
│   ├── BookDetail.tsx
│   ├── BookList.tsx
│   └── index.ts
├── auth/                 # Authentication components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── index.ts
└── admin/                # Admin-specific components
    ├── AdminSidebar.tsx
    ├── AdminDashboard.tsx
    └── index.ts
```

#### **2. Business Logic Layer (Lib)**
```typescript
// ✅ Good: Organized business logic
src/lib/
├── auth/                 # Authentication logic
│   ├── config.ts         # NextAuth configuration
│   ├── middleware.ts     # Auth middleware
│   └── utils.ts          # Auth utilities
├── db/                   # Database layer
│   ├── index.ts          # Prisma client
│   ├── queries/          # Database queries
│   │   ├── books.ts
│   │   ├── users.ts
│   │   └── orders.ts
│   └── mutations/        # Database mutations
│       ├── books.ts
│       ├── users.ts
│       └── orders.ts
├── validations/          # Zod schemas
│   ├── auth.ts
│   ├── books.ts
│   ├── orders.ts
│   └── index.ts
├── services/             # External services
│   ├── email.ts
│   ├── payment.ts
│   └── storage.ts
└── utils.ts              # Common utilities
```

#### **3. Data Access Layer (API Routes)**
```typescript
// ✅ Good: RESTful API structure
src/app/api/
├── auth/                 # Authentication endpoints
│   ├── login/route.ts
│   ├── register/route.ts
│   └── logout/route.ts
├── books/                # Book endpoints
│   ├── route.ts          # GET /api/books
│   ├── [id]/route.ts     # GET /api/books/[id]
│   └── search/route.ts   # GET /api/books/search
├── admin/                # Admin endpoints
│   ├── users/route.ts
│   ├── books/route.ts
│   └── analytics/route.ts
└── health/route.ts       # Health check
```

### **Component Organization Patterns**

#### **Barrel Exports**
```typescript
// ✅ Good: components/ui/index.ts
export { GlassCard } from './GlassCard';
export { LiquidButton } from './LiquidButton';
export { LoadingSpinner } from './LoadingSpinner';

// ✅ Good: components/books/index.ts
export { BookCard } from './BookCard';
export { BookDetail } from './BookDetail';
export { BookList } from './BookList';
export { FeaturedBooks } from './FeaturedBooks';
```

#### **Component Composition**
- Use composition over inheritance
- Create reusable, composable components
- Implement proper prop interfaces with optional parameters
- Use consistent prop naming conventions

### **File Naming Conventions**

#### **File Naming**
- **Components**: PascalCase (BookCard.tsx, AdminSidebar.tsx)
- **Utilities**: camelCase (authUtils.ts, bookQueries.ts)
- **Types**: Descriptive names (auth.ts, book.ts, cart.ts)
- **Use descriptive names** that clearly indicate purpose

### **Import Organization**

#### **Import Order**
1. React and Next.js imports
2. Third-party libraries
3. Internal components (absolute imports)
4. Internal utilities and types
5. Relative imports

#### **Type Imports**
- Use `import type` for type-only imports
- Separate type imports for better tree-shaking
- Use consistent import patterns across the project

### **Code Organization Principles**

#### **Single Responsibility**
- Each component should have one clear responsibility
- Separate concerns (display, logic, data fetching)
- Keep components focused and maintainable

#### **Separation of Concerns**
- Separate data fetching from presentation
- Use custom hooks for business logic
- Keep components pure and predictable

#### **Dependency Injection**
- Inject dependencies for better testability
- Use interfaces for service contracts
- Implement proper abstraction layers

### **Error Handling Organization**

#### **Centralized Error Handling**
- Create custom error classes (AppError, ValidationError, NotFoundError)
- Use consistent error codes and status codes
- Implement proper error logging and monitoring

#### **Error Boundaries**
- Implement React error boundaries for component errors
- Provide fallback UI for error states
- Log errors for debugging and monitoring

### **Configuration Organization**

#### **Environment Configuration**
- Centralize configuration in `lib/config/index.ts`
- Validate required environment variables at startup
- Use TypeScript for configuration type safety
- Separate public and private environment variables

### **Code Organization Checklist**

#### **Before Committing**
- [ ] **File structure** follows the established pattern
- [ ] **Import order** is consistent and organized
- [ ] **Component responsibilities** are clear and single-purpose
- [ ] **Type definitions** are properly organized
- [ ] **Error handling** is implemented consistently
- [ ] **Configuration** is centralized and validated
- [ ] **Dependencies** are properly injected
- [ ] **Code is DRY** (Don't Repeat Yourself)
- [ ] **Naming conventions** are followed consistently

---

## 📝 Coding Standards

### **TypeScript Guidelines**

#### **Strict Configuration**
- Use TypeScript strict mode
- Enable `noUncheckedIndexedAccess` and `noImplicitReturns`
- Require explicit return types for functions

#### **Type Definitions**
- Use `interface` for object shapes
- Use `type` aliases for unions
- Always use type imports: `import type { Book } from '@/types/book'`

#### **Error Handling**
- Always handle errors with proper types
- Use try-catch blocks for async operations
- Return null or throw errors consistently

### **React Component Standards**

#### **Component Structure**
- Use `'use client'` only when necessary (state, event handlers, browser APIs)
- Prefer server components for static content and data fetching
- Use proper TypeScript interfaces for all props
- Implement proper error boundaries for complex components
- Use consistent naming: PascalCase for components, camelCase for props

#### **Component Patterns**
- Keep components small and focused on single responsibility
- Use composition over inheritance
- Implement proper loading and error states
- Use consistent prop naming conventions

### **Styling Guidelines**

#### **Tailwind CSS Standards**
- Use semantic class combinations with `cn()` utility
- Follow Albanian color palette consistently
- Use responsive design patterns (mobile-first)
- Implement proper hover and focus states

#### **Glass Card Variants**
- Use consistent variants: `default`, `frosted`, `crystal`, `bubble`
- Apply `morphing` and `glowEffect` props appropriately
- Maintain consistent spacing and typography

### **API Route Standards**

#### **Route Structure**
- Follow RESTful API conventions
- Use proper HTTP status codes (200, 400, 404, 500)
- Implement consistent error responses
- Add logging for important operations

#### **API Best Practices**
- Always validate input using Zod schemas
- Use proper authentication and authorization
- Implement rate limiting for public endpoints
- Use TypeScript for request/response types
- Handle errors gracefully with proper status codes

---

## 🔒 Security Guidelines

### **Authentication & Authorization**
- Use NextAuth.js for session management
- Implement role-based access control (USER, ADMIN)
- Protect sensitive routes with middleware
- Validate user permissions on every request

### **Input Validation**
- Use Zod schemas for all input validation
- Validate both request body and query parameters
- Return proper error messages for validation failures
- Sanitize user input before processing

### **Security Headers**
- Implement security headers (XSS, CSRF, etc.)
- Use HTTPS in production
- Validate environment variables
- Implement rate limiting on API endpoints

---

## 🔍 Strict Linting Rules

### **ESLint Configuration**
- **TypeScript strict rules**: No `any`, unused vars, floating promises
- **React strict rules**: Hooks rules, no array index keys, no unstable components
- **Security rules**: Object injection, unsafe regex, eval detection
- **Import organization**: Consistent import sorting and organization
- **Code quality**: No console, debugger, eval, modern JS practices
- **Unicorn rules**: Modern JavaScript best practices

### **Linting Requirements**
- **All ESLint rules must pass** before commit
- **No warnings allowed** in production code
- **TypeScript strict mode** enforced
- **Import organization** must be consistent
- **Security rules** are non-negotiable

---

## 📱 Performance Guidelines

### **Next.js Optimization**
```typescript
// ✅ Good: Use proper loading states
import { Suspense } from 'react';

export default function BooksPage() {
  return (
    <div>
      <Suspense fallback={<BookListSkeleton />}>
        <BookList />
      </Suspense>
    </div>
  );
}

// ✅ Good: Optimize images
import Image from 'next/image';

<Image
  src="/book-cover.jpg"
  alt="Book cover"
  width={300}
  height={400}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### **Database Optimization**
```typescript
// ✅ Good: Use proper Prisma queries
const books = await prisma.book.findMany({
  where: { active: true },
  include: {
    category: true,
    tags: { include: { tag: true } }
  },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: page * 20
});

// ✅ Good: Use database indexes
// In schema.prisma
model Book {
  // ... fields
  @@index([active])
  @@index([categoryId])
  @@index([featured])
}
```

---

## 🎬 Animation Guidelines

### **Framer Motion Standards**
- Use Framer Motion for all animations
- Implement consistent animation timing and easing
- Use Albanian cultural elements in animations
- Optimize animations for mobile performance

### **Animation Patterns**
- **Page Transitions**: Smooth fade and slide effects
- **Component Animations**: Hover states, loading states, micro-interactions
- **Liquid Glass Effects**: Morphing, glowing, floating animations
- **Cultural Animations**: Albanian flag colors, traditional patterns

### **Performance Considerations**
- Use `transform` and `opacity` for smooth animations
- Implement `will-change` for animated elements
- Use `useReducedMotion` for accessibility
- Optimize animation duration (200-500ms for interactions)

### **Albanian Content Standards**
- All content in Albanian language only
- Use proper Albanian typography and fonts
- Implement Albanian cultural design elements
- Format currency in Albanian Lek (ALL) and Euro (EUR)

---

## 🔄 State Management Guidelines

### **React Built-in State Management**
- **useState**: For simple component state
- **useReducer**: For complex state logic with multiple sub-values
- **Context API**: For sharing state across component tree
- **Custom Hooks**: For reusable stateful logic

### **State Management Patterns**
- **Local State**: Use `useState` for component-specific state
- **Shared State**: Use Context API for state shared between components
- **Complex State**: Use `useReducer` for state with complex logic
- **Server State**: Use React Query/SWR for server state management

### **External State Management**
- **Zustand**: For global state when Context API is insufficient
- **React Query**: For server state, caching, and synchronization
- **Form State**: Use React Hook Form for form management

### **State Management Best Practices**
- Keep state as close to where it's used as possible
- Use composition over prop drilling
- Implement proper state normalization for complex data
- Use immutable update patterns
- Implement proper error boundaries for state errors

---

## 📱 PWA (Progressive Web App) Guidelines

### **PWA Core Requirements**
- **Service Worker**: For offline functionality and caching
- **Web App Manifest**: For installability and app-like experience
- **HTTPS**: Required for PWA features
- **Responsive Design**: Mobile-first approach
- **Fast Loading**: Core Web Vitals optimization

### **PWA Implementation**
- **Next.js PWA Plugin**: Use `next-pwa` for automatic service worker generation
- **Manifest Configuration**: Customize app metadata, icons, and theme
- **Offline Strategy**: Cache critical resources and API responses
- **Push Notifications**: For book recommendations and community updates
- **Background Sync**: For offline actions when connection is restored

### **PWA Features for Book Platform**
- **Offline Reading**: Cache book content for offline access
- **Offline Reviews**: Allow users to write reviews offline
- **Push Notifications**: Book recommendations, community updates
- **Install Prompt**: Encourage users to install the app
- **App-like Navigation**: Smooth transitions and native feel

### **PWA Performance**
- **Lazy Loading**: Load content as needed
- **Image Optimization**: Use Next.js Image component with PWA caching
- **Code Splitting**: Reduce initial bundle size
- **Preloading**: Preload critical resources
- **Caching Strategy**: Implement smart caching for different content types

### **PWA Best Practices**
- **App Shell Model**: Cache the app shell for instant loading
- **Network-First Strategy**: For dynamic content (reviews, discussions)
- **Cache-First Strategy**: For static content (book covers, images)
- **Stale-While-Revalidate**: For frequently updated content
- **Graceful Degradation**: Ensure functionality without PWA features

---

## 🖼️ Media Optimization Guidelines

### **Image Standards**
- **Format**: WebP only for all images
- **Quality**: 80-90% for photos, 90-95% for graphics
- **Responsive Images**: Multiple sizes for different screen densities
- **Lazy Loading**: Implement for all images below the fold
- **Alt Text**: Descriptive alt text for accessibility

### **Video Standards**
- **Format**: WebM only for all videos
- **Compression**: Optimize for web delivery
- **Autoplay**: Disabled by default, user-controlled
- **Subtitles**: Include Albanian subtitles for accessibility
- **Thumbnails**: WebP thumbnails for video previews

### **Next.js Image Component**
```tsx
import Image from 'next/image'

// Always use Next.js Image component
<Image
  src="/images/book-cover.webp"
  alt="Book cover description"
  width={300}
  height={400}
  priority={false} // Only true for above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### **Media Optimization Best Practices**
- **Compression**: Use tools like `sharp` for server-side optimization
- **CDN**: Serve media through CDN for global performance
- **Caching**: Implement proper cache headers for media files
- **Progressive Loading**: Load low-quality placeholders first
- **Format Detection**: Serve WebP/WebM with fallbacks for older browsers

### **Media File Organization**
```
public/
├── images/
│   ├── books/           # Book covers and related images
│   ├── authors/         # Author photos
│   ├── blog/           # Blog post images
│   └── ui/             # UI elements and icons
├── videos/
│   ├── book-trailers/  # Book promotional videos
│   ├── author-talks/   # Author interview videos
│   └── tutorials/      # How-to videos
└── icons/              # App icons and favicons
```

### **Performance Considerations**
- **File Size**: Keep images under 500KB, videos under 5MB
- **Dimensions**: Serve appropriately sized images for each use case
- **Preloading**: Preload critical images and videos
- **Lazy Loading**: Implement intersection observer for lazy loading
- **WebP Fallback**: Provide JPEG fallback for unsupported browsers

---

## 🗄️ Database & Docker Guidelines

### **Database Configuration**
- **Database**: PostgreSQL only (development & production)
- **ORM**: Prisma for type-safe database operations
- **Development**: Local PostgreSQL with Docker
- **Production**: Managed PostgreSQL service
- **Migrations**: Version-controlled schema changes

### **Docker Development Setup**
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: brenda_librave_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### **Database Best Practices**
- **Environment Variables**: Use `.env.local` for database connection
- **Connection Pooling**: Configure Prisma connection pooling
- **Migrations**: Always use Prisma migrations for schema changes
- **Seeding**: Use Prisma seed for development data
- **Backups**: Regular database backups in production

### **Prisma Configuration**
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Connection pooling for production
// DATABASE_URL="postgresql://user:password@localhost:5432/db?connection_limit=5&pool_timeout=20"
```

### **Development Workflow**
```bash
# Start development environment
yarn docker:up

# Run database migrations
yarn db:migrate

# Seed development data
yarn db:seed

# Generate Prisma client
yarn db:generate

# Reset database
yarn db:reset
```

### **Database Security**
- **Connection Security**: Use SSL connections in production
- **Environment Variables**: Never commit database credentials
- **Access Control**: Limit database user permissions
- **Backup Encryption**: Encrypt database backups
- **Audit Logging**: Log database access and changes

---

## 🔤 Typography & Accessibility Guidelines

### **Custom Font Strategy**
- **Primary Font**: Unique custom font for brand identity
- **Fallback Fonts**: System fonts as fallbacks
- **Font Loading**: Optimize font loading with `font-display: swap`
- **Font Weights**: Multiple weights for hierarchy
- **Albanian Support**: Full Albanian character set support

### **Font Implementation**
```css
/* Custom font loading */
@font-face {
  font-family: 'BrendaLibrave';
  src: url('/fonts/brenda-librave-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'BrendaLibrave';
  src: url('/fonts/brenda-librave-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### **Typography Hierarchy**
- **Headings**: Custom font with proper Albanian typography
- **Body Text**: Readable font with good Albanian character support
- **UI Elements**: Consistent font usage across components
- **Reading Mode**: Optimized typography for long-form content

### **Browser Reader Capabilities**
- **Reading Mode**: Implement browser reader-friendly content
- **Semantic HTML**: Proper heading structure (h1, h2, h3, etc.)
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus Management**: Keyboard navigation support
- **Reading Progress**: Visual reading progress indicators

### **Reading Experience Features**
- **Text-to-Speech**: Browser reader integration
- **Reading Mode**: Distraction-free reading interface
- **Font Size Control**: User-adjustable text size
- **Line Height**: Optimized for readability
- **Reading Time**: Estimated reading time display

### **Accessibility Standards**
- **WCAG 2.1 AA**: Compliance with accessibility guidelines
- **Screen Reader**: Full screen reader compatibility
- **Keyboard Navigation**: Complete keyboard accessibility
- **Color Contrast**: Sufficient contrast ratios
- **Focus Indicators**: Clear focus states

### **Reading Mode Implementation**
```tsx
// Reading mode component
const ReadingMode = ({ content, title }) => {
  return (
    <article className="reading-mode">
      <header>
        <h1>{title}</h1>
        <div className="reading-meta">
          <span>Koha e leximit: {readingTime} min</span>
        </div>
      </header>
      <div className="reading-content">
        {content}
      </div>
    </article>
  );
};
```

### **Font Performance**
- **Preloading**: Preload critical font files
- **Subsetting**: Include only necessary characters
- **Compression**: Use WOFF2 format for best compression
- **Caching**: Implement proper font caching headers
- **Fallbacks**: Graceful degradation for font loading failures

---

## 🚀 Deployment & DevOps

### **Environment Configuration**
```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://brendalibrave.com"
NODE_ENV="production"
```

### **Quality Gates**
```bash
# All checks must pass before deployment
yarn quality-gate

# Individual checks
yarn lint          # ESLint
yarn type-check    # TypeScript
yarn format:check  # Prettier formatting
```

### **Performance Monitoring**
- **Core Web Vitals** monitoring
- **Error tracking** with Sentry
- **Database performance** monitoring
- **API response times** tracking

---

## 📋 Code Review Checklist

### **Before Submitting PR**
- [ ] **ESLint rules** are satisfied (no warnings/errors)
- [ ] **TypeScript strict mode** compliance
- [ ] **Code organization** follows established patterns
- [ ] **Import order** is consistent and organized
- [ ] **Component responsibilities** are clear and single-purpose
- [ ] **Error handling** is implemented consistently
- [ ] **Security considerations** addressed
- [ ] **Performance optimizations** applied
- [ ] **Accessibility features** included
- [ ] **Animations** are optimized and performant
- [ ] **Albanian content** is properly formatted
- [ ] **PWA features** are properly implemented
- [ ] **Service worker caching** strategy is appropriate
- [ ] **Offline functionality** is tested
- [ ] **Media optimization** follows WebP/WebM standards
- [ ] **Image lazy loading** is implemented
- [ ] **Alt text** is provided for all images
- [ ] **Database migrations** are properly structured
- [ ] **Environment variables** are properly configured
- [ ] **Custom font** is properly implemented
- [ ] **Accessibility** standards are met
- [ ] **Reading mode** functionality is working
- [ ] **Documentation** updated

### **Review Criteria**
- **Code Quality**: Clean, readable, maintainable
- **Type Safety**: Proper TypeScript usage
- **Linting**: All ESLint rules pass
- **Organization**: Clear layer separation and file structure
- **Security**: Input validation, authentication
- **Performance**: Optimized queries, lazy loading
- **Accessibility**: ARIA labels, keyboard navigation
- **Animations**: Smooth, performant, culturally appropriate
- **Albanian Content**: Proper language, typography, and cultural elements
- **Documentation**: Clear comments and README updates

---

## 🎨 Design System

### **Albanian Color Palette**
```css
/* Albanian flag colors */
--albanian-red: #e41e20;
--albanian-red-dark: #c41e3a;
--mountain-gray: #6b7280;
--adriatic-blue: #0ea5e9;
--olive-green: #84cc16;
--golden-eagle: #f59e0b;
```

### **Typography**
```css
/* Literary content */
font-family: 'Crimson Pro', Georgia, serif;

/* Interface elements */
font-family: 'Outfit', Inter, system-ui, sans-serif;
```

### **Component Variants**
- **GlassCard**: default, frosted, crystal, bubble
- **LiquidButton**: albanian, liquid, ghost
- **Animations**: liquid-morph, float, pulse-soft, glow

---

## 🔧 Development Workflow

### **Git Workflow**
```bash
# Feature development
git checkout -b feature/book-recommendations
git add .
git commit -m "feat: add AI book recommendations"
git push origin feature/book-recommendations

# Create PR with proper description
```

### **Package Management**
- **Use Yarn (latest version)** for all package management
- **Lock dependencies** with `yarn.lock` file
- **Use Yarn workspaces** if needed for monorepo structure
- **Prefer Yarn over npm** for consistency and performance

### **Commit Message Format**
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

---

**Remember**: These guidelines ensure consistent, maintainable, and secure code across the Brënda Librave platform. Always prioritize code quality, user experience, and Albanian cultural authenticity.

---

*"Kod i pastër për një platformë të pastër!"*  
*"Clean code for a clean platform!"*
