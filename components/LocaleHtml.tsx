'use client';

import { useLayoutEffect } from 'react';
import { useLocale } from 'next-intl';

export default function LocaleHtml() {
  const locale = useLocale();

  // Use useLayoutEffect to set attributes synchronously before browser paint
  // This ensures the direction changes immediately on client-side navigation
  // The initial direction is set by the blocking script in root layout
  useLayoutEffect(() => {
    const html = document.documentElement;
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    // Only update if different from current (to avoid unnecessary updates on initial load)
    if (html.getAttribute('lang') !== locale || html.getAttribute('dir') !== dir) {
      html.setAttribute('lang', locale);
      html.setAttribute('dir', dir);
    }
  }, [locale]);

  return null;
}

