import { supabaseAdmin } from '@/lib/supabase/server'
import { supabase } from '@/lib/supabase/client'

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (error) throw error
    return data
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get user by token
  static async getUserByToken(token: string) {
    const { data, error } = await supabase.auth.getUser(token)
    if (error) throw error
    return data.user
  }

  // Get user profile from database
  static async getUserProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  // Update user profile
  static async updateProfile(userId: string, updates: {
    name?: string
    avatar_url?: string
  }) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Change password
  static async changePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return data
  }
}
