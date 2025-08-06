import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { SubscriptionService } from '@/lib/services/subscriptions';

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
    const access = await SubscriptionService.checkSubscriptionAccess(session.user.id, bookId);

    return NextResponse.json({
      bookId,
      hasAccess: access.hasAccess,
      userSubscription: access.userSubscription,
      availableBooks: access.availableBooks,
      currentReads: access.currentReads,
      maxConcurrent: access.maxConcurrent,
      canReadMore: access.canReadMore
    });

  } catch (error) {
    console.error('Error checking subscription access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const { action } = await request.json();

    if (action === 'start') {
      const success = await SubscriptionService.startReading(session.user.id, bookId);
      
      if (!success) {
        return NextResponse.json({ 
          error: 'Cannot start reading. Check your subscription and concurrent reading limits.' 
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Started reading book'
      });

    } else if (action === 'stop') {
      await SubscriptionService.stopReading(session.user.id, bookId);
      
      return NextResponse.json({
        success: true,
        message: 'Stopped reading book'
      });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error managing subscription access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 