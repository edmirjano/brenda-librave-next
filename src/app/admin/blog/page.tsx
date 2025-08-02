import { Metadata } from 'next';

import { BlogManagement } from '@/components/admin/BlogManagement';

export const metadata: Metadata = {
  title: 'Menaxhimi i Blogut | Admin',
  description: 'Menaxho postimet e blogut, kategoritë dhe moderimin.',
};

export default function AdminBlogPage() {
  return <BlogManagement />;
}