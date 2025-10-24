/**
 * Credit Display Utilities
 */

interface User {
  credits?: number
  is_admin?: boolean
  [key: string]: unknown
}

/**
 * Format credits for display
 * - Admins: "∞ Unlimited"
 * - Credits = -1: "∞ Unlimited"
 * - Credits = 999999: "∞ Unlimited"
 * - Regular: "X credits"
 */
export function formatCredits(user: User | null | undefined): string {
  if (!user) return '0 credits'
  
  const credits = user.credits ?? 0
  
  // Admin or unlimited credits
  if (user.is_admin || credits === -1 || credits >= 999999) {
    return '∞ Unlimited'
  }
  
  return `${credits} ${credits === 1 ? 'credit' : 'credits'}`
}

/**
 * Check if user has unlimited credits
 */
export function hasUnlimitedCredits(user: User | null | undefined): boolean {
  if (!user) return false
  
  const credits = user.credits ?? 0
  return user.is_admin === true || credits === -1 || credits >= 999999
}

/**
 * Check if user can afford an action
 */
export function canAfford(user: User | null | undefined, required: number): boolean {
  if (!user) return false
  
  // Unlimited credits
  if (hasUnlimitedCredits(user)) return true
  
  // Check regular credits
  const credits = user.credits ?? 0
  return credits >= required
}

/**
 * Get display value for credits (for UI components)
 */
export function getCreditsDisplay(user: User | null | undefined): number | string {
  if (!user) return 0
  
  const credits = user.credits ?? 0
  
  // Admin or unlimited
  if (user.is_admin || credits === -1 || credits >= 999999) {
    return '∞'
  }
  
  return credits
}
