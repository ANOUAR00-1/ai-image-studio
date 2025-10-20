"use client"

import { motion } from "motion/react"
import LandingPage from "@/components/pages/home/LandingPage"
import { Footer } from "@/components/pages/shared/Footer"
import { FeatureShowcase } from "@/components/pages/home/FeatureShowcase"
import { Testimonials } from "@/components/pages/home/Testimonials"
import { FAQ } from "@/components/pages/shared/FAQ"

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <main>
        <LandingPage />
        <FeatureShowcase />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </motion.div>
  )
}