"use client"

import dynamic from 'next/dynamic'
import OptimizedPageWrapper from "@/components/OptimizedPageWrapper"
import PricingPage from "@/components/pages/pricing/PricingPage"

// Dynamic import for Footer (below the fold)
const Footer = dynamic(() => import("@/components/pages/shared/Footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-32 animate-pulse bg-white/5" />,
})

export default function Pricing() {
  return (
    <OptimizedPageWrapper>
      <PricingPage />
      <Footer />
    </OptimizedPageWrapper>
  )
}
