"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Film, Zap, Wand2, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function VideoToolsDocs() {
  const tools = [
    {
      title: "Text-to-Video",
      description: "Generate videos from descriptions",
      icon: Video,
      color: "from-green-500 to-emerald-500",
      features: [
        "Create videos from text prompts",
        "Multiple duration options (3s, 5s, 10s)",
        "Choose video style and theme",
        "HD quality output",
        "Costs 5 credits per video"
      ],
      tips: [
        "Be specific about camera movements",
        "Describe the scene in detail",
        "Mention lighting and atmosphere",
        "Keep prompts under 200 words"
      ]
    },
    {
      title: "Video Editing",
      description: "Edit videos with AI assistance",
      icon: Film,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Automatic scene detection",
        "AI-powered trimming",
        "Add transitions and effects",
        "Background music integration",
        "Costs 3 credits per edit"
      ],
      tips: [
        "Upload videos under 2GB",
        "Supported formats: MP4, MOV, AVI",
        "Best results with HD footage",
        "Processing time: 1-3 minutes"
      ]
    },
    {
      title: "Video Enhancement",
      description: "Improve video quality",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      features: [
        "AI upscaling to 4K",
        "Stabilization and smoothing",
        "Color grading and correction",
        "Noise reduction",
        "Costs 4 credits per enhancement"
      ],
      tips: [
        "Works best on 720p+ source videos",
        "Reduces shake and blur",
        "Enhances low-light footage",
        "Output in multiple formats"
      ]
    },
    {
      title: "Animation Tools",
      description: "Create animations from images",
      icon: Wand2,
      color: "from-orange-500 to-red-500",
      features: [
        "Animate still images",
        "Create motion from photos",
        "Add parallax effects",
        "Multiple animation styles",
        "Costs 3 credits per animation"
      ],
      tips: [
        "Best with high-res images",
        "Choose animation style carefully",
        "Preview before final render",
        "Combine multiple animations"
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/documentation">
              <Button variant="ghost" className="mb-6 text-purple-300 hover:text-purple-200">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Documentation
              </Button>
            </Link>

            <Badge className="mb-6 bg-green-500/20 text-green-300 border border-green-500/30 px-4 py-2">
              <Video className="w-4 h-4 mr-2" />
              Video Tools
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Create Stunning
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                AI Videos
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Complete guide to video generation, editing, and enhancement
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
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
                  <Card className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-green-500/50 transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-gray-400 mb-6">{tool.description}</p>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-white font-semibold mb-3">Features:</h4>
                              <ul className="space-y-2">
                                {tool.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-start text-gray-300">
                                    <span className="text-green-400 mr-3 flex-shrink-0 mt-0.5">✓</span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-white font-semibold mb-3">Pro Tips:</h4>
                              <ul className="space-y-2">
                                {tool.tips.map((tip, idx) => (
                                  <li key={idx} className="flex items-start text-gray-300">
                                    <span className="text-blue-400 mr-3 flex-shrink-0 mt-0.5">💡</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
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
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Start Creating Videos</h2>
              <p className="text-gray-300 text-lg mb-8">
                Transform your ideas into professional videos with AI
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/video-tools">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg shadow-green-500/50">
                    Go to Video Tools
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/documentation/api">
                  <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    API Documentation
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
