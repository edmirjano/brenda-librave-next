'use client';

import { Logo, LogoWithText } from '@/components/ui/Logo';
import { GlassCard } from '@/components/ui/GlassCard';
import { useState } from 'react';

// Simple download functions that work with the browser APIs
const downloadSVG = (logoVariant: string, size: string) => {
  try {
    const logoElement = document.querySelector(`[data-logo="${logoVariant}-${size}"] svg`);
    if (!logoElement) return;

    const svgData = logoElement.outerHTML;
    const blob = new (globalThis as any).Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `brenda-librave-${logoVariant}-${size}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

const downloadPNG = (logoVariant: string, size: string, scale: number = 2) => {
  try {
    const logoElement = document.querySelector(`[data-logo="${logoVariant}-${size}"] svg`) as SVGElement;
    if (!logoElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgSize = parseInt(logoElement.getAttribute('width') || '100');
    canvas.width = svgSize * scale;
    canvas.height = svgSize * scale;

    const img = new (globalThis as any).Image();
    const svgBlob = new (globalThis as any).Blob([logoElement.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `brenda-librave-${logoVariant}-${size}-${canvas.width}x${canvas.height}.png`;
          link.click();
          URL.revokeObjectURL(pngUrl);
        }
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  } catch (error) {
    console.error('Download failed:', error);
  }
};

const DownloadButton = ({ logoVariant, size }: { logoVariant: string; size: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
      >
        Download
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
          <button
            onClick={() => {
              downloadSVG(logoVariant, size);
              setIsOpen(false);
            }}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
          >
            SVG
          </button>
          <button
            onClick={() => {
              downloadPNG(logoVariant, size, 2);
              setIsOpen(false);
            }}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
          >
            PNG (2x)
          </button>
          <button
            onClick={() => {
              downloadPNG(logoVariant, size, 4);
              setIsOpen(false);
            }}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
          >
            PNG (4x)
          </button>
        </div>
      )}
    </div>
  );
};

export default function LogoShowcase() {
  return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Brënda Librave - Logo Variations
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Modern Apple-Style Design: "B" Made from Books + L-shaped Book with Cutting Effect
          </p>
          <a
            href="/favicon-generator"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
          >
            Generate Favicon Files
          </a>
        </div>

        {/* Featured Book-B Apple-Style Concept */}
        <GlassCard className="p-8 mb-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
            🚀 Ultimate Book-B Logo - NEW! 🚀
          </h2>
          <div className="flex justify-center items-center space-x-12 mb-6">
            <div className="text-center">
              <div className="bg-white p-8 rounded-xl mb-4 flex justify-center shadow-xl border-2 border-purple-200">
                <Logo variant="book-b" size="xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Book-B Bold</h3>
              <p className="text-sm text-gray-600">"B" made from stacked books</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-900 p-8 rounded-xl mb-4 flex justify-center shadow-xl border-2 border-purple-200">
                <Logo variant="book-b-white" size="xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Book-B Dark</h3>
              <p className="text-sm text-gray-600">Dark backgrounds version</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 p-8 rounded-xl mb-4 flex justify-center shadow-xl border-2 border-purple-200">
                <Logo variant="book-b-minimal" size="xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Book-B Minimal</h3>
              <p className="text-sm text-gray-600">Ultra-clean book design</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-700 max-w-2xl mx-auto mb-4">
              <strong>Perfect thematic design!</strong> The "B" is literally made from stacked book shapes, combined with the L-shaped open book. 
              This creates the ultimate representation of "Brënda Librave" (Inside Books) with modern Apple-style aesthetics.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-lg border border-purple-200">
              <span className="text-purple-700 font-medium">🎯 Recommended for primary branding</span>
            </div>
          </div>
        </GlassCard>

        {/* Modern Apple-Style Concept */}
        <GlassCard className="p-8 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 text-center">
            Modern Apple-Style (Alternative)
          </h2>
          <div className="flex justify-center items-center space-x-8 mb-4">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg mb-3 flex justify-center shadow-md">
                <Logo variant="modern" size="lg" />
              </div>
              <h3 className="font-medium text-gray-700">Modern Bold</h3>
              <p className="text-xs text-gray-500">Text-based "B"</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-900 p-6 rounded-lg mb-3 flex justify-center shadow-md">
                <Logo variant="modern-white" size="lg" />
              </div>
              <h3 className="font-medium text-gray-700">Modern Dark</h3>
              <p className="text-xs text-gray-500">Dark version</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-lg mb-3 flex justify-center shadow-md">
                <Logo variant="modern-minimal" size="lg" />
              </div>
              <h3 className="font-medium text-gray-700">Modern Minimal</h3>
              <p className="text-xs text-gray-500">Clean version</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm max-w-xl mx-auto">
              Apple-style design with bold text "B" and L-shaped book. Good alternative but less thematic than Book-B variants.
            </p>
          </div>
        </GlassCard>

        {/* Size Variations */}
        <GlassCard className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Size Variations - Book-B Style</h2>
          <div className="flex items-end justify-center space-x-8">
            <div className="text-center" data-logo="book-b-sm">
              <Logo variant="book-b" size="sm" />
              <p className="mt-2 text-sm text-gray-600">Small (32px)</p>
            </div>
            <div className="text-center" data-logo="book-b-md">
              <Logo variant="book-b" size="md" />
              <p className="mt-2 text-sm text-gray-600">Medium (48px)</p>
            </div>
            <div className="text-center" data-logo="book-b-lg">
              <Logo variant="book-b" size="lg" />
              <p className="mt-2 text-sm text-gray-600">Large (64px)</p>
            </div>
            <div className="text-center" data-logo="book-b-xl">
              <Logo variant="book-b" size="xl" />
              <p className="mt-2 text-sm text-gray-600">Extra Large (96px)</p>
            </div>
          </div>
        </GlassCard>

        {/* Style Variations */}
        <GlassCard className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">All Style Variations</h2>
          
          {/* Book-B Variants - Primary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">🚀 Book-B Apple-Style (Ultimate Design)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white p-6 rounded-xl mb-4 flex justify-center shadow-lg border-2 border-purple-200">
                  <Logo variant="book-b" size="lg" />
                </div>
                <h4 className="font-semibold text-gray-900">Book-B Bold</h4>
                <p className="text-sm text-gray-600">"B" made from books</p>
                <DownloadButton logoVariant="book-b" size="lg" />
              </div>
              
              <div className="text-center">
                <div className="bg-gray-900 p-6 rounded-xl mb-4 flex justify-center shadow-lg border-2 border-purple-200">
                  <Logo variant="book-b-white" size="lg" />
                </div>
                <h4 className="font-semibold text-gray-900">Book-B Dark</h4>
                <p className="text-sm text-gray-600">Dark backgrounds</p>
                <DownloadButton logoVariant="book-b-white" size="lg" />
              </div>
              
              <div className="text-center">
                <div className="bg-gray-50 p-6 rounded-xl mb-4 flex justify-center shadow-lg border-2 border-purple-200">
                  <Logo variant="book-b-minimal" size="lg" />
                </div>
                <h4 className="font-semibold text-gray-900">Book-B Minimal</h4>
                <p className="text-sm text-gray-600">Ultra-clean book design</p>
                <DownloadButton logoVariant="book-b-minimal" size="lg" />
              </div>
            </div>
          </div>

          {/* Modern Variants - Alternative */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Modern Apple-Style (Alternative)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg mb-3 flex justify-center shadow-md border border-gray-200">
                  <Logo variant="modern" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Modern Bold</h4>
                <p className="text-xs text-gray-500">Text-based "B"</p>
                <DownloadButton logoVariant="modern" size="md" />
              </div>
              
              <div className="text-center">
                <div className="bg-gray-900 p-4 rounded-lg mb-3 flex justify-center shadow-md border border-gray-200">
                  <Logo variant="modern-white" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Modern Dark</h4>
                <p className="text-xs text-gray-500">Dark backgrounds</p>
                <DownloadButton logoVariant="modern-white" size="md" />
              </div>
              
              <div className="text-center">
                <div className="bg-gray-50 p-4 rounded-lg mb-3 flex justify-center shadow-md border border-gray-200">
                  <Logo variant="modern-minimal" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Modern Minimal</h4>
                <p className="text-xs text-gray-500">Clean version</p>
                <DownloadButton logoVariant="modern-minimal" size="md" />
              </div>
            </div>
          </div>

          {/* Legacy Variants */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Legacy Variations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg mb-3 flex justify-center">
                  <Logo variant="inside-book" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Inside Book</h4>
                <p className="text-xs text-gray-500">3D book concept</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-900 p-4 rounded-lg mb-3 flex justify-center">
                  <Logo variant="inside-book-white" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Inside Book Dark</h4>
                <p className="text-xs text-gray-500">3D dark version</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg mb-3 flex justify-center">
                  <Logo variant="default" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Classic Red</h4>
                <p className="text-xs text-gray-500">Original design</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-900 p-4 rounded-lg mb-3 flex justify-center">
                  <Logo variant="white" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Classic White</h4>
                <p className="text-xs text-gray-500">Inverted version</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-3 flex justify-center">
                  <Logo variant="minimal" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Minimal</h4>
                <p className="text-xs text-gray-500">No background</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg mb-3 flex justify-center">
                  <Logo variant="icon-only" size="md" />
                </div>
                <h4 className="font-medium text-gray-700">Book Icon</h4>
                <p className="text-xs text-gray-500">Icon version</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Logo with Text */}
        <GlassCard className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Logo with Text - Book-B Style</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12">
            <div className="text-center">
              <div className="bg-white p-6 rounded-xl mb-4 flex justify-center shadow-lg border-2 border-purple-200">
                <LogoWithText variant="book-b" size="lg" textColor="text-gray-900" />
              </div>
              <p className="text-sm text-gray-600">Light background version</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-900 p-6 rounded-xl mb-4 flex justify-center shadow-lg border-2 border-purple-200">
                <LogoWithText variant="book-b-white" size="lg" textColor="text-white" />
              </div>
              <p className="text-sm text-gray-600">Dark background version</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 p-6 rounded-xl mb-4 flex justify-center shadow-lg border-2 border-purple-200">
                <LogoWithText variant="book-b-minimal" size="lg" textColor="text-gray-900" />
              </div>
              <p className="text-sm text-gray-600">Minimal version</p>
            </div>
          </div>
        </GlassCard>

        {/* Usage Examples */}
        <GlassCard className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Usage Examples</h2>
          
          {/* Navigation Bar Example */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Navigation Bar - Book-B Style</h3>
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <LogoWithText variant="book-b" size="md" />
              <div className="flex space-x-4">
                <button className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium">Libra</button>
                <button className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium">Blog</button>
                <button className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium">Kontakt</button>
              </div>
            </div>
          </div>

          {/* Footer Example */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Footer - Book-B Style</h3>
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
              <LogoWithText variant="book-b-white" size="lg" textColor="text-white" />
              <p className="text-gray-400 mt-4 max-w-md">
                Libraria juaj shqiptare online për libra fizikë dhe dixhitalë.
              </p>
            </div>
          </div>

          {/* Icon Usage */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Icon Usage - Book-B Style</h3>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-purple-200">
                  <Logo variant="book-b" size="sm" />
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium">Favicon (32px)</p>
              </div>
              <div className="text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-200">
                  <Logo variant="book-b" size="md" />
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium">Button Icon (48px)</p>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200">
                  <Logo variant="book-b" size="lg" />
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium">App Icon (64px)</p>
              </div>
              <div className="text-center">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-200">
                  <Logo variant="book-b" size="xl" />
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium">Brand Mark (96px)</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Usage Guidelines */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Usage Guidelines</h2>
          
          {/* Book-B Logo Recommendations */}
          <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">🚀 Book-B Logo Recommendations (Ultimate Choice)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">Primary Use Cases</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• <strong>Book-B Bold:</strong> Main brand applications, websites</li>
                  <li>• <strong>Book-B Dark:</strong> Dark backgrounds, presentations</li>
                  <li>• <strong>Book-B Minimal:</strong> Social media, favicons, mobile</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">Benefits</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Perfect thematic representation ("B" from books)</li>
                  <li>• Modern Apple-style with cutting effect</li>
                  <li>• Ideal for "Brënda Librave" (Inside Books)</li>
                  <li>• Professional and memorable design</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">✓ Best Practices</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Use Book-B variants</strong> for all new applications</li>
                <li>• Use book-b-white on dark backgrounds</li>
                <li>• Use book-b-minimal for social media and favicons</li>
                <li>• Maintain minimum 32px clear space around logo</li>
                <li>• Keep the cutting effect visible - don't crop</li>
                <li>• Use animated version for interactive elements</li>
                <li>• Ensure contrast meets accessibility standards</li>
                <li>• Showcase the book elements prominently</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">✗ Avoid</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Don't stretch or distort the logo proportions</li>
                <li>• Don't use on busy or low-contrast backgrounds</li>
                <li>• Don't change colors outside of provided variants</li>
                <li>• Don't make smaller than 32px for book-B variants</li>
                <li>• Don't crop the cutting effect or book elements</li>
                <li>• Don't rotate beyond the hover animation</li>
                <li>• Don't use legacy variants for new projects</li>
                <li>• Don't obscure the book details at small sizes</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
