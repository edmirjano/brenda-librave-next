'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BookDetailView } from '@/types/book';

interface BookDetailTabsProps {
  book: BookDetailView;
}

export function BookDetailTabs({ book }: BookDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    {
      id: 'description',
      label: 'Përshkrimi',
      content: (
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {book.description}
          </p>
        </div>
      )
    },
    {
      id: 'details',
      label: 'Detajet',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Titulli:</span>
              <p className="font-medium">{book.title}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Autori:</span>
              <p className="font-medium">{book.author}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Kategoria:</span>
              <p className="font-medium">{book.category.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Gjuha:</span>
              <p className="font-medium">{book.language === 'SQ' ? 'Shqip' : 'Anglisht'}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {book.isbn && (
              <div>
                <span className="text-sm font-medium text-gray-500">ISBN:</span>
                <p className="font-medium font-mono text-sm">{book.isbn}</p>
              </div>
            )}
            {book.publishedDate && (
              <div>
                <span className="text-sm font-medium text-gray-500">Data e botimit:</span>
                <p className="font-medium">
                  {new Date(book.publishedDate).toLocaleDateString('sq-AL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Statusi:</span>
              <p className="font-medium">
                {book.inventory > 0 ? (
                  <span className="text-green-600">Në stok ({book.inventory} copë)</span>
                ) : (
                  <span className="text-red-600">Mbaruar</span>
                )}
              </p>
            </div>
            {book.hasDigital && (
              <div>
                <span className="text-sm font-medium text-gray-500">Formati dixhital:</span>
                <p className="font-medium text-green-600">✓ I disponueshëm</p>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  // Only show shipping tab if book has physical copies
  if (book.inventory > 0 || (book.priceALL || book.priceEUR)) {
    tabs.push({
      id: 'shipping',
      label: 'Dërgimi',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🚚 Dërgimi në Shqipëri</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dërgim falas për porosi mbi 2,000 Lek</li>
                <li>• Kohëzgjatja: 1-3 ditë pune</li>
                <li>• Çmimi: 300 Lek</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🌍 Dërgimi ndërkombëtar</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Kohëzgjatja: 5-14 ditë pune</li>
                <li>• Çmimi: varet nga destinacioni</li>
                <li>• Kontaktoni për më shumë detaje</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Shënim:</strong> Librat dixhitalë janë të disponueshëm për shkarkim të menjëhershëm pas pagesës.
            </p>
          </div>
        </div>
      )
    });
  }

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}