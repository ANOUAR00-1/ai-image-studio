import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: string;
  email?: string;
  name?: string;
  plan?: string;
  credits?: number;
  accessToken?: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  accessToken: string | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  setUser: (userData: User) => void;
  initialize: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      loading: true,
      accessToken: null,
      
      login: (userData: User) => {
        const token = userData.accessToken || null;
        
        // Save to localStorage
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('access_token', token);
          console.log('✅ Token saved to localStorage on login');
        }
        
        set({ 
          user: userData, 
          isLoggedIn: true, 
          accessToken: token 
        });
      },
      
      logout: async () => {
        try {
          // Call logout API
          await fetch('/api/auth/logout', { method: 'POST' });
          
          // Clear localStorage
          localStorage.removeItem('access_token');
          localStorage.removeItem('supabase_session');
          
          // Clear state
          set({ user: null, isLoggedIn: false, accessToken: null });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      
      setUser: (userData: User) => {
        set({ user: { ...get().user, ...userData } });
      },
      
      initialize: async () => {
        try {
          console.log('🔄 Initializing auth...');
          
          // Check if we have a stored token
          const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
          
          console.log('🔍 Token found:', token ? `${token.substring(0, 20)}...` : 'NULL');
          
          if (!token) {
            console.log('❌ No token found, user not logged in');
            set({ loading: false, isLoggedIn: false, user: null, accessToken: null });
            return;
          }
          
          // Verify token and get user data
          console.log('🔐 Verifying token...');
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Token valid, user logged in:', data.user.email);
            set({ 
              user: { ...data.user, accessToken: token }, 
              isLoggedIn: true,
              accessToken: token,
              loading: false 
            });
          } else {
            console.log('❌ Token invalid, clearing session');
            // Token invalid, clear it
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('supabase_session');
            }
            set({ loading: false, isLoggedIn: false, user: null, accessToken: null });
          }
        } catch (error) {
          console.error('❌ Initialize error:', error);
          set({ loading: false, isLoggedIn: false, user: null, accessToken: null });
        }
      },
      
      refreshUser: async () => {
        try {
          const token = get().accessToken;
          
          if (!token) return;
          
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ user: { ...data.user, accessToken: token } });
          }
        } catch (error) {
          console.error('Refresh user error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        accessToken: state.accessToken
      }),
    }
  )
);