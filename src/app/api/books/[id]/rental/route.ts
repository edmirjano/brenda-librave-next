import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { randomBytes } from 'crypto';

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
    const { rentalType, orderItemId } = await request.json();

    // Validate rental type
    const validRentalTypes = ['SINGLE_READ', 'TIME_LIMITED', 'UNLIMITED_READS'];
    if (!validRentalTypes.includes(rentalType)) {
      return NextResponse.json({ error: 'Invalid rental type' }, { status: 400 });
    }

    // Check if book exists and has digital version
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        author: true,
        hasDigital: true,
        digitalFileUrl: true,
        digitalFileSize: true,
        digitalPrice: true
      }
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (!book.hasDigital || !book.digitalFileUrl) {
      return NextResponse.json({ error: 'Digital version not available' }, { status: 404 });
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
    const existingRental = await prisma.ebookRental.findFirst({
      where: {
        userId: session.user.id,
        bookId: bookId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    });

    if (existingRental) {
      return NextResponse.json({ 
        error: 'You already have an active rental for this book',
        rentalId: existingRental.id,
        securityToken: existingRental.securityToken
      }, { status: 409 });
    }

    // Calculate rental duration based on type
    let endDate: Date;
    const startDate = new Date();
    
    switch (rentalType) {
      case 'SINGLE_READ':
        // Single read - expires after 24 hours
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'TIME_LIMITED':
        // Time limited - expires after 7 days
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'UNLIMITED_READS':
        // Unlimited reads - expires after 30 days
        endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    }

    // Generate unique security token
    const securityToken = randomBytes(32).toString('hex');

    // Create watermark data (user-specific)
    const watermarkData = {
      userId: session.user.id,
      userName: session.user.name,
      rentalId: null, // Will be set after creation
      timestamp: new Date().toISOString(),
      deviceInfo: request.headers.get('user-agent') || 'unknown'
    };

    // Create the rental
    const rental = await prisma.ebookRental.create({
      data: {
        userId: session.user.id,
        bookId: bookId,
        orderItemId: orderItemId,
        rentalType: rentalType as any,
        rentalPrice: orderItem.price,
        currency: orderItem.currency,
        startDate,
        endDate,
        securityToken,
        watermarkData: JSON.stringify(watermarkData),
        isActive: true
      }
    });

    // Update watermark data with rental ID
    watermarkData.rentalId = rental.id;
    await prisma.ebookRental.update({
      where: { id: rental.id },
      data: {
        watermarkData: JSON.stringify(watermarkData)
      }
    });

    // Log the rental start
    await prisma.ebookAccessLog.create({
      data: {
        rentalId: rental.id,
        userId: session.user.id,
        bookId: bookId,
        accessType: 'RENTAL_START',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: session.user.id,
        deviceFingerprint: request.headers.get('sec-ch-ua') || 'unknown'
      }
    });

    return NextResponse.json({
      rentalId: rental.id,
      securityToken: rental.securityToken,
      bookId: book.id,
      title: book.title,
      author: book.author,
      ebookUrl: book.digitalFileUrl,
      fileSize: book.digitalFileSize,
      rentalType: rental.rentalType,
      startDate: rental.startDate,
      endDate: rental.endDate,
      hasAccess: true
    });

  } catch (error) {
    console.error('Error creating rental:', error);
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
    const securityToken = searchParams.get('token');

    if (!rentalId || !securityToken) {
      return NextResponse.json({ error: 'Missing rental parameters' }, { status: 400 });
    }

    // Check if rental exists and is valid
    const rental = await prisma.ebookRental.findFirst({
      where: {
        id: rentalId,
        securityToken: securityToken,
        userId: session.user.id,
        bookId: bookId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            hasDigital: true,
            digitalFileUrl: true,
            digitalFileSize: true
          }
        }
      }
    });

    if (!rental) {
      return NextResponse.json({ 
        error: 'Rental not found or expired' 
      }, { status: 404 });
    }

    if (!rental.book.hasDigital || !rental.book.digitalFileUrl) {
      return NextResponse.json({ 
        error: 'Digital version not available' 
      }, { status: 404 });
    }

    // Update access count and last access time
    await prisma.ebookRental.update({
      where: { id: rentalId },
      data: {
        accessCount: {
          increment: 1
        },
        lastAccessAt: new Date()
      }
    });

    // Log the access
    await prisma.ebookAccessLog.create({
      data: {
        rentalId: rental.id,
        userId: session.user.id,
        bookId: bookId,
        accessType: 'RENTAL_READ',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: session.user.id,
        deviceFingerprint: request.headers.get('sec-ch-ua') || 'unknown'
      }
    });

    return NextResponse.json({
      rentalId: rental.id,
      securityToken: rental.securityToken,
      bookId: rental.book.id,
      title: rental.book.title,
      author: rental.book.author,
      ebookUrl: rental.book.digitalFileUrl,
      fileSize: rental.book.digitalFileSize,
      rentalType: rental.rentalType,
      startDate: rental.startDate,
      endDate: rental.endDate,
      accessCount: rental.accessCount + 1,
      hasAccess: true
    });

  } catch (error) {
    console.error('Error checking rental access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 