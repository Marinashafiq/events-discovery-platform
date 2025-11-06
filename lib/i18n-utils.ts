import { locales, defaultLocale, type Locale } from '@/i18n';
import { cookies } from 'next/headers';

/**
 * Get the current locale from the URL or cookie
 */
export function getLocale(): Locale {
  // This will be used in server components
  // In client components, use useParams() from next/navigation
  return defaultLocale;
}

/**
 * Set the locale preference in a cookie
 */
export async function setLocaleCookie(locale: Locale) {
  'use server';
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    ar: 'العربية',
  };
  return names[locale];
}

/**
 * Check if a locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

