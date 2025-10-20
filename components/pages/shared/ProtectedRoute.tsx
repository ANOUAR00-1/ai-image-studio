"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Sparkles } from "lucide-react"
import { AuthModal } from "@/components/pages/auth/AuthModal"
import { useState } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  feature?: string
}

export function ProtectedRoute({ children, feature = "this feature" }: ProtectedRouteProps) {
  const { isLoggedIn, loading, initialize } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <Card className="max-w-2xl w-full bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-black text-white mb-4">
                Sign In Required
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Please sign in to access {feature} and start creating amazing content with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/50 text-lg h-14"
                onClick={() => setShowAuthModal(true)}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Sign In / Sign Up
              </Button>
              
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-white font-bold mb-4 text-center">What you&apos;ll get:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3">✓</span>
                    <span>10 free credits to try all AI tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3">✓</span>
                    <span>Access to text-to-image generation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3">✓</span>
                    <span>Background removal & image enhancement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3">✓</span>
                    <span>Video generation and editing tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3">✓</span>
                    <span>HD exports and commercial usage rights</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </>
    )
  }

  return <>{children}</>
}
