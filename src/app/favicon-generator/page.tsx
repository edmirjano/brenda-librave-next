'use client';

import { useRef } from 'react';
import { Logo } from '@/components/ui/Logo';

// Utility function to convert SVG to PNG
const downloadPNGFromSVG = (
  svgElement: SVGElement, 
  fileName: string, 
  width: number, 
  height: number
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = width;
  canvas.height = height;

  const img = new Image();
  const svgBlob = new Blob([svgElement.outerHTML], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Fill white background for better contrast
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(pngUrl);
      }
    }, 'image/png');
    URL.revokeObjectURL(url);
  };
  img.src = url;
};

export default function FaviconGenerator() {
  const logoRef16 = useRef<HTMLDivElement>(null);
  const logoRef32 = useRef<HTMLDivElement>(null);
  const logoRef192 = useRef<HTMLDivElement>(null);
  const logoRef512 = useRef<HTMLDivElement>(null);
  const logoRefApple = useRef<HTMLDivElement>(null);

  const generateFavicon = (size: number, fileName: string, ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const svgElement = ref.current.querySelector('svg');
    if (!svgElement) return;

    downloadPNGFromSVG(svgElement, fileName, size, size);
  };

  const generateAllFavicons = () => {
    setTimeout(() => generateFavicon(16, 'favicon-16x16.png', logoRef16), 100);
    setTimeout(() => generateFavicon(32, 'favicon-32x32.png', logoRef32), 200);
    setTimeout(() => generateFavicon(192, 'android-chrome-192x192.png', logoRef192), 300);
    setTimeout(() => generateFavicon(512, 'android-chrome-512x512.png', logoRef512), 400);
    setTimeout(() => generateFavicon(180, 'apple-touch-icon.png', logoRefApple), 500);
  };

  return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Favicon Generator - Inside Book Concept
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Generate favicon files using the new "Inside Book" logo concept
        </p>
        
        <div className="text-center mb-8">
          <button
            onClick={generateAllFavicons}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Generate All Favicon Files
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* 16x16 */}
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <div ref={logoRef16} className="flex justify-center mb-2">
              <Logo variant="inside-book" size="sm" animated={false} />
            </div>
            <p className="text-sm">16x16px</p>
            <button
              onClick={() => generateFavicon(16, 'favicon-16x16.png', logoRef16)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
            >
              Download
            </button>
          </div>

          {/* 32x32 */}
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <div ref={logoRef32} className="flex justify-center mb-2">
              <Logo variant="inside-book" size="md" animated={false} />
            </div>
            <p className="text-sm">32x32px</p>
            <button
              onClick={() => generateFavicon(32, 'favicon-32x32.png', logoRef32)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
            >
              Download
            </button>
          </div>

          {/* 192x192 */}
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <div ref={logoRef192} className="flex justify-center mb-2">
              <Logo variant="inside-book" size="lg" animated={false} />
            </div>
            <p className="text-sm">192x192px</p>
            <button
              onClick={() => generateFavicon(192, 'android-chrome-192x192.png', logoRef192)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
            >
              Download
            </button>
          </div>

          {/* 512x512 */}
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <div ref={logoRef512} className="flex justify-center mb-2">
              <Logo variant="inside-book" size="xl" animated={false} />
            </div>
            <p className="text-sm">512x512px</p>
            <button
              onClick={() => generateFavicon(512, 'android-chrome-512x512.png', logoRef512)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
            >
              Download
            </button>
          </div>

          {/* Apple Touch Icon 180x180 */}
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <div ref={logoRefApple} className="flex justify-center mb-2">
              <Logo variant="inside-book" size="xl" animated={false} />
            </div>
            <p className="text-sm">180x180px (Apple)</p>
            <button
              onClick={() => generateFavicon(180, 'apple-touch-icon.png', logoRefApple)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
            >
              Download
            </button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white/30 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Generate All Favicon Files" to download all favicon sizes at once</li>
            <li>Save the downloaded PNG files to your <code className="bg-gray-200 px-1 rounded">/public</code> directory</li>
            <li>The favicon system is already configured in your layout.tsx</li>
            <li>Use individual download buttons for specific sizes if needed</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
