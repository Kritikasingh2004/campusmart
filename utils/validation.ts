/**
 * Validation utility functions for form validation and data checking
 */

/**
 * Check if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a string is a valid phone number (10 digits)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

/**
 * Check if a string is a valid price (positive number)
 */
export function isValidPrice(price: string | number): boolean {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice > 0;
}

/**
 * Check if a string has a minimum length
 */
export function hasMinLength(text: string, minLength: number): boolean {
  return text.length >= minLength;
}

/**
 * Check if a string has a maximum length
 */
export function hasMaxLength(text: string, maxLength: number): boolean {
  return text.length <= maxLength;
}

/**
 * Check if a value is not empty (string, array, object)
 */
export function isNotEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

/**
 * Check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Check if a file is below a certain size (in MB)
 */
export function isFileSizeValid(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const isValid = file.size <= maxSizeBytes;

  // Log file size for debugging
  if (!isValid) {
    console.warn(
      `File size validation failed: ${(file.size / (1024 * 1024)).toFixed(
        2
      )}MB exceeds limit of ${maxSizeMB}MB`
    );
  }

  return isValid;
}

/**
 * Strictly validate file size with no tolerance
 * This is used after compression to ensure we never upload files larger than the limit
 */
export function enforceFileSizeLimit(blob: Blob, maxSizeMB: number): void {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (blob.size > maxSizeBytes) {
    const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `Image size (${sizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB`
    );
  }
}
