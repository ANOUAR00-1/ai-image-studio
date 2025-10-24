/**
 * Client-side API caching utility using SWR-like pattern
 * Reduces unnecessary API calls and improves navigation speed
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresIn: number
}

class APICache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache = new Map<string, CacheEntry<any>>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pendingRequests = new Map<string, Promise<any>>()

  /**
   * Get cached data or fetch if not available/expired
   * @param key - Cache key (usually the API endpoint)
   * @param fetcher - Function to fetch data if not cached
   * @param expiresIn - Cache duration in milliseconds (default: 5 minutes)
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    expiresIn: number = 5 * 60 * 1000
  ): Promise<T> {
    // Check if data is in cache and not expired
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
      return cached.data as T
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key)
    if (pending) {
      return pending
    }

    // Fetch new data
    const promise = fetcher()
      .then((data) => {
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          expiresIn,
        })
        this.pendingRequests.delete(key)
        return data
      })
      .catch((error) => {
        this.pendingRequests.delete(key)
        throw error
      })

    this.pendingRequests.set(key, promise)
    return promise
  }

  /**
   * Invalidate cache for a specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
    this.pendingRequests.clear()
  }

  /**
   * Prefetch data and store in cache
   */
  async prefetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    expiresIn: number = 5 * 60 * 1000
  ): Promise<void> {
    await this.get(key, fetcher, expiresIn)
  }
}

// Export singleton instance
export const apiCache = new APICache()

/**
 * Hook for using cached API calls in React components
 */
export function useCachedFetch<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  options: {
    expiresIn?: number
    enabled?: boolean
  } = {}
) {
  const { expiresIn = 5 * 60 * 1000, enabled = true } = options
  const [data, setData] = React.useState<T | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (!key || !enabled) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    const fetchData = async () => {
      try {
        const result = await apiCache.get(key, fetcher, expiresIn)
        if (!cancelled) {
          setData(result)
          setError(null)
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [key, enabled, expiresIn, fetcher])

  const mutate = React.useCallback(
    async (newData?: T) => {
      if (!key) return

      if (newData !== undefined) {
        setData(newData)
        apiCache.invalidate(key)
      } else {
        setIsLoading(true)
        try {
          apiCache.invalidate(key)
          const result = await apiCache.get(key, fetcher, expiresIn)
          setData(result)
          setError(null)
        } catch (err) {
          setError(err as Error)
        } finally {
          setIsLoading(false)
        }
      }
    },
    [key, fetcher, expiresIn]
  )

  return { data, error, isLoading, mutate }
}

// Import React for the hook
import React from 'react'
