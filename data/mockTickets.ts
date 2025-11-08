import { Ticket } from '@/types/event';

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    eventId: '1',
    eventSlug: 'tech-summit-2024',
    eventTitle: 'Tech Summit 2024',
    eventDate: new Date('2024-12-15T10:00:00'),
    eventLocation: {
      venue: 'Convention Center',
      city: 'Dubai',
      state: 'Dubai',
      country: 'United Arab Emirates',
    },
    attendeeName: 'Ahmed Ali',
    attendeeEmail: 'ahmed.ali@example.com',
    attendeeMobile: '+971501234567',
    bookingDate: new Date('2024-11-01T14:30:00'),
    price: 299,
  },
  {
    id: 'ticket-2',
    eventId: '2',
    eventSlug: 'music-festival-summer',
    eventTitle: 'Summer Music Festival',
    eventDate: new Date('2024-12-22T16:00:00'),
    eventLocation: {
      venue: 'City Park',
      city: 'Riyadh',
      state: 'Riyadh',
      country: 'Saudi Arabia',
    },
    attendeeName: 'Ahmed Ali',
    attendeeEmail: 'ahmed.ali@example.com',
    attendeeMobile: '+971501234567',
    bookingDate: new Date('2024-11-05T10:15:00'),
    price: 150,
  },
  {
    id: 'ticket-3',
    eventId: '3',
    eventSlug: 'art-exhibition-modern',
    eventTitle: 'Modern Art Exhibition',
    eventDate: new Date('2024-12-08T09:00:00'),
    eventLocation: {
      venue: 'Art Gallery Museum',
      city: 'Cairo',
      state: 'Cairo',
      country: 'Egypt',
    },
    attendeeName: 'Ahmed Ali',
    attendeeEmail: 'ahmed.ali@example.com',
    attendeeMobile: '+971501234567',
    bookingDate: new Date('2024-11-10T11:20:00'),
    price: 'free',
  },
];

