'use client';

import { useLayoutEffect } from 'react';
import { useLocale } from 'next-intl';

export default function LocaleHtml() {
  const locale = useLocale();

  // This ensures the direction changes immediately on client-side navigation
  useLayoutEffect(() => {
    const html = document.documentElement;
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    if (html.getAttribute('lang') !== locale || html.getAttribute('dir') !== dir) {
      html.setAttribute('lang', locale);
      html.setAttribute('dir', dir);
    }
  }, [locale]);

  return null;
}

