/**
 * Date utility functions for formatting and manipulating dates
 */

/**
 * Format a date as a relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const dateToFormat = new Date(date);
  const seconds = Math.floor((now.getTime() - dateToFormat.getTime()) / 1000);
  
  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  // Check each interval
  if (seconds < 0) {
    return 'just now';
  } else if (seconds < 60) {
    return 'just now';
  } else if (seconds < intervals.hour) {
    const minutes = Math.floor(seconds / intervals.minute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (seconds < intervals.day) {
    const hours = Math.floor(seconds / intervals.hour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (seconds < intervals.week) {
    const days = Math.floor(seconds / intervals.day);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (seconds < intervals.month) {
    const weeks = Math.floor(seconds / intervals.week);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (seconds < intervals.year) {
    const months = Math.floor(seconds / intervals.month);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(seconds / intervals.year);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string | number): boolean {
  const today = new Date();
  const dateToCheck = new Date(date);
  
  return (
    dateToCheck.getDate() === today.getDate() &&
    dateToCheck.getMonth() === today.getMonth() &&
    dateToCheck.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string | number): boolean {
  return new Date(date).getTime() < new Date().getTime();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string | number): boolean {
  return new Date(date).getTime() > new Date().getTime();
}

/**
 * Format a date as a short date (e.g., "Jan 1, 2023")
 */
export function formatShortDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Format a date as a time (e.g., "2:30 PM")
 */
export function formatTime(date: Date | string | number): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(date));
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get the difference in days between two dates
 */
export function getDaysDifference(date1: Date | string | number, date2: Date | string | number): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  // Convert both dates to UTC to avoid DST issues
  const utcDate1 = Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
  const utcDate2 = Date.UTC(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
  
  return Math.floor(Math.abs((utcDate2 - utcDate1) / oneDay));
}
