'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/routing';

export default function Navigation() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/events"
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              onClick={closeMobileMenu}
            >
              Events 
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link
                href="/events"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname?.includes('/events') && !pathname?.includes('/book')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t('home')}
              </Link>
              <Link
                href="/tickets"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname?.includes('/tickets')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t('myTickets')}
              </Link>
            </div>
          </div>

          {/* Locale Switcher - Always visible */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LocaleSwitcher />
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  // Close icon (X)
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Slides down when open */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700 rtl:space-y-reverse">
            <Link
              href="/events"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname?.includes('/events') && !pathname?.includes('/book')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/tickets"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname?.includes('/tickets')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('myTickets')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const switchLocale = (locale: string) => {
    // pathname from next-intl already excludes the locale prefix
    // Use router.replace with locale option to switch locales properly
    const path = pathname || '/events';
    const searchParams = window.location.search;
    router.replace(`${path}${searchParams}`, { locale });
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1 text-sm font-medium transition-colors cursor-pointer rounded-md mr-2 rtl:mr-0 rtl:ml-2 ${
          currentLocale === 'en'
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold'
            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        EN
      </button>
      <span className="text-gray-400 mr-2 rtl:mr-0 rtl:ml-2">|</span>
      <button
        onClick={() => switchLocale('ar')}
        className={`px-3 py-1 text-sm font-medium transition-colors rounded-md cursor-pointer ${
          currentLocale === 'ar'
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold'
            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        AR
      </button>
    </div>
  );
}

