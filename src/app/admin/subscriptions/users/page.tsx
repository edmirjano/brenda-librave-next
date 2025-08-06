import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth/config';
import { SubscriptionService } from '@/lib/services/subscriptions';
import { SubscriptionUsersManagement } from '@/components/admin/SubscriptionUsersManagement';

export default async function SubscriptionUsersPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not admin
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login?callbackUrl=/admin/subscriptions/users');
  }

  // Get subscription users data
  const stats = await SubscriptionService.getSubscriptionStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Përdoruesit e Abonuar</h1>
          <p className="text-gray-600 mt-2">
            Menaxhoni përdoruesit e abonuar dhe statusin e tyre
          </p>
        </div>
      </div>

      <SubscriptionUsersManagement 
        stats={stats}
      />
    </div>
  );
} 