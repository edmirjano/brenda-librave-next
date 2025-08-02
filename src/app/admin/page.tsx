import { Metadata } from 'next';

import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
  description: 'Admin dashboard me statistika dhe menaxhim të përgjithshëm.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}