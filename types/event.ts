export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  date: Date;
  endDate?: Date;
  location: {
    venue: string;
    city: string;
    state: string;
    country: string;
  };
  category: string;
  tags: string[];
  imageUrl: string;
  price: number | 'free';
  attendeeCount: number;
  maxAttendees: number;
  organizer: {
    name: string;
    avatar: string;
  };
  featured: boolean;
  createdAt: Date;
}


export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

