import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { locales, pathnames } from '@/lib/i18n/config';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix: 'as-needed'
  });