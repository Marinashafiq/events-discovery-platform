'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { EventsResponse, EventFilters, Event } from '@/types/event';
import { getEvents } from '@/lib/api/events';
import EventCard from './EventCard';
import LoadingSkeleton from '../LoadingSkeleton';

interface EventsGridProps {
  initialEvents: EventsResponse;
  initialFilters: EventFilters;
  initialPage: number;
}

export default function EventsGrid({ initialEvents, initialFilters, initialPage }: EventsGridProps) {
  const t = useTranslations('common');
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents.events);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialEvents.page < initialEvents.totalPages);
  const [totalPages, setTotalPages] = useState(initialEvents.totalPages);
  const prevFiltersRef = useRef<string>(JSON.stringify(initialFilters));

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

  // Reload events when filters change (from URL)
  useEffect(() => {
    const normalizedInitial = normalizeFilters(initialFilters);
    const normalizedInitialStr = JSON.stringify(normalizedInitial);
    
    // Only reload if filters actually changed
    if (prevFiltersRef.current !== normalizedInitialStr) {
      prevFiltersRef.current = normalizedInitialStr;
      
      async function loadEvents() {
        setLoading(true);
        try {
          const data = await getEvents(normalizedInitial, { page: 1, limit: 6 });
          setAllEvents(data.events);
          setCurrentPage(1);
          setHasMore(data.page < data.totalPages);
          setTotalPages(data.totalPages);
        } catch (error) {
          console.error('Error loading events:', error);
        } finally {
          setLoading(false);
        }
      }
      
      loadEvents();
    }
  }, [initialFilters]);

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

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

