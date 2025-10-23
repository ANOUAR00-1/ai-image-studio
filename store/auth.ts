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
        // Don't store tokens - they're in httpOnly cookies now
        set({ 
          user: userData, 
          isLoggedIn: true, 
          accessToken: null // No longer storing tokens in state
        });
      },
      
      logout: async () => {
        try {
          // Call logout API (will clear httpOnly cookies)
          await fetch('/api/auth/logout', { 
            method: 'POST',
            credentials: 'include' // Important: include cookies
          });
          
          // Clear any legacy localStorage items
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('supabase_session');
          }
          
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
          // Clean up legacy localStorage tokens (security improvement)
          if (typeof window !== 'undefined') {
            const legacyKeys = ['access_token', 'supabase_session', 'sb-qwambovteljtmkruyvfd-auth-token'];
            legacyKeys.forEach(key => {
              if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
              }
            });
          }

          // If we have persisted user data, use it immediately while verifying in background
          const currentState = get();
          if (currentState.user && currentState.isLoggedIn) {
            // User data is already loaded from persistence, just verify in background
            set({ loading: false });
            
            // Verify session in background and update if needed
            fetch('/api/auth/me', {
              credentials: 'include' // Include httpOnly cookies
            }).then(async (response) => {
              if (response.ok) {
                const data = await response.json();
                set({ user: data.user });
              } else {
                // Session invalid, clear state
                set({ isLoggedIn: false, user: null, accessToken: null });
              }
            }).catch(() => {
              // Network error, keep cached state
            });
            return;
          }
          
          // No cached user data, verify session before proceeding
          const response = await fetch('/api/auth/me', {
            credentials: 'include' // Include httpOnly cookies
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ 
              user: data.user, 
              isLoggedIn: true,
              accessToken: null, // No longer storing tokens
              loading: false 
            });
          } else {
            // No valid session
            set({ loading: false, isLoggedIn: false, user: null, accessToken: null });
          }
        } catch (error) {
          console.error('Initialize error:', error);
          set({ loading: false, isLoggedIn: false, user: null, accessToken: null });
        }
      },
      
      refreshUser: async () => {
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include' // Include httpOnly cookies
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ user: data.user });
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
        // Don't persist accessToken - it's in httpOnly cookies now
      }),
    }
  )
);