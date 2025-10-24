import { NextRequest, NextResponse } from 'next/server'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://ai-image-studio.vercel.app', // Production URL
  'https://*.vercel.app', // All Vercel preview URLs
  // Add your custom domain here
  // 'https://yourdomain.com',
]

/**
 * Check if origin is allowed (supports wildcard patterns)
 */
function isOriginAllowed(origin: string): boolean {
  // Allow all localhost
  if (origin.includes('localhost')) return true
  
  // Allow all vercel.app domains
  if (origin.includes('.vercel.app')) return true
  
  // Check exact matches
  return ALLOWED_ORIGINS.some(allowedOrigin => {
    if (allowedOrigin.includes('*')) {
      // Convert wildcard pattern to regex
      const pattern = allowedOrigin
        .replace(/\./g, '\\.') // Escape dots
        .replace(/\*/g, '[a-zA-Z0-9-]+') // Replace * with valid domain chars
      return new RegExp(`^${pattern}$`).test(origin)
    }
    return allowedOrigin === origin
  })
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin?: string
): NextResponse {
  // If origin is allowed, use it. Otherwise use wildcard for development
  const allowedOrigin = origin && isOriginAllowed(origin) ? origin : '*'

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Allow-Credentials', allowedOrigin !== '*' ? 'true' : 'false')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreFlight(request: NextRequest): Response {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, request.headers.get('origin') || undefined)
}

/**
 * Middleware wrapper to add CORS to any API route
 * Uses 'any' types to support multiple handler signatures (withAuth, withAdmin, etc.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withCors(handler: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (request: NextRequest, context: any) => {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Call the actual handler
    const response = await handler(request, context)

    // Add CORS headers to response
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }
}
