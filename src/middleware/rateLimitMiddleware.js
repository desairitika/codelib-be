/**
 * Simple in-memory rate limiter for protecting auth endpoints
 * Tracks request attempts per IP address
 */
const logger = require('../utils/logger');

// Store request attempts: { ip: { count: number, resetTime: timestamp } }
const requestAttempts = {};

// Configuration
const RATE_LIMIT_WINDOW_MS = 1 * 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5; // Max requests per window

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

function rateLimitAuth(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();

  // Initialize or reset if window has passed
  if (!requestAttempts[ip]) {
    requestAttempts[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    };
    return next();
  }

  // Reset if time window has passed
  if (now > requestAttempts[ip].resetTime) {
    requestAttempts[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    };
    return next();
  }

  // Check if rate limit exceeded
  if (requestAttempts[ip].count >= MAX_ATTEMPTS) {
    logger.warn('Rate limit exceeded for auth endpoint', { ip, attempts: requestAttempts[ip].count });
    return res.status(429).json({
      code: 429,
      success: false,
      error: 'Too many authentication attempts. Please try again later.',
      retryAfter: Math.ceil((requestAttempts[ip].resetTime - now) / 1000)
    });
  }

  // Increment attempt count
  requestAttempts[ip].count++;
  next();
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const ip in requestAttempts) {
    if (requestAttempts[ip].resetTime < now) {
      delete requestAttempts[ip];
    }
  }
}, RATE_LIMIT_WINDOW_MS);

module.exports = { rateLimitAuth };
