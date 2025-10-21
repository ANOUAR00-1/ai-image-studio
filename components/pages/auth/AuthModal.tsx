'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Github,
  Chrome,
  Sparkles
} from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { staggerContainer, staggerItem } from "@/lib/animations"
import StarBorder from "@/components/ui/StarBorder"

export function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  
  const { login } = useAuthStore()
  const router = useRouter()

  const handleOtpVerify = async () => {
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, token: otpCode })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        toast.error(data.error || 'Invalid verification code')
        return
      }
      
      // Save token
      const token = data.accessToken || data.session?.access_token
      if (token) {
        localStorage.setItem('access_token', token)
        localStorage.setItem('supabase_session', JSON.stringify(data.session))
      }
      
      // Login user
      login({ ...data.user, accessToken: token })
      
      toast.success("Email verified! Welcome!")
      
      // Close modal and redirect
      onOpenChange(false)
      router.push("/dashboard")
      
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(data.message || "Code resent! Check your email.")
      } else {
        toast.error(data.error || "Failed to resend code")
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only last digit
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      toast.error("Please enter your email")
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })
      
      await response.json()
      
      toast.success("Password reset email sent! Check your inbox.", {
        duration: 6000,
      })
      
      // Clear form and switch back to login
      setFormData({ name: "", email: "", password: "" })
      setIsForgotPassword(false)
      
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Handle forgot password separately
    if (isForgotPassword) {
      return handleForgotPassword(e)
    }
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields")
      return
    }
    
    if (!isLogin && !formData.name) {
      toast.error("Please enter your name")
      return
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    
    setLoading(true)
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      
      console.log('🔐 Auth attempt:', { endpoint, email: formData.email })
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      console.log('📥 Auth response:', { 
        ok: response.ok, 
        status: response.status,
        hasSession: !!data.session,
        hasAccessToken: !!data.accessToken,
        data 
      })
      
      if (!response.ok) {
        console.error('❌ Auth failed:', data.error)
        toast.error(data.error || 'Authentication failed')
        return
      }
      
      // Check if email confirmation is required (OTP)
      if (data.requiresEmailConfirmation || (!data.session && !data.accessToken && !isLogin)) {
        console.log('⚠️ OTP verification required')
        toast.success("Verification code sent! Check your email and enter the 6-digit code.", {
          duration: 6000,
        })
        
        // Show OTP input instead of switching to login
        setShowOtpInput(true)
        setLoading(false)
        
        return
      }
      
      // Save session to localStorage
      if (data.session) {
        localStorage.setItem('supabase_session', JSON.stringify(data.session))
        console.log('✅ Session saved')
      }
      
      // Save access token
      const token = data.accessToken || data.session?.access_token
      console.log('🎫 Token to save:', token ? `${token.substring(0, 20)}...` : 'NULL')
      
      if (token) {
        localStorage.setItem('access_token', token)
        console.log('✅ Token saved to localStorage')
        console.log('🔍 Verify token in storage:', localStorage.getItem('access_token')?.substring(0, 20))
      } else {
        console.error('❌ No token received from API!')
        toast.error("Session not created. Please check your email or try logging in.")
        onOpenChange(false)
        return
      }
      
      // Login user
      login({ ...data.user, accessToken: token })
      console.log('✅ User logged in to store')
      
      // Show success
      if (isLogin) {
        toast.success("Welcome back!")
      } else {
        toast.success("Account created successfully!")
      }
      
      // Close modal and redirect
      onOpenChange(false)
      router.push("/dashboard")
      
      console.log('✅ Auth complete, redirecting to dashboard')
      
    } catch (error) {
      console.error('Auth error:', error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = (provider: string) => {
    toast.info(`${provider} authentication coming soon!`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#0f0520]/95 via-[#1a0b2e]/95 to-[#0a0a1f]/95 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-purple-500/20 transition-all duration-300 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4">
        <DialogHeader className="space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-2xl font-black text-white text-center">
            {isForgotPassword ? "Reset Password" : (isLogin ? "Welcome back" : "Join PixFusion AI")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-300 text-center">
            {isForgotPassword 
              ? "Enter your email to receive a password reset link"
              : (isLogin 
                ? "Sign in to your account to continue" 
                : "Get started with powerful AI tools")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          {!isLogin && !isForgotPassword && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-white text-sm font-semibold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name" 
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 h-10" 
                />
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white text-sm font-semibold">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email" 
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 h-10" 
                required
              />
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {showOtpInput ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-sm text-gray-300 mb-4">
                    Enter the 6-digit code sent to {formData.email}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex justify-center space-x-2"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {otp.map((digit, index) => (
                    <motion.div key={index} variants={staggerItem}>
                      <Input
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus()
                          }
                        }}
                        className="w-12 h-12 text-center text-2xl font-bold bg-white/5 border-white/20 text-white focus:border-purple-500/50 transition-all hover:border-purple-500/30"
                      />
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Didn&apos;t receive code? Resend
                  </button>
                </motion.div>
              </motion.div>
          ) : !isForgotPassword && (
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white text-sm font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password" 
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 h-10"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}
          </AnimatePresence>
          
          {isLogin && !isForgotPassword && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" 
                />
                <Label htmlFor="remember" className="text-xs text-gray-300 cursor-pointer">Remember me</Label>
              </div>
              <button 
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}
          
          <div className="mt-2">
            <StarBorder
              as="button"
              type={showOtpInput ? "button" : "submit"}
              onClick={showOtpInput ? handleOtpVerify : undefined}
              disabled={loading}
              color="#A855F7"
              speed="5s"
              className="w-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {showOtpInput ? "Verify Code" : (isForgotPassword ? "Send Reset Link" : (isLogin ? "Sign In" : "Create Account"))}
                </span>
              )}
            </StarBorder>
          </div>
          
          {!isForgotPassword && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-gradient-to-br from-[#0f0520]/95 via-[#1a0b2e]/95 to-[#0a0a1f]/95 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2.5">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => handleSocialAuth("GitHub")}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 h-9 text-sm"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialAuth("Google")}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 h-9 text-sm"
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </>
          )}
          
          <div className="text-center text-xs pt-1">
            {showOtpInput ? (
              <button 
                type="button"
                onClick={() => {
                  setShowOtpInput(false)
                  setOtp(['', '', '', '', '', ''])
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                ← Back to Sign Up
              </button>
            ) : isForgotPassword ? (
              <button 
                type="button"
                onClick={() => {
                  setIsForgotPassword(false)
                  setFormData({ name: "", email: "", password: "" })
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                ← Back to Login
              </button>
            ) : (
              <>
                <span className="text-gray-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
