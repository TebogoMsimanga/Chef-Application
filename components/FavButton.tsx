/**
 * Favorite Button Component
 * 
 * Displays a button with favorite icon and badge count.
 * Navigates to favorites screen when pressed.
 * 
 * @component
 */

import React, { useEffect, useState } from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import * as Sentry from "@sentry/react-native";
import {useFavoritesStore} from "@/store/favorite.store";
import {getFavorites} from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";
import {Ionicons} from "@expo/vector-icons";

const FavButton = () => {
  const { user } = useAuthStore();
  // Subscribe to favorites store for real-time updates
  const totalFavorites = useFavoritesStore((state) => state.getTotalFavorites());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from database on mount and sync with store
  useEffect(() => {
    if (user?.id && !isInitialized) {
      loadAndSyncFavorites();
    } else if (!user?.id) {
      // Clear favorites when user logs out
      useFavoritesStore.getState().clearFavorites();
      setIsInitialized(false);
    }
  }, [user, isInitialized]);

  /**
   * Load favorites from Supabase and sync with store
   */
  const loadAndSyncFavorites = async () => {
    try {
      if (!user?.id) return;

      console.log("[FavButton] Loading and syncing favorites for user:", user.id);
      const favorites = await getFavorites(user.id);
      
      // Extract menu item IDs from favorites
      const favoriteIds = favorites.map((fav: any) => 
        fav.menu_item_id || fav.menu_item?.id || fav.id
      ).filter((id: string) => id);
      
      console.log("[FavButton] Favorites loaded:", favoriteIds.length);
      
      // Initialize store with database favorites
      useFavoritesStore.getState().initializeFavorites(favoriteIds);
      setIsInitialized(true);
    } catch (error: any) {
      console.error("[FavButton] Error loading favorites:", error);
      Sentry.captureException(error, {
        tags: { component: "FavButton", action: "loadAndSyncFavorites" },
        extra: { userId: user?.id, errorMessage: error?.message },
      });
    }
  };

  /**
   * Handle navigation to favorites screen
   */
  const handlePress = () => {
    try {
      console.log("[FavButton] Navigating to favorites screen");
      router.push("/favorite");
    } catch (error: any) {
      console.error("[FavButton] Error navigating:", error);
      Sentry.captureException(error, {
        tags: { component: "FavButton", action: "handlePress" },
      });
    }
  };

  return (
    <TouchableOpacity style={styles.cartButton} onPress={handlePress}>  
      <Ionicons 
          name={"heart"} 
          size={24} 
          color={"#fff"} 
        /> 

      {totalFavorites > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalFavorites}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FavButton;

const styles = StyleSheet.create({
  cartButton: {
    position: "relative",
    backgroundColor: "#FE8C00",
    padding: 10,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, 
  },
  icon: {
    width: 20,  
    height: 20, 
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12, 
    fontFamily: "Quicksand-Bold",
    color: "#FFFFFF", 
  },
});