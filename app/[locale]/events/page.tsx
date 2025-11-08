import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import EventsSearch from '@/components/Event/EventsSearch';
import EventFiltersServer from '@/components/Event/EventFiltersServer';
import EventsGridServer from '@/components/Event/EventsGridServer';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { getEvents } from '@/lib/api/events';
import { generatePageMetadata } from '@/lib/utils/metadata';

interface EventsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: EventsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('events');
  
  // Get some events for structured data
  const eventsData = await getEvents({}, { page: 1, limit: 6 });
  
  const title = `${t('title')} | Events Platform`;
  const description = `${t('upcomingEvents')} - Discover and book tickets for the best events in your area. Find concerts, conferences, workshops, and more.`;
  const keywords = [
    'events',
    'tickets',
    'book events',
    'upcoming events',
    'concerts',
    'conferences',
    'workshops',
    'entertainment',
    locale === 'ar' ? 'أحداث' : '',
    locale === 'ar' ? 'تذاكر' : '',
  ];

  const imageUrl = eventsData.events[0]?.imageUrl;

  return generatePageMetadata({
    title,
    description,
    keywords,
    locale,
    url: `/${locale}/events`,
    imageUrl,
    imageAlt: t('title'),
  });
}

export default async function EventsPage({ params, searchParams }: EventsPageProps) {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const t = await getTranslations('events');

  const page = parseInt(searchParamsResolved.page as string) || 1;
  const search = searchParamsResolved.search as string;
  const category = searchParamsResolved.category as string;
  const location = searchParamsResolved.location as string;
  const dateFrom = searchParamsResolved.dateFrom as string;
  const dateTo = searchParamsResolved.dateTo as string;

  const filters = {
    ...(search && { search }),
    ...(category && { category }),
    ...(location && { location }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const eventsData = await getEvents(filters, { page: 1, limit: 6 });

  // Structured data (JSON-LD) for EventCollection
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    description: t('upcomingEvents'),
    url: `${baseUrl}/${locale}/events`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: eventsData.total,
      itemListElement: eventsData.events.slice(0, 10).map((event, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Event',
          name: event.title,
          description: event.description,
          startDate: event.date.toISOString(),
          endDate: event.endDate?.toISOString() || event.date.toISOString(),
          location: {
            '@type': 'Place',
            name: event.location.venue,
            address: {
              '@type': 'PostalAddress',
              addressLocality: event.location.city,
              addressRegion: event.location.state,
              addressCountry: event.location.country,
            },
          },
          image: event.imageUrl,
          offers: {
            '@type': 'Offer',
            price: event.price === 'free' ? '0' : event.price.toString(),
            priceCurrency: 'USD',
            url: `${baseUrl}/${locale}/events/${event.slug}/book`,
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('upcomingEvents')}
            </p>
          </div>

          <Suspense fallback={<LoadingSkeleton variant="text" count={1} />}>
            <EventsSearch initialSearch={search || ''} />
          </Suspense>

          <Suspense fallback={<LoadingSkeleton variant="text" count={1} />}>
            <EventFiltersServer initialFilters={filters} />
          </Suspense>

          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"><LoadingSkeleton variant="card" count={6} /></div>}>
            <EventsGridServer filters={filters} page={page} />
          </Suspense>
        </main>
      </div>
    </>
  );
}

