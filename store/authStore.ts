import { create } from "zustand";
import { findUser, UserRole } from "../utils/virtualUsers";

interface AuthState {
  user: {
    username: string;
    email: string;
    role: UserRole;
  } | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: (username: string, password: string) => {
    const user = findUser(username, password);
    if (user) {
      set({
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  isAdmin: () => {
    return get().user?.role === "admin";
  },
}));
