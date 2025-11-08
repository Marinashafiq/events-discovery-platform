'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { EventFilters } from '@/types/event';

interface EventFiltersClientProps {
  initialFilters: EventFilters;
  initialCategories: string[];
  initialLocations: string[];
}

export default function EventFiltersClient({
  initialFilters,
  initialCategories,
  initialLocations,
}: EventFiltersClientProps) {
  const t = useTranslations('events.filters');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [categories] = useState<string[]>(initialCategories);
  const [locations] = useState<string[]>(initialLocations);
  const [localFilters, setLocalFilters] = useState<EventFilters>(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key: keyof EventFilters, value: string | boolean | undefined) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
  };

  const updateURL = (filters: EventFilters) => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    params.delete('page'); // Reset to first page
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleApply = () => {
    updateURL(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters: EventFilters = {};
    setLocalFilters(clearedFilters);
    updateURL(clearedFilters);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {tCommon('filter')}
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('category')}
              </label>
              <select
                value={localFilters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{t('allCategories')}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('location')}
              </label>
              <select
                value={localFilters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{t('allLocations')}</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dateFrom')}
              </label>
              <input
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dateTo')}
              </label>
              <input
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4 flex">
            <button
              onClick={handleApply}
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2 rtl:mr-0 rtl:ml-2"
            >
              {tCommon('apply')}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {tCommon('clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

