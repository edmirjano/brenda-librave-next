import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Mirë se vini në{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Brënda Librave
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Libraria juaj shqiptare online për libra fizikë dhe dixhitalë
          </p>

          <div className="space-y-4 mb-8">
            <p className="text-gray-600">📚 Zbuloni literaturën shqiptare dhe ndërkombëtare</p>
            <p className="text-gray-600">💰 Çmime në Lek Shqiptarë dhe Euro</p>
            <p className="text-gray-600">📱 Përvojë mobile-first me dizajn modern</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2">
              <span className="text-green-800 font-medium">
                ✅ Aplikacioni është i gatshëm për zhvillim
              </span>
            </div>

            <Link
              href="/api/health"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Shiko Health Check
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Faza 1: Themelimi i projektit ✅</p>
            <p>Next.js 14+ • TypeScript • Tailwind CSS • Prisma</p>
          </div>
        </div>
      </div>
    </main>
  );
}
