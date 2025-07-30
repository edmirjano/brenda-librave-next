# Brënda Librave ("Inside Books")

A modern, responsive full-stack web application designed as a library-inspired bookshop and blog, built entirely with **Next.js** for both frontend and backend functionality.

## 🎯 Project Vision

Brënda Librave creates a welcoming digital space that evokes the feeling of a cozy, modern library or bookstore. The platform combines commerce, community, and personalized discovery to provide a seamless experience for book lovers.

## 🏗️ Architecture

**Full-Stack Next.js Application**
- Single Next.js application handling both frontend and backend
- API routes (`/app/api/` or `/pages/api/`) for backend logic
- Server-side rendering (SSR) and static generation (SSG) for optimal performance
- Shared TypeScript types between frontend and backend components

## 🚀 Core Features

### 📚 Bookshop
- Browse and search physical books with advanced filtering
- Shopping cart and secure checkout process
- PayPal payment integration
- Order tracking and history
- Inventory management

### 📱 eBooks
- Digital book downloads with secure delivery
- Multiple format support (PDF, EPUB)
- S3-compatible storage for digital assets
- User library management
- Reading progress tracking

### ✍️ Blog
- Articles and book reviews
- Comment system with moderation
- Rich text editor for content creation
- SEO-optimized blog posts
- Social sharing capabilities

### 🤖 AI Book Recommender
- Personalized book recommendations
- Integration with open-source LLM (via API routes or external service)
- Recommendation engine based on reading history
- Direct purchase/download links from recommendations

### 👤 User Management
- Multi-platform authentication (Email, Google, Apple)
- JWT authentication with refresh tokens
- User profiles and reading preferences
- Reading history and wishlist
- Two-factor authentication (passkeys/WebAuthn)

### 📧 Newsletter & Notifications
- Email newsletter subscription system
- Push notifications for new books and blog posts
- Personalized content recommendations
- GDPR-compliant communication preferences

### 🎛️ Admin Dashboard
- Content management (books, blog posts)
- User management and analytics
- Order processing and inventory control
- Internal analytics and reporting
- Moderation tools

## 🛠️ Technical Stack

### Frontend & Backend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (exclusive - no custom CSS)
- **Authentication**: NextAuth.js with JWT
- **API**: Next.js API Routes

### Database & Storage
- **Production Database**: Neon PostgreSQL (serverless)
- **Development Database**: SQLite (local development)
- **Caching**: Redis (production) / In-memory (development)
- **File Storage**: Netlify Large Media or S3-compatible solution
- **Media**: WebP images, WebM videos

### Internationalization
- **Languages**: Albanian, English
- **Library**: next-intl
- **Localized content**: Full UI and content localization

### Deployment & Infrastructure
- **Platform**: Netlify (with Next.js support)
- **Database**: Neon PostgreSQL (serverless, auto-scaling)
- **Development**: SQLite for local development
- **Security**: Netlify Edge Functions + Cloudflare (DDoS protection, SSL)
- **CI/CD**: Netlify auto-deployment from Git
- **Monitoring**: Internal analytics (GDPR compliant)

### AI & Machine Learning
- **LLM**: Open-source model integration via API routes or external service
- **Implementation**: Server-side processing in Next.js API routes
- **Privacy**: Secure API communication and data handling

## 🔒 Security Features

### Data Protection
- **Encryption**: TLS 1.3 for data in transit
- **Database**: Encryption at rest for sensitive data
- **Authentication**: JWT with refresh token rotation
- **Authorization**: Role-based access control (RBAC)

### Best Practices
- Input validation and sanitization
- OWASP security guidelines compliance
- Regular security audits
- Secure coding practices
- CORS and CSP configuration

### Privacy Compliance
- **GDPR**: Full compliance with data protection regulations
- **Analytics**: Internal only, no third-party tracking
- **Consent**: Cookie and data processing consent management
- **Rights**: User data export and deletion capabilities

## 🌐 Domains & Environments

### Production
- **Frontend/Backend**: [brendalibrave.al](https://brendalibrave.al)
- **API Prefix**: `/api/` (same domain)

### Testing
- **Frontend/Backend**: [test.brendalibrave.al](https://test.brendalibrave.al)
- **API Prefix**: `/api/` (same domain)

## 📊 Analytics & Performance

### Internal Analytics
- User behavior tracking
- Sales and conversion metrics
- Content performance analysis
- Reading pattern insights
- GDPR-compliant data collection

### Performance Optimization
- Next.js Image component for optimized images
- Code splitting and lazy loading
- Redis caching for API responses
- CDN for static assets
- Database query optimization

## 🎨 Design Requirements

### UI/UX Principles
- **Styling**: Tailwind CSS exclusively (no custom CSS)
- **Theme**: Library/bookstore ambiance with modern aesthetics
- **Responsive**: Mobile-first, accessible design
- **Animations**: Smooth transitions using Tailwind and modern libraries
- **Accessibility**: WCAG 2.1 AA compliance

### Media Standards
- **Images**: WebP format exclusively
- **Videos**: WebM format exclusively
- **Optimization**: Next.js Image component for all images
- **Performance**: Lazy loading and progressive enhancement

## 🔄 Integration APIs

### Payment Processing
- **Primary**: PayPal integration
- **Features**: Recurring payments, refunds, currency support
- **Security**: PCI DSS compliance

### Authentication Providers
- **Email**: Custom JWT implementation
- **Google**: OAuth 2.0 integration
- **Apple**: Sign in with Apple
- **Two-Factor**: WebAuthn/passkeys support

### External Services
- **Email**: SMTP provider for newsletters
- **Storage**: S3-compatible service
- **CDN**: Cloudflare for asset delivery
- **Monitoring**: Application performance monitoring

## 📈 Scalability Considerations

### Current Architecture (Next.js Full-Stack)
- **Single Application**: Next.js handling frontend and backend
- **API Routes**: All backend logic in `/app/api/` directory
- **Database**: PostgreSQL (Neon) in production, SQLite in development
- **ORM**: Prisma for type-safe database operations
- **Caching**: Redis (production) / In-memory (development)
- **Deployment**: Netlify with automatic builds and deployments

### Future Scaling Path (When Needed)
- **Horizontal Scaling**: Netlify Functions for compute-heavy operations
- **Database Optimization**: Neon read replicas and connection pooling
- **Microservices**: Extract specific domains (if traffic justifies complexity)
- **CDN**: Netlify CDN + enhanced static asset delivery

## 🌍 Multilingual Support

### Supported Languages
- **Albanian**: Primary language for local market
- **English**: International accessibility
- **Implementation**: next-intl with dynamic locale switching

### Localization Features
- **Content**: All UI text and content
- **Currency**: Multi-currency support
- **Date/Time**: Locale-specific formatting
- **SEO**: Localized URLs and meta tags

## 📝 Content Management

### Book Management
- Comprehensive book metadata
- Multiple categories and tags
- Inventory tracking
- Pricing and promotions
- Related book suggestions

### Blog System
- Rich text content editor
- SEO optimization tools
- Comment moderation
- Social media integration
- Content scheduling

## 🎯 Success Metrics

### Business KPIs
- Monthly active users
- Conversion rates (visitor to customer)
- Average order value
- Customer lifetime value
- Content engagement rates

### Technical Metrics
- Page load performance
- API response times
- System uptime and reliability
- Error rates and resolution times
- Security incident tracking

---

**Project Status**: Ready for implementation
**License**: Proprietary
**Team**: Full-stack development team
**Timeline**: Phased implementation approach (see IMPLEMENTATION.md) 