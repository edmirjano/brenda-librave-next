# 📋 Terms and Conditions System

## Overview

The Brënda Librave Terms and Conditions System ensures **legal compliance** and **user protection** by requiring users to read and accept specific terms before any rental transaction (ebook, hardcopy, audio book, or subscription). The system tracks reading progress, ensures genuine acceptance, and maintains comprehensive audit trails.

## 🎯 Key Features

### 📖 Mandatory Terms Acceptance
- **Pre-Rental Validation** - Terms must be accepted before any rental
- **Type-Specific Terms** - Different terms for different rental types
- **Version Control** - Track terms versions and updates
- **Effective Date Management** - Terms become active on specific dates

### 🔒 Reading Verification
- **Scroll Depth Tracking** - Monitor how much of terms user has read
- **Reading Time Tracking** - Ensure minimum reading time (30 seconds)
- **Progress Visualization** - Show reading progress to users
- **Confirmation Requirements** - Double confirmation of understanding

### 📊 Audit Trail
- **Acceptance Logging** - Record all terms acceptances with details
- **IP Address Tracking** - Log user's IP address at acceptance
- **Device Information** - Track browser and device details
- **Session Tracking** - Link acceptances to user sessions

## 🛠️ Technical Implementation

### Database Schema

#### TermsAndConditions Model
```prisma
model TermsAndConditions {
  id              String    @id @default(cuid())
  title           String    // e.g., "Ebook Rental Terms", "Audio Book Terms"
  version         String    // e.g., "1.0", "2.1"
  content         String    // Full terms and conditions text
  type            TermsType // Type of terms (rental, subscription, etc.)
  isActive        Boolean   @default(true)
  effectiveDate   DateTime  @default(now())
  expiryDate      DateTime? // When these terms expire
  
  // User acceptances
  userAcceptances UserTermsAcceptance[]
}
```

#### UserTermsAcceptance Model
```prisma
model UserTermsAcceptance {
  id                    String    @id @default(cuid())
  userId                String
  termsId               String
  acceptedAt            DateTime  @default(now())
  ipAddress             String?   // IP address when accepted
  userAgent             String?   // Browser/device info
  sessionId             String?   // Session identifier
  
  // Related to specific rental/subscription
  rentalType            RentalType? // For ebook rentals
  hardcopyRentalType   HardcopyRentalType? // For hardcopy rentals
  audioBookRentalType  AudioBookRentalType? // For audio book rentals
  subscriptionType      String?   // For subscriptions
  
  // Acceptance details
  readTime              Int?      // Time spent reading in seconds
  scrollDepth           Int?      // Percentage of terms scrolled
  confirmedRead         Boolean   @default(false) // User confirmed they read
  confirmedUnderstand   Boolean   @default(false) // User confirmed they understand
  
  user                  User      @relation(fields: [userId], references: [id])
  terms                 TermsAndConditions @relation(fields: [termsId], references: [id])
}
```

### API Endpoints

#### 1. Validate Terms Before Rental
```typescript
POST /api/terms/validate
{
  "rentalType": "ebook",
  "specificRentalType": "TIME_LIMITED"
}

// Response
{
  "valid": false,
  "termsRequired": {
    "id": "terms-123",
    "title": "Ebook Rental Terms and Conditions",
    "content": "...",
    "version": "1.0"
  },
  "message": "You must read and accept the terms and conditions before proceeding with this rental."
}
```

#### 2. Record Terms Acceptance
```typescript
POST /api/terms/accept
{
  "termsId": "terms-123",
  "rentalType": "TIME_LIMITED",
  "readTime": 45,
  "scrollDepth": 95,
  "confirmedRead": true,
  "confirmedUnderstand": true
}

// Response
{
  "success": true,
  "acceptance": {
    "id": "acceptance-456",
    "acceptedAt": "2024-01-15T10:30:00Z",
    "termsId": "terms-123"
  },
  "message": "Terms and conditions accepted successfully"
}
```

### Components

#### 1. TermsAndConditionsModal
- Display terms content with proper formatting
- Track reading progress and time
- Enforce minimum reading requirements
- Require double confirmation
- Visual progress indicators

#### 2. TermsService
- Business logic for terms management
- Validation and acceptance tracking
- Audit trail maintenance
- Version control and updates

## 💰 Terms Types and Content

### Ebook Rental Terms
```markdown
# Ebook Rental Terms and Conditions

## 1. Rental Agreement
By renting this ebook, you agree to the following terms and conditions.

## 2. Usage Rights
- You may read this ebook during the rental period
- You may not copy, distribute, or share the ebook
- You may not attempt to bypass security measures
- You may not use automated tools to access the content

## 3. Security Measures
- The ebook is protected by advanced DRM technology
- Browser security measures are enforced
- Your reading activity is monitored for security
- Violations may result in immediate rental termination

## 4. Rental Period
- Your rental expires at the specified end date
- No refunds for early termination
- Extensions may be available for additional fees

## 5. Prohibited Activities
- Copying or downloading the ebook
- Sharing access with others
- Using multiple devices simultaneously
- Attempting to circumvent security measures

## 6. Termination
We reserve the right to terminate your rental immediately if you violate these terms.

## 7. Limitation of Liability
We are not liable for any damages arising from your use of this ebook.

By accepting these terms, you confirm that you have read, understood, and agree to comply with all conditions stated above.
```

### Hardcopy Rental Terms
```markdown
# Hardcopy Book Rental Terms and Conditions

## 1. Rental Agreement
By renting this physical book, you agree to the following terms and conditions.

## 2. Guarantee System
- A guarantee amount is required for all rentals
- The guarantee is refunded upon book return
- Damages may result in partial or full guarantee forfeiture
- Late returns may incur additional fees

## 3. Book Care
- Handle the book with care
- Do not write, highlight, or damage the book
- Keep the book in a safe, dry location
- Return the book in the same condition received

## 4. Return Policy
- Return the book by the specified due date
- Late returns incur daily fees
- Damaged books may result in full guarantee forfeiture
- Lost books require full replacement cost

## 5. Shipping
- Shipping costs are included in rental price
- Return shipping is your responsibility
- Use provided return shipping label
- Track your return shipment

## 6. Condition Assessment
- Books are assessed before shipping
- Return condition is compared to initial condition
- Condition notes are provided for transparency
- Disputes are resolved fairly

## 7. Prohibited Activities
- Writing or marking in the book
- Damaging or destroying the book
- Lending the book to others
- Using the book for commercial purposes

By accepting these terms, you confirm that you have read, understood, and agree to comply with all conditions stated above.
```

### Audio Book Rental Terms
```markdown
# Audio Book Rental Terms and Conditions

## 1. Rental Agreement
By renting this audio book, you agree to the following terms and conditions.

## 2. Streaming Rights
- You may stream this audio book during the rental period
- Streaming is limited to authorized devices
- Offline downloads may be available for premium rentals
- Quality may be adjusted based on your connection

## 3. Usage Tracking
- Your listening progress is tracked for your convenience
- Play time and completion status are recorded
- This data helps improve your experience
- No personal information is shared with third parties

## 4. Security Measures
- Audio streams are protected by DRM technology
- Unauthorized copying is prevented
- Multiple simultaneous streams may be restricted
- Violations result in immediate access termination

## 5. Rental Period
- Access expires at the specified end date
- No refunds for early termination
- Extensions available for additional fees
- Progress is saved for future rentals

## 6. Prohibited Activities
- Recording or copying the audio
- Sharing access with others
- Using unauthorized playback devices
- Attempting to bypass security measures

## 7. Technical Requirements
- Stable internet connection required
- Compatible device and browser needed
- Audio quality may vary by connection
- Technical support available for issues

By accepting these terms, you confirm that you have read, understood, and agree to comply with all conditions stated above.
```

### Subscription Terms
```markdown
# Subscription Terms and Conditions

## 1. Subscription Agreement
By subscribing to our service, you agree to the following terms and conditions.

## 2. Subscription Benefits
- Access to curated book collections
- Unlimited reads within subscription period
- Multiple formats available (ebook, hardcopy, audio)
- Priority customer support

## 3. Usage Limits
- Concurrent reading limits apply
- Fair use policies are enforced
- Excessive usage may be reviewed
- Account sharing is prohibited

## 4. Billing and Payment
- Monthly/annual billing as selected
- Automatic renewal unless cancelled
- Payment methods may be updated
- Failed payments may suspend access

## 5. Cancellation Policy
- Cancel anytime through your account
- No refunds for partial months
- Access continues until end of billing period
- Cancellation takes effect immediately

## 6. Content Availability
- Book collections may change over time
- New books are added regularly
- Some books may be removed
- Availability varies by subscription tier

## 7. Prohibited Activities
- Sharing account credentials
- Excessive concurrent usage
- Attempting to download entire collections
- Circumventing usage limits

By accepting these terms, you confirm that you have read, understood, and agree to comply with all conditions stated above.
```

## 📊 Business Benefits

### For Users
- ✅ **Legal Protection** - Clear understanding of rights and obligations
- ✅ **Transparency** - Know exactly what they're agreeing to
- ✅ **Fair Treatment** - Clear policies and procedures
- ✅ **Dispute Resolution** - Clear terms for handling issues

### For Bookstore
- ✅ **Legal Compliance** - Meet regulatory requirements
- ✅ **Risk Mitigation** - Protect against legal disputes
- ✅ **Clear Policies** - Establish clear rental rules
- ✅ **Audit Trail** - Complete record of user acceptances

### For Publishers
- ✅ **Content Protection** - Clear terms about usage rights
- ✅ **Revenue Protection** - Prevent unauthorized sharing
- ✅ **Legal Framework** - Clear legal basis for enforcement
- ✅ **Dispute Resolution** - Clear procedures for violations

## 🎨 User Experience Flow

### Terms Acceptance Process
1. **Initiate Rental** - User attempts to rent a book
2. **Terms Check** - System validates terms acceptance
3. **Display Terms** - Show relevant terms and conditions
4. **Reading Requirements** - Enforce minimum reading time and scroll depth
5. **Confirmation** - Require double confirmation of understanding
6. **Record Acceptance** - Log acceptance with full audit trail
7. **Proceed with Rental** - Allow rental to proceed

### Reading Verification
1. **Start Timer** - Begin tracking reading time
2. **Track Scroll** - Monitor scroll depth through terms
3. **Progress Display** - Show reading progress to user
4. **Requirements Check** - Verify minimum requirements met
5. **Enable Confirmation** - Allow checkboxes only when requirements met
6. **Final Validation** - Ensure all requirements satisfied

### Audit Trail
1. **Capture Details** - Record IP, device, session information
2. **Log Acceptance** - Store acceptance with all metadata
3. **Link to Rental** - Connect acceptance to specific rental
4. **Version Tracking** - Track which terms version was accepted
5. **Compliance Monitoring** - Monitor acceptance patterns

## 🔧 Configuration Options

### Reading Requirements
```typescript
const readingRequirements = {
  minimumReadTime: 30, // seconds
  minimumScrollDepth: 80, // percentage
  requireConfirmation: true,
  doubleConfirmation: true,
  trackProgress: true
};
```

### Terms Management
```typescript
const termsConfig = {
  // Version control
  versioning: {
    autoIncrement: true,
    requireApproval: true,
    effectiveDateRequired: true
  },
  
  // Acceptance tracking
  tracking: {
    recordIP: true,
    recordUserAgent: true,
    recordSession: true,
    trackReadTime: true,
    trackScrollDepth: true
  },
  
  // Validation
  validation: {
    requireReading: true,
    requireConfirmation: true,
    enforceMinimums: true
  }
};
```

### Terms Types
```typescript
const termsTypes = {
  EBOOK_RENTAL: {
    title: "Ebook Rental Terms",
    required: true,
    version: "1.0"
  },
  HARDCOPY_RENTAL: {
    title: "Hardcopy Rental Terms",
    required: true,
    version: "1.0"
  },
  AUDIO_BOOK_RENTAL: {
    title: "Audio Book Rental Terms",
    required: true,
    version: "1.0"
  },
  SUBSCRIPTION: {
    title: "Subscription Terms",
    required: true,
    version: "1.0"
  }
};
```

## 📈 Analytics & Monitoring

### Key Metrics
- **Acceptance Rate** - Percentage of users who accept terms
- **Reading Time** - Average time spent reading terms
- **Scroll Depth** - Average scroll depth through terms
- **Rejection Rate** - Users who don't accept terms
- **Terms Updates** - Frequency of terms updates

### Compliance Monitoring
- **Acceptance Tracking** - Monitor terms acceptance patterns
- **Version Compliance** - Ensure users accept current terms
- **Audit Trail** - Complete record of all acceptances
- **Legal Compliance** - Ensure regulatory requirements met

## 🚀 Implementation Guide

### 1. Database Migration
```bash
npx prisma migrate dev --name add_terms_and_conditions_system
```

### 2. Environment Setup
```bash
# Add to .env.local
TERMS_ENABLED=true
MINIMUM_READ_TIME=30
MINIMUM_SCROLL_DEPTH=80
REQUIRE_DOUBLE_CONFIRMATION=true
```

### 3. Component Integration
```typescript
// In rental components
import { TermsAndConditionsModal } from '@/components/terms/TermsAndConditionsModal';

// Validate terms before rental
const validateTerms = async (rentalType: string) => {
  const response = await fetch('/api/terms/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rentalType })
  });
  
  const result = await response.json();
  
  if (!result.valid) {
    // Show terms modal
    setTermsToShow(result.termsRequired);
    setShowTermsModal(true);
  }
};

// Handle terms acceptance
const handleTermsAccept = async (acceptanceData: any) => {
  const response = await fetch('/api/terms/accept', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(acceptanceData)
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Proceed with rental
    proceedWithRental();
  }
};
```

### 4. API Integration
```typescript
// Validate terms before rental
const validateTermsBeforeRental = async (rentalType: string) => {
  const response = await fetch('/api/terms/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rentalType })
  });
  return response.json();
};

// Record terms acceptance
const recordTermsAcceptance = async (acceptanceData: any) => {
  const response = await fetch('/api/terms/accept', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(acceptanceData)
  });
  return response.json();
};
```

## 🧪 Testing

### Terms Flow Testing
```typescript
// Test terms validation
test('should require terms acceptance for new rentals', async () => {
  const validation = await TermsService.validateTermsBeforeRental(
    'user-123',
    'ebook',
    'TIME_LIMITED'
  );
  
  expect(validation.valid).toBe(false);
  expect(validation.termsRequired).toBeDefined();
});

// Test terms acceptance
test('should record terms acceptance correctly', async () => {
  const acceptance = await TermsService.recordTermsAcceptance({
    userId: 'user-123',
    termsId: 'terms-456',
    readTime: 45,
    scrollDepth: 95,
    confirmedRead: true,
    confirmedUnderstand: true
  });
  
  expect(acceptance.confirmedRead).toBe(true);
  expect(acceptance.confirmedUnderstand).toBe(true);
});

// Test reading requirements
test('should enforce minimum reading requirements', async () => {
  const hasReadEnough = readTime >= 30 && scrollDepth >= 80;
  expect(hasReadEnough).toBe(true);
});
```

## 🚀 Deployment Considerations

### Production Requirements
1. **Legal Review** - Have terms reviewed by legal counsel
2. **Compliance Monitoring** - Ensure regulatory compliance
3. **Audit Trail** - Maintain complete acceptance records
4. **Version Control** - Manage terms updates properly
5. **User Communication** - Notify users of terms updates

### Operational Considerations
1. **Terms Management** - Regular review and updates
2. **Compliance Monitoring** - Track acceptance patterns
3. **Legal Support** - Handle terms-related inquiries
4. **User Education** - Help users understand terms
5. **Dispute Resolution** - Handle terms-related disputes

## 📈 Future Enhancements

### Advanced Features
- **Multi-language Terms** - Terms in multiple languages
- **Dynamic Terms** - Context-specific terms content
- **Terms Analytics** - Detailed acceptance analytics
- **Automated Updates** - Automatic terms version management
- **Legal Integration** - Integration with legal systems

### Technology Improvements
- **AI Terms Analysis** - Analyze terms for clarity
- **Smart Notifications** - Notify users of terms updates
- **Compliance Dashboard** - Monitor legal compliance
- **Terms Templates** - Automated terms generation
- **Legal API Integration** - Connect with legal databases

## 🔍 Troubleshooting

### Common Issues

#### Terms Not Showing
- Check terms are active and effective
- Verify terms type matches rental type
- Confirm user doesn't have recent acceptance
- Review terms configuration

#### Acceptance Not Recording
- Verify all required fields are provided
- Check database connection and permissions
- Review API endpoint configuration
- Confirm user authentication

#### Reading Requirements Not Met
- Check minimum read time setting
- Verify scroll depth calculation
- Review progress tracking logic
- Confirm UI updates correctly

## 📞 Support

For technical support or legal inquiries:
- **Email**: legal@brenda-librave.com
- **Documentation**: /docs/terms-and-conditions-system
- **GitHub Issues**: Report bugs and feature requests
- **Legal Support**: 24/7 legal compliance support

---

This terms and conditions system ensures legal compliance, user protection, and comprehensive audit trails while providing a smooth user experience for accepting rental terms. 