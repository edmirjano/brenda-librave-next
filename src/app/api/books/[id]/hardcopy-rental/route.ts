import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookId = params.id;
    const { 
      rentalType, 
      orderItemId, 
      shippingAddress,
      guaranteeAmount 
    } = await request.json();

    // Validate rental type
    const validRentalTypes = ['SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM', 'EXTENDED_TERM'];
    if (!validRentalTypes.includes(rentalType)) {
      return NextResponse.json({ error: 'Invalid rental type' }, { status: 400 });
    }

    // Check if book exists and is available for rental
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        inventory: true,
        active: true
      }
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (!book.active) {
      return NextResponse.json({ error: 'Book not available for rental' }, { status: 404 });
    }

    if (book.inventory <= 0) {
      return NextResponse.json({ error: 'Book not in stock for rental' }, { status: 404 });
    }

    // Check if user has purchased this rental
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: orderItemId,
        bookId: bookId,
        isRental: true,
        order: {
          userId: session.user.id,
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        }
      },
      include: {
        order: true
      }
    });

    if (!orderItem) {
      return NextResponse.json({ 
        error: 'Rental purchase not found or not paid' 
      }, { status: 403 });
    }

    // Check if user already has an active rental for this book
    const existingRental = await prisma.hardcopyRental.findFirst({
      where: {
        userId: session.user.id,
        bookId: bookId,
        isActive: true,
        isReturned: false
      }
    });

    if (existingRental) {
      return NextResponse.json({ 
        error: 'You already have an active rental for this book',
        rentalId: existingRental.id
      }, { status: 409 });
    }

    // Calculate rental duration and pricing based on type
    let endDate: Date;
    let rentalPrice: number;
    const startDate = new Date();
    
    switch (rentalType) {
      case 'SHORT_TERM':
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        rentalPrice = Math.round(book.price * 0.15); // 15% of book price
        break;
      case 'MEDIUM_TERM':
        endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
        rentalPrice = Math.round(book.price * 0.25); // 25% of book price
        break;
      case 'LONG_TERM':
        endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        rentalPrice = Math.round(book.price * 0.4); // 40% of book price
        break;
      case 'EXTENDED_TERM':
        endDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days
        rentalPrice = Math.round(book.price * 0.6); // 60% of book price
        break;
      default:
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        rentalPrice = Math.round(book.price * 0.15);
    }

    // Calculate guarantee amount (default to 80% of book price if not provided)
    const calculatedGuarantee = guaranteeAmount || Math.round(book.price * 0.8);

    // Create the hardcopy rental
    const rental = await prisma.hardcopyRental.create({
      data: {
        userId: session.user.id,
        bookId: bookId,
        orderItemId: orderItemId,
        rentalType: rentalType as any,
        rentalPrice,
        guaranteeAmount: calculatedGuarantee,
        currency: orderItem.currency,
        startDate,
        endDate,
        shippingAddress,
        isActive: true,
        isReturned: false,
        initialCondition: 'EXCELLENT'
      }
    });

    // Log the rental creation
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: session.user.id,
        bookId: bookId,
        logType: 'RENTAL_CREATED',
        description: `Hardcopy rental created for ${rentalType} period`,
        amount: rentalPrice,
        currency: orderItem.currency
      }
    });

    // Log guarantee charge
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: session.user.id,
        bookId: bookId,
        logType: 'GUARANTEE_CHARGED',
        description: `Guarantee amount charged: ${calculatedGuarantee} ${orderItem.currency}`,
        amount: calculatedGuarantee,
        currency: orderItem.currency
      }
    });

    // Update book inventory (reserve one copy)
    await prisma.book.update({
      where: { id: bookId },
      data: {
        inventory: {
          decrement: 1
        }
      }
    });

    return NextResponse.json({
      rentalId: rental.id,
      bookId: book.id,
      title: book.title,
      author: book.author,
      rentalType: rental.rentalType,
      rentalPrice: rental.rentalPrice,
      guaranteeAmount: rental.guaranteeAmount,
      currency: rental.currency,
      startDate: rental.startDate,
      endDate: rental.endDate,
      shippingAddress: rental.shippingAddress,
      hasAccess: true
    });

  } catch (error) {
    console.error('Error creating hardcopy rental:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookId = params.id;
    const { searchParams } = new URL(request.url);
    const rentalId = searchParams.get('rentalId');

    if (!rentalId) {
      return NextResponse.json({ error: 'Missing rental ID' }, { status: 400 });
    }

    // Check if rental exists and belongs to user
    const rental = await prisma.hardcopyRental.findFirst({
      where: {
        id: rentalId,
        userId: session.user.id,
        bookId: bookId,
        isActive: true
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            price: true
          }
        }
      }
    });

    if (!rental) {
      return NextResponse.json({ 
        error: 'Rental not found or not active' 
      }, { status: 404 });
    }

    return NextResponse.json({
      rentalId: rental.id,
      bookId: rental.book.id,
      title: rental.book.title,
      author: rental.book.author,
      rentalType: rental.rentalType,
      rentalPrice: rental.rentalPrice,
      guaranteeAmount: rental.guaranteeAmount,
      currency: rental.currency,
      startDate: rental.startDate,
      endDate: rental.endDate,
      returnDate: rental.returnDate,
      isReturned: rental.isReturned,
      isDamaged: rental.isDamaged,
      guaranteeRefunded: rental.guaranteeRefunded,
      refundAmount: rental.refundAmount,
      initialCondition: rental.initialCondition,
      returnCondition: rental.returnCondition,
      shippingAddress: rental.shippingAddress,
      trackingNumber: rental.trackingNumber,
      returnTracking: rental.returnTracking,
      hasAccess: true
    });

  } catch (error) {
    console.error('Error checking hardcopy rental access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 