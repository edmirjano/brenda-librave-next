import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { SubscriptionService } from '@/lib/services/subscriptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userSubscription = await SubscriptionService.getUserSubscription(session.user.id);
    const subscriptionBooks = await SubscriptionService.getSubscriptionBooks(session.user.id);

    return NextResponse.json({
      userSubscription,
      subscriptionBooks,
      hasActiveSubscription: !!userSubscription?.hasAccess
    });

  } catch (error) {
    console.error('Error getting user subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 