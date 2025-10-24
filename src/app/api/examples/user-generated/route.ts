import { NextRequest } from 'next/server'
import { ApiResponse } from '@/backend/utils/response'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET endpoint to fetch user-generated images for examples showcase
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch successful generations with images
    const query = supabaseAdmin
      .from('generations')
      .select('*')
      .eq('status', 'completed')
      .not('result_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit)

    const { data: generations, error } = await query

    if (error) throw error

    // Transform to examples format
    const examples = generations?.map(gen => ({
      id: gen.id,
      title: gen.prompt.split(',')[0].trim().slice(0, 50), // First part of prompt as title
      category: category || 'all',
      prompt: gen.prompt,
      image_url: gen.result_url,
      type: 'image',
      model: gen.model,
      credits_used: gen.credits_used || 2,
    })) || []

    return ApiResponse.success({ examples })

  } catch (error) {
    console.error('Fetch user-generated examples error:', error)
    return ApiResponse.serverError()
  }
}
