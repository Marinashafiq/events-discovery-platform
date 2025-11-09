import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;

  const disallowPaths = [
    '/_next/',           // Next.js internal files
    '/api/',             // API routes (if any are added in the future)
  ];

  // Add tickets pages for all locales (user-specific, should not be indexed)
  routing.locales.forEach((locale) => {
    disallowPaths.push(`/${locale}/tickets`);
  });

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

