import { Ticket } from '@/types/ticket';
import { BookingFormData } from '@/types/booking';
import { mockTickets } from '@/data/mockTickets';
import { getEventBySlug } from './events';

// Simulate API delay
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

  // Simulate occasional API failures (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: 'Network error. Please try again later.',
    };
  }

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

  // In a real app, this would be saved to a database
  // For now, we just return success

  return {
    success: true,
    ticket,
  };
}

