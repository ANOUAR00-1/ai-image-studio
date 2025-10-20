import { supabaseAdmin } from '@/lib/supabase/server'

export interface Generation {
  id: string
  user_id: string
  type: 'image' | 'video'
  prompt: string
  tool: string
  url?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  credits_used: number
  created_at: string
}

export class GenerationService {
  // Create new generation record
  static async createGeneration(
    userId: string,
    type: 'image' | 'video',
    prompt: string,
    tool: string,
    creditsUsed: number
  ): Promise<Generation> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .insert({
        user_id: userId,
        type,
        prompt,
        tool,
        credits_used: creditsUsed,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update generation status
  static async updateGenerationStatus(
    generationId: string,
    status: 'processing' | 'completed' | 'failed',
    url?: string
  ): Promise<Generation> {
    const updateData: Record<string, unknown> = { status }
    if (url) updateData.url = url

    const { data, error } = await supabaseAdmin
      .from('generations')
      .update(updateData)
      .eq('id', generationId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get user generations
  static async getUserGenerations(
    userId: string,
    limit = 50,
    offset = 0
  ): Promise<Generation[]> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data
  }

  // Get generation by ID
  static async getGenerationById(generationId: string): Promise<Generation> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .single()

    if (error) throw error
    return data
  }

  // Delete generation
  static async deleteGeneration(generationId: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('generations')
      .delete()
      .eq('id', generationId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // Get user generation stats
  static async getUserStats(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('type, status, created_at')
      .eq('user_id', userId)

    if (error) throw error

    const stats = {
      total: data.length,
      images: data.filter(g => g.type === 'image').length,
      videos: data.filter(g => g.type === 'video').length,
      completed: data.filter(g => g.status === 'completed').length,
      failed: data.filter(g => g.status === 'failed').length,
      last24Hours: data.filter(g => {
        const createdAt = new Date(g.created_at)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        return createdAt > oneDayAgo
      }).length,
    }

    return stats
  }
}
