'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  read: boolean
  created_at: string
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications()
    }
  }, [isLoggedIn])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      if (data.success) {
        setNotifications(data.data.notifications || [])
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isLoggedIn) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 bg-gradient-to-br from-white/[0.12] to-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                        !notification.read ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{notification.title}</h4>
                          <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4 text-green-400" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
