"use client"

import dynamic from 'next/dynamic'
import OptimizedPageWrapper from "@/components/OptimizedPageWrapper"
import LandingPage from "@/components/pages/home/LandingPage"

// Dynamic imports for below-the-fold content
// These components load after the initial page render, improving FCP and LCP
const FeatureShowcase = dynamic(() => import("@/components/pages/home/FeatureShowcase").then(mod => ({ default: mod.FeatureShowcase })), {
  loading: () => <div className="h-96 animate-pulse bg-white/5" />,
})

const Testimonials = dynamic(() => import("@/components/pages/home/Testimonials").then(mod => ({ default: mod.Testimonials })), {
  loading: () => <div className="h-96 animate-pulse bg-white/5" />,
})

const FAQ = dynamic(() => import("@/components/pages/shared/FAQ").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="h-96 animate-pulse bg-white/5" />,
  ssr: false, // Disable SSR to prevent hydration mismatch with Radix UI IDs
})

const Footer = dynamic(() => import("@/components/pages/shared/Footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-32 animate-pulse bg-white/5" />,
})

export default function Home() {
  return (
    <OptimizedPageWrapper className="min-h-screen">
      <main>
        <LandingPage />
        <FeatureShowcase />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </OptimizedPageWrapper>
  )
}