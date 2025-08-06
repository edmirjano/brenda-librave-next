import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth/config';
import { TransporterOrdersToday } from '@/components/admin/TransporterOrdersToday';

export default async function TransporterOrdersTodayPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not transporter
  if (!session || session.user.role !== 'TRANSPORTER') {
    redirect('/auth/login?callbackUrl=/admin/orders/today');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Porositë e Sotme</h1>
          <p className="text-gray-600 mt-2">
            Menaxhoni porositë që duhet të dërgohen sot
          </p>
        </div>
      </div>

      <TransporterOrdersToday 
        transporterId={session.user.id}
      />
    </div>
  );
} 