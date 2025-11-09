import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getEventBySlug } from '@/lib/api/events';
import { Link as I18nLink } from '@/i18n/routing';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { buildEventSchema } from '@/lib/utils/structuredData';
import { getBlurDataURL } from '@/lib/utils/blurPlaceholder';
import { formatLongDate, formatTime } from '@/lib/utils/dateFormat';
import StructuredData from '@/components/StructuredData';

interface EventDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  const keywords = [
    event.title,
    event.category,
    event.location.city,
    event.location.country,
    'event tickets',
    'book event',
    ...event.tags,
  ];

  return generatePageMetadata({
    title: `${event.title} | Events Platform`,
    description: event.description,
    keywords,
    locale,
    url: `/${locale}/events/${slug}`,
    imageUrl: event.imageUrl,
    imageAlt: event.title,
  });
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('events.details');
  const tCommon = await getTranslations('common');
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const formatDate = (date: Date) => formatLongDate(date, locale as 'en' | 'ar');
  const formatTimeDisplay = (date: Date) => formatTime(date, locale as 'en' | 'ar');

  const formatPrice = () => {
    if (event.price === 'free') return t('free');
    return `$${event.price}`;
  };

  const locationString = `${event.location.venue}, ${event.location.city}, ${event.location.state}, ${event.location.country}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  // Structured data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    ...buildEventSchema(event, locale, baseUrl, {
      includeEventStatus: true,
      includeEventAttendanceMode: true,
      includePerformer: true,
      includeValidFrom: true,
    }),
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <I18nLink
            href="/events"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
          >
            <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tCommon('back')}
          </I18nLink>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96 w-full">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                placeholder="blur"
                blurDataURL={getBlurDataURL()}
              />
              {event.featured && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  Featured
                </div>
              )}
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {event.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{t('date')}:</span>
                      <span className="ml-2 rtl:ml-0 rtl:mr-2">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{t('time')}:</span>
                      <span className="ml-2 rtl:ml-0 rtl:mr-2">{formatTimeDisplay(event.date)}</span>
                      {event.endDate && (
                        <span className="ml-1 rtl:ml-0 rtl:mr-1">- {formatTimeDisplay(event.endDate)}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{t('location')}:</span>
                      <span className="ml-2 rtl:ml-0 rtl:mr-2">{locationString}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:ml-6 rtl:lg:ml-0 rtl:lg:mr-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {formatPrice()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {event.attendeeCount} / {event.maxAttendees} {t('attendees')}
                    </div>
                    <I18nLink
                      href={`/events/${event.slug}/book`}
                      className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
                    >
                      {t('bookNow')}
                    </I18nLink>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('organizer')}
                  </h3>
                  <div className="flex items-center">
                    <Image
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-3 rtl:mr-0 rtl:ml-3"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{event.organizer.name}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('category')}
                  </h3>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                </div>
              </div>

              {event.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t('tags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('description')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.longDescription}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

