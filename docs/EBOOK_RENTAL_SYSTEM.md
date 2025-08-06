# 📚 Ebook Rental System with Advanced DRM Protection

## Overview

The Brënda Librave ebook rental system provides a secure, time-limited access model similar to movie rentals, with comprehensive digital rights management (DRM) protection. This system allows users to rent ebooks at lower prices while implementing multiple security layers to prevent unauthorized copying and distribution.

## 🎯 Key Features

### 📖 Rental Types
1. **Single Read** - One-time access for 24 hours (30% of full price)
2. **Time Limited** - 7-day access with unlimited reads (60% of full price)
3. **Unlimited Reads** - 30-day access with all privileges (full price)

### 🔒 Security Layers

#### 1. Browser Security
- **Developer Tools Detection** - Monitors for opened dev tools
- **Fullscreen Enforcement** - Requires fullscreen mode for reading
- **Text Selection Prevention** - Disables text copying
- **Context Menu Disabled** - Prevents right-click context menu
- **Screenshot Prevention** - Blocks common screenshot shortcuts

#### 2. Session Management
- **Time-Limited Access** - Automatic expiration based on rental type
- **Security Tokens** - Unique tokens for each rental session
- **Real-time Validation** - Server-side access verification
- **Activity Monitoring** - Tracks user behavior patterns

#### 3. Content Protection
- **User Watermarking** - Invisible watermarks with user data
- **Device Fingerprinting** - Tracks device characteristics
- **IP Address Logging** - Records access locations
- **Session Tracking** - Monitors reading sessions

#### 4. Real-time Monitoring
- **Security Violation Detection** - Automatic flagging of suspicious activity
- **Access Logging** - Comprehensive audit trail
- **Behavioral Analysis** - Pattern recognition for abuse detection
- **Automatic Suspension** - Immediate rental termination on violations

## 🛠️ Technical Implementation

### Database Schema

#### EbookRental Model
```prisma
model EbookRental {
  id              String    @id @default(cuid())
  userId          String
  bookId          String
  orderItemId     String
  rentalType      RentalType
  rentalPrice     Float
  currency        Currency  @default(ALL)
  startDate       DateTime  @default(now())
  endDate         DateTime
  isActive        Boolean   @default(true)
  accessCount     Int       @default(0)
  lastAccessAt    DateTime?
  securityToken   String    @unique
  watermarkData   Json?
  
  user            User      @relation(fields: [userId], references: [id])
  book            Book      @relation(fields: [bookId], references: [id])
  orderItem       OrderItem @relation(fields: [orderItemId], references: [id])
  accessLogs      EbookAccessLog[]
}
```

#### EbookAccessLog Model
```prisma
model EbookAccessLog {
  id              String    @id @default(cuid())
  rentalId        String
  userId          String
  bookId          String
  accessType      AccessType
  ipAddress       String?
  userAgent       String?
  sessionId       String?
  deviceFingerprint String?
  suspiciousActivity Boolean @default(false)
  securityFlags   Json?
  
  rental          EbookRental @relation(fields: [rentalId], references: [id])
  user            User        @relation(fields: [userId], references: [id])
  book            Book        @relation(fields: [bookId], references: [id])
}
```

### API Endpoints

#### 1. Create Rental
```typescript
POST /api/books/[id]/rental
{
  "rentalType": "SINGLE_READ" | "TIME_LIMITED" | "UNLIMITED_READS",
  "orderItemId": "string"
}
```

#### 2. Check Rental Access
```typescript
GET /api/books/[id]/rental?rentalId=string&token=string
```

#### 3. Security Logging
```typescript
POST /api/books/[id]/security-log
{
  "rentalId": "string",
  "securityToken": "string",
  "eventType": "security_violation" | "suspicious_activity" | "rental_end",
  "details": object,
  "timestamp": "string"
}
```

### Components

#### 1. SecureEbookReader
- Advanced security monitoring
- Real-time violation detection
- Fullscreen enforcement
- Activity tracking

#### 2. RentalOptions
- Rental type selection
- Pricing display
- Security feature explanation
- User-friendly interface

## 🔐 Security Measures

### Browser-Level Protection

#### Developer Tools Detection
```typescript
const detectDevTools = () => {
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
  if (widthThreshold || heightThreshold) {
    onSecurityViolation('Developer tools detected');
    return true;
  }
  return false;
};
```

#### Screenshot Prevention
```typescript
const detectScreenshotAttempt = (e: KeyboardEvent) => {
  const isScreenshotShortcut = (
    (e.ctrlKey && e.key === 'p') || // Print
    (e.ctrlKey && e.shiftKey && e.key === 'I') || // Dev tools
    (e.key === 'F12') || // F12
    (e.ctrlKey && e.key === 'u') // View source
  );

  if (isScreenshotShortcut) {
    e.preventDefault();
    onSecurityViolation('Screenshot attempt detected');
    return true;
  }
  return false;
};
```

#### Text Selection Prevention
```typescript
const disableTextSelection = () => {
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.body.style.mozUserSelect = 'none';
  document.body.style.msUserSelect = 'none';
};
```

### Server-Side Security

#### Security Token Validation
```typescript
const validateSecurityToken = async (rentalId: string, token: string) => {
  const rental = await prisma.ebookRental.findFirst({
    where: {
      id: rentalId,
      securityToken: token,
      isActive: true,
      endDate: { gt: new Date() }
    }
  });
  
  return rental !== null;
};
```

#### Activity Logging
```typescript
const logSecurityEvent = async (eventType: string, details: any) => {
  await prisma.ebookAccessLog.create({
    data: {
      rentalId,
      userId,
      bookId,
      accessType: 'SECURITY_VIOLATION',
      suspiciousActivity: true,
      securityFlags: JSON.stringify({
        eventType,
        details,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for')
      })
    }
  });
};
```

## 📊 Monitoring & Analytics

### Security Metrics
- **Total Rentals** - Number of active rentals
- **Security Violations** - Count of detected violations
- **Suspicious Activity** - Flagged user behavior
- **Access Patterns** - Reading behavior analysis

### User Analytics
- **Reading Time** - Time spent reading
- **Access Frequency** - How often users access
- **Device Usage** - Browser and device statistics
- **Geographic Data** - Access location patterns

## 🚀 Implementation Guide

### 1. Database Migration
```bash
npx prisma migrate dev --name add_rental_system
```

### 2. Environment Setup
```bash
# Add to .env.local
RENTAL_SECURITY_ENABLED=true
RENTAL_MONITORING_INTERVAL=1000
RENTAL_ACTIVITY_TIMEOUT=300000
```

### 3. Component Integration
```typescript
// In BookDetail component
import { RentalOptions } from '@/components/books/RentalOptions';
import { SecureEbookReader } from '@/components/books/SecureEbookReader';

// Add rental options to book detail page
{book.hasDigital && (
  <RentalOptions
    bookId={book.id}
    digitalPrice={book.digitalPrice}
    currency={book.baseCurrency}
    onRentalSelect={handleRentalSelect}
  />
)}
```

### 4. API Integration
```typescript
// Create rental
const createRental = async (rentalType: string, orderItemId: string) => {
  const response = await fetch(`/api/books/${bookId}/rental`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rentalType, orderItemId })
  });
  
  return response.json();
};

// Access rental
const accessRental = async (rentalId: string, token: string) => {
  const response = await fetch(
    `/api/books/${bookId}/rental?rentalId=${rentalId}&token=${token}`
  );
  
  return response.json();
};
```

## 🎨 User Experience

### Rental Selection Flow
1. **Book Detail Page** - User sees rental options
2. **Rental Selection** - Choose rental type and duration
3. **Purchase Flow** - Complete payment for rental
4. **Secure Reading** - Access book with security measures
5. **Session Monitoring** - Real-time security monitoring

### Security Notifications
- **Warning Messages** - Inform users of security measures
- **Violation Alerts** - Notify of detected violations
- **Session Status** - Show current security status
- **Access Remaining** - Display time left in rental

## 🔧 Configuration Options

### Security Settings
```typescript
const securityConfig = {
  enableDevToolsDetection: true,
  requireFullscreen: true,
  disableTextSelection: true,
  preventScreenshots: true,
  monitorActivity: true,
  logViolations: true,
  autoSuspendOnViolation: true
};
```

### Rental Duration Settings
```typescript
const rentalDurations = {
  SINGLE_READ: 24 * 60 * 60 * 1000, // 24 hours
  TIME_LIMITED: 7 * 24 * 60 * 60 * 1000, // 7 days
  UNLIMITED_READS: 30 * 24 * 60 * 60 * 1000 // 30 days
};
```

### Pricing Configuration
```typescript
const rentalPricing = {
  SINGLE_READ: 0.3, // 30% of full price
  TIME_LIMITED: 0.6, // 60% of full price
  UNLIMITED_READS: 1.0 // 100% of full price
};
```

## 🧪 Testing

### Security Testing
```typescript
// Test developer tools detection
test('should detect developer tools', () => {
  // Mock window dimensions
  Object.defineProperty(window, 'outerWidth', { value: 1200 });
  Object.defineProperty(window, 'innerWidth', { value: 1000 });
  
  const violation = detectDevTools();
  expect(violation).toBe(true);
});

// Test screenshot prevention
test('should prevent screenshot shortcuts', () => {
  const event = new KeyboardEvent('keydown', {
    ctrlKey: true,
    key: 'p'
  });
  
  const prevented = detectScreenshotAttempt(event);
  expect(prevented).toBe(true);
  expect(event.defaultPrevented).toBe(true);
});
```

### Rental Flow Testing
```typescript
// Test rental creation
test('should create rental successfully', async () => {
  const rental = await RentalService.createRental({
    rentalType: 'SINGLE_READ',
    orderItemId: 'test-order',
    userId: 'test-user',
    bookId: 'test-book'
  });
  
  expect(rental.rentalType).toBe('SINGLE_READ');
  expect(rental.securityToken).toBeDefined();
  expect(rental.isActive).toBe(true);
});
```

## 🚀 Deployment Considerations

### Production Security
1. **HTTPS Only** - All rental access must be over HTTPS
2. **Rate Limiting** - Prevent abuse of rental endpoints
3. **IP Whitelisting** - Restrict access to known IPs if needed
4. **Monitoring** - Set up alerts for security violations
5. **Backup** - Regular backup of rental and security logs

### Performance Optimization
1. **Caching** - Cache rental validation results
2. **Database Indexing** - Optimize queries for rental lookups
3. **CDN** - Serve ebook files from CDN
4. **Compression** - Compress ebook files for faster loading

## 📈 Future Enhancements

### Advanced Security
- **Machine Learning** - AI-powered behavior analysis
- **Biometric Authentication** - Fingerprint/face recognition
- **Hardware Security** - TPM-based protection
- **Blockchain Integration** - Decentralized rental tracking

### User Experience
- **Offline Reading** - Download for offline access
- **Multi-device Sync** - Sync progress across devices
- **Social Features** - Share reading progress
- **Recommendations** - AI-powered book suggestions

### Business Features
- **Subscription Model** - Monthly/yearly rental subscriptions
- **Bulk Discounts** - Discounts for multiple rentals
- **Loyalty Program** - Points for rental purchases
- **Affiliate System** - Referral rewards

## 🔍 Troubleshooting

### Common Issues

#### Rental Not Accessible
- Check if rental is expired
- Verify security token is valid
- Ensure user has proper permissions
- Check for security violations

#### Security Warnings
- Clear browser cache and cookies
- Disable browser extensions
- Use supported browsers only
- Contact support for persistent issues

#### Performance Issues
- Check network connectivity
- Verify ebook file accessibility
- Monitor server resources
- Review security monitoring overhead

## 📞 Support

For technical support or security concerns:
- **Email**: security@brenda-librave.com
- **Documentation**: /docs/rental-system
- **GitHub Issues**: Report bugs and feature requests
- **Security Reports**: security@brenda-librave.com

---

This rental system provides a secure, user-friendly way to offer ebook access at lower prices while maintaining strong protection against unauthorized copying and distribution. The multi-layered security approach ensures content protection while providing a smooth reading experience for legitimate users. 