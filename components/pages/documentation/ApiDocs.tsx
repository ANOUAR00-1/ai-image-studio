"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Key, Zap, Webhook, Terminal, ArrowRight, Copy, Check } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

export function ApiDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(id)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  const endpoints = [
    {
      method: "POST",
      path: "/api/generate/image",
      description: "Generate image from text prompt",
      code: `curl -X POST https://api.pixfusion.ai/v1/generate/image \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A serene mountain landscape",
    "style": "realistic",
    "size": "1024x1024"
  }'`
    },
    {
      method: "POST",
      path: "/api/generate/video",
      description: "Generate video from text prompt",
      code: `curl -X POST https://api.pixfusion.ai/v1/generate/video \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Ocean waves at sunset",
    "duration": 5,
    "quality": "hd"
  }'`
    },
    {
      method: "POST",
      path: "/api/edit/remove-background",
      description: "Remove image background",
      code: `curl -X POST https://api.pixfusion.ai/v1/edit/remove-background \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@/path/to/image.jpg"`
    }
  ]

  const authSteps = [
    {
      title: "Get Your API Key",
      description: "Navigate to Settings → API Keys and generate a new key",
      icon: Key,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Authenticate Requests",
      description: "Include your API key in the Authorization header",
      icon: Code,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Handle Rate Limits",
      description: "Free: 100 req/day, Pro: 1000 req/day, Enterprise: Unlimited",
      icon: Zap,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Setup Webhooks",
      description: "Receive real-time notifications for async operations",
      icon: Webhook,
      color: "from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/documentation">
              <Button variant="ghost" className="mb-6 text-purple-300 hover:text-purple-200">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Documentation
              </Button>
            </Link>

            <Badge className="mb-6 bg-orange-500/20 text-orange-300 border border-orange-500/30 px-4 py-2">
              <Code className="w-4 h-4 mr-2" />
              API & Integration
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Developer
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
                API Reference
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Integrate PixFusion AI into your applications with our powerful REST API
            </p>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Authentication & Setup</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {authSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-orange-500/50 transition-all duration-500 h-full">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">API Endpoints</h2>
            
            <div className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-orange-500/50 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          {endpoint.method}
                        </Badge>
                        <code className="text-purple-300 font-mono">{endpoint.path}</code>
                      </div>
                      <p className="text-gray-400 mb-4">{endpoint.description}</p>
                      
                      <div className="relative">
                        <pre className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm">
                          <code className="text-gray-300 font-mono">{endpoint.code}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 bg-white/5 hover:bg-white/10"
                          onClick={() => copyToClipboard(endpoint.code, endpoint.path)}
                        >
                          {copiedEndpoint === endpoint.path ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SDK Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Terminal className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">Official SDKs</h2>
                <p className="text-gray-300 text-lg">
                  Use our SDKs for faster integration
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {["Python", "Node.js", "PHP"].map((sdk) => (
                  <div key={sdk} className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                    <p className="text-white font-semibold">{sdk}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link href="/settings">
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-lg shadow-orange-500/50">
                    Get Your API Key
                    <ArrowRight className="ml-2 w-4 h-4" />
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
