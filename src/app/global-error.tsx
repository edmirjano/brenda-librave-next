'use client';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
              <h1 className="text-2xl font-bold text-red-800 mb-4">Diçka shkoi keq</h1>
              <p className="text-red-700 mb-6">
                Ka ndodhur një gabim në aplikacion. Ju lutemi provoni përsëri.
              </p>
              <div className="space-y-4">
                <button
                  onClick={reset}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Provo Përsëri
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Kthehu në Faqen Kryesore
                </button>
              </div>
              <p className="text-sm text-red-600 mt-4">Gabimi është raportuar automatikisht.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
