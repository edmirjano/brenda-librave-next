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

    const { 
      termsId, 
      rentalType, 
      hardcopyRentalType, 
      audioBookRentalType, 
      subscriptionType,
      readTime,
      scrollDepth,
      confirmedRead,
      confirmedUnderstand 
    } = await request.json();

    if (!termsId || !confirmedRead || !confirmedUnderstand) {
      return NextResponse.json({ 
        error: 'Terms ID and confirmations are required' 
      }, { status: 400 });
    }

    // Get client information
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';
    const sessionId = session.user.id; // Using user ID as session identifier

    // Record terms acceptance
    const acceptance = await TermsService.recordTermsAcceptance({
      userId: session.user.id,
      termsId,
      ipAddress: ipAddress.split(',')[0].trim(), // Get first IP if multiple
      userAgent,
      sessionId,
      rentalType,
      hardcopyRentalType,
      audioBookRentalType,
      subscriptionType,
      readTime,
      scrollDepth,
      confirmedRead,
      confirmedUnderstand
    });

    return NextResponse.json({
      success: true,
      acceptance: {
        id: acceptance.id,
        acceptedAt: acceptance.acceptedAt,
        termsId: acceptance.termsId
      },
      message: 'Terms and conditions accepted successfully'
    });

  } catch (error) {
    console.error('Error recording terms acceptance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 