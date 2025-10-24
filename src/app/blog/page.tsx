"use client"

import { motion } from "framer-motion"
import { BlogPage } from "@/components/pages/shared/BlogPage"
import { Footer } from "@/components/pages/shared/Footer"

export default function Blog() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]"
    >
      <BlogPage />
      <Footer />
    </motion.div>
  )
}
