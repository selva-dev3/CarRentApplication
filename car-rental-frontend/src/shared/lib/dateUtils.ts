import { format, differenceInDays, parseISO } from 'date-fns';

export function formatDate(date: Date | string | null, pattern = 'MMM dd, yyyy'): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatDateTime(date: Date | string | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy hh:mm a');
}

export function getDaysBetween(start: Date | string | null, end: Date | string | null): number {
  if (!start || !end) return 0;
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInDays(e, s);
}

export function toISODate(date: Date | null): string | undefined {
  if (!date) return undefined;
  return date.toISOString();
}
