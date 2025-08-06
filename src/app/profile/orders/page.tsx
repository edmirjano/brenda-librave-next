import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Porositë e mia',
  description: 'Shikoni historikun e porosive tuaja.',
};

export default function OrdersPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Porositë e mia</h1>
        <p className="mt-2 text-gray-600">
          Këtu mund të shikoni historikun e të gjitha porosive tuaja.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Nuk keni bërë asnjë porosi akoma.</p>
          <p className="text-sm text-gray-400 mt-2">
            Kur të bëni porositë e para, ato do të shfaqen këtu.
          </p>
        </div>
      </div>
    </div>
  );
}