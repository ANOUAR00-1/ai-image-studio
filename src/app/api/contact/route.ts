import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { ApiResponse } from '@/backend/utils/response'
import { addCorsHeaders } from '@/backend/utils/cors'

// OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, request.headers.get('origin') || undefined)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      const response = ApiResponse.validationError('Name, email, and message are required')
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const response = ApiResponse.validationError('Invalid email format')
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Insert contact message
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to save contact message:', error)
      const response = ApiResponse.error('Failed to send message')
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    const response = ApiResponse.success({
      message: 'Your message has been sent successfully. We will get back to you soon!',
      id: data.id
    })
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  } catch (error) {
    console.error('Contact endpoint error:', error)
    const response = ApiResponse.serverError()
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }
}
