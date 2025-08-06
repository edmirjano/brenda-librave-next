import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brenda-librave.netlify.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/profile/',
          '/*?*', // Disallow URLs with query parameters
          '/auth/',
          '/sq/admin/',
          '/en/admin/',
          '/sq/profili/',
          '/en/profile/',
          '/sq/auth/',
          '/en/auth/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/profile/',
          '/auth/',
          '/sq/admin/',
          '/en/admin/',
          '/sq/profili/',
          '/en/profile/',
          '/sq/auth/',
          '/en/auth/'
        ],
        crawlDelay: 1
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}