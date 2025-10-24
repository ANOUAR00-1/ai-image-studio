"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon, Wand2, Sparkles, Palette, Grid3x3, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function ImageToolsDocs() {
  const tools = [
    {
      title: "Text-to-Image Generation",
      description: "Create images from text prompts",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      features: [
        "Write detailed prompts for best results",
        "Choose from multiple AI models",
        "Adjust image dimensions and aspect ratios",
        "Generate up to 4 variations at once",
        "Costs 1 credit per image"
      ],
      example: "A serene mountain landscape at sunset with vibrant purple skies"
    },
    {
      title: "Background Removal",
      description: "Remove backgrounds automatically",
      icon: Wand2,
      color: "from-blue-500 to-cyan-500",
      features: [
        "AI-powered edge detection",
        "Transparent PNG export",
        "Batch processing support",
        "Perfect for product photos",
        "Costs 0.5 credits per image"
      ],
      example: "Upload product photo → Get clean cutout with transparent background"
    },
    {
      title: "Image Enhancement",
      description: "Upscale and enhance images",
      icon: ImageIcon,
      color: "from-green-500 to-emerald-500",
      features: [
        "AI upscaling up to 4x resolution",
        "Noise reduction and sharpening",
        "Color correction and enhancement",
        "Preserve fine details",
        "Costs 2 credits per upscale"
      ],
      example: "Transform low-res images into HD quality"
    },
    {
      title: "Style Transfer",
      description: "Apply artistic styles to images",
      icon: Palette,
      color: "from-orange-500 to-red-500",
      features: [
        "Apply famous art styles",
        "Custom style intensity",
        "Maintain original composition",
        "100+ preset styles available",
        "Costs 1.5 credits per transfer"
      ],
      example: "Make your photo look like Van Gogh's Starry Night"
    },
    {
      title: "Batch Processing",
      description: "Process multiple images simultaneously",
      icon: Grid3x3,
      color: "from-pink-500 to-rose-500",
      features: [
        "Process up to 50 images at once",
        "Apply same settings to all",
        "Bulk download as ZIP",
        "Save time on repetitive tasks",
        "Credit cost varies by operation"
      ],
      example: "Remove backgrounds from 30 product photos in one go"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/documentation">
              <Button variant="ghost" className="mb-6 text-purple-300 hover:text-purple-200">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Documentation
              </Button>
            </Link>

            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2">
              <ImageIcon className="w-4 h-4 mr-2" />
              Image Tools
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Master
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                AI Image Tools
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Comprehensive guide to all our image generation and editing tools
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-8 max-w-5xl mx-auto">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-gray-400 mb-6">{tool.description}</p>

                          <div className="mb-6">
                            <h4 className="text-white font-semibold mb-3">Features:</h4>
                            <ul className="space-y-2">
                              {tool.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start text-gray-300">
                                  <span className="text-purple-400 mr-3 flex-shrink-0 mt-0.5">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                            <p className="text-sm text-purple-300 font-semibold mb-1">Example Use Case:</p>
                            <p className="text-gray-300 italic">{tool.example}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Images?</h2>
              <p className="text-gray-300 text-lg mb-8">
                Try our AI-powered image tools now
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/image-tools">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/50">
                    Go to Image Tools
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/documentation/video-tools">
                  <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    Explore Video Tools
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
