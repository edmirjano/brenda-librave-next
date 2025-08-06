# 🎧 Audio Book Rental & Subscription System

## Overview

The Brënda Librave audio book system provides **secure digital streaming** and **physical audio book rentals** with comprehensive DRM protection. Users can rent audio books individually or access them through subscriptions, with advanced security measures to prevent unauthorized copying and distribution.

## 🎯 Key Features

### 📖 Audio Book Formats
- **Digital Streaming** - Secure online streaming with DRM protection
- **Physical Audio CDs** - Traditional audio book rentals with guarantee system
- **Multiple Qualities** - LOW (64kbps), STANDARD (128kbps), HIGH (256kbps), ULTRA (320kbps)
- **Multiple Languages** - Albanian, English, Italian, German, French, Turkish, Macedonian

### 🔒 Security Features
- **Secure Streaming** - Protected audio streams with session management
- **Play Time Tracking** - Monitor listening progress and completion
- **Access Logging** - Comprehensive audit trail for all listening sessions
- **Device Monitoring** - Prevent unauthorized access and sharing
- **Chapter Management** - Track progress by chapter with timestamps

### 💰 Rental Options
1. **Single Listen** - €3.99 (24 hours, one complete listen)
2. **Time Limited** - €7.99 (7 days, unlimited listens)
3. **Unlimited Listens** - €12.99 (30 days, unlimited listens)

## 🛠️ Technical Implementation

### Database Schema

#### AudioBook Model
```prisma
model AudioBook {
  id              String    @id @default(cuid())
  bookId          String    // Reference to the original book
  title           String
  author          String
  narrator        String    // Audio book narrator
  duration        Int       // Duration in seconds
  fileSize        Int       // File size in bytes
  audioFileUrl    String?   // URL to the audio file (S3 or similar)
  audioFileFormat String    @default("MP3") // MP3, AAC, etc.
  sampleUrl       String?   // Sample audio file URL
  price           Float?    // Audio book price
  digitalPrice    Float?    // Digital audio book price
  baseCurrency    Currency  @default(ALL)
  inventory       Int       @default(0) // For physical audio CDs
  hasDigital      Boolean   @default(true)
  hasPhysical     Boolean   @default(false)
  active          Boolean   @default(true)
  featured        Boolean   @default(false)
  
  // Audio book specific fields
  language        Language  @default(SQ)
  quality         AudioQuality @default(STANDARD)
  chapters        Int?      // Number of chapters
  chapterList     Json?     // Chapter timestamps and titles
  
  // Relations
  book            Book      @relation(fields: [bookId], references: [id])
  rentals         AudioBookRental[]
  accessLogs      AudioBookAccessLog[]
  subscriptionBooks AudioBookSubscriptionBook[]
}
```

#### AudioBookRental Model
```prisma
model AudioBookRental {
  id              String    @id @default(cuid())
  userId          String
  audioBookId     String
  orderItemId     String
  rentalType      AudioBookRentalType
  rentalPrice     Float
  guaranteeAmount Float?    // For physical audio CDs
  currency        Currency  @default(ALL)
  startDate       DateTime  @default(now())
  endDate         DateTime
  returnDate      DateTime? // For physical rentals
  isActive        Boolean   @default(true)
  isReturned      Boolean   @default(false)
  isDamaged       Boolean   @default(false)
  damageNotes     String?
  guaranteeRefunded Boolean @default(false)
  refundAmount    Float?
  
  // Audio book specific tracking
  totalPlayTime   Int       @default(0) // Total seconds played
  lastPlayedAt    DateTime?
  playCount       Int       @default(0) // Number of times started
  completed       Boolean   @default(false) // Finished listening
  
  // Physical audio book tracking
  initialCondition AudioBookCondition @default(EXCELLENT)
  returnCondition  AudioBookCondition?
  conditionNotes   String?
  shippingAddress String?
  trackingNumber  String?
  returnTracking  String?
  
  user            User      @relation(fields: [userId], references: [id])
  audioBook       AudioBook @relation(fields: [audioBookId], references: [id])
  orderItem       OrderItem @relation(fields: [orderItemId], references: [id])
  accessLogs      AudioBookAccessLog[]
}
```

#### AudioBookAccessLog Model
```prisma
model AudioBookAccessLog {
  id              String    @id @default(cuid())
  rentalId        String?
  userSubscriptionId String?
  userId          String
  audioBookId     String
  accessType      AudioBookAccessType
  playTime        Int?      // Seconds played in this session
  sessionDuration Int?      // Total session duration in seconds
  deviceInfo      String?
  ipAddress       String?
  userAgent       String?
  suspiciousActivity Boolean @default(false)
  securityFlags   Json?
  
  rental          AudioBookRental? @relation(fields: [rentalId], references: [id])
  userSubscription UserSubscription? @relation(fields: [userSubscriptionId], references: [id])
  user            User        @relation(fields: [userId], references: [id])
  audioBook       AudioBook   @relation(fields: [audioBookId], references: [id])
}
```

### API Endpoints

#### 1. Get Audio Books
```typescript
GET /api/audio-books
{
  "audioBooks": [
    {
      "id": "audio-123",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "narrator": "Jake Gyllenhaal",
      "duration": 28800, // 8 hours in seconds
      "fileSize": 256000000, // 256 MB
      "price": 19.99,
      "digitalPrice": 14.99,
      "quality": "HIGH",
      "language": "EN"
    }
  ],
  "total": 150
}
```

#### 2. Create Audio Book Rental
```typescript
POST /api/audio-books
{
  "audioBookId": "audio-123",
  "rentalType": "TIME_LIMITED",
  "orderItemId": "order-item-456",
  "shippingAddress": "123 Main St, Tirana",
  "guaranteeAmount": 15.00
}
```

#### 3. Check Audio Book Access
```typescript
GET /api/audio-books/[id]/access
{
  "audioBookId": "audio-123",
  "hasAccess": true,
  "userRental": {
    "id": "rental-789",
    "rentalType": "TIME_LIMITED",
    "totalPlayTime": 3600,
    "playCount": 3,
    "completed": false,
    "endDate": "2024-02-01T00:00:00Z"
  },
  "canListenMore": true
}
```

#### 4. Update Play Time
```typescript
POST /api/audio-books/[id]/access
{
  "action": "update_playtime",
  "playTime": 300 // 5 minutes
}
```

### Components

#### 1. AudioBookRentalOptions
- Display audio book information (duration, narrator, quality)
- Show rental options with pricing
- Handle rental selection
- Display audio book benefits

#### 2. AudioBookService
- Business logic for audio book management
- Access control and validation
- Play time tracking and completion
- Comprehensive logging

## 💰 Pricing & Features

### Rental Tiers
```typescript
const audioBookRentalTiers = {
  SINGLE_LISTEN: {
    name: "Një Dëgjim",
    duration: "24 orë",
    rentalPrice: "30% of base price",
    features: [
      "Dëgjim i plotë një herë",
      "Akses për 24 orë",
      "Kualitet i lartë audio",
      "Kontrolli i shpejtësisë"
    ]
  },
  TIME_LIMITED: {
    name: "Akses i Kufizuar",
    duration: "7 ditë",
    rentalPrice: "60% of base price",
    features: [
      "Dëgjime të pakufizuara",
      "Akses për 7 ditë",
      "Ruajtja e progresit",
      "Kualitet i lartë audio"
    ]
  },
  UNLIMITED_LISTENS: {
    name: "Dëgjime të Pakufizuara",
    duration: "30 ditë",
    rentalPrice: "80% of base price",
    features: [
      "Dëgjime të pakufizuara",
      "Akses për 30 ditë",
      "Ruajtja e progresit",
      "Kualitet i lartë audio",
      "Shkarkim për dëgjim offline"
    ]
  }
};
```

### Audio Book Features
```typescript
const audioBookFeatures = {
  // Quality options
  quality: {
    LOW: "64kbps - Për lidhje të ngadaltë",
    STANDARD: "128kbps - Kualitet i mirë",
    HIGH: "256kbps - Kualitet i lartë",
    ULTRA: "320kbps - Kualitet maksimal"
  },
  
  // Playback controls
  controls: [
    "Play/Pause",
    "Fast Forward/Rewind",
    "Speed Control (0.5x - 3x)",
    "Chapter Navigation",
    "Bookmarking"
  ],
  
  // Progress tracking
  tracking: [
    "Total play time",
    "Session duration",
    "Completion percentage",
    "Chapter progress",
    "Last played position"
  ]
};
```

## 📊 Business Benefits

### For Listeners
- ✅ **Convenient Listening** - Listen during commute, work, or relaxation
- ✅ **Speed Control** - Adjust playback speed to your preference
- ✅ **Progress Tracking** - Resume from where you left off
- ✅ **Multiple Formats** - Digital streaming and physical CDs
- ✅ **Quality Options** - Choose audio quality based on connection

### For Publishers
- ✅ **Additional Revenue** - Audio book sales and rentals
- ✅ **Wider Distribution** - Reach audio book enthusiasts
- ✅ **Content Protection** - Secure streaming with DRM
- ✅ **Usage Analytics** - Track listening patterns and preferences
- ✅ **Market Expansion** - Tap into growing audio book market

### For Bookstore
- ✅ **Revenue Diversification** - Audio book rentals and sales
- ✅ **Customer Engagement** - Multiple content consumption options
- ✅ **Inventory Optimization** - Physical and digital audio books
- ✅ **Market Differentiation** - Comprehensive audio book platform
- ✅ **Subscription Integration** - Audio books in subscription plans

## 🎨 User Experience Flow

### Audio Book Discovery
1. **Browse Audio Books** - View available audio book collection
2. **Filter Options** - By language, narrator, duration, quality
3. **Sample Audio** - Listen to sample before renting
4. **Compare Formats** - Digital vs physical options

### Rental Process
1. **Select Audio Book** - Choose from available titles
2. **Choose Rental Type** - Single listen, time limited, or unlimited
3. **Complete Payment** - Pay rental fee and guarantee (if physical)
4. **Start Listening** - Begin streaming or receive physical copy

### Listening Experience
1. **Stream Audio** - Secure online streaming with DRM
2. **Track Progress** - Monitor listening time and completion
3. **Control Playback** - Adjust speed, skip chapters, bookmark
4. **Complete Listening** - Mark as finished when done

### Subscription Access
1. **Check Subscription** - Verify audio book availability in plan
2. **Start Listening** - Begin streaming immediately
3. **Track Usage** - Monitor concurrent listens and limits
4. **Manage Library** - Access all subscription audio books

## 🔧 Configuration Options

### Audio Book Settings
```typescript
const audioBookConfig = {
  // Quality settings
  quality: {
    LOW: { bitrate: 64, description: "Për lidhje të ngadaltë" },
    STANDARD: { bitrate: 128, description: "Kualitet i mirë" },
    HIGH: { bitrate: 256, description: "Kualitet i lartë" },
    ULTRA: { bitrate: 320, description: "Kualitet maksimal" }
  },
  
  // Rental pricing
  pricing: {
    SINGLE_LISTEN: { multiplier: 0.3, duration: 24 },
    TIME_LIMITED: { multiplier: 0.6, duration: 168 },
    UNLIMITED_LISTENS: { multiplier: 0.8, duration: 720 }
  },
  
  // Security settings
  security: {
    maxDevices: 2,
    sessionTimeout: 30, // minutes
    playTimeTracking: true,
    accessLogging: true,
    drmProtection: true
  }
};
```

### Audio Book Management
```typescript
// Add audio book to subscription
const addAudioBookToSubscription = async (subscriptionId: string, audioBookId: string) => {
  return await prisma.audioBookSubscriptionBook.create({
    data: { subscriptionId, audioBookId }
  });
};

// Track play time
const updatePlayTime = async (userId: string, audioBookId: string, playTime: number) => {
  await AudioBookService.updatePlayTime(userId, audioBookId, playTime);
};

// Complete listening
const completeListening = async (userId: string, audioBookId: string) => {
  await AudioBookService.completeListening(userId, audioBookId);
};
```

## 📈 Analytics & Monitoring

### Key Metrics
- **Audio Book Revenue** - Rental and subscription income
- **Listening Time** - Total hours listened across all users
- **Completion Rate** - Percentage of audio books finished
- **Popular Narrators** - Most requested audio book narrators
- **Quality Preferences** - Most chosen audio quality levels
- **Device Usage** - Listening patterns across devices

### Business Intelligence
- **Audio Book Performance** - Which audio books are most popular
- **Listening Patterns** - When and how users listen
- **Narrator Effectiveness** - Which narrators drive rentals
- **Quality Impact** - How audio quality affects user satisfaction
- **Subscription Integration** - Audio book usage in subscriptions

## 🚀 Implementation Guide

### 1. Database Migration
```bash
npx prisma migrate dev --name add_audio_book_system
```

### 2. Environment Setup
```bash
# Add to .env.local
AUDIO_BOOK_ENABLED=true
AUDIO_STORAGE_URL=s3://your-audio-bucket
MAX_AUDIO_QUALITY=ULTRA
AUDIO_SESSION_TIMEOUT=30
```

### 3. Component Integration
```typescript
// In book detail page
import { AudioBookRentalOptions } from '@/components/audio-books/AudioBookRentalOptions';

// Display audio book options
<AudioBookRentalOptions
  audioBook={audioBookData}
  onRentalSelect={handleAudioBookRental}
/>
```

### 4. API Integration
```typescript
// Get available audio books
const getAudioBooks = async () => {
  const response = await fetch('/api/audio-books');
  return response.json();
};

// Create audio book rental
const rentAudioBook = async (audioBookId: string, rentalType: string) => {
  const response = await fetch('/api/audio-books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBookId, rentalType })
  });
  return response.json();
};

// Check audio book access
const checkAudioBookAccess = async (audioBookId: string) => {
  const response = await fetch(`/api/audio-books/${audioBookId}/access`);
  return response.json();
};
```

## 🧪 Testing

### Audio Book Flow Testing
```typescript
// Test audio book rental creation
test('should create audio book rental successfully', async () => {
  const rental = await AudioBookService.createAudioBookRental({
    userId: 'user-123',
    audioBookId: 'audio-456',
    orderItemId: 'order-789',
    rentalType: 'TIME_LIMITED'
  });
  
  expect(rental.rentalType).toBe('TIME_LIMITED');
  expect(rental.isActive).toBe(true);
});

// Test play time tracking
test('should update play time correctly', async () => {
  await AudioBookService.updatePlayTime('user-123', 'audio-456', 300);
  
  const rental = await prisma.audioBookRental.findFirst({
    where: { userId: 'user-123', audioBookId: 'audio-456' }
  });
  
  expect(rental.totalPlayTime).toBe(300);
});

// Test completion tracking
test('should mark audio book as completed', async () => {
  await AudioBookService.completeListening('user-123', 'audio-456');
  
  const rental = await prisma.audioBookRental.findFirst({
    where: { userId: 'user-123', audioBookId: 'audio-456' }
  });
  
  expect(rental.completed).toBe(true);
});
```

## 🚀 Deployment Considerations

### Production Requirements
1. **Audio Storage** - S3 or similar for secure audio file storage
2. **Streaming Service** - CDN for efficient audio delivery
3. **DRM Protection** - Audio content protection system
4. **Session Management** - Track listening sessions and progress
5. **Quality Optimization** - Multiple quality levels for different connections

### Operational Considerations
1. **Audio File Management** - Upload, process, and serve audio files
2. **Quality Control** - Ensure audio quality meets standards
3. **Storage Optimization** - Efficient audio file storage and delivery
4. **Bandwidth Management** - Optimize streaming for different connections
5. **User Experience** - Smooth playback and progress tracking

## 📈 Future Enhancements

### Advanced Features
- **Offline Download** - Download audio books for offline listening
- **Family Sharing** - Share audio books with family members
- **Audio Book Clubs** - Group listening and discussion features
- **Voice Notes** - Add personal notes to audio books
- **Sleep Timer** - Automatic stop after set time

### Technology Improvements
- **AI Recommendations** - Personalized audio book suggestions
- **Listening Analytics** - Detailed listening insights
- **Social Features** - Share listening progress and reviews
- **Audio Book Challenges** - Reading/listening challenges
- **Multi-language Support** - Audio books in multiple languages

## 🔍 Troubleshooting

### Common Issues

#### Audio Not Playing
- Check audio book rental status and expiration
- Verify audio file availability and format
- Confirm device compatibility and browser support
- Review network connection and bandwidth

#### Play Time Not Updating
- Verify user has active rental or subscription
- Check API endpoint and authentication
- Review play time calculation logic
- Confirm database connection and updates

#### Quality Issues
- Check user's internet connection speed
- Verify audio file quality and encoding
- Review CDN and streaming service status
- Confirm device audio capabilities

## 📞 Support

For technical support or audio book inquiries:
- **Email**: audiobooks@brenda-librave.com
- **Documentation**: /docs/audio-book-system
- **GitHub Issues**: Report bugs and feature requests
- **Customer Service**: 24/7 audio book support

---

This audio book system provides a comprehensive solution for renting and streaming audio books with advanced security measures, progress tracking, and subscription integration, making it easy for users to enjoy audio books while protecting content creators' rights. 