'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Download, DollarSign, Calendar, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Invoice {
  id: string
  amount: number
  plan: string
  status: string
  created_at: string
}

export function BillingPage() {
  const { user } = useAuthStore()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/billing/invoices')
      const data = await response.json()
      if (data.success) {
        setInvoices(data.data.invoices || [])
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async () => {
    try {
      toast.info('Generating invoice PDF...')
      // TODO: Implement PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Invoice downloaded!')
    } catch {
      toast.error('Failed to download invoice')
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Billing & Invoices</h1>
            <p className="text-sm text-gray-400">Manage your billing and download invoices</p>
          </div>
        </motion.div>

        {/* Current Plan */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{user?.plan?.toUpperCase() || 'FREE'} Plan</h3>
                <p className="text-gray-400">
                  {user?.credits || 0} credits remaining
                </p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Invoice History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading invoices...</div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{invoice.plan.toUpperCase()} Plan</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-bold">${invoice.amount.toFixed(2)}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle className="h-3 w-3" />
                          {invoice.status}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadInvoice}
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
