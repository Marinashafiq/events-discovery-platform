'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { EventsResponse, EventFilters } from '@/types/event';
import { getEvents } from '@/lib/api/events';
import EventCard from './EventCard';

interface EventsGridProps {
  initialEvents: EventsResponse;
  initialFilters: EventFilters;
  initialPage: number;
}

export default function EventsGrid({ initialEvents, initialFilters, initialPage }: EventsGridProps) {
  const t = useTranslations('common');
  // Use server-provided events directly, no client-side refetch on filter changes
  const [allEvents, setAllEvents] = useState(initialEvents.events);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialEvents.page < initialEvents.totalPages);

  // Sync with server-provided data when filters change (server re-renders with new data)
  useEffect(() => {
    setAllEvents(initialEvents.events);
    setCurrentPage(initialPage);
    setHasMore(initialEvents.page < initialEvents.totalPages);
  }, [initialEvents, initialPage]);

  // Normalize filters to handle empty strings as undefined
  const normalizeFilters = (f: EventFilters): EventFilters => {
    const normalized: EventFilters = {};
    if (f.search && f.search.trim()) normalized.search = f.search.trim();
    if (f.category && f.category.trim()) normalized.category = f.category.trim();
    if (f.location && f.location.trim()) normalized.location = f.location.trim();
    if (f.dateFrom) normalized.dateFrom = f.dateFrom;
    if (f.dateTo) normalized.dateTo = f.dateTo;
    if (f.featured !== undefined) normalized.featured = f.featured;
    return normalized;
  };

  // Only client-side refetch for "Load More" pagination
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const normalizedFilters = normalizeFilters(initialFilters);
      const nextPage = currentPage + 1;
      const data = await getEvents(normalizedFilters, { page: nextPage, limit: 6 });
      setAllEvents((prev) => [...prev, ...data.events]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < data.totalPages);
    } catch (error) {
      console.error('Error loading more events:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (allEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">{t('noResults')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {allEvents.map((event, index) => (
          <EventCard key={`${event.id}-${event.slug}-${index}`} event={event} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? t('loadingMore') : t('loadMore')}
          </button>
        </div>
      )}
      {!hasMore && allEvents.length > 6 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400">{t('noMoreEvents')}</p>
        </div>
      )}
    </div>
  );
}

