import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getEventBySlug } from '@/lib/api/events';
import BookingForm from '@/components/Booking/BookingForm';
import { Link as I18nLink } from '@/i18n/routing';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { buildReservationActionSchema } from '@/lib/utils/structuredData';

interface BookTicketPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BookTicketPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations('booking');
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  const eventDate = event.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const locationString = `${event.location.city}, ${event.location.country}`;
  const priceString = event.price === 'free' ? 'Free' : `$${event.price}`;
  const description = `Book your ticket for ${event.title} on ${eventDate} in ${locationString}. ${priceString} tickets available. ${event.description}`;

  return generatePageMetadata({
    title: `${t('title')} - ${event.title} | Events Platform`,
    description,
    keywords: [
      event.title,
      'book tickets',
      'event tickets',
      event.location.city,
      event.location.country,
      event.category,
      ...event.tags,
    ],
    locale,
    url: `/${locale}/events/${slug}/book`,
    imageUrl: event.imageUrl,
    imageAlt: event.title,
  });
}

export default async function BookTicketPage({ params }: BookTicketPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('booking');
  const tCommon = await getTranslations('common');
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  // Structured data (JSON-LD) for SEO
  const structuredData = buildReservationActionSchema(event, locale, baseUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <I18nLink
            href={`/events/${slug}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
          >
            <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tCommon('back')}
          </I18nLink>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 lg:p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {event.title}
              </p>

              <BookingForm eventSlug={slug} eventTitle={event.title} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

