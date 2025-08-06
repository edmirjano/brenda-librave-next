import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { TermsService } from '@/lib/services/terms';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rentalType, specificRentalType } = await request.json();

    if (!rentalType) {
      return NextResponse.json({ 
        error: 'Rental type is required' 
      }, { status: 400 });
    }

    // Validate terms acceptance before rental
    const validation = await TermsService.validateTermsBeforeRental(
      session.user.id,
      rentalType,
      specificRentalType
    );

    if (!validation.valid) {
      return NextResponse.json({
        valid: false,
        termsRequired: validation.termsRequired,
        message: validation.message
      });
    }

    return NextResponse.json({
      valid: true,
      message: 'Terms and conditions accepted'
    });

  } catch (error) {
    console.error('Error validating terms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 