import { Ticket } from '@/types/ticket';
import { BookingFormData } from '@/types/booking';
import { mockTickets } from '@/data/mockTickets';
import { getEventBySlug } from './events';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getTickets(): Promise<Ticket[]> {
  await delay(300);
  return [...mockTickets];
}

export async function bookTicket(
  eventSlug: string,
  formData: BookingFormData
): Promise<{ success: boolean; ticket?: Ticket; error?: string }> {
  await delay(1500); // Simulate API delay


  const event = await getEventBySlug(eventSlug);
  if (!event) {
    return {
      success: false,
      error: 'Event not found.',
    };
  }

  // Check if event is full
  if (event.attendeeCount >= event.maxAttendees) {
    return {
      success: false,
      error: 'This event is fully booked.',
    };
  }

  // Create ticket
  const ticket: Ticket = {
    id: `ticket-${Date.now()}`,
    eventId: event.id,
    eventSlug: event.slug,
    eventTitle: event.title,
    eventDate: event.date,
    eventLocation: event.location,
    attendeeName: formData.name,
    attendeeEmail: formData.email,
    attendeeMobile: formData.mobile,
    bookingDate: new Date(),
    price: event.price,
  };


  return {
    success: true,
    ticket,
  };
}

