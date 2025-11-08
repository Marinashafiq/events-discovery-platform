'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface EventsSearchProps {
  initialSearch: string;
}

export default function EventsSearch({ initialSearch }: EventsSearchProps) {
  const t = useTranslations('events');
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const handleSearch = (value: string) => {
    setSearch(value);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce the URL update
    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (value.trim()) {
        params.set('search', value.trim());
      } else {
        params.delete('search');
      }
      params.delete('page'); // Reset to first page on new search
      router.push(`${pathname}?${params.toString()}`);
    }, 500); // 500ms debounce
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full px-4 py-3 pl-10 pr-10 rtl:pl-10 rtl:pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 rtl:left-auto rtl:right-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {search && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rtl:right-auto rtl:left-3"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

