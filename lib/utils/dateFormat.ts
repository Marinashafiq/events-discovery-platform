import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

type Locale = 'en' | 'ar';

function getDateFnsLocale(locale: Locale) {
  return locale === 'ar' ? ar : enUS;
}


export function formatLongDate(date: Date, locale: Locale = 'en'): string {
  try {
    return format(date, 'MMMM d, yyyy', { locale: getDateFnsLocale(locale) });
  } catch {
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export function formatTime(date: Date, locale: Locale = 'en'): string {
  try {
    return format(date, 'h:mm a', { locale: getDateFnsLocale(locale) });
  } catch {
    return date.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}


