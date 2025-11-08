import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { format } from 'date-fns';
import { getEventBySlug } from '@/lib/api/events';
import { Link as I18nLink } from '@/i18n/routing';
import { generatePageMetadata } from '@/lib/utils/metadata';

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

  const formatDate = (date: Date) => {
    try {
      if (locale === 'ar') {
        const d = new Date(date);
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        return `${days[d.getDay()]}، ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (date: Date) => {
    try {
      if (locale === 'ar') {
        const d = new Date(date);
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'م' : 'ص';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
      return format(date, 'h:mm a');
    } catch {
      return date.toLocaleTimeString();
    }
  };

  const formatPrice = () => {
    if (event.price === 'free') return t('free');
    return `$${event.price}`;
  };

  const locationString = `${event.location.venue}, ${event.location.city}, ${event.location.state}, ${event.location.country}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  // Structured data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || event.date.toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.venue,
        addressLocality: event.location.city,
        addressRegion: event.location.state,
        addressCountry: event.location.country,
      },
    },
    image: event.imageUrl,
    organizer: {
      '@type': 'Organization',
      name: event.organizer.name,
    },
    offers: {
      '@type': 'Offer',
      price: event.price === 'free' ? '0' : event.price.toString(),
      priceCurrency: 'USD',
      availability: event.attendeeCount < event.maxAttendees ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: `${baseUrl}/${locale}/events/${event.slug}/book`,
      validFrom: event.createdAt.toISOString(),
    },
    performer: {
      '@type': 'Organization',
      name: event.organizer.name,
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
              />
              {event.featured && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                      <span className="ml-2 rtl:ml-0 rtl:mr-2">{formatTime(event.date)}</span>
                      {event.endDate && (
                        <span className="ml-1 rtl:ml-0 rtl:mr-1">- {formatTime(event.endDate)}</span>
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

