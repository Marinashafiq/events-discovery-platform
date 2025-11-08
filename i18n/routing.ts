import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import type { Locale } from '@/types/locale';

export const routing = defineRouting({
  locales: ['en', 'ar'] as Locale[],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

