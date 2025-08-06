import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cilësimet',
  description: 'Menaxho cilësimet e llogarisë suaj.',
};

export default function SettingsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cilësimet</h1>
        <p className="mt-2 text-gray-600">
          Personalizoni përvojën tuaj në Brënda Librave.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Njoftimet</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Newsletter</h3>
                <p className="text-sm text-gray-500">Merrni njoftime për libra të rinj dhe ofertat speciale</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Njoftime për porositë</h3>
                <p className="text-sm text-gray-500">Merrni njoftime për statusin e porosive tuaja</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Privatësia</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Profili publik</h3>
                <p className="text-sm text-gray-500">Lejoni përdoruesit e tjerë të shohin profilin tuaj</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}