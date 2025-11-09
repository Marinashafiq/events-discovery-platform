# Events Discovery Platform

A modern, multilingual events discovery and booking platform built with Next.js 16, TypeScript, and Tailwind CSS. Features comprehensive SEO optimization, internationalization (English/Arabic), and a fully responsive design.

## Features

- 🎫 **Event Discovery**: Browse and search through 30+ unique events
- 🔍 **Advanced Filtering**: Filter by category, location, and date range
- 🌍 **Internationalization**: Full support for English and Arabic (RTL)
- 📱 **Responsive Design**: Mobile-first design with collapsible navigation
- 🔐 **SEO Optimized**: Dynamic metadata, Open Graph, Twitter Cards, and structured data
- ⚡ **Performance**: Server-side rendering, optimized images, and code splitting
- 🎯 **Type Safety**: Full TypeScript with strict mode enabled

## Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl 4.4.0
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns with locale support
- **Fonts**: Poppins (English), Tajawal (Arabic)

## Prerequisites

- Node.js 18+ 
- npm

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd events-discovery-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory (optional):

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

If not set, the application will default to `https://example.com` for metadata URLs.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically redirect to `/en/events` (default locale).

### 5. Build for Production

```bash
npm run build
```

### 6. Start Production Server

```bash
npm start
```

## Project Structure

```
events-discovery-platform/
├── app/                          # Next.js App Router pages
│   ├── [locale]/                # Locale-based routing (en, ar)
│   │   ├── events/              # Events pages
│   │   │   ├── [slug]/          # Dynamic event detail pages
│   │   │   │   ├── book/        # Booking page
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx     # Event detail page
│   │   │   └── page.tsx         # Events listing page
│   │   ├── tickets/             # User tickets page
│   │   │   └── page.tsx
│   │   ├── layout.tsx           # Locale layout with NextIntl provider
│   │   └── page.tsx             # Locale root (redirects to /events)
│   ├── layout.tsx               # Root layout with fonts and direction script
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Dynamic sitemap generation
│   ├── robots.ts                # Robots.txt configuration
│   └── favicon.ico              # Site favicon
├── components/                   # React components
│   ├── Booking/
│   │   ├── BookingForm.tsx      # Booking form with validation
│   │   └── BookingSuccessModal.tsx # Success modal after booking
│   ├── Event/
│   │   ├── EventCard.tsx        # Individual event card component
│   │   ├── EventFiltersClient.tsx # Client-side filters
│   │   ├── EventFiltersServer.tsx # Server component for filters
│   │   ├── EventsGrid.tsx        # Client-side events grid with pagination
│   │   ├── EventsGridServer.tsx  # Server component for initial events
│   │   └── EventsSearch.tsx     # Search component with debouncing
│   ├── Tickets/
│   │   └── TicketsTable.tsx      # Tickets display table
│   ├── ErrorAlert.tsx           # Reusable error alert component
│   ├── LoadingSkeleton.tsx      # Loading state component
│   ├── LocaleHtml.tsx           # Client component for locale attributes
│   └── Navigation.tsx            # Main navigation with mobile menu
├── lib/
│   ├── api/                      # Mock API layer
│   │   ├── events.ts            # Event data fetching and filtering
│   │   └── tickets.ts           # Ticket operations
│   └── utils/                   # Utility functions
│       ├── metadata.ts          # Reusable metadata generator
│       ├── structuredData.ts    # Reusable schema.org structured data builders
│       └── ticketPrint.ts       # Ticket printing utility
├── data/                         # Mock data
│   ├── mockEvents.ts            # Event data
│   └── mockTickets.ts           # Sample tickets
├── types/                        # TypeScript type definitions
│   ├── booking.ts               # Booking form types
│   ├── event.ts                 # Event and filter types
│   ├── locale.ts                # Locale type definition
│   └── ticket.ts                # Ticket type definition
├── messages/                     # Translation files
│   ├── en.json                  # English translations
│   └── ar.json                  # Arabic translations
├── i18n/                         # Internationalization config
│   ├── routing.ts                # Routing configuration
│   └── request.ts                # Request configuration
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── proxy.ts                      # Next.js proxy for i18n routing
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
└── README.md                     # This file
```

## Key Features Implementation

### SEO Optimization

- **Dynamic Metadata**: Each page generates metadata using `generateMetadata` function
- **Structured Data**: Reusable JSON-LD schema markup utilities for events, tickets, and reservations
- **Schema.org Support**: Event, EventReservation, ReservationAction, CollectionPage, and Ticket schemas
- **Sitemap**: Dynamic sitemap.xml generated from event data
- **Robots.txt**: Proper crawling rules configured
- **Open Graph & Twitter Cards**: Social media preview support

### Internationalization

- **URL-based Locales**: `/en/events` and `/ar/events`
- **RTL Support**: Full right-to-left layout for Arabic
- **Direction Management**: Prevents FOUC with inline blocking script
- **Locale-aware Metadata**: Different metadata for each language

### State Management

- **URL State**: Search parameters drive filtering (`?search=...&category=...`)
- **React Hooks**: useState, useEffect, useRef for component state
- **Server Components**: Data fetching happens in server components for SEO
- **Client Components**: Only used where interactivity is needed (filters, pagination)
- **Debounced Search**: Search component with debouncing to reduce API calls

### Responsive Design

- **Mobile-first**: Tailwind breakpoints (sm, md, lg)
- **Collapsible Navigation**: Burger menu on mobile
- **Flexible Grids**: 1 column (mobile) → 3 columns (desktop)
- **RTL-aware**: Proper spacing for both LTR and RTL


## TypeScript

The project uses TypeScript with strict mode enabled. All components, functions, and data structures are fully typed. No `any` types are used.

## Code Organization

### Reusable Utilities

The project includes several reusable utility modules:

- **`lib/utils/metadata.ts`**: Centralized metadata generation for all pages with Open Graph and Twitter Card support
- **`lib/utils/structuredData.ts`**: Reusable schema.org structured data builders:
  - `buildEventSchema()` - Event schema with configurable options
  - `buildReservationActionSchema()` - Booking page schema
  - `buildCollectionPageSchema()` - Events listing page schema
  - `buildTicketsCollectionPageSchema()` - Tickets listing page schema
  - Helper functions for Place, Organization, and Offer schemas
- **`lib/utils/ticketPrint.ts`**: Ticket printing functionality

### Translation Structure

Translations are organized by namespace in JSON files:
- `common` - Shared UI elements (buttons, labels)
- `events` - Event-related content (listing, details, filters)
- `booking` - Booking form and validation messages
- `tickets` - Ticket management interface

All user-facing content is fully translatable, including SEO-optimized paragraphs and descriptions.

