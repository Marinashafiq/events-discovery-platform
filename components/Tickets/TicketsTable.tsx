'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { Ticket } from '@/types/ticket';
import { printTicket } from '@/lib/utils/ticketPrint';

interface TicketsTableProps {
  tickets: Ticket[];
}

export default function TicketsTable({ tickets }: TicketsTableProps) {
  const t = useTranslations('tickets.table');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const formatDate = (date: Date) => {
    try {
      if (locale === 'ar') {
        const d = new Date(date);
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
      return format(date, 'MMM d, yyyy');
    } catch {
      return date.toLocaleDateString();
    }
  };

  const formatPrice = (price: number | 'free') => {
    if (price === 'free') return tCommon('free');
    return `$${price}`;
  };

  const handlePrint = (ticket: Ticket) => {
    printTicket(ticket, {
      formatDate,
      formatPrice,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-left rtl:text-right">
                {t('event')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-left rtl:text-right">
                {t('date')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-left rtl:text-right">
                {t('location')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-left rtl:text-right">
                {t('attendee')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-left rtl:text-right">
                {t('price')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-left rtl:text-right">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-left rtl:text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {ticket.eventTitle}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left rtl:text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(ticket.eventDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left rtl:text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ticket.eventLocation.city}, {ticket.eventLocation.country}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left rtl:text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ticket.attendeeName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left rtl:text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPrice(ticket.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left rtl:text-right">
                  <button
                    onClick={() => handlePrint(ticket)}
                    className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-900 dark:hover:text-blue-300 inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1 rtl:mr-0 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {tCommon('print')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

