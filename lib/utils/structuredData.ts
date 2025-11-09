import { Event } from '@/types/event';
import { Ticket } from '@/types/ticket';

/**
 * Builds a schema.org Place object from event location data
 */
export function buildPlaceSchema(location: Event['location']) {
  return {
    '@type': 'Place' as const,
    name: location.venue,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: location.venue,
      addressLocality: location.city,
      addressRegion: location.state,
      addressCountry: location.country,
    },
  };
}

/**
 * Builds a schema.org Organization object from event organizer data
 */
export function buildOrganizerSchema(organizer: Event['organizer']) {
  return {
    '@type': 'Organization' as const,
    name: organizer.name,
  };
}

/**
 * Builds a schema.org Offer object from event pricing data
 */
export function buildOfferSchema(
  event: Pick<Event, 'price' | 'attendeeCount' | 'maxAttendees' | 'slug' | 'createdAt'>,
  locale: string,
  baseUrl: string,
  options?: {
    includeValidFrom?: boolean;
  }
) {
  return {
    '@type': 'Offer' as const,
    price: event.price === 'free' ? '0' : event.price.toString(),
    priceCurrency: 'USD',
    availability:
      event.attendeeCount < event.maxAttendees
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    url: `${baseUrl}/${locale}/events/${event.slug}/book`,
    ...(options?.includeValidFrom && { validFrom: event.createdAt.toISOString() }),
  };
}

/**
 * Builds a schema.org Event object from event data
 */
export function buildEventSchema(
  event: Event,
  locale: string,
  baseUrl: string,
  options?: {
    includeEventStatus?: boolean;
    includeEventAttendanceMode?: boolean;
    includePerformer?: boolean;
    includeValidFrom?: boolean;
  }
) {
  return {
    '@type': 'Event' as const,
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || event.date.toISOString(),
    ...(options?.includeEventStatus && {
      eventStatus: 'https://schema.org/EventScheduled',
    }),
    ...(options?.includeEventAttendanceMode && {
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    }),
    location: buildPlaceSchema(event.location),
    image: event.imageUrl,
    organizer: buildOrganizerSchema(event.organizer),
    offers: buildOfferSchema(event, locale, baseUrl, {
      includeValidFrom: options?.includeValidFrom,
    }),
    ...(options?.includePerformer && {
      performer: buildOrganizerSchema(event.organizer),
    }),
  };
}

/**
 * Builds a schema.org EventReservation object from event data
 */
export function buildEventReservationSchema(
  event: Event,
  locale: string,
  baseUrl: string
) {
  return {
    '@type': 'EventReservation' as const,
    reservationFor: buildEventSchema(event, locale, baseUrl),
  };
}

/**
 * Builds a schema.org ReservationAction object for booking pages
 */
export function buildReservationActionSchema(
  event: Event,
  locale: string,
  baseUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ReservationAction' as const,
    target: buildEventReservationSchema(event, locale, baseUrl),
    object: {
      '@type': 'Ticket' as const,
      name: `Ticket for ${event.title}`,
    },
  };
}

/**
 * Builds a simplified Event schema for use in ItemList (without organizer and with minimal location)
 */
function buildSimplifiedEventSchema(
  event: Event,
  locale: string,
  baseUrl: string
) {
  return {
    '@type': 'Event' as const,
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || event.date.toISOString(),
    location: {
      '@type': 'Place' as const,
      name: event.location.venue,
      address: {
        '@type': 'PostalAddress' as const,
        addressLocality: event.location.city,
        addressRegion: event.location.state,
        addressCountry: event.location.country,
      },
    },
    image: event.imageUrl,
    offers: {
      '@type': 'Offer' as const,
      price: event.price === 'free' ? '0' : event.price.toString(),
      priceCurrency: 'USD',
      url: `${baseUrl}/${locale}/events/${event.slug}/book`,
    },
  };
}

/**
 * Builds a schema.org CollectionPage with ItemList for events listing pages
 */
export function buildCollectionPageSchema(
  events: Event[],
  total: number,
  locale: string,
  baseUrl: string,
  options: {
    name: string;
    description: string;
    url: string;
    maxItems?: number;
  }
) {
  const maxItems = options.maxItems || 10;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage' as const,
    name: options.name,
    description: options.description,
    url: options.url,
    mainEntity: {
      '@type': 'ItemList' as const,
      numberOfItems: total,
      itemListElement: events.slice(0, maxItems).map((event, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        item: buildSimplifiedEventSchema(event, locale, baseUrl),
      })),
    },
  };
}

/**
 * Builds a schema.org Ticket object from ticket data
 */
function buildTicketSchema(ticket: Ticket) {
  return {
    '@type': 'Ticket' as const,
    name: `Ticket for ${ticket.eventTitle}`,
    description: `Ticket for ${ticket.eventTitle} on ${ticket.eventDate.toISOString().split('T')[0]}`,
  };
}

/**
 * Builds a schema.org CollectionPage with ItemList for tickets listing pages
 */
export function buildTicketsCollectionPageSchema(
  tickets: Ticket[],
  locale: string,
  baseUrl: string,
  options: {
    name: string;
    description: string;
    url: string;
    maxItems?: number;
  }
) {
  const maxItems = options.maxItems || 10;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage' as const,
    name: options.name,
    description: options.description,
    url: options.url,
    mainEntity: {
      '@type': 'ItemList' as const,
      numberOfItems: tickets.length,
      itemListElement: tickets.slice(0, maxItems).map((ticket, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        item: buildTicketSchema(ticket),
      })),
    },
  };
}

