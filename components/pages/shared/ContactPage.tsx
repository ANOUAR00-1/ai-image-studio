'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Mail,
  MessageSquare,
  MapPin,
  Send,
  Clock,
  Globe,
  Users,
  Headphones,
  Zap,
  CheckCircle
} from "lucide-react"
import StarBorder from "@/components/ui/StarBorder"

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      details: ['support@pixfusion.ai', '24/7 Response'],
      gradient: 'from-purple-500 to-pink-500',
      description: 'Get help from our expert team'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      details: ['Available 24/7', 'Instant Response'],
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Chat with our AI assistants'
    },
    {
      icon: Headphones,
      title: 'Phone Support',
      details: ['+1 (555) 123-PXFS', 'Business Hours'],
      gradient: 'from-green-500 to-emerald-500',
      description: 'Speak directly with our team'
    },
  ]

  const offices = [
    {
      city: 'San Francisco',
      country: 'USA',
      address: '123 AI Innovation Drive, Suite 200',
      timezone: 'PST (GMT-8)',
      hours: 'Mon-Fri 9AM-6PM'
    },
    {
      city: 'New York',
      country: 'USA',
      address: '456 Creative Street, Floor 15',
      timezone: 'EST (GMT-5)',
      hours: 'Mon-Fri 9AM-6PM'
    },
    {
      city: 'London',
      country: 'UK',
      address: '789 Innovation Lane, Building A',
      timezone: 'GMT (GMT+0)',
      hours: 'Mon-Fri 9AM-5PM'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0520] via-[#1a0f2e] to-[#0a0118]">
      {/* Header */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get in Touch
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              We&apos;re Here to
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                Help You Succeed
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-12">
              Have questions about our AI tools? Need help with your account? Our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Choose Your Preferred Way to Connect
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multiple channels to ensure you get the help you need, when you need it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {contactInfo.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {method.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {method.description}
                    </p>
                    <div className="space-y-2">
                      {method.details.map((detail, idx) => (
                        <p key={idx} className="text-purple-300 font-semibold">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-4">Send Us a Message</CardTitle>
                <p className="text-gray-300 text-lg">We typically respond within 24 hours</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {submitted && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-300 font-semibold">Message sent successfully!</p>
                      <p className="text-green-200 text-sm">We&apos;ll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Name</label>
                      <Input
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Subject</label>
                    <Input
                      type="text"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Message</label>
                    <Textarea
                      placeholder="Tell us more about your question or issue..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500/50"
                    />
                  </div>
                  <div className="text-center pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Our Global Offices
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Visit us in person or connect with our local teams around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {offices.map((office, index) => (
              <Card key={index} className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {office.city}
                      </h3>
                      <p className="text-gray-400 text-sm">{office.country}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 inline mr-2 text-purple-400" />
                      {office.address}
                    </p>
                    <p className="text-gray-300 text-sm">
                      <Clock className="w-4 h-4 inline mr-2 text-blue-400" />
                      {office.timezone}
                    </p>
                    <p className="text-gray-300 text-sm">
                      <Users className="w-4 h-4 inline mr-2 text-green-400" />
                      {office.hours}
                    </p>
                  </div>

                  <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-purple-600/30 border-2 border-purple-500/40 backdrop-blur-2xl shadow-2xl shadow-purple-500/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Check out our comprehensive FAQ section for instant answers to common questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#faq">
                  <StarBorder
                    as="button"
                    color="#a855f7"
                    speed="5s"
                    className="hover:scale-105 transition-transform"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Visit FAQ
                    </span>
                  </StarBorder>
                </Link>
                <Link href="/support">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40">
                    <Zap className="mr-2 w-4 h-4" />
                    Get Support
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
