import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

// Middleware to verify JWT token
export async function verifyAuth(request: NextRequest): Promise<{
  success: boolean
  userId?: string
  user?: { id: string; email: string }
  error?: string
}> {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return { success: false, error: 'No token provided' }
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return { success: false, error: 'Invalid token' }
    }

    return {
      success: true,
      userId: user.id,
      user: { id: user.id, email: user.email! },
    }
  } catch {
    return { success: false, error: 'Authentication failed' }
  }
}

// Wrapper for protected API routes
export function withAuth(
  handler: (request: NextRequest, context: { userId: string; user: { id: string; email: string } }) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(request, {
      userId: authResult.userId!,
      user: authResult.user!,
    })
  }
}

// Wrapper for admin-only API routes
export function withAdmin(
  handler: (request: NextRequest, context: { userId: string; user: { id: string; email: string } }) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', authResult.userId!)
      .single()

    if (error || !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return handler(request, {
      userId: authResult.userId!,
      user: authResult.user!,
    })
  }
}

// Error handler wrapper
export function errorHandler<T>(
  fn: (...args: T[]) => Promise<unknown>
) {
  return async (...args: T[]) => {
    try {
      return await fn(...args)
    } catch (_error) {
      console.error('API Error:', _error)
      throw _error
    }
  }
}

// Validate request body
export function validateBody<T>(
  body: unknown,
  requiredFields: string[]
): { valid: boolean; data?: T; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const missingFields = requiredFields.filter(
    field => !(field in body) || (body as Record<string, unknown>)[field] === undefined
  )

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
    }
  }

  return { valid: true, data: body as T }
}
