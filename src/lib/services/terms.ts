import { prisma } from '@/lib/db/prisma';

export interface TermsAndConditions {
  id: string;
  title: string;
  version: string;
  content: string;
  type: 'EBOOK_RENTAL' | 'HARDCOPY_RENTAL' | 'AUDIO_BOOK_RENTAL' | 'SUBSCRIPTION' | 'GENERAL_RENTAL' | 'PRIVACY_POLICY' | 'DATA_PROTECTION';
  isActive: boolean;
  effectiveDate: Date;
  expiryDate?: Date;
}

export interface UserTermsAcceptance {
  id: string;
  userId: string;
  termsId: string;
  acceptedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  rentalType?: string;
  hardcopyRentalType?: string;
  audioBookRentalType?: string;
  subscriptionType?: string;
  readTime?: number;
  scrollDepth?: number;
  confirmedRead: boolean;
  confirmedUnderstand: boolean;
}

export interface TermsValidation {
  hasAccepted: boolean;
  termsId?: string;
  acceptanceId?: string;
  requiresAcceptance: boolean;
  termsContent?: string;
  termsTitle?: string;
}

export class TermsService {
  /**
   * Get active terms and conditions by type
   */
  static async getActiveTerms(type: string): Promise<TermsAndConditions | null> {
    const terms = await prisma.termsAndConditions.findFirst({
      where: {
        type: type as any,
        isActive: true,
        effectiveDate: { lte: new Date() },
        OR: [
          { expiryDate: null },
          { expiryDate: { gt: new Date() } }
        ]
      },
      orderBy: { effectiveDate: 'desc' }
    });

    return terms;
  }

  /**
   * Check if user has accepted terms for a specific rental type
   */
  static async checkUserTermsAcceptance(
    userId: string,
    termsType: string,
    rentalType?: string
  ): Promise<TermsValidation> {
    // Get active terms for this type
    const terms = await this.getActiveTerms(termsType);
    
    if (!terms) {
      return {
        hasAccepted: false,
        requiresAcceptance: false
      };
    }

    // Check if user has accepted these terms
    const acceptance = await prisma.userTermsAcceptance.findFirst({
      where: {
        userId,
        termsId: terms.id,
        confirmedRead: true,
        confirmedUnderstand: true,
        acceptedAt: { gte: terms.effectiveDate }
      },
      orderBy: { acceptedAt: 'desc' }
    });

    if (acceptance) {
      return {
        hasAccepted: true,
        termsId: terms.id,
        acceptanceId: acceptance.id,
        requiresAcceptance: false
      };
    }

    return {
      hasAccepted: false,
      termsId: terms.id,
      requiresAcceptance: true,
      termsContent: terms.content,
      termsTitle: terms.title
    };
  }

  /**
   * Record user terms acceptance
   */
  static async recordTermsAcceptance(data: {
    userId: string;
    termsId: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    rentalType?: string;
    hardcopyRentalType?: string;
    audioBookRentalType?: string;
    subscriptionType?: string;
    readTime?: number;
    scrollDepth?: number;
    confirmedRead: boolean;
    confirmedUnderstand: boolean;
  }): Promise<UserTermsAcceptance> {
    const acceptance = await prisma.userTermsAcceptance.create({
      data: {
        userId: data.userId,
        termsId: data.termsId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        sessionId: data.sessionId,
        rentalType: data.rentalType as any,
        hardcopyRentalType: data.hardcopyRentalType as any,
        audioBookRentalType: data.audioBookRentalType as any,
        subscriptionType: data.subscriptionType,
        readTime: data.readTime,
        scrollDepth: data.scrollDepth,
        confirmedRead: data.confirmedRead,
        confirmedUnderstand: data.confirmedUnderstand
      }
    });

    return acceptance;
  }

  /**
   * Validate terms acceptance before rental
   */
  static async validateTermsBeforeRental(
    userId: string,
    rentalType: 'ebook' | 'hardcopy' | 'audio' | 'subscription',
    specificRentalType?: string
  ): Promise<{ valid: boolean; termsRequired?: TermsAndConditions; message?: string }> {
    let termsType: string;
    
    switch (rentalType) {
      case 'ebook':
        termsType = 'EBOOK_RENTAL';
        break;
      case 'hardcopy':
        termsType = 'HARDCOPY_RENTAL';
        break;
      case 'audio':
        termsType = 'AUDIO_BOOK_RENTAL';
        break;
      case 'subscription':
        termsType = 'SUBSCRIPTION';
        break;
      default:
        termsType = 'GENERAL_RENTAL';
    }

    const validation = await this.checkUserTermsAcceptance(userId, termsType, specificRentalType);

    if (validation.requiresAcceptance) {
      const terms = await this.getActiveTerms(termsType);
      return {
        valid: false,
        termsRequired: terms || undefined,
        message: 'You must read and accept the terms and conditions before proceeding with this rental.'
      };
    }

    return { valid: true };
  }

  /**
   * Get terms content for display
   */
  static async getTermsForDisplay(termsType: string): Promise<TermsAndConditions | null> {
    return await this.getActiveTerms(termsType);
  }

  /**
   * Create new terms and conditions
   */
  static async createTerms(data: {
    title: string;
    version: string;
    content: string;
    type: string;
    effectiveDate?: Date;
    expiryDate?: Date;
  }): Promise<TermsAndConditions> {
    // Deactivate previous terms of the same type
    await prisma.termsAndConditions.updateMany({
      where: {
        type: data.type as any,
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    // Create new terms
    const terms = await prisma.termsAndConditions.create({
      data: {
        title: data.title,
        version: data.version,
        content: data.content,
        type: data.type as any,
        effectiveDate: data.effectiveDate || new Date(),
        expiryDate: data.expiryDate,
        isActive: true
      }
    });

    return terms;
  }

  /**
   * Get user's terms acceptance history
   */
  static async getUserTermsHistory(userId: string) {
    return await prisma.userTermsAcceptance.findMany({
      where: { userId },
      include: {
        terms: {
          select: {
            id: true,
            title: true,
            version: true,
            type: true,
            effectiveDate: true
          }
        }
      },
      orderBy: { acceptedAt: 'desc' }
    });
  }

  /**
   * Get terms acceptance statistics
   */
  static async getTermsAcceptanceStats() {
    const [
      totalTerms,
      activeTerms,
      totalAcceptances,
      recentAcceptances
    ] = await Promise.all([
      prisma.termsAndConditions.count(),
      prisma.termsAndConditions.count({ where: { isActive: true } }),
      prisma.userTermsAcceptance.count(),
      prisma.userTermsAcceptance.count({
        where: {
          acceptedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ]);

    return {
      terms: {
        total: totalTerms,
        active: activeTerms
      },
      acceptances: {
        total: totalAcceptances,
        recent: recentAcceptances
      }
    };
  }

  /**
   * Check if terms need to be re-accepted (e.g., updated terms)
   */
  static async checkTermsReacceptance(
    userId: string,
    termsType: string
  ): Promise<{ needsReacceptance: boolean; newTerms?: TermsAndConditions }> {
    // Get the most recent terms acceptance for this user and type
    const lastAcceptance = await prisma.userTermsAcceptance.findFirst({
      where: {
        userId,
        terms: {
          type: termsType as any
        }
      },
      include: {
        terms: true
      },
      orderBy: { acceptedAt: 'desc' }
    });

    if (!lastAcceptance) {
      const newTerms = await this.getActiveTerms(termsType);
      return {
        needsReacceptance: true,
        newTerms: newTerms || undefined
      };
    }

    // Check if there are newer terms since last acceptance
    const newerTerms = await prisma.termsAndConditions.findFirst({
      where: {
        type: termsType as any,
        isActive: true,
        effectiveDate: { gt: lastAcceptance.acceptedAt }
      }
    });

    if (newerTerms) {
      return {
        needsReacceptance: true,
        newTerms: newerTerms
      };
    }

    return { needsReacceptance: false };
  }

  /**
   * Get default terms content templates
   */
  static getDefaultTermsTemplates() {
    return {
      EBOOK_RENTAL: {
        title: "Ebook Rental Terms and Conditions",
        content: `
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
        `
      },
      HARDCOPY_RENTAL: {
        title: "Hardcopy Book Rental Terms and Conditions",
        content: `
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
        `
      },
      AUDIO_BOOK_RENTAL: {
        title: "Audio Book Rental Terms and Conditions",
        content: `
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
        `
      },
      SUBSCRIPTION: {
        title: "Subscription Terms and Conditions",
        content: `
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
        `
      }
    };
  }
} 