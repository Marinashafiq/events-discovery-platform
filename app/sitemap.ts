import { MetadataRoute } from 'next';
import { eventsWithDates } from '@/data/mockEvents';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  
  const routes: MetadataRoute.Sitemap = [];

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

  // Add event detail pages
  eventsWithDates.forEach((event) => {
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

