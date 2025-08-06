import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { defaultLocale, locales } from './config';

export default getRequestConfig(async () => {
  // This can either be defined statically at the top level if no user
  // preferences are involved, or alternatively read from the user
  // database, request headers, etc.
  
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Extract locale from pathname
  let locale = defaultLocale;
  
  // Check if the pathname starts with a locale
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  if (firstSegment && locales.includes(firstSegment as any)) {
    locale = firstSegment as any;
  }
  
  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default
  };
});