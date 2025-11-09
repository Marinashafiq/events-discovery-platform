import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import EventsSearch from '@/components/Event/EventsSearch';
import EventFiltersServer from '@/components/Event/EventFiltersServer';
import EventsGridServer from '@/components/Event/EventsGridServer';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { getEvents } from '@/lib/api/events';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { buildCollectionPageSchema } from '@/lib/utils/structuredData';

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const eventsData = await getEvents(filters, { page: 1, limit: 6 });

  // Structured data (JSON-LD) for EventCollection
  const structuredData = buildCollectionPageSchema(
    eventsData.events,
    eventsData.total,
    locale,
    baseUrl,
    {
      name: t('title'),
      description: t('upcomingEvents'),
      url: `${baseUrl}/${locale}/events`,
      maxItems: 10,
    }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')} - {t('upcomingEvents')}
            </h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Welcome to our comprehensive events platform where you can <strong>discover events</strong> happening near you and around the world. Whether you're looking for concerts, conferences, workshops, cultural festivals, or business networking events, our platform makes it easy to find and book tickets for the best <strong>upcoming events</strong> in your area.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our <strong>events platform</strong> features a diverse collection of events across multiple categories including technology, music, arts, sports, business, education, and entertainment. Each event listing provides detailed information about the date, time, location, pricing, and organizer, helping you make informed decisions when choosing which events to attend.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To help you <strong>discover events</strong> that match your interests, we've built powerful search and filtering tools. Use the search bar to find events by name, or apply filters to narrow down results by category, location, or date range. You can filter events by specific categories like technology conferences, music festivals, or business workshops, making it simple to find exactly what you're looking for.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Once you've found an event that interests you, booking tickets is quick and straightforward. Simply click on any event card to view full details, including the event description, venue information, ticket pricing, and availability. Our secure booking system ensures your ticket purchase is safe and reliable, and you'll receive instant confirmation via email.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We regularly update our platform with new events, so there's always something exciting to discover. From free community gatherings to premium exclusive events, our platform caters to all interests and budgets. Whether you're planning a weekend activity, looking for professional development opportunities, or seeking entertainment options, you'll find a wide variety of events to choose from.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Start exploring our curated selection of events below. Use the search and filter options to refine your results, and don't forget to check back regularly as we add new events daily. Join thousands of event-goers who use our platform to discover and book tickets for memorable experiences.
              </p>
            </div>
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

