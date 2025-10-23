/**
 * API Client Utility
 * Centralized API calls with authentication
 */

interface Generation {
  id: string
  url: string
  prompt: string
  model?: string
  creditsUsed: number
  createdAt?: string
}

interface ImageGenerationResponse {
  generation: Generation
  remainingCredits: number
}

interface VideoGenerationResponse {
  generation: Generation
  remainingCredits: number
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      console.log('🔍 API Request:', { 
        endpoint,
        method: options.method || 'GET'
      })

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // Merge with any additional headers
      if (options.headers) {
        Object.assign(headers, options.headers)
      }

      // Use credentials: 'include' to send httpOnly cookies
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Important: send cookies with request
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Image generation
  async generateImage(prompt: string, model: string = 'sdxl'): Promise<ApiResponse<ImageGenerationResponse>> {
    return this.request<ImageGenerationResponse>('/api/generate/image', {
      method: 'POST',
      body: JSON.stringify({ prompt, model }),
    })
  }

  // Video generation
  async generateVideo(prompt: string, model: string = 'stable-video'): Promise<ApiResponse<VideoGenerationResponse>> {
    return this.request<VideoGenerationResponse>('/api/generate/video', {
      method: 'POST',
      body: JSON.stringify({ prompt, model }),
    })
  }

  // Get available models
  async getModels() {
    return this.request('/api/generate/image', {
      method: 'GET',
    })
  }

  // Get generation history
  async getGenerations() {
    return this.request('/api/generations/history', {
      method: 'GET',
    })
  }

  // Delete generation
  async deleteGeneration(id: string) {
    return this.request(`/api/generations/${id}`, {
      method: 'DELETE',
    })
  }

  // Get user profile
  async getProfile() {
    return this.request('/api/auth/profile', {
      method: 'GET',
    })
  }

  // Update user profile
  async updateProfile(data: { name?: string; avatar_url?: string }) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Admin: Get stats
  async getAdminStats() {
    return this.request('/api/admin/stats', {
      method: 'GET',
    })
  }

  // Admin: Get recent users
  async getRecentUsers() {
    return this.request('/api/admin/users/recent', {
      method: 'GET',
    })
  }

  // Admin: Get recent generations
  async getRecentGenerations() {
    return this.request('/api/admin/generations/recent', {
      method: 'GET',
    })
  }

  // Stripe: Create checkout session
  async createCheckout(data: {
    type: 'subscription' | 'credits'
    plan?: string
    credits?: number
    price?: number
  }) {
    return this.request('/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

// Export singleton instance
export const api = new ApiClient()
