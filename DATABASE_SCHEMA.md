# Brënda Librave - Database Schema

This document contains the complete PostgreSQL database schema for Brënda Librave using Prisma ORM.

## 🗄️ Complete Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Authentication Models (NextAuth.js compatible)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// User Management
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  password        String?   // nullable for social auth
  name            String
  role            Role      @default(USER)
  language        Language  @default(SQ)
  newsletter      Boolean   @default(false)
  emailVerified   DateTime?
  image           String?
  
  // Relations
  accounts        Account[]
  sessions        Session[]
  orders          Order[]
  cartItems       CartItem[]
  readingHistory  ReadingHistory[]
  blogPosts       BlogPost[]
  comments        Comment[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}

enum Language {
  SQ
  EN
}

// Book Catalog
model Book {
  id              String    @id @default(cuid())
  title           String
  author          String
  description     String    @db.Text
  isbn            String?   @unique
  categoryId      String
  price           Decimal?  @db.Decimal(10, 2)
  digitalPrice    Decimal?  @db.Decimal(10, 2)
  inventory       Int       @default(0)
  hasDigital      Boolean   @default(false)
  digitalFileUrl  String?   // S3 URL for digital book
  coverImage      String?   // WebP format
  images          String[]  // Additional images
  publishedDate   DateTime?
  pageCount       Int?
  language        Language  @default(SQ)
  featured        Boolean   @default(false)
  active          Boolean   @default(true)
  
  // SEO fields
  slug            String    @unique
  metaTitle       String?
  metaDescription String?
  
  // Relations
  category        Category  @relation(fields: [categoryId], references: [id])
  tags            BookTag[]
  cartItems       CartItem[]
  orderItems      OrderItem[]
  readingHistory  ReadingHistory[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([featured])
  @@index([active])
  @@index([categoryId])
}

model Category {
  id          String  @id @default(cuid())
  name        String
  nameEn      String?
  slug        String  @unique
  description String?
  active      Boolean @default(true)
  sortOrder   Int     @default(0)
  
  books       Book[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([active, sortOrder])
}

model Tag {
  id      String    @id @default(cuid())
  name    String    @unique
  nameEn  String?
  
  books   BookTag[]
  
  createdAt DateTime @default(now())
}

model BookTag {
  bookId  String
  tagId   String
  
  book    Book @relation(fields: [bookId], references: [id], onDelete: Cascade)
  tag     Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([bookId, tagId])
}

// E-commerce
model CartItem {
  id       String    @id @default(cuid())
  userId   String
  bookId   String
  quantity Int       @default(1)
  isDigital Boolean  @default(false)
  
  user     User @relation(fields: [userId], references: [id], onDelete: Cascade)
  book     Book @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, bookId, isDigital])
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  orderNumber     String      @unique
  status          OrderStatus @default(PENDING)
  totalAmount     Decimal     @db.Decimal(10, 2)
  currency        String      @default("EUR")
  
  // Shipping information
  shippingName    String
  shippingEmail   String
  shippingAddress String
  shippingCity    String
  shippingZip     String
  shippingCountry String
  
  // Payment information
  paymentMethod   PaymentMethod
  paymentId       String?     // PayPal transaction ID
  paidAt          DateTime?
  
  // Relations
  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([userId])
  @@index([status])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  bookId    String
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  isDigital Boolean @default(false)
  
  order     Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  book      Book  @relation(fields: [bookId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@index([orderId])
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentMethod {
  PAYPAL
  STRIPE
  BANK_TRANSFER
}

// Blog System
model BlogPost {
  id              String    @id @default(cuid())
  title           String
  slug            String    @unique
  content         String    @db.Text
  excerpt         String?
  authorId        String
  categoryId      String?
  featuredImage   String?
  published       Boolean   @default(false)
  publishedAt     DateTime?
  language        Language  @default(SQ)
  
  // SEO fields
  metaTitle       String?
  metaDescription String?
  
  // Relations
  author          User      @relation(fields: [authorId], references: [id])
  category        BlogCategory? @relation(fields: [categoryId], references: [id])
  tags            BlogPostTag[]
  comments        Comment[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([published])
  @@index([authorId])
  @@index([categoryId])
}

model BlogCategory {
  id          String     @id @default(cuid())
  name        String
  nameEn      String?
  slug        String     @unique
  description String?
  active      Boolean    @default(true)
  
  posts       BlogPost[]
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model BlogTag {
  id      String        @id @default(cuid())
  name    String        @unique
  nameEn  String?
  
  posts   BlogPostTag[]
  
  createdAt DateTime @default(now())
}

model BlogPostTag {
  postId String
  tagId  String
  
  post   BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    BlogTag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
}

model Comment {
  id        String        @id @default(cuid())
  content   String        @db.Text
  authorId  String
  postId    String
  parentId  String?       // For threaded comments
  status    CommentStatus @default(PENDING)
  
  author    User      @relation(fields: [authorId], references: [id])
  post      BlogPost  @relation(fields: [postId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([postId])
  @@index([status])
}

enum CommentStatus {
  PENDING
  APPROVED
  REJECTED
  SPAM
}

// User Activity & Recommendations
model ReadingHistory {
  id        String   @id @default(cuid())
  userId    String
  bookId    String
  startedAt DateTime @default(now())
  progress  Int      @default(0) // Percentage 0-100
  completed Boolean  @default(false)
  rating    Int?     // 1-5 stars
  
  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)
  book      Book @relation(fields: [bookId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, bookId])
  @@index([userId])
}

// Analytics & Tracking
model AnalyticsEvent {
  id         String   @id @default(cuid())
  userId     String?
  sessionId  String
  event      String
  properties Json?
  timestamp  DateTime @default(now())
  
  @@index([event])
  @@index([timestamp])
}

// Newsletter & Communication
model NewsletterSubscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  language  Language @default(SQ)
  active    Boolean  @default(true)
  tags      String[] // Subscription preferences
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([active])
}

// Admin & Settings
model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String @db.Text
  
  updatedAt DateTime @updatedAt
}
```

## 🔧 Database Setup Commands

### Development Setup
```bash
# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (if seed script exists)
npx prisma db seed
```

### Production Setup
```bash
# Deploy migrations to production
npx prisma migrate deploy

# Generate client for production
npx prisma generate
```

## 📊 Database Indexing Strategy

### Performance Indexes
- **Books**: `featured`, `active`, `categoryId` for fast filtering
- **Orders**: `userId`, `status` for user orders and admin management
- **Blog Posts**: `published`, `authorId`, `categoryId` for content queries
- **Analytics**: `event`, `timestamp` for performance tracking

### Unique Constraints
- **Books**: `isbn`, `slug` for data integrity
- **Categories**: `slug` for URL routing
- **Users**: `email` for authentication
- **Orders**: `orderNumber` for order tracking

## 🔄 Migration Strategy

### Phase 1 (MVP)
- Core user authentication tables
- Basic book catalog
- Simple cart and order system
- Essential blog functionality

### Phase 2 (Enhanced)
- Reading history and user preferences
- Advanced blog features (comments, tags)
- Analytics events table

### Phase 3 (Advanced)
- Newsletter subscription system
- Advanced user activity tracking
- Settings management

## 📈 Database Performance Considerations

### Query Optimization
- Use appropriate indexes for common queries
- Implement pagination for large datasets
- Use database-level constraints for data integrity

### Scaling Preparation
- Designed for vertical scaling initially
- Ready for read replicas in Phase 4
- Optimized for Neon PostgreSQL serverless architecture

### Data Retention
- Analytics events: 2 years (configurable)
- User sessions: 30 days
- Order history: Permanent
- Reading history: Permanent (user-deletable)