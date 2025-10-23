import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: string;
  email?: string;
  name?: string;
  plan?: string;
  credits?: number;
  is_admin?: boolean;
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
          // Check if we have a stored token
          const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
          
          if (!token) {
            set({ loading: false, isLoggedIn: false, user: null, accessToken: null });
            return;
          }
          
          // If we have persisted user data, use it immediately while verifying in background
          const currentState = get();
          if (currentState.user && currentState.isLoggedIn) {
            // User data is already loaded from persistence, just verify token in background
            set({ loading: false });
            
            // Verify token in background and update if needed
            fetch('/api/auth/me', {
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(async (response) => {
              if (response.ok) {
                const data = await response.json();
                set({ user: { ...data.user, accessToken: token } });
              } else {
                // Token invalid, clear session
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('supabase_session');
                }
                set({ isLoggedIn: false, user: null, accessToken: null });
              }
            }).catch(() => {
              // Network error, keep cached state
            });
            return;
          }
          
          // No cached user data, verify token before proceeding
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ 
              user: { ...data.user, accessToken: token }, 
              isLoggedIn: true,
              accessToken: token,
              loading: false 
            });
          } else {
            // Token invalid, clear it
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('supabase_session');
            }
            set({ loading: false, isLoggedIn: false, user: null, accessToken: null });
          }
        } catch (error) {
          console.error('Initialize error:', error);
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