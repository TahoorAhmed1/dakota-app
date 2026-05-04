/**
 * Simple in-memory rate limiter.
 * Tracks request counts per IP per rolling window.
 * Not suitable for multi-process deployments — add Redis if needed.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune stale entries every 5 minutes to avoid memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.windowStart > 60_000 * 5) {
      store.delete(key);
    }
  }
}, 60_000 * 5);

/**
 * Returns true if the request should be rate-limited (blocked).
 * @param ip       - Client IP address (used as key)
 * @param limit    - Max requests allowed in the window
 * @param windowMs - Window duration in milliseconds
 */
export function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return true;
  }

  return false;
}
