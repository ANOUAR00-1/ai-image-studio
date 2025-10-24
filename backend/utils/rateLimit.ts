import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting (use Redis in production for distributed systems)
const rateLimitStore: RateLimitStore = {}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  })
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string // Custom error message
}

/**
 * Rate limiting middleware
 * @param config Rate limit configuration
 * @returns Middleware function
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later'
  } = config

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Get client identifier (IP address or user ID from token)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    // Get user ID from auth header if available
    const authHeader = request.headers.get('authorization')
    const identifier = authHeader ? `user:${authHeader.slice(0, 20)}` : `ip:${ip}`

    const now = Date.now()
    const key = `${identifier}:${request.nextUrl.pathname}`

    // Initialize or get existing rate limit data
    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + windowMs
      }
      return null // Allow request
    }

    // Increment request count
    rateLimitStore[key].count++

    // Check if limit exceeded
    if (rateLimitStore[key].count > maxRequests) {
      const resetIn = Math.ceil((rateLimitStore[key].resetTime - now) / 1000)
      
      return NextResponse.json(
        { 
          error: message,
          retryAfter: resetIn
        },
        { 
          status: 429,
          headers: {
            'Retry-After': resetIn.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitStore[key].resetTime).toISOString()
          }
        }
      )
    }

    // Add rate limit headers to response
    return null // Allow request, headers will be added by wrapper
  }
}

/**
 * Wrapper to apply rate limiting to API route handlers
 */
export function withRateLimit<T>(
  config: RateLimitConfig,
  handler: (request: NextRequest, ...args: T[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T[]): Promise<NextResponse> => {
    // Check rate limit
    const rateLimitResponse = await rateLimit(config)(request)
    
    if (rateLimitResponse) {
      return rateLimitResponse // Rate limit exceeded
    }

    // Continue with original handler
    return handler(request, ...args)
  }
}

/**
 * Predefined rate limit configurations
 */
export const RateLimits = {
  // Strict rate limit for authentication endpoints
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again in 15 minutes.'
  },
  
  // Moderate rate limit for API endpoints
  API: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many requests. Please slow down.'
  },
  
  // Strict rate limit for generation endpoints (expensive operations)
  GENERATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 generations per minute
    message: 'Generation rate limit exceeded. Please wait before creating more.'
  },
  
  // Lenient rate limit for read-only endpoints
  READ: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'Too many requests. Please try again shortly.'
  }
}
