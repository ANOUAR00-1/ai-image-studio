import { NextRequest, NextResponse } from 'next/server'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://ai-image-studio.vercel.app',
  'https://ai-image-studio-hsvqr6o3c-banouarofficiel-gmailcoms-projects.vercel.app',
  // Add your production domain here
]

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin?: string
): NextResponse {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
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
