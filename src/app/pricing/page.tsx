"use client"

import { motion } from "motion/react"
import PricingPage from "@/components/pages/pricing/PricingPage"
import { Footer } from "@/components/pages/shared/Footer"

export default function Pricing() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PricingPage />
      <Footer />
    </motion.div>
  )
}
