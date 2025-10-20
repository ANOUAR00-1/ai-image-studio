// User types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  plan: 'free' | 'pro' | 'business'
  credits: number
  created_at: string
  updated_at: string
}

// Generation types
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

// Credit transaction types
export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: 'purchase' | 'generation' | 'refund' | 'bonus'
  description?: string
  generation_id?: string
  created_at: string
}

// Subscription types
export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  stripe_price_id?: string
  status?: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// API Key types
export interface ApiKey {
  id: string
  user_id: string
  key: string
  name?: string
  is_active: boolean
  created_at: string
  last_used_at?: string
}

// API Request/Response types
export interface ApiError {
  error: string
  details?: unknown
}

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
}

export interface GenerateImageRequest {
  prompt: string
  tool: string
  size?: string
  quality?: string
}

export interface GenerateVideoRequest {
  prompt: string
  tool: string
  duration?: number
}

export interface UpdateProfileRequest {
  name?: string
  avatar_url?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
