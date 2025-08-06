import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { BookRentalService } from '@/lib/services/book-rentals';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const bookId = params.id;

    // Get rental availability for the book
    const rentalAvailability = await BookRentalService.getRentalAvailability(bookId);

    // If user is logged in, get their rental info
    let userRentalInfo = null;
    if (session?.user?.id) {
      userRentalInfo = await BookRentalService.getBookRentalInfo(bookId, session.user.id);
    }

    // Get recommended rental type
    const recommendedType = await BookRentalService.getRecommendedRentalType(bookId);

    // Check if book can be rented at all
    const canBeRented = await BookRentalService.canBeRented(bookId);

    return NextResponse.json({
      bookId,
      canBeRented,
      rentalAvailability,
      userRentalInfo,
      recommendedType,
      hasActiveRental: userRentalInfo?.activeRentals?.ebook || userRentalInfo?.activeRentals?.hardcopy
    });

  } catch (error) {
    console.error('Error getting rental info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 