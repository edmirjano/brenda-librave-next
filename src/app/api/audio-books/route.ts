import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { AudioBookService } from '@/lib/services/audio-books';

export async function GET() {
  try {
    const audioBooks = await AudioBookService.getActiveAudioBooks();
    
    return NextResponse.json({
      audioBooks,
      total: audioBooks.length
    });
  } catch (error) {
    console.error('Error getting audio books:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      audioBookId, 
      rentalType, 
      orderItemId, 
      shippingAddress, 
      guaranteeAmount 
    } = await request.json();

    if (!audioBookId || !rentalType || !orderItemId) {
      return NextResponse.json({ 
        error: 'Audio book ID, rental type, and order item ID are required' 
      }, { status: 400 });
    }

    // Create audio book rental
    const rental = await AudioBookService.createAudioBookRental({
      userId: session.user.id,
      audioBookId,
      orderItemId,
      rentalType,
      shippingAddress,
      guaranteeAmount
    });

    return NextResponse.json({
      success: true,
      rental
    });

  } catch (error) {
    console.error('Error creating audio book rental:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 