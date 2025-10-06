import { create } from "zustand";
import { Meal, meals } from "../utils/data";
import { User, addUser as virtualAddUser } from "../utils/virtualUsers";

interface AdminStore {
  // Menu management
  menu: Meal[];
  addMenuItem: (meal: Meal) => void;
  editMenuItem: (mealId: string, updatedMeal: Meal) => void;
  deleteMenuItem: (mealId: string) => void;

  // User management
  users: User[];
  addUser: (user: User) => boolean;
  updateUser: (username: string, updates: Partial<User>) => boolean;
  deleteUser: (username: string) => boolean;

  // Analytics
  analytics: {
    totalOrders: number;
    totalRevenue: number;
    popularItems: { mealId: string; count: number }[];
  };
}

export const useAdminStore = create<AdminStore>(
  (
    set: (fn: (state: AdminStore) => Partial<AdminStore>) => void,
    get: () => AdminStore
  ) => ({
    // Menu management
    menu: meals, // Initialize with default meals
    addMenuItem: (meal: Meal) => {
      set((state: AdminStore) => ({
        menu: [...state.menu, meal],
      }));
    },
    editMenuItem: (mealId: string, updatedMeal: Meal) => {
      set((state: AdminStore) => ({
        menu: state.menu.map((meal: Meal) =>
          meal.id === mealId ? { ...meal, ...updatedMeal } : meal
        ),
      }));
    },
    deleteMenuItem: (mealId: string) => {
      set((state: AdminStore) => ({
        menu: state.menu.filter((meal: Meal) => meal.id !== mealId),
      }));
    },

    // User management
    users: [
      {
        username: "Christoffel",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      },
      {
        username: "user",
        email: "user@example.com",
        password: "user1234",
        role: "user",
      },
    ],
    addUser: (user: User) => {
      const success = virtualAddUser(user);
      if (success) {
        set((state) => ({
          users: [...state.users, user],
        }));
      }
      return success;
    },
    updateUser: (username: string, updates: Partial<User>) => {
      let success = false;
      set((state: AdminStore) => {
        const userIndex = state.users.findIndex(
          (u: User) => u.username === username
        );
        if (userIndex !== -1) {
          const updatedUsers = [...state.users];
          updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updates };
          success = true;
          return { users: updatedUsers };
        }
        return state;
      });
      return success;
    },
    deleteUser: (username: string) => {
      let success = false;
      set((state: AdminStore) => {
        const userIndex = state.users.findIndex(
          (u: User) => u.username === username
        );
        if (userIndex !== -1) {
          const updatedUsers = state.users.filter(
            (u: User) => u.username !== username
          );
          success = true;
          return { users: updatedUsers };
        }
        return state;
      });
      return success;
    },

    // Analytics
    analytics: {
      totalOrders: 0,
      totalRevenue: 0,
      popularItems: [],
    },
  })
);
