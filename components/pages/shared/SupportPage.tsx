import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle, 
  BookOpen, 
  Users,
  Clock,
  Send
} from 'lucide-react'

export function SupportPage() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      action: 'Start Chat',
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24h',
      action: 'Send Email',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Talk to our experts directly',
      availability: 'Business hours only',
      action: 'Call Now',
      gradient: 'from-green-500 to-emerald-500'
    },
  ]

  const quickLinks = [
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Browse common questions and answers',
      link: '#help-center'
    },
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Detailed guides and tutorials',
      link: '#docs'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with other users',
      link: '#community'
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Support
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our dedicated support team is here to assist you 24/7
          </p>
        </motion.div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {option.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {option.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6">
                      <Clock className="w-4 h-4" />
                      {option.availability}
                    </div>
                    <Button className={`w-full bg-gradient-to-r ${option.gradient} hover:opacity-90 text-white`}>
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Name</label>
                  <Input 
                    placeholder="Your name" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Subject</label>
                <Input 
                  placeholder="How can we help?" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Message</label>
                <Textarea 
                  placeholder="Tell us more about your issue..." 
                  rows={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                Send Message <Send className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors border border-white/10">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">
                          {link.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

