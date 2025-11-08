export interface Ticket {
  id: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation: {
    venue: string;
    city: string;
    state: string;
    country: string;
  };
  attendeeName: string;
  attendeeEmail: string;
  attendeeMobile: string;
  bookingDate: Date;
  price: number | "free";
}
