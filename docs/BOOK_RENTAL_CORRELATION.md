# 📚 Book Rental Correlation System

## Overview

The Brënda Librave rental system supports books that can have **both hardcopy and ebook versions**, **only hardcopy**, or **only ebook**. This flexible approach allows publishers to offer their content in multiple formats while maintaining a unified book entity in the database.

## 🎯 Key Concepts

### Book Entity Structure
A single book in the database can have:
- ✅ **Both versions** - Hardcopy + Ebook
- ✅ **Hardcopy only** - Physical book only
- ✅ **Ebook only** - Digital book only

### Rental Options Display
The system intelligently shows rental options based on what's available:

#### **Both Versions Available**
```
┌─────────────────────────────────────┐
│           Opsionet e Rentimit      │
├─────────────────────────────────────┤
│  📱 Rentim Digital    📖 Rentim   │
│     • Akses i menjëhershëm         │
│     • Siguri maksimale             │
│     • Pa dërgesa                   │
│                                     │
│     €15.00                         │
│     çmimi fillestar                │
└─────────────────────────────────────┘
```

#### **Ebook Only**
```
┌─────────────────────────────────────┐
│      Opsionet e Rentimit Digital   │
│                                     │
│  • Single Read (24h) - €5.00       │
│  • Time Limited (7 days) - €10.00  │
│  • Unlimited Reads (30 days) - €15 │
└─────────────────────────────────────┘
```

#### **Hardcopy Only**
```
┌─────────────────────────────────────┐
│      Opsionet e Rentimit Fizik     │
│                                     │
│  • Short Term (7 days) - €12.50    │
│    Guarantee: €40.00               │
│  • Medium Term (14 days) - €20.00  │
│    Guarantee: €40.00               │
└─────────────────────────────────────┘
```

## 🛠️ Technical Implementation

### Database Schema

#### Book Model Fields
```prisma
model Book {
  // Core identification
  id              String    @id @default(cuid())
  slug            String    @unique
  
  // Version availability
  hasDigital      Boolean   @default(false) // Has ebook version
  hasHardcopy     Boolean   @default(true)  // Has physical version
  
  // Pricing
  price           Float?    // Base price for hardcopy
  digitalPrice    Float?    // Digital price for ebook
  
  // Inventory
  inventory       Int       @default(0) // Physical inventory for hardcopy
  
  // Digital file info
  digitalFileUrl  String?   // URL to EPUB file
  digitalFileSize Int?      // File size in bytes
  
  // Relations to rentals
  rentals         EbookRental[]      // Ebook rentals
  hardcopyRentals HardcopyRental[]   // Hardcopy rentals
}
```

### Component Logic

#### BookRentalOptions Component
```typescript
// Determine what rental options are available
const hasEbookRental = book.hasDigital && book.digitalPrice && book.digitalPrice > 0;
const hasHardcopyRental = book.hasHardcopy && book.price && book.price > 0 && book.inventory > 0;

// Auto-select if only one option is available
if (hasEbookRental && !hasHardcopyRental) {
  setSelectedMode('ebook');
} else if (hasHardcopyRental && !hasEbookRental) {
  setSelectedMode('hardcopy');
}
```

### Service Layer

#### BookRentalService
```typescript
export class BookRentalService {
  // Get comprehensive rental information
  static async getBookRentalInfo(bookId: string, userId: string) {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        hasDigital: true,
        hasHardcopy: true,
        digitalPrice: true,
        price: true,
        inventory: true
      }
    });

    // Check active rentals for both types
    const [ebookRental, hardcopyRental] = await Promise.all([
      book.hasDigital ? prisma.ebookRental.findFirst({...}) : null,
      book.hasHardcopy ? prisma.hardcopyRental.findFirst({...}) : null
    ]);

    return {
      hasDigital: book.hasDigital,
      hasHardcopy: book.hasHardcopy,
      activeRentals: {
        ebook: ebookRental ? {...} : undefined,
        hardcopy: hardcopyRental ? {...} : undefined
      }
    };
  }
}
```

## 🎨 User Experience Flow

### Scenario 1: Book with Both Versions
1. **User visits book page**
2. **System detects both versions available**
3. **Shows format selection cards**
4. **User chooses format (Digital/Fizik)**
5. **Shows appropriate rental options**
6. **User selects rental type and proceeds**

### Scenario 2: Ebook Only
1. **User visits book page**
2. **System detects only ebook available**
3. **Auto-selects ebook mode**
4. **Shows ebook rental options directly**
5. **User selects rental type and proceeds**

### Scenario 3: Hardcopy Only
1. **User visits book page**
2. **System detects only hardcopy available**
3. **Auto-selects hardcopy mode**
4. **Shows hardcopy rental options directly**
5. **User selects rental type and proceeds**

## 📊 Business Logic

### Availability Detection
```typescript
const hasEbookRental = book.hasDigital && book.digitalPrice && book.digitalPrice > 0;
const hasHardcopyRental = book.hasHardcopy && book.price && book.price > 0 && book.inventory > 0;
```

### Recommendation Algorithm
```typescript
static async getRecommendedRentalType(bookId: string): Promise<'ebook' | 'hardcopy' | null> {
  // If only one option is available, recommend that
  if (hasEbookRental && !hasHardcopyRental) return 'ebook';
  if (hasHardcopyRental && !hasEbookRental) return 'hardcopy';

  // If both available, recommend based on characteristics
  if (hasEbookRental && hasHardcopyRental) {
    // Recommend ebook for larger files
    if (book.digitalFileSize > 10 * 1024 * 1024) return 'ebook';
    
    // Recommend hardcopy for low inventory
    if (book.inventory <= 2) return 'hardcopy';
    
    // Default to ebook for convenience
    return 'ebook';
  }

  return null;
}
```

### Pricing Correlation
```typescript
// Ebook pricing (based on digital price)
const ebookPricing = {
  SHORT_TERM: { rentalPrice: Math.round(digitalPrice * 0.3), duration: '24 orë' },
  MEDIUM_TERM: { rentalPrice: Math.round(digitalPrice * 0.6), duration: '7 ditë' },
  LONG_TERM: { rentalPrice: Math.round(digitalPrice * 0.8), duration: '30 ditë' },
  UNLIMITED_READS: { rentalPrice: digitalPrice, duration: '30 ditë' }
};

// Hardcopy pricing (based on physical price)
const hardcopyPricing = {
  SHORT_TERM: { 
    rentalPrice: Math.round(price * 0.15), 
    guaranteeAmount: Math.round(price * 0.8),
    duration: '7 ditë' 
  },
  MEDIUM_TERM: { 
    rentalPrice: Math.round(price * 0.25), 
    guaranteeAmount: Math.round(price * 0.8),
    duration: '14 ditë' 
  }
};
```

## 🔧 Configuration Examples

### Book with Both Versions
```typescript
const bookWithBoth = {
  id: "book-123",
  title: "The Great Novel",
  author: "John Doe",
  hasDigital: true,
  hasHardcopy: true,
  digitalPrice: 20.00,  // €20 for ebook
  price: 50.00,         // €50 for hardcopy
  inventory: 5,          // 5 physical copies
  digitalFileSize: 5242880  // 5MB EPUB
};
```

### Ebook Only
```typescript
const ebookOnly = {
  id: "book-456",
  title: "Digital Guide",
  author: "Jane Smith",
  hasDigital: true,
  hasHardcopy: false,
  digitalPrice: 15.00,
  price: null,
  inventory: 0,
  digitalFileSize: 2097152  // 2MB EPUB
};
```

### Hardcopy Only
```typescript
const hardcopyOnly = {
  id: "book-789",
  title: "Physical Textbook",
  author: "Bob Wilson",
  hasDigital: false,
  hasHardcopy: true,
  digitalPrice: null,
  price: 75.00,
  inventory: 3,
  digitalFileSize: null
};
```

## 📈 Analytics & Insights

### Rental Type Distribution
```typescript
// Track which format users prefer
const rentalStats = {
  totalRentals: 1000,
  ebookRentals: 650,    // 65% prefer digital
  hardcopyRentals: 350, // 35% prefer physical
  bothFormatsAvailable: 200, // 200 books have both
  formatChoice: {
    ebook: 120,         // 60% choose ebook when both available
    hardcopy: 80        // 40% choose hardcopy when both available
  }
};
```

### Revenue Optimization
```typescript
// Revenue per book with both formats
const revenueAnalysis = {
  bookId: "book-123",
  totalRevenue: 1500,
  ebookRevenue: 900,    // 60% from digital
  hardcopyRevenue: 600, // 40% from physical
  averageRentalValue: {
    ebook: 15.00,
    hardcopy: 25.00     // Higher due to guarantee system
  }
};
```

## 🚀 Implementation Guide

### 1. Database Migration
```bash
# Add hasHardcopy field
npx prisma migrate dev --name add_has_hardcopy_field
```

### 2. Component Integration
```typescript
// In BookDetail component
import { BookRentalOptions } from '@/components/books/BookRentalOptions';

// Show rental options based on book availability
{book && (
  <BookRentalOptions
    book={book}
    onEbookRentalSelect={handleEbookRentalSelect}
    onHardcopyRentalSelect={handleHardcopyRentalSelect}
  />
)}
```

### 3. API Integration
```typescript
// Get comprehensive rental info
const getRentalInfo = async (bookId: string) => {
  const response = await fetch(`/api/books/${bookId}/rental-info`);
  const data = await response.json();
  
  return {
    canBeRented: data.canBeRented,
    hasEbookRental: data.rentalAvailability.hasEbookRental,
    hasHardcopyRental: data.rentalAvailability.hasHardcopyRental,
    recommendedType: data.recommendedType,
    userActiveRental: data.userRentalInfo?.activeRentals
  };
};
```

## 🎯 Benefits

### For Publishers
- ✅ **Flexible Content Distribution** - Offer both formats or just one
- ✅ **Revenue Maximization** - Multiple rental streams per book
- ✅ **Market Reach** - Appeal to both digital and physical readers
- ✅ **Inventory Management** - Track physical and digital availability separately

### For Readers
- ✅ **Format Choice** - Choose preferred reading method
- ✅ **Availability** - Access books in available format
- ✅ **Price Optimization** - Choose most affordable option
- ✅ **Convenience** - Digital for immediate access, physical for traditional reading

### For Bookstore
- ✅ **Inventory Efficiency** - Better utilization of both formats
- ✅ **Customer Satisfaction** - Multiple options for different preferences
- ✅ **Revenue Growth** - Multiple rental streams per book
- ✅ **Market Differentiation** - Unique dual-format rental system

## 🔍 Troubleshooting

### Common Issues

#### Book Shows No Rental Options
- Check `hasDigital` and `hasHardcopy` flags
- Verify `digitalPrice` and `price` are set
- Ensure `inventory > 0` for hardcopy
- Confirm book is `active: true`

#### Wrong Format Selected
- Review recommendation algorithm
- Check book characteristics (file size, inventory)
- Verify pricing configuration
- Test with different book types

#### Rental Creation Fails
- Ensure user has valid payment method
- Check for existing active rentals
- Verify book availability
- Confirm rental type is valid

## 📞 Support

For technical support or rental inquiries:
- **Email**: rentals@brenda-librave.com
- **Documentation**: /docs/book-rental-correlation
- **GitHub Issues**: Report bugs and feature requests
- **Customer Service**: 24/7 rental support

---

This correlation system provides a flexible, user-friendly approach to book rentals that accommodates the diverse needs of publishers and readers while maximizing revenue opportunities for the bookstore. 