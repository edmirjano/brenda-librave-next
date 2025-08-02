import { Metadata } from 'next';

import { BookManagement } from '@/components/admin/BookManagement';

export const metadata: Metadata = {
  title: 'Menaxhimi i Librave | Admin',
  description: 'Menaxho librat, kategoritë dhe etiketat.',
};

export default function AdminBooksPage() {
  return <BookManagement />;
}