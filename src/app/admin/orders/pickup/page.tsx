import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth/config';
import { TransporterOrderPickup } from '@/components/admin/TransporterOrderPickup';

export default async function TransporterOrderPickupPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not transporter
  if (!session || session.user.role !== 'TRANSPORTER') {
    redirect('/auth/login?callbackUrl=/admin/orders/pickup');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marr në Dorë</h1>
          <p className="text-gray-600 mt-2">
            Menaxhoni porositë që duhet të merren në dorë për dërgim
          </p>
        </div>
      </div>

      <TransporterOrderPickup 
        transporterId={session.user.id}
      />
    </div>
  );
} 