'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { locales, defaultLocale, type Locale } from '@/i18n';

export function LocaleHtml({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useLayoutEffect(() => {
    // Extract locale from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const locale = (pathSegments[0] as Locale) || defaultLocale;
    
    if (locales.includes(locale)) {
      const html = document.documentElement;
      html.setAttribute('lang', locale);
      html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    }
  }, [pathname]);

  return <>{children}</>;
}

