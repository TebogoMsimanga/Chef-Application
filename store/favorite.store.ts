/**
 * Favorites Store
 * 
 * Manages favorites state using Zustand.
 * Currently used for local state management (badge count).
 * Actual favorites are stored in Supabase and managed through Supabase functions.
 * 
 * Note: This store is used for UI state (badge count).
 * For actual favorites CRUD operations, use Supabase functions directly.
 * 
 * @module store/favorite.store
 */

import {FavoritesStore} from "@/type";
import {create} from "zustand";
import * as Sentry from "@sentry/react-native";

/**
 * Favorites Store
 * 
 * Manages local favorites state for UI purposes.
 * Actual favorites are persisted in Supabase.
 */
export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  /**
   * Add favorite to local state
   * Note: This is for UI state only. Use Supabase addFavorite() for persistence.
   * 
   * @param {string} id - Menu item ID
   */
  addFavorite: (id) => {
    try {
      console.log("[FavoritesStore] Adding favorite to local state:", id);
      const current = get().favorites;
      if (!current.includes(id)) {
        set({ favorites: [...current, id] });
        console.log("[FavoritesStore] Favorite added. Total:", get().favorites.length);
      } else {
        console.log("[FavoritesStore] Favorite already exists:", id);
      }
    } catch (error: any) {
      console.error("[FavoritesStore] Error adding favorite:", error);
      Sentry.captureException(error, {
        tags: { component: "FavoritesStore", action: "addFavorite" },
        extra: { itemId: id },
      });
    }
  },

  /**
   * Remove favorite from local state
   * Note: This is for UI state only. Use Supabase removeFavorite() for persistence.
   * 
   * @param {string} id - Menu item ID
   */
  removeFavorite: (id) => {
    try {
      console.log("[FavoritesStore] Removing favorite from local state:", id);
      const newFavorites = get().favorites.filter((favId) => favId !== id);
      set({ favorites: newFavorites });
      console.log("[FavoritesStore] Favorite removed. Total:", newFavorites.length);
    } catch (error: any) {
      console.error("[FavoritesStore] Error removing favorite:", error);
      Sentry.captureException(error, {
        tags: { component: "FavoritesStore", action: "removeFavorite" },
        extra: { itemId: id },
      });
    }
  },

  /**
   * Toggle favorite in local state
   * Note: This is for UI state only. Use Supabase functions for persistence.
   * 
   * @param {string} id - Menu item ID
   */
  toggleFavorite: (id) => {
    try {
      console.log("[FavoritesStore] Toggling favorite:", id);
      const current = get().favorites;
      if (current.includes(id)) {
        get().removeFavorite(id);
      } else {
        get().addFavorite(id);
      }
    } catch (error: any) {
      console.error("[FavoritesStore] Error toggling favorite:", error);
      Sentry.captureException(error, {
        tags: { component: "FavoritesStore", action: "toggleFavorite" },
        extra: { itemId: id },
      });
    }
  },

  /**
   * Check if item is favorite in local state
   * 
   * @param {string} id - Menu item ID
   * @returns {boolean} True if item is in favorites
   */
  isFavorite: (id) => {
    const result = get().favorites.includes(id);
    console.log("[FavoritesStore] Checking favorite:", id, "Result:", result);
    return result;
  },

  /**
   * Clear all favorites from local state
   */
  clearFavorites: () => {
    try {
      console.log("[FavoritesStore] Clearing all favorites");
      set({ favorites: [] });
      console.log("[FavoritesStore] Favorites cleared");
    } catch (error: any) {
      console.error("[FavoritesStore] Error clearing favorites:", error);
      Sentry.captureException(error, {
        tags: { component: "FavoritesStore", action: "clearFavorites" },
      });
    }
  },

  /**
   * Get total number of favorites in local state
   * 
   * @returns {number} Total favorites count
   */
  getTotalFavorites: () => {
    const total = get().favorites.length;
    console.log("[FavoritesStore] Total favorites:", total);
    return total;
  },
}));