/**
 * Lazy-loaded components for better performance
 * These components are loaded on-demand to reduce initial bundle size
 */

import dynamic from 'next/dynamic'

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
  </div>
)

// ============================================
// ADMIN COMPONENTS (Heavy, rarely used)
// ============================================

export const AdminDashboard = dynamic(
  () => import('@/components/pages/admin/AdminDashboard'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
)

export const AdminUsersPage = dynamic(
  () => import('@/components/pages/admin/AdminUsersPage'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
)

export const AdminGenerationsPage = dynamic(
  () => import('@/components/pages/admin/AdminGenerationsPage'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
)

export const AdminAnalyticsPage = dynamic(
  () => import('@/components/pages/admin/AdminAnalyticsPage'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
)

export const AdminPaymentsPage = dynamic(
  () => import('@/components/pages/admin/AdminPaymentsPage'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
)

// ============================================
// AUTH COMPONENTS (Modal, load on demand)
// ============================================

export const AuthModal = dynamic(
  () => import('@/components/pages/auth/AuthModal').then(mod => ({ default: mod.AuthModal })),
  {
    ssr: false,
  }
)

// ============================================
// NOTIFICATION COMPONENTS
// ============================================

export const NotificationBell = dynamic(
  () => import('@/components/NotificationBell').then(mod => ({ default: mod.NotificationBell })),
  {
    ssr: false,
  }
)

// ============================================
// HEAVY UI COMPONENTS
// ============================================

export const ExamplesShowcase = dynamic(
  () => import('@/components/pages/examples/ExamplesShowcase').then(mod => ({ default: mod.ExamplesShowcase })),
  {
    loading: () => <LoadingSpinner />,
  }
)

export const HistoryPage = dynamic(
  () => import('@/components/pages/history/HistoryPage').then(mod => ({ default: mod.HistoryPage })),
  {
    loading: () => <LoadingSpinner />,
  }
)

export const UserGalleryPage = dynamic(
  () => import('@/components/pages/gallery/UserGalleryPage').then(mod => ({ default: mod.UserGalleryPage })),
  {
    loading: () => <LoadingSpinner />,
  }
)

// ============================================
// CHART COMPONENTS (Heavy library)
// ============================================

export const AdminAnalyticsCharts = dynamic(
  () => import('@/components/pages/admin/AdminAnalyticsPage'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
)
