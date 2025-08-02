import { Metadata } from 'next';

import { OrderManagement } from '@/components/admin/OrderManagement';

export const metadata: Metadata = {
  title: 'Menaxhimi i Porosive | Admin',
  description: 'Menaxho porositë dhe statusin e tyre.',
};

export default function AdminOrdersPage() {
  return <OrderManagement />;
}