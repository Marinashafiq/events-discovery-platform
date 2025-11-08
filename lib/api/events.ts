import { Event, EventsResponse, EventFilters, PaginationParams } from '@/types/event';
import { eventsWithDates } from '@/data/mockEvents';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getEvents(
  filters: EventFilters = {},
  pagination: PaginationParams = {}
): Promise<EventsResponse> {
  await delay(300); 

  let filteredEvents = [...eventsWithDates];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) => event.title.toLowerCase().includes(searchLower)
    );
  }

  if (filters.category) {
    filteredEvents = filteredEvents.filter(
      (event) => event.category === filters.category
    );
  }

  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) => {
        const cityCountry = `${event.location.city}, ${event.location.country}`.toLowerCase();
        return (
          cityCountry.includes(locationLower) ||
          event.location.city.toLowerCase().includes(locationLower) ||
          event.location.country.toLowerCase().includes(locationLower)
        );
      }
    );
  }

  if (filters.dateFrom) {
    const dateFrom = new Date(filters.dateFrom);
    filteredEvents = filteredEvents.filter((event) => event.date >= dateFrom);
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo);
    filteredEvents = filteredEvents.filter((event) => event.date <= dateTo);
  }

  filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  const page = pagination.page || 1;
  const limit = pagination.limit || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  return {
    events: paginatedEvents,
    total: filteredEvents.length,
    page,
    limit,
    totalPages: Math.ceil(filteredEvents.length / limit),
  };
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  await delay(200);
  const event = eventsWithDates.find((e) => e.slug === slug);
  return event || null;
}

export async function getFeaturedEvents(): Promise<Event[]> {
  await delay(200);
  return eventsWithDates.filter((event) => event.featured).slice(0, 3);
}

export async function getCategories(): Promise<string[]> {
  await delay(100);
  const categories = new Set(eventsWithDates.map((event) => event.category));
  return Array.from(categories).sort();
}

export async function getLocations(): Promise<string[]> {
  await delay(100);
  const locations = new Set(
    eventsWithDates.map((event) => `${event.location.city}, ${event.location.country}`)
  );
  return Array.from(locations).sort();
}

