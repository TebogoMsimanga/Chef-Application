/**
 * Authentication Store
 * 
 * Manages user authentication state using Zustand and Supabase.
 * Handles:
 * - User session management
 * - Authentication state tracking
 * - Logout functionality
 * - Auth state change listeners
 * 
 * @module store/auth.store
 */

import { create } from 'zustand';
import * as Sentry from '@sentry/react-native';
import { getCurrentUser, signOut, getSupabase } from '@/lib/supabase';

/**
 * User interface matching Supabase profile structure
 */
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  about?: string;
  avatar?: string;
}

/**
 * Auth Store interface
 */
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  fetchAuthenticatedUser: () => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Authentication Store
 * 
 * Uses Zustand for state management with Supabase for authentication.
 * Automatically listens to auth state changes from Supabase.
 */
const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  /**
   * Set user and update authentication state
   * @param user - User object or null
   */
  setUser: (user) => {
    console.log('[AuthStore] Setting user:', user ? user.email : 'null');
    set({ user, isAuthenticated: !!user });
  },

  /**
   * Fetch the currently authenticated user from Supabase
   * Called on app initialization and after sign in
   */
  fetchAuthenticatedUser: async () => {
    try {
      console.log('[AuthStore] Fetching authenticated user...');
      set({ isLoading: true });
      
      const user = await getCurrentUser();
      
      if (user) {
        console.log('[AuthStore] User fetched successfully:', user.email);
        set({ user, isAuthenticated: true, isLoading: false });
        
        // Set user context in Sentry for error tracking
        Sentry.setUser({
          id: user.id,
          email: user.email,
          username: user.name,
        });
      } else {
        console.log('[AuthStore] No authenticated user found');
        set({ user: null, isAuthenticated: false, isLoading: false });
        Sentry.setUser(null);
      }
    } catch (error: any) {
      console.error('[AuthStore] Error fetching user:', error);
      
      // Log to Sentry with context
      Sentry.captureException(error, {
        tags: {
          component: 'AuthStore',
          action: 'fetchAuthenticatedUser',
        },
        extra: {
          errorMessage: error?.message,
          errorCode: error?.code,
        },
      });
      
      set({ user: null, isAuthenticated: false, isLoading: false });
      Sentry.setUser(null);
    }
  },

  /**
   * Logout the current user
   * Signs out from Supabase and clears all local state
   * Also clears cart and favorites stores
   */
  logout: async () => {
    try {
      console.log('[AuthStore] Logging out user...');
      
      // Clear cart store
      try {
        const { useCartStore } = await import('@/store/cart.store');
        useCartStore.getState().clearCart();
        console.log('[AuthStore] Cart cleared');
      } catch (error) {
        console.warn('[AuthStore] Error clearing cart:', error);
      }

      // Clear favorites store
      try {
        const { useFavoritesStore } = await import('@/store/favorite.store');
        useFavoritesStore.getState().clearFavorites();
        console.log('[AuthStore] Favorites cleared');
      } catch (error) {
        console.warn('[AuthStore] Error clearing favorites:', error);
      }
      
      // Sign out from Supabase
      await signOut();
      
      console.log('[AuthStore] User logged out successfully');
      
      // Clear user context in Sentry
      Sentry.setUser(null);
      
      // Clear local state
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      console.error('[AuthStore] Error signing out:', error);
      
      // Log to Sentry
      Sentry.captureException(error, {
        tags: {
          component: 'AuthStore',
          action: 'logout',
        },
        extra: {
          errorMessage: error?.message,
          errorCode: error?.code,
        },
      });
      
      // Still clear local state even if signOut fails
      set({ user: null, isAuthenticated: false, isLoading: false });
      Sentry.setUser(null);
      
      throw error;
    }
  },
}));

/**
 * Listen to Supabase auth state changes
 * Automatically updates store when user signs in or out
 * Only runs on client side (not during SSR)
 */
if (typeof window !== 'undefined') {
  try {
    console.log('[AuthStore] Setting up auth state change listener');
    
    // Use a small delay to ensure getSupabase is available
    setTimeout(() => {
      try {
        const supabase = getSupabase();
        if (supabase && supabase.auth) {
          supabase.auth.onAuthStateChange((event, session) => {
            console.log('[AuthStore] Auth state changed:', event, session?.user?.email || 'no session');
            
            if (event === 'SIGNED_IN' && session) {
              console.log('[AuthStore] User signed in, fetching user data...');
              useAuthStore.getState().fetchAuthenticatedUser();
            } else if (event === 'SIGNED_OUT') {
              console.log('[AuthStore] User signed out, clearing state...');
              useAuthStore.setState({ user: null, isAuthenticated: false });
              Sentry.setUser(null);
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('[AuthStore] Token refreshed');
              // Optionally refetch user data on token refresh
              useAuthStore.getState().fetchAuthenticatedUser();
            }
          });
        } else {
          console.warn('[AuthStore] Supabase client not available for auth listener');
        }
      } catch (error) {
        console.warn('[AuthStore] Error setting up auth listener:', error);
      }
    }, 100);
  } catch (error) {
    console.warn('[AuthStore] Error initializing auth listener:', error);
  }
}

export default useAuthStore;