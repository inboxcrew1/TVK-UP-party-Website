/**
 * Universal async timeout wrapper.
 * Wraps any Promise with a hard timeout that returns a controlled error response
 * instead of hanging indefinitely — preventing nginx 504 Gateway Timeouts.
 *
 * Usage:
 *   const result = await withTimeout(prisma.member.count(), 8000, 'member count');
 */
export class TimeoutError extends Error {
  constructor(label: string, ms: number) {
    super(`Operation "${label}" timed out after ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

/**
 * Races a promise against a timer.
 * If the promise does not resolve within `ms` milliseconds, throws TimeoutError.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label = 'operation'
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(label, ms));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

/**
 * Wraps a promise with a timeout; returns a fallback value instead of throwing
 * if the timeout is exceeded. Suitable for non-critical background operations.
 */
export async function withTimeoutFallback<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
  label = 'operation'
): Promise<T> {
  try {
    return await withTimeout(promise, ms, label);
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.warn(`[TIMEOUT] ${err.message} — using fallback value`);
      return fallback;
    }
    throw err;
  }
}
