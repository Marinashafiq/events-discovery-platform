import { Suspense } from 'react';
import { getEvents } from '@/lib/api/events';
import { EventFilters, PaginationParams } from '@/types/event';
import EventsGrid from './EventsGrid';
import LoadingSkeleton from '../LoadingSkeleton';

interface EventsGridServerProps {
  filters: EventFilters;
  page: number;
}

export default async function EventsGridServer({ filters, page }: EventsGridServerProps) {
  const eventsData = await getEvents(filters, { page: 1, limit: 6 });

  return (
    <EventsGrid
      initialEvents={eventsData}
      initialFilters={filters}
      initialPage={1}
    />
  );
}


