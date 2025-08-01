import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AdminPageLayout({ children, title, description }: AdminPageLayoutProps) {
  const navigationItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/books', label: 'Librat', icon: '📚' },
    { href: '/admin/categories', label: 'Kategoritë', icon: '🏷️' },
    { href: '/admin/orders', label: 'Porositë', icon: '🛒' },
    { href: '/admin/users', label: 'Përdoruesit', icon: '👥' },
    { href: '/admin/settings', label: 'Cilësimet', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 mr-8">
                Brënda Librave
              </Link>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Admin Panel
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                🌐 Shiko Faqen
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                👤 Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav className="sticky top-8 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden mb-6">
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              onChange={(e) => window.location.href = e.target.value}
            >
              {navigationItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.icon} {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 xl:col-span-10">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="mt-2 text-gray-600">{description}</p>
              )}
            </div>

            {/* Page Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}