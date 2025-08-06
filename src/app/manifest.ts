import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'pwa' });

  return {
    name: t('name'),
    short_name: t('shortName'),
    description: t('description'),
    start_url: `/${locale}/`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626', // Red-600 from Tailwind
    lang: locale,
    dir: 'ltr', // All our supported languages are LTR for now
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    categories: ['books', 'education', 'reading', 'shopping'],
    shortcuts: [
      {
        name: t('shortcuts.books'),
        short_name: t('shortcuts.booksShort'),
        description: t('shortcuts.booksDescription'),
        url: `/${locale}/${locale === 'sq' ? 'libra' : 'books'}`,
        icons: [{ 
          src: '/icon-books-96x96.png', 
          sizes: '96x96',
          type: 'image/png'
        }]
      },
      {
        name: t('shortcuts.cart'),
        short_name: t('shortcuts.cartShort'),
        description: t('shortcuts.cartDescription'),
        url: `/${locale}/${locale === 'sq' ? 'shporte' : 'cart'}`,
        icons: [{ 
          src: '/icon-cart-96x96.png', 
          sizes: '96x96',
          type: 'image/png'
        }]
      }
    ],
    // Custom properties for enhanced PWA experience
    display_override: ['window-controls-overlay', 'standalone'],
    edge_side_panel: {
      preferred_width: 400
    },
    // Protocol handlers for deep linking
    protocol_handlers: [
      {
        protocol: 'web+brendalibrave',
        url: `/${locale}/books/%s`
      }
    ],
    // File handlers (for future ebook file association)
    file_handlers: [
      {
        action: `/${locale}/read`,
        accept: {
          'application/epub+zip': ['.epub'],
          'application/pdf': ['.pdf']
        }
      }
    ],
    // Share target for sharing books
    share_target: {
      action: `/${locale}/share`,
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url'
      }
    }
  };
}