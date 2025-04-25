/**
 * Function utility helpers
 */

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every specified wait milliseconds.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (...args: Parameters<T>): void {
    const now = Date.now();

    if (now - lastCall >= wait) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Memoizes a function by caching its results.
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, unknown>();

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = func(...args);
    cache.set(key, result);

    return result as ReturnType<T>;
  };
}

/**
 * Creates a function that is restricted to invoking the provided function
 * once. Repeat calls to the function return the value of the first invocation.
 */
export function once<T extends (...args: unknown[]) => unknown>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  let result: unknown;
  let called = false;

  return function (...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = func(...args);
    }

    return result as ReturnType<T>;
  };
}

/**
 * Creates a function that invokes the provided function with its arguments
 * transformed by the specified transforms.
 */
export function overArgs<T extends (...args: unknown[]) => unknown>(
  func: T,
  transforms: Array<(arg: unknown) => unknown>
): (...args: Parameters<T>) => ReturnType<T> {
  return function (...args: Parameters<T>): ReturnType<T> {
    const transformedArgs = args.map((arg, index) => {
      return transforms[index] ? transforms[index](arg) : arg;
    });

    const result = func(...(transformedArgs as Parameters<T>));
    return result as ReturnType<T>;
  };
}
