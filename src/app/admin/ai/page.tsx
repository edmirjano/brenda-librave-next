import { Metadata } from 'next';

import { AIManagement } from '@/components/admin/AIManagement';

export const metadata: Metadata = {
  title: 'AI Management | Admin',
  description: 'Menaxho sistemin e inteligjencës artificiale dhe rekomandimet.',
};

export default function AdminAIPage() {
  return <AIManagement />;
}