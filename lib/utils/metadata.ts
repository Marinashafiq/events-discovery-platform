import { Metadata } from 'next';

export interface GenerateMetadataOptions {
  title: string;
  description: string;
  keywords?: string | string[];
  locale: string;
  url: string;
  imageUrl?: string;
  imageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  robotsIndex?: boolean;
  siteName?: string;
}

export function generatePageMetadata(options: GenerateMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords,
    locale,
    url,
    imageUrl,
    imageAlt,
    twitterCard = 'summary_large_image',
    robotsIndex = true,
    siteName = 'Events Platform',
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  const ogLocale = locale === 'ar' ? 'ar_SA' : 'en_US';
  
  const absoluteImageUrl = imageUrl
    ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`)
    : undefined;

  const canonicalUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  const pathWithoutLocale = url.replace(/^\/(en|ar)/, '') || '/';
  const languageAlternates = {
    'en': `${baseUrl}/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    'ar': `${baseUrl}/ar${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
  };

  const keywordsString = Array.isArray(keywords)
    ? keywords.filter(Boolean).join(', ')
    : keywords || '';

  const metadata: Metadata = {
    title,
    description,
    ...(keywordsString && { keywords: keywordsString }),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale,
      siteName,
      url: canonicalUrl,
      ...(absoluteImageUrl && {
        images: [
          {
            url: absoluteImageUrl,
            width: 1200,
            height: 630,
            alt: imageAlt || title,
          },
        ],
      }),
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      creator: '@EventsPlatform',
      site: '@EventsPlatform',
      ...(absoluteImageUrl && { images: [absoluteImageUrl] }),
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    robots: {
      index: robotsIndex,
      follow: true,
      googleBot: {
        index: robotsIndex,
        follow: true,
        ...(robotsIndex && {
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        }),
      },
    },
  };

  return metadata;
}

