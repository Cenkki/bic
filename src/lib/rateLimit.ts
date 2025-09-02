// Simple in-memory rate limiter (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 5; // 5 requests
const TIME_WINDOW = 60 * 1000; // 1 minute

/**
 * Check if a client has exceeded the rate limit
 */
export function isRateLimited(clientId: string): { limited: boolean; resetTime?: number } {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientId);
  
  // If no record exists or the time window has passed, reset the counter
  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + TIME_WINDOW });
    return { limited: false };
  }
  
  // Increment the count
  const newCount = clientData.count + 1;
  
  // Check if limit is exceeded
  if (newCount > RATE_LIMIT) {
    return { limited: true, resetTime: clientData.resetTime };
  }
  
  // Update the count
  rateLimitStore.set(clientId, { count: newCount, resetTime: clientData.resetTime });
  return { limited: false };
}

/**
 * Get client identifier (IP address in this case)
 */
export function getClientId(request: Request): string {
  // In a real implementation, you would get the actual IP address
  // For now, we'll use a placeholder
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0].trim() || realIp || '127.0.0.1';
  
  return ip;
}