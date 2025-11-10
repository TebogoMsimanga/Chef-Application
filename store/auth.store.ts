import { getCurrentUser, account } from "@/lib/appwrite";
import { User } from "@/type";
import * as Sentry from "@sentry/react-native";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });

    try {
      const user = await getCurrentUser();

      if (user) {
        set({
          isAuthenticated: true,
          user: user as unknown as User,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error: any) {
      Sentry.captureEvent(error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await account.deleteSession("current");
      set({
        isAuthenticated: false,
        user: null,
      });
    } catch (error: any) {
      Sentry.captureEvent(error);
      throw new Error(error);
    }
  },
}));

export default useAuthStore;