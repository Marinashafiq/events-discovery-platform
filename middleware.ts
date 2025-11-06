import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n';

function getLocale(request: NextRequest): Locale {
  const pathname = request.nextUrl.pathname;
  
  // Check if there's a locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const localeFromPath = pathname.split('/')[1] as Locale;
    if (locales.includes(localeFromPath)) {
      return localeFromPath;
    }
  }

  // Check for NEXT_LOCALE cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase())
      .find((lang) => locales.includes(lang as Locale));

    if (preferredLocale && locales.includes(preferredLocale as Locale)) {
      return preferredLocale as Locale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/.test(pathname)
  ) {
    return;
  }

  // Check if the pathname is missing a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Redirect if there's no locale in the pathname
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    const newUrl = new URL(newPath, request.url);
    newUrl.search = request.nextUrl.search; // Preserve query parameters
    return NextResponse.redirect(newUrl);
  }

  // Set locale header for server-side access
  const locale = getLocale(request);
  const response = NextResponse.next();
  response.headers.set('x-locale', locale);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

