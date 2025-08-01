import { Metadata } from 'next';
import Link from 'next/link';

import { AlertCircle, Home, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Gabim në autentifikim | Brënda Librave',
  description: 'Ka ndodhur një gabim gjatë procesit të autentifikimit.',
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthErrorPageProps {
  searchParams: {
    error?: string;
  };
}

const errorMessages: Record<string, string> = {
  Configuration: 'Konfigurim i pasaktë i serverit.',
  AccessDenied: 'Nuk keni leje për të aksesuar këtë faqe.',
  Verification: 'Token verifikimi i pavlefshëm ose i skaduar.',
  Default: 'Ka ndodhur një gabim gjatë hyrjes.',
};

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const error = searchParams.error || 'Default';
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gabim në autentifikim</h1>
            <p className="text-gray-600 mb-8">{errorMessage}</p>

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="w-full">
                  <LogIn className="w-5 h-5 mr-2" />
                  Provoni përsëri
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="w-5 h-5 mr-2" />
                  Kthehu në krye
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
