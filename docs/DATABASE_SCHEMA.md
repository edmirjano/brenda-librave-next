# Brënda Librave - Database Schema

This document contains the complete PostgreSQL database schema for Brënda Librave using Prisma ORM.

## 🗄️ Complete Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Note: For production deployment on Netlify, this will be automatically 
// configured to use PostgreSQL via Neon. See NETLIFY_DEPLOYMENT.md for setup.

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
  currency        Currency  @default(ALL)
  newsletter      Boolean   @default(false)
  emailVerified   DateTime?
  image           String?
  
  // Push notification settings
  fcmTokens       UserFCMToken[]
  notificationSettings NotificationSettings?
  
  // Relations
  accounts        Account[]
  sessions        Session[]
  orders          Order[]
  cartItems       CartItem[]
  readingHistory  ReadingHistory[]
  blogPosts       BlogPost[]
  comments        Comment[]
  
  // New relations
  forumTopics     ForumTopic[]
  forumPosts      ForumPost[]
  giftsSent       BookGift[]   @relation("GiftsSent")
  giftsReceived   BookGift[]   @relation("GiftsReceived")
  giftsClaimed    BookGift[]   @relation("GiftsClaimed")
  couponUsages    CouponUsage[]
  subscriptions   Subscription[]
  wishlist        Wishlist[]
  collections     BookCollection[]
  moderatedPosts  BlogPost[]   @relation("ModeratedPosts")
  blogPostLikes   BlogPostLike[]
  
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

enum Currency {
  ALL  // Albanian Lek
  EUR  // Euro
}

// Book Catalog
model Book {
  id              String    @id @default(cuid())
  title           String
  author          String
  description     String    @db.Text
  isbn            String?   @unique
  categoryId      String
  priceALL        Decimal?  @db.Decimal(10, 2) // Price in Albanian Lek
  priceEUR        Decimal?  @db.Decimal(10, 2) // Price in Euro
  digitalPriceALL Decimal?  @db.Decimal(10, 2) // Digital price in Albanian Lek
  digitalPriceEUR Decimal?  @db.Decimal(10, 2) // Digital price in Euro
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
  
  // New relations
  forumTopics     ForumTopic[]
  gifts           BookGift[]
  preview         BookPreview?
  wishlistItems   Wishlist[]
  collectionItems BookCollectionItem[]
  
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
  currency Currency  @default(ALL)
  
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
  shippingCost    Decimal     @db.Decimal(10, 2) @default(0)
  currency        Currency    @default(ALL)
  exchangeRate    Decimal?    @db.Decimal(10, 4) // Exchange rate used at time of order
  
  // Shipping information
  shippingName    String
  shippingEmail   String
  shippingPhone   String      // Added phone number requirement
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
  couponUsage     CouponUsage?
  
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
  currency  Currency @default(ALL)
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
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  content         String        @db.Text
  excerpt         String?
  authorId        String
  categoryId      String?
  featuredImage   String?
  published       Boolean       @default(false)
  publishedAt     DateTime?
  language        Language      @default(SQ)
  type            BlogPostType  @default(ADMIN)
  status          BlogPostStatus @default(DRAFT)
  moderatedAt     DateTime?
  moderatedById   String?
  rejectionReason String?
  views           Int           @default(0)
  likes           Int           @default(0)
  
  // SEO fields
  metaTitle       String?
  metaDescription String?
  
  // Relations
  author          User          @relation(fields: [authorId], references: [id])
  category        BlogCategory? @relation(fields: [categoryId], references: [id])
  moderatedBy     User?         @relation("ModeratedPosts", fields: [moderatedById], references: [id])
  tags            BlogPostTag[]
  comments        Comment[]
  likes_relation  BlogPostLike[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([published])
  @@index([authorId])
  @@index([categoryId])
  @@index([type])
  @@index([status])
}

model BlogPostLike {
  id       String   @id @default(cuid())
  userId   String
  postId   String
  
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post     BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, postId])
  @@index([postId])
}

enum BlogPostType {
  ADMIN     // Official blog posts by admin/staff
  USER      // User-generated content
  FEATURED  // Featured user posts
}

enum BlogPostStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  PUBLISHED
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

model Newsletter {
  id          String    @id @default(cuid())
  title       String
  content     String    @db.Text
  htmlContent String?   @db.Text
  subject     String
  language    Language  @default(SQ)
  status      NewsletterStatus @default(DRAFT)
  scheduledAt DateTime?
  sentAt      DateTime?
  recipients  Int       @default(0)
  openRate    Float?
  clickRate   Float?
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([status])
  @@index([scheduledAt])
}

enum NewsletterStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  FAILED
}

// Forum & Community
model ForumCategory {
  id          String  @id @default(cuid())
  name        String
  nameEn      String?
  description String?
  slug        String  @unique
  color       String? // Hex color for category
  sortOrder   Int     @default(0)
  active      Boolean @default(true)
  
  topics      ForumTopic[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([active, sortOrder])
}

model ForumTopic {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  content     String      @db.Text
  authorId    String
  categoryId  String
  bookId      String?     // Optional: link to specific book
  pinned      Boolean     @default(false)
  locked      Boolean     @default(false)
  status      TopicStatus @default(ACTIVE)
  views       Int         @default(0)
  
  author      User         @relation(fields: [authorId], references: [id])
  category    ForumCategory @relation(fields: [categoryId], references: [id])
  book        Book?        @relation(fields: [bookId], references: [id])
  posts       ForumPost[]
  tags        ForumTopicTag[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([categoryId])
  @@index([authorId])
  @@index([bookId])
  @@index([status])
}

model ForumPost {
  id        String     @id @default(cuid())
  content   String     @db.Text
  authorId  String
  topicId   String
  parentId  String?    // For threaded replies
  status    PostStatus @default(ACTIVE)
  
  author    User       @relation(fields: [authorId], references: [id])
  topic     ForumTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)
  parent    ForumPost? @relation("PostReplies", fields: [parentId], references: [id])
  replies   ForumPost[] @relation("PostReplies")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([topicId])
  @@index([authorId])
  @@index([status])
}

model ForumTag {
  id      String          @id @default(cuid())
  name    String          @unique
  nameEn  String?
  color   String?         // Hex color for tag
  
  topics  ForumTopicTag[]
  
  createdAt DateTime @default(now())
}

model ForumTopicTag {
  topicId String
  tagId   String
  
  topic   ForumTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)
  tag     ForumTag   @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([topicId, tagId])
}

enum TopicStatus {
  ACTIVE
  LOCKED
  HIDDEN
  DELETED
}

enum PostStatus {
  ACTIVE
  HIDDEN
  DELETED
  FLAGGED
}

// Book Gifting & Used Books
model BookGift {
  id            String     @id @default(cuid())
  bookId        String
  fromUserId    String?    // null for anonymous gifts
  toUserId      String?    // null if available to anyone
  toEmail       String?    // For gifting to non-users
  message       String?    @db.Text
  condition     BookCondition
  status        GiftStatus @default(AVAILABLE)
  claimedAt     DateTime?
  claimedById   String?
  shippingInfo  Json?      // Shipping details if physical
  
  book          Book       @relation(fields: [bookId], references: [id])
  fromUser      User?      @relation("GiftsSent", fields: [fromUserId], references: [id])
  toUser        User?      @relation("GiftsReceived", fields: [toUserId], references: [id])
  claimedBy     User?      @relation("GiftsClaimed", fields: [claimedById], references: [id])
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@index([status])
  @@index([bookId])
  @@index([toUserId])
}

enum BookCondition {
  NEW
  LIKE_NEW
  VERY_GOOD
  GOOD
  ACCEPTABLE
}

enum GiftStatus {
  AVAILABLE
  CLAIMED
  SHIPPED
  RECEIVED
  EXPIRED
}

// Coupons & Discounts
model Coupon {
  id                String      @id @default(cuid())
  code              String      @unique
  name              String
  description       String?
  type              CouponType
  value             Decimal     @db.Decimal(10, 2) // Amount or percentage
  minimumAmount     Decimal?    @db.Decimal(10, 2)
  maximumDiscount   Decimal?    @db.Decimal(10, 2)
  usageLimit        Int?        // Total usage limit
  usagePerUser      Int?        @default(1)
  usedCount         Int         @default(0)
  isActive          Boolean     @default(true)
  validFrom         DateTime
  validUntil        DateTime?
  applicableToBooks String[]    // Book IDs (empty = all books)
  applicableToCategories String[] // Category IDs
  
  uses              CouponUsage[]
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  @@index([code])
  @@index([isActive])
  @@index([validFrom, validUntil])
}

model CouponUsage {
  id        String   @id @default(cuid())
  couponId  String
  userId    String
  orderId   String   @unique
  discount  Decimal  @db.Decimal(10, 2)
  
  coupon    Coupon   @relation(fields: [couponId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
  order     Order    @relation(fields: [orderId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@index([couponId])
  @@index([userId])
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
  BUY_ONE_GET_ONE
}

// Book Previews & Content
model BookPreview {
  id            String   @id @default(cuid())
  bookId        String   @unique
  samplePages   String[] // URLs to sample page images
  audioSample   String?  // URL to audio sample
  tableOfContents String[] // Chapter/section titles
  readingTime   Int?     // Estimated reading time in minutes
  difficulty    String?  // Reading difficulty level
  excerpt       String?  @db.Text
  
  book          Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Subscriptions
model Subscription {
  id            String           @id @default(cuid())
  userId        String
  type          SubscriptionType
  status        SubscriptionStatus @default(ACTIVE)
  price         Decimal          @db.Decimal(10, 2)
  currency      String           @default("EUR")
  startDate     DateTime
  endDate       DateTime?
  renewalDate   DateTime
  paymentId     String?          // Payment provider ID
  
  user          User             @relation(fields: [userId], references: [id])
  
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([renewalDate])
}

enum SubscriptionType {
  MONTHLY_BOX
  EBOOK_UNLIMITED
  PREMIUM_MEMBERSHIP
  AUDIOBOOK_PLUS
}

enum SubscriptionStatus {
  ACTIVE
  PAUSED
  CANCELLED
  EXPIRED
  PENDING
}

// Wishlist & Collections
model Wishlist {
  id        String @id @default(cuid())
  userId    String
  bookId    String
  priority  Int    @default(1) // 1=low, 2=medium, 3=high
  notes     String?
  
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  book      Book   @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, bookId])
  @@index([userId])
}

model BookCollection {
  id          String               @id @default(cuid())
  name        String
  description String?
  userId      String
  isPublic    Boolean              @default(false)
  
  user        User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  books       BookCollectionItem[]
  
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt
  
  @@index([userId])
  @@index([isPublic])
}

model BookCollectionItem {
  id           String         @id @default(cuid())
  collectionId String
  bookId       String
  sortOrder    Int            @default(0)
  notes        String?
  
  collection   BookCollection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  book         Book           @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  @@unique([collectionId, bookId])
  @@index([collectionId])
}

// Admin & Settings
model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String @db.Text
  
  updatedAt DateTime @updatedAt
}

// Currency Exchange Rates
model ExchangeRate {
  id           String   @id @default(cuid())
  fromCurrency Currency
  toCurrency   Currency
  rate         Decimal  @db.Decimal(10, 4)
  isActive     Boolean  @default(true)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@unique([fromCurrency, toCurrency])
  @@index([isActive])
}
// Push Notifications & FCM
model UserFCMToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  deviceType String? // 'web', 'mobile', 'pwa'
  userAgent String?
  isActive  Boolean  @default(true)
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([token])
}

model NotificationSettings {
  id              String  @id @default(cuid())
  userId          String  @unique
  
  // Notification preferences
  newBooks        Boolean @default(true)
  orderUpdates    Boolean @default(true)
  promotions      Boolean @default(true)
  blog            Boolean @default(true)
  newsletter      Boolean @default(true)
  bookRecommendations Boolean @default(true)
  priceAlerts     Boolean @default(true)
  
  // Delivery preferences
  pushEnabled     Boolean @default(true)
  emailEnabled    Boolean @default(true)
  
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Common settings for shipping management:
// - shipping_rate_domestic_all: Flat rate for domestic shipping in ALL
// - shipping_rate_international_all: Flat rate for international shipping in ALL
// - shipping_rate_domestic_eur: Flat rate for domestic shipping in EUR
// - shipping_rate_international_eur: Flat rate for international shipping in EUR
// - shipping_free_threshold: Minimum order amount for free shipping
// - shipping_enabled_countries: JSON array of supported countries
// - business_phone: Contact phone for shipping inquiries
// - business_address: Business address for returns/exchanges
// - exchange_rate_all_eur: Current exchange rate from ALL to EUR
// - exchange_rate_eur_all: Current exchange rate from EUR to ALL
// - default_currency: Default currency for new users (ALL)
// - currency_display_both: Whether to show both currencies (true/false)
```

## 🔧 Database Setup Commands

### Development Setup (SQLite)
```bash
# Initialize Prisma
npx prisma init

# Set up local SQLite database
echo 'DATABASE_URL="file:./dev.db"' > .env

# Generate Prisma client
npx prisma generate

# Run migrations for SQLite
npx prisma migrate dev --name init

# Seed database (if seed script exists)
npx prisma db seed
```

### Production Setup (Neon PostgreSQL on Netlify)
```bash
# Set production database URL in Netlify environment
# DATABASE_URL="postgresql://username:password@ep-name.region.aws.neon.tech/dbname?sslmode=require"

# Deploy migrations to Neon PostgreSQL
npx prisma migrate deploy

# Generate client for production
npx prisma generate
```

### Database Strategy
- **Local Development**: SQLite for simplicity and speed
- **Production (Netlify)**: Neon PostgreSQL for scalability and performance
- **Schema Compatibility**: Prisma handles differences automatically
- **Migration Strategy**: Develop locally with SQLite, deploy to PostgreSQL

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
- **Development**: SQLite for fast local development and testing
- **Production**: Neon PostgreSQL serverless architecture for automatic scaling
- **Migration Path**: Seamless transition from SQLite to PostgreSQL via Prisma
- **Future Scaling**: Ready for read replicas and connection pooling in Phase 4

### Data Retention
- Analytics events: 2 years (configurable)
- User sessions: 30 days
- Order history: Permanent
- Reading history: Permanent (user-deletable)