import { Metadata } from 'next';

import { UserManagement } from '@/components/admin/UserManagement';

export const metadata: Metadata = {
  title: 'Menaxhimi i Përdoruesve | Admin',
  description: 'Menaxho përdoruesit dhe rolet e tyre.',
};

export default function AdminUsersPage() {
  return <UserManagement />;
}