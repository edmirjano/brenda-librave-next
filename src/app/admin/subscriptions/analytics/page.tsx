import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth/config';
import { SubscriptionService } from '@/lib/services/subscriptions';
import { SubscriptionAnalytics } from '@/components/admin/SubscriptionAnalytics';

export default async function SubscriptionAnalyticsPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not admin
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login?callbackUrl=/admin/subscriptions/analytics');
  }

  // Get subscription analytics data
  const stats = await SubscriptionService.getSubscriptionStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistikat e Abonimit</h1>
          <p className="text-gray-600 mt-2">
            Analizoni performancën e abonimeve dhe trendet
          </p>
        </div>
      </div>

      <SubscriptionAnalytics 
        stats={stats}
      />
    </div>
  );
} 