import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth/config';
import { SubscriptionService } from '@/lib/services/subscriptions';
import { SubscriptionPlansManagement } from '@/components/admin/SubscriptionPlansManagement';

export default async function SubscriptionPlansPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not admin
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login?callbackUrl=/admin/subscriptions/plans');
  }

  // Get subscription plans data
  const subscriptions = await SubscriptionService.getActiveSubscriptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planet e Abonimit</h1>
          <p className="text-gray-600 mt-2">
            Menaxhoni planet e abonimit dhe konfigurimet e tyre
          </p>
        </div>
      </div>

      <SubscriptionPlansManagement 
        subscriptions={subscriptions}
      />
    </div>
  );
} 