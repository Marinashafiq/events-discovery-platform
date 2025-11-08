import { getCategories, getLocations } from '@/lib/api/events';
import EventFiltersClient from './EventFiltersClient';
import { EventFilters } from '@/types/event';

interface EventFiltersServerProps {
  initialFilters: EventFilters;
}

export default async function EventFiltersServer({ initialFilters }: EventFiltersServerProps) {
  const [categories, locations] = await Promise.all([
    getCategories(),
    getLocations(),
  ]);

  return (
    <EventFiltersClient
      initialFilters={initialFilters}
      initialCategories={categories}
      initialLocations={locations}
    />
  );
}


