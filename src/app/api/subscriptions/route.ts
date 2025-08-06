import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { SubscriptionService } from '@/lib/services/subscriptions';

export async function GET() {
  try {
    const subscriptions = await SubscriptionService.getActiveSubscriptions();
    
    return NextResponse.json({
      subscriptions,
      total: subscriptions.length
    });
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscriptionId, paymentMethod } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Subscribe user to the subscription
    const userSubscription = await SubscriptionService.subscribeUser(
      session.user.id,
      subscriptionId,
      paymentMethod
    );

    return NextResponse.json({
      success: true,
      userSubscription: {
        id: userSubscription.id,
        subscriptionId: userSubscription.subscriptionId,
        startDate: userSubscription.startDate,
        endDate: userSubscription.endDate,
        isActive: userSubscription.isActive,
        autoRenew: userSubscription.autoRenew
      }
    });

  } catch (error) {
    console.error('Error subscribing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 