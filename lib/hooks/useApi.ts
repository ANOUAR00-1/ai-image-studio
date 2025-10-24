/**
 * API Hooks with SWR for client-side caching
 * Reduces unnecessary API calls and improves navigation speed
 */

import useSWR from 'swr'

// Fetcher function with cookie support
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include', // Include httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'API Error' }))
    throw new Error(error.error || 'API Error')
  }
  
  return res.json()
}

// ============================================
// USER HOOKS
// ============================================

/**
 * Get current user data
 */
export function useUser() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/auth/me',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
      shouldRetryOnError: false,
    }
  )

  return {
    user: data?.data?.user,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Get user statistics
 */
export function useUserStats() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/stats',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  )

  return {
    stats: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Get user generations
 */
export function useUserGenerations(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/user/generations?limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // Cache for 30 seconds
    }
  )

  return {
    generations: data?.data?.generations || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Get generation history
 */
export function useGenerationHistory() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/generations/history',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  )

  return {
    generations: data?.data?.generations || [],
    total: data?.data?.total || 0,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// ============================================
// NOTIFICATION HOOKS
// ============================================

/**
 * Get user notifications
 */
export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/notifications',
    fetcher,
    {
      refreshInterval: 60000, // Auto-refresh every minute
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  )

  return {
    notifications: data?.data?.notifications || [],
    unreadCount: data?.data?.notifications?.filter((n: { read: boolean }) => !n.read).length || 0,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Get admin statistics
 */
export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/admin/stats',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000, // Cache for 2 minutes
    }
  )

  return {
    stats: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Get admin users list
 */
export function useAdminUsers() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/admin/users',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    users: data?.data?.users || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Get admin generations list
 */
export function useAdminGenerations() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/admin/generations',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    generations: data?.data?.generations || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Get admin analytics
 */
export function useAdminAnalytics() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/admin/analytics',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000,
    }
  )

  return {
    analytics: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// ============================================
// BILLING HOOKS
// ============================================

/**
 * Get user invoices
 */
export function useInvoices() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/billing/invoices',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  )

  return {
    invoices: data?.data?.invoices || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// ============================================
// EXAMPLES HOOKS
// ============================================

/**
 * Get examples showcase
 */
export function useExamples() {
  const { data, error, isLoading } = useSWR(
    '/api/examples/user-generated',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  )

  return {
    examples: data?.data?.examples || [],
    isLoading,
    isError: error,
  }
}

// ============================================
// MUTATION HELPERS
// ============================================

/**
 * Mark notification as read
 */
export async function markNotificationRead(id: string) {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: 'POST',
    credentials: 'include',
  })
  return res.json()
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead() {
  const res = await fetch('/api/notifications/read-all', {
    method: 'POST',
    credentials: 'include',
  })
  return res.json()
}

/**
 * Add favorite
 */
export async function addFavorite(generationId: string) {
  const res = await fetch(`/api/favorites/${generationId}`, {
    method: 'POST',
    credentials: 'include',
  })
  return res.json()
}

/**
 * Remove favorite
 */
export async function removeFavorite(generationId: string) {
  const res = await fetch(`/api/favorites/${generationId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return res.json()
}
