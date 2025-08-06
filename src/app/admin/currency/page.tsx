import { Metadata } from 'next';
import { CurrencyManagement } from '@/components/admin/CurrencyManagement';

export const metadata: Metadata = {
  title: 'Currency Management | Admin',
  description: 'Manage exchange rates and currency settings.',
};

export default function CurrencyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Currency Management</h1>
        <p className="text-gray-600 mt-2">
          Manage exchange rates between EUR and ALL currencies.
        </p>
      </div>
      <CurrencyManagement />
    </div>
  );
}