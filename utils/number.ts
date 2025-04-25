/**
 * Number utility functions
 */

/**
 * Format a number with commas as thousands separators
 */
export function formatNumber(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Clamp a number between a minimum and maximum value
 */
export function clamp(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max);
}

/**
 * Round a number to a specified number of decimal places
 */
export function roundToDecimalPlaces(number: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}

/**
 * Calculate the percentage of a value relative to a total
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Format a percentage (e.g., "42%")
 */
export function formatPercentage(
  percentage: number,
  decimalPlaces: number = 0
): string {
  return `${roundToDecimalPlaces(percentage, decimalPlaces)}%`;
}

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Convert a number to an ordinal string (1st, 2nd, 3rd, etc.)
 */
export function toOrdinal(number: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Format a number as a file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Check if a number is even
 */
export function isEven(number: number): boolean {
  return number % 2 === 0;
}

/**
 * Check if a number is odd
 */
export function isOdd(number: number): boolean {
  return number % 2 !== 0;
}

/**
 * Calculate the average of an array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((total, num) => total + num, 0);
  return sum / numbers.length;
}
