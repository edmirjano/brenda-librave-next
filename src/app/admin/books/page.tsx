import { Suspense } from 'react';
import Link from 'next/link';
import { AdminBooksTable } from '@/components/admin/AdminBooksTable';
import { AdminBooksFilters } from '@/components/admin/AdminBooksFilters';
import { Button } from '@/components/ui/Button';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';

interface AdminBooksPageProps {
  searchParams: {
    query?: string;
    categoryId?: string;
    status?: 'all' | 'active' | 'inactive';
    featured?: string;
    page?: string;
    limit?: string;
  };
}

export default function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
  return (
    <AdminPageLayout
      title="Menaxhimi i Librave"
      description="Menaxhoni koleksionin e librave, krijoni libra të rinj dhe përditësoni detajet."
    >
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin/books/new">
              <Button size="lg">
                ➕ Shto Libër të Ri
              </Button>
            </Link>
            
            <Link href="/admin/categories">
              <Button variant="outline">
                📚 Menaxho Kategoritë
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/admin/books/import">
              <Button variant="outline" size="sm">
                📤 Importo CSV
              </Button>
            </Link>
            
            <Button variant="outline" size="sm">
              📥 Eksporto CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <Suspense fallback={<div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            ))}
          </div>}>
            <AdminBooksFilters searchParams={searchParams} />
          </Suspense>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Suspense fallback={<div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>}>
            <AdminBooksTable searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </AdminPageLayout>
  );
}

export const metadata = {
  title: 'Menaxhimi i Librave - Admin | Brënda Librave',
  description: 'Menaxhoni koleksionin e librave, krijoni dhe përditësoni libra.',
};