'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Event } from '@/types/event';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getBlurDataURL } from '@/lib/utils/blurPlaceholder';
import { formatLongDate } from '@/lib/utils/dateFormat';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const t = useTranslations('events.details');
  const locale = useLocale() as 'en' | 'ar';

  const formatDate = (date: Date) => formatLongDate(date, locale);

  const formatPrice = () => {
    if (event.price === 'free') return t('free');
    return `$${event.price}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/events/${event.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={getBlurDataURL()}
          />
          {event.featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {event.title}
            </h3>
            <span className="text-blue-600 dark:text-blue-400 font-semibold ml-2 rtl:ml-0 rtl:mr-2 whitespace-nowrap">
              {formatPrice()}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {event.description}
          </p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mb-2">
            <svg className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
            <svg className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location.city}, {event.location.country}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {event.attendeeCount} / {event.maxAttendees} {t('attendees')}
            </span>
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
              {event.category}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

