"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Menu, 
  X, 
  Sparkles,
  User,
  LogIn,
  LogOut,
  Settings,
  LayoutDashboard,
  CreditCard
} from "lucide-react"
import { AuthModal } from "@/components/pages/auth/AuthModal"
import { useAuthStore } from "@/store/auth"
import { NotificationBell } from "@/components/NotificationBell"
import StarBorder from "@/components/ui/StarBorder"

interface NavigationProps {
  currentPage?: string;
}

export function Navigation({}: NavigationProps = {}) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isLoggedIn, logout, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Examples", href: "/examples" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0f0520]/95 via-[#1a0b2e]/95 to-[#0a0a1f]/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                PixFusion AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <NotificationBell />
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white/10"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden lg:inline">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-gradient-to-br from-[#0f0520]/95 via-[#1a0b2e]/95 to-[#0a0a1f]/95 backdrop-blur-2xl border border-white/20"
                  >
                    <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => router.push('/dashboard')}
                      className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/settings')}
                      className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/account')}
                      className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/pricing')}
                      className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => {
                        logout()
                        router.push('/')
                      }}
                      className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </>
              ) : (
                <>
                  <StarBorder
                    as="button"
                    onClick={() => setShowAuthModal(true)}
                    color="#6366F1"
                    speed="6s"
                    className="hover:scale-105 transition-transform"
                  >
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </span>
                  </StarBorder>
                  <StarBorder
                    as="button"
                    onClick={() => setShowAuthModal(true)}
                    color="#A855F7"
                    speed="5s"
                    className="hover:scale-105 transition-transform"
                  >
                    Get Started
                  </StarBorder>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant="ghost" 
                          className="w-full text-white hover:bg-white/10"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                          router.push('/')
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className="w-full text-white hover:bg-white/10"
                        onClick={() => {
                          setShowAuthModal(true)
                          setIsMenuOpen(false)
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                        onClick={() => {
                          setShowAuthModal(true)
                          setIsMenuOpen(false)
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </>
  )
}
