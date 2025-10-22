import { supabaseAdmin } from '@/lib/supabase/server'

export class CreditsService {
  // Check if user is admin
  static async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()

    if (error) return false
    return data.is_admin || false
  }

  // Get user credits (returns 999999 for admins for display purposes)
  static async getUserCredits(userId: string): Promise<number> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('credits, is_admin')
      .eq('id', userId)
      .single()

    if (error) throw error
    
    // If admin or unlimited credits (-1), return a large number for display
    if (data.is_admin || data.credits === -1) {
      return 999999
    }
    
    return data.credits
  }

  // Deduct credits (returns true if successful, false if insufficient)
  static async deductCredits(
    userId: string,
    amount: number,
    description?: string
  ): Promise<boolean> {
    // Check if admin first (admins have unlimited credits, no deduction needed)
    const isAdmin = await this.isAdmin(userId)
    if (isAdmin) {
      console.log(`Admin user ${userId} - skipping credit deduction`)
      return true
    }

    const { data, error } = await supabaseAdmin.rpc('deduct_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_description: description,
    })

    if (error) throw error
    return data as boolean
  }

  // Add credits
  static async addCredits(
    userId: string,
    amount: number,
    type: 'purchase' | 'bonus' | 'refund' = 'purchase',
    description?: string
  ): Promise<void> {
    const { error } = await supabaseAdmin.rpc('add_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_type: type,
      p_description: description,
    })

    if (error) throw error
  }

  // Get credit transactions
  static async getCreditTransactions(userId: string, limit = 50) {
    const { data, error } = await supabaseAdmin
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Check if user has enough credits
  static async hasEnoughCredits(userId: string, required: number): Promise<boolean> {
    // Check if admin first (admins have unlimited credits)
    const isAdmin = await this.isAdmin(userId)
    if (isAdmin) return true
    
    const credits = await this.getUserCredits(userId)
    return credits >= required
  }
}
