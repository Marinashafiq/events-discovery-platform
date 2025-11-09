import { MetadataRoute } from 'next';
import { getEvents } from '@/lib/api/events';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  
  const routes: MetadataRoute.Sitemap = [];

  // Fetch all events for sitemap 
  const eventsData = await getEvents({}, { page: 1, limit: 1000 });
  const allEvents = eventsData.events;

  // Add locale-specific main routes
  routing.locales.forEach((locale) => {
    // Events listing page (main content page)
    routes.push({
      url: `${baseUrl}/${locale}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Tickets page (lower priority, user-specific content)
    routes.push({
      url: `${baseUrl}/${locale}/tickets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5, // Lower priority as it's user-specific
    });
  });

  // Add event detail pages dynamically based on available events
  allEvents.forEach((event) => {
    routing.locales.forEach((locale) => {
      // Event detail page (high priority for SEO)
      routes.push({
        url: `${baseUrl}/${locale}/events/${event.slug}`,
        lastModified: event.createdAt,
        changeFrequency: 'weekly',
        priority: 0.9,
      });

      // Booking page (lower priority, action page)
      routes.push({
        url: `${baseUrl}/${locale}/events/${event.slug}/book`,
        lastModified: event.createdAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  return routes;
}

