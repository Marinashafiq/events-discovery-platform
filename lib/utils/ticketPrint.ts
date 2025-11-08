import { Ticket } from '@/types/event';

interface PrintTicketOptions {
  formatDate: (date: Date) => string;
  formatPrice: (price: number | 'free') => string;
}

/**
 * Generates the HTML content for printing a ticket
 */
function generateTicketHTML(ticket: Ticket, options: PrintTicketOptions): string {
  const { formatDate, formatPrice } = options;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ticket - ${ticket.eventTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .ticket {
            border: 2px solid #000;
            padding: 20px;
            margin: 20px 0;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .event-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .details {
            margin: 10px 0;
          }
          .details strong {
            display: inline-block;
            width: 150px;
          }
          @media print {
            body {
              margin: 0;
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="event-title">${ticket.eventTitle}</div>
            <div>Ticket #${ticket.id}</div>
          </div>
          <div class="details">
            <strong>Event Date:</strong> ${formatDate(ticket.eventDate)}
          </div>
          <div class="details">
            <strong>Location:</strong> ${ticket.eventLocation.venue}, ${ticket.eventLocation.city}, ${ticket.eventLocation.country}
          </div>
          <div class="details">
            <strong>Attendee:</strong> ${ticket.attendeeName}
          </div>
          <div class="details">
            <strong>Email:</strong> ${ticket.attendeeEmail}
          </div>
          <div class="details">
            <strong>Mobile:</strong> ${ticket.attendeeMobile}
          </div>
          <div class="details">
            <strong>Price:</strong> ${formatPrice(ticket.price)}
          </div>
          <div class="details">
            <strong>Booking Date:</strong> ${formatDate(ticket.bookingDate)}
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Prints a ticket in a new window
 */
export function printTicket(ticket: Ticket, options: PrintTicketOptions): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window. Please check your popup blocker settings.');
    return;
  }

  const printContent = generateTicketHTML(ticket, options);

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

