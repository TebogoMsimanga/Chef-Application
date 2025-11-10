import { create } from 'zustand';
import { getCurrentUser, signOut, getSupabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  about?: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  fetchAuthenticatedUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  fetchAuthenticatedUser: async () => {
    try {
      set({ isLoading: true });
      const user = await getCurrentUser();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
}));

// Listen to auth state changes - only on client side
if (typeof window !== 'undefined') {
  getSupabase().auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      useAuthStore.getState().fetchAuthenticatedUser();
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ user: null, isAuthenticated: false });
    }
  });
}

export default useAuthStore;