import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth/config';
import { SubscriptionService } from '@/lib/services/subscriptions';
import { SubscriptionManagement } from '@/components/admin/SubscriptionManagement';

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not admin
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login?callbackUrl=/admin/subscriptions');
  }

  // Get subscription data
  const subscriptions = await SubscriptionService.getActiveSubscriptions();
  const stats = await SubscriptionService.getSubscriptionStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menaxhimi i Abonimeve</h1>
          <p className="text-gray-600 mt-2">
            Menaxhoni planet e abonimit dhe përdoruesit e abonuar
          </p>
        </div>
      </div>

      <SubscriptionManagement 
        subscriptions={subscriptions}
        stats={stats}
      />
    </div>
  );
} 