import { Suspense } from 'react';
import { BookGrid } from '@/components/books/BookGrid';
import { BookFilters } from '@/components/books/BookFilters';
import { BookSearch } from '@/components/books/BookSearch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BookGridSkeleton } from '@/components/books/BookGridSkeleton';

interface BooksPageProps {
  searchParams: {
    query?: string;
    categoryId?: string;
    tags?: string;
    language?: 'SQ' | 'EN';
    minPrice?: string;
    maxPrice?: string;
    currency?: 'ALL' | 'EUR';
    featured?: string;
    sortBy?: 'title' | 'author' | 'price' | 'featured' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: string;
  };
}

export default function BooksPage({ searchParams }: BooksPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Librat
          </h1>
          
          {/* Search Bar */}
          <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse" />}>
            <BookSearch defaultQuery={searchParams.query} />
          </Suspense>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar - Hidden on mobile, shown as drawer */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              <Suspense fallback={<div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>}>
                <BookFilters 
                  searchParams={searchParams}
                  isMobile={false}
                />
              </Suspense>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filters Button */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <span className="text-sm text-gray-600">
                Të gjitha librat
              </span>
              <Suspense fallback={<div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />}>
                <BookFilters 
                  searchParams={searchParams}
                  isMobile={true}
                />
              </Suspense>
            </div>

            {/* Book Grid */}
            <Suspense fallback={<BookGridSkeleton />}>
              <BookGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Librat - Brënda Librave',
  description: 'Zbuloni koleksionin tonë të gjerë të librave shqiptarë dhe ndërkombëtarë. Gjeni librat tuaj të preferuar me çmime të përballueshme.',
  keywords: 'libra, libra shqiptarë, libra ndërkombëtarë, blerje libra online, Brënda Librave',
  openGraph: {
    title: 'Librat - Brënda Librave',
    description: 'Zbuloni koleksionin tonë të gjerë të librave shqiptarë dhe ndërkombëtarë.',
    type: 'website',
    locale: 'sq_AL'
  }
};