import {FavoritesStore} from "@/type";
import {create} from "zustand";


export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  addFavorite: (id) => {
    const current = get().favorites;
    if (!current.includes(id)) {
      set({ favorites: [...current, id] });
    }
  },

  removeFavorite: (id) => {
    set({ favorites: get().favorites.filter((favId) => favId !== id) });
  },

  toggleFavorite: (id) => {
    const current = get().favorites;
    if (current.includes(id)) {
      get().removeFavorite(id);
    } else {
      get().addFavorite(id);
    }
  },

  isFavorite: (id) => get().favorites.includes(id),

  clearFavorites: () => set({ favorites: [] }),

  getTotalFavorites: () => get().favorites.length,
}));