import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/backend/utils/response'
import { addCorsHeaders } from '@/backend/utils/cors'
import { supabaseAdmin } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

// OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, request.headers.get('origin') || undefined)
}

// DELETE user
export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  if (!id) {
    const response = ApiResponse.validationError('User ID is required')
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }

  try {
    // Delete user's generations first (cascade)
    await supabaseAdmin
      .from('generations')
      .delete()
      .eq('user_id', id)

    // Delete user's credit transactions
    await supabaseAdmin
      .from('credit_transactions')
      .delete()
      .eq('user_id', id)

    // Delete user profile
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Delete from auth (optional, requires service role)
    try {
      await supabaseAdmin.auth.admin.deleteUser(id)
    } catch (authError) {
      console.error('Failed to delete auth user:', authError)
    }

    const response = ApiResponse.success({ message: 'User deleted successfully' })
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  } catch (error) {
    console.error('Failed to delete user:', error)
    const response = ApiResponse.serverError()
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }
}

// PATCH user - Update user details
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  if (!id) {
    const response = ApiResponse.validationError('User ID is required')
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }

  try {
    const body = await request.json()
    const { credits, plan, is_admin } = body

    const updateData: Record<string, unknown> = {}
    
    if (credits !== undefined) updateData.credits = credits
    if (plan) updateData.plan = plan
    if (is_admin !== undefined) updateData.is_admin = is_admin

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    const response = ApiResponse.success({ user: data })
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  } catch (error) {
    console.error('Failed to update user:', error)
    const response = ApiResponse.serverError()
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }
}
