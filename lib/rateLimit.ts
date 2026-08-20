const hitMap = new Map<string, number[]>();

/**
 * Checks if a given key (e.g. client IP or identifier) has exceeded the max allowed hits
 * within a sliding window duration (windowMs).
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = hitMap.get(key) || [];
  // Filter out timestamps outside current window
  const validTimestamps = timestamps.filter((ts) => ts > windowStart);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const resetMs = oldest + windowMs - now;
    hitMap.set(key, validTimestamps);
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    };
  }

  validTimestamps.push(now);
  hitMap.set(key, validTimestamps);

  return {
    allowed: true,
    remaining: limit - validTimestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Helper to extract client IP address from standard Request headers.
 */
export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }
  return '127.0.0.1';
}
