/**
 * String utility functions
 */

/**
 * Capitalize the first letter of a string
 */
export function capitalizeFirstLetter(string: string): string {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Capitalize the first letter of each word in a string
 */
export function capitalizeWords(string: string): string {
  if (!string) return string;
  return string
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

/**
 * Convert a string to camelCase
 */
export function toCamelCase(string: string): string {
  return string
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

/**
 * Convert a string to snake_case
 */
export function toSnakeCase(string: string): string {
  return string
    .replace(/\s+/g, '_')
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Convert a string to kebab-case
 */
export function toKebabCase(string: string): string {
  return string
    .replace(/\s+/g, '-')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Mask a string (e.g., for credit card numbers, emails)
 */
export function maskString(
  string: string,
  visibleStart: number = 4,
  visibleEnd: number = 4,
  maskChar: string = '*'
): string {
  if (!string) return string;
  if (string.length <= visibleStart + visibleEnd) return string;
  
  const start = string.substring(0, visibleStart);
  const end = string.substring(string.length - visibleEnd);
  const masked = maskChar.repeat(string.length - visibleStart - visibleEnd);
  
  return start + masked + end;
}

/**
 * Extract initials from a name
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Remove HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Check if a string contains only alphanumeric characters
 */
export function isAlphanumeric(string: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(string);
}

/**
 * Truncate a string in the middle (useful for long filenames, URLs)
 */
export function truncateMiddle(
  string: string,
  maxLength: number,
  separator: string = '...'
): string {
  if (!string || string.length <= maxLength) return string;
  
  const charsToShow = maxLength - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  
  return (
    string.substring(0, frontChars) +
    separator +
    string.substring(string.length - backChars)
  );
}
