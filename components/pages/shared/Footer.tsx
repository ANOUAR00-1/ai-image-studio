import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Twitter, 
  Github, 
  Linkedin, 
  Instagram,
  Sparkles
} from "lucide-react"

export function Footer() {
  const navigation = {
    product: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Image Tools", href: "/image-tools" },
      { name: "Examples", href: "/examples" },
    ],
    resources: [
      { name: "Documentation", href: "/documentation" },
      { name: "Blog", href: "/blog" },
      { name: "Support", href: "/support" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ]
  }

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white">PixFusion AI</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transform your ideas into stunning visuals with cutting-edge AI technology.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
            <p className="text-gray-400 mb-6">Get the latest updates and AI tips delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50"
              />
              <button
                className="bg-gradient-to-br from-[#0f0520] via-[#1a0f2e] to-[#0a0118] backdrop-blur-xl border-2 border-purple-500/50 text-white hover:border-purple-400 transition-all duration-300 px-8 py-3 rounded-full hover:scale-105 cursor-pointer whitespace-nowrap font-semibold"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} PixFusion AI. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Made with ❤️ for creators worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
