type Entry = {
  count: number;
  expiresAt: number;
};

const bucket = new Map<string, Entry>();

export function getClientIp(headerValue: string | null) {
  if (!headerValue) return "unknown";

  return headerValue.split(",")[0]?.trim() || "unknown";
}

export function consumeRateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const current = bucket.get(key);

  if (!current || current.expiresAt <= now) {
    bucket.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: current.expiresAt - now };
  }

  current.count += 1;
  bucket.set(key, current);

  return { allowed: true, remaining: limit - current.count };
}
