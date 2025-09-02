// Production rate limiter using Redis
import { Redis } from "@upstash/redis";

const RATE_LIMIT = 5; // 5 requests
const TIME_WINDOW = 60; // 1 minute

// Initialize Redis client only if environment variables are properly configured
let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && 
      process.env.UPSTASH_REDIS_REST_URL !== "your-redis-url" && 
      process.env.UPSTASH_REDIS_REST_TOKEN !== "your-redis-token") {
    redis = Redis.fromEnv();
  }
} catch (error) {
  console.warn("Failed to initialize Redis client:", error);
  redis = null;
}

/**
 * Check if a client has exceeded the rate limit using Redis
 */
export async function isRateLimited(clientId: string): Promise<{ limited: boolean; resetTime?: number }> {
  // If Redis is not configured, always return not limited
  if (!redis) {
    return { limited: false };
  }
  
  try {
    const key = `rate_limit:${clientId}`;
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Get current count and reset time
    const [count, resetTime] = await redis.multi().get(`${key}:count`).get(`${key}:reset`).exec<[string | null, string | null]>();
    
    const currentCount = count ? parseInt(count) : 0;
    const currentResetTime = resetTime ? parseInt(resetTime) : 0;
    
    // If no record exists or the time window has passed, reset the counter
    if (!currentResetTime || currentTime > currentResetTime) {
      const newResetTime = currentTime + TIME_WINDOW;
      await redis.multi()
        .set(`${key}:count`, 1, { ex: TIME_WINDOW })
        .set(`${key}:reset`, newResetTime, { ex: TIME_WINDOW })
        .exec();
      return { limited: false };
    }
    
    // Increment the count
    const newCount = currentCount + 1;
    
    // Check if limit is exceeded
    if (newCount > RATE_LIMIT) {
      return { limited: true, resetTime: currentResetTime * 1000 };
    }
    
    // Update the count
    await redis.set(`${key}:count`, newCount, { ex: currentResetTime - currentTime });
    return { limited: false };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    // Fail open in case of Redis errors
    return { limited: false };
  }
}

/**
 * Get client identifier (IP address)
 */
export function getClientId(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0].trim() || realIp || '127.0.0.1';
  
  return ip;
}