// Simple in-memory rate limiter (not suitable for multi-instance deployments)
const userTimestamps = new Map();

export function rateLimit(userId) {
  const now = Date.now();
  const windowTime = 60 * 1000; // 1 minute
  const maxRequests = 4;

  if (!userTimestamps.has(userId)) {
    userTimestamps.set(userId, []);
  }

  // Get requests timestamps within the last windowTime
  const timestamps = userTimestamps.get(userId).filter(ts => now - ts < windowTime);

  if (timestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Add current timestamp
  timestamps.push(now);
  userTimestamps.set(userId, timestamps);
  return true;
}
