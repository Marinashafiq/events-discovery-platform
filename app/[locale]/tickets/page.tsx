import { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getTickets } from '@/lib/api/tickets';
import { generatePageMetadata } from '@/lib/utils/metadata';
import TicketsTable from '@/components/Tickets/TicketsTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import StructuredData from '@/components/StructuredData';
import { buildTicketsCollectionPageSchema } from '@/lib/utils/structuredData';

interface TicketsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TicketsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('tickets');
  
  const title = `${t('title')} | Events Platform`;
  const description = `View and manage your event tickets. Access your booked events, print tickets, and view booking details.`;
  const keywords = [
    'my tickets',
    'event tickets',
    'booked events',
    'ticket management',
    locale === 'ar' ? 'تذاكري' : '',
    locale === 'ar' ? 'تذاكر الأحداث' : '',
  ];

  return generatePageMetadata({
    title,
    description,
    keywords,
    locale,
    url: `/${locale}/tickets`,
    twitterCard: 'summary',
    robotsIndex: false,
  });
}

async function TicketsContent() {
  const t = await getTranslations('tickets');
  const tickets = await getTickets();

  if (tickets.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('noTickets')}
        </p>
      </div>
    );
  }

  return <TicketsTable tickets={tickets} />;
}

export default async function TicketsPage({ params }: TicketsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('tickets');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const tickets = await getTickets();

  // Structured data (JSON-LD) for tickets page
  const structuredData = buildTicketsCollectionPageSchema(
    tickets,
    locale,
    baseUrl,
    {
      name: t('title'),
      description: 'View and manage your event tickets',
      url: `${baseUrl}/${locale}/tickets`,
      maxItems: 10,
    }
  );

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('title')}
            </h1>
          </div>

          <Suspense fallback={<LoadingSkeleton variant="table" count={5} />}>
            <TicketsContent />
          </Suspense>
        </main>
      </div>
    </>
  );
}

