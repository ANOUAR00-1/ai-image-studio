"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Sparkles, CreditCard, ImageIcon, ArrowRight, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function GettingStartedDocs() {
  const guides = [
    {
      title: "Quick Start Guide",
      description: "Get up and running in 5 minutes",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500",
      steps: [
        "Create your free account",
        "Verify your email address",
        "Receive 10 free credits",
        "Start creating amazing content"
      ]
    },
    {
      title: "Understanding Credits",
      description: "How our credit system works",
      icon: CreditCard,
      color: "from-purple-500 to-pink-500",
      steps: [
        "Each tool requires different credits",
        "Credits never expire",
        "Free tier: 10 credits/month",
        "Pro tier: 300 credits/month",
        "Enterprise: Custom credits"
      ]
    },
    {
      title: "First AI Generation",
      description: "Create your first AI image",
      icon: ImageIcon,
      color: "from-pink-500 to-rose-500",
      steps: [
        "Navigate to Image Tools",
        "Enter a descriptive prompt",
        "Select your preferred style",
        "Click Generate and wait 5-10 seconds",
        "Download your masterpiece"
      ]
    },
    {
      title: "Account Setup",
      description: "Configure your profile and preferences",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      steps: [
        "Update your profile information",
        "Set your notification preferences",
        "Configure API keys (optional)",
        "Set up billing information",
        "Customize your workspace"
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/documentation">
              <Button variant="ghost" className="mb-6 text-purple-300 hover:text-purple-200">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Documentation
              </Button>
            </Link>

            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Getting Started
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                PixFusion AI
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Everything you need to start creating stunning AI-generated content in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {guides.map((guide, index) => {
              const Icon = guide.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${guide.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {guide.title}
                      </h3>

                      <p className="text-gray-400 mb-6">{guide.description}</p>

                      <div className="space-y-3">
                        {guide.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-4 h-4 text-purple-400" />
                            </div>
                            <p className="text-gray-300 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Next Steps CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Create?</h2>
              <p className="text-gray-300 text-lg mb-8">
                Start generating amazing AI content with your free credits
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/image-tools">
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white border-0 shadow-lg shadow-pink-500/50">
                    Start Creating
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/documentation/image-tools">
                  <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    Explore Image Tools
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
