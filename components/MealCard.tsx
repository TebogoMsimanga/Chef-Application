/**
 * Meal Card Component
 * 
 * Displays a menu item card with:
 * - Item image
 * - Name, description, price, rating
 * - Favorite button
 * - Navigation to item details
 * 
 * @component
 */

import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { images } from "@/constants";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { addFavorite, removeFavorite, getFavorites } from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";
import useFavoritesStore from "@/store/favorite.store";

interface MealCardProps {
  item: any;
  isFavorite?: boolean;
}

const MealCard = ({ item, isFavorite = false }: MealCardProps) => {
  const { user } = useAuthStore();
  const { addFavorite: addToStore, removeFavorite: removeFromStore } = useFavoritesStore();
  const [favorite, setFavorite] = useState(isFavorite);

  // Check if item is favorite on mount
  useEffect(() => {
    if (user?.id && item?.id) {
      checkFavoriteStatus();
    }
  }, [user, item]);

  /**
   * Check if item is in user's favorites
   */
  const checkFavoriteStatus = async () => {
    try {
      if (!user?.id || !item?.id) return;

      console.log("[MealCard] Checking favorite status for item:", item.id);
      const favorites = await getFavorites(user.id);
      const isFav = favorites.some((fav: any) => fav.menu_item_id === item.id || fav.menu_item?.id === item.id);
      
      console.log("[MealCard] Favorite status:", isFav);
      setFavorite(isFav);
      
      // Update store
      if (isFav) {
        addToStore(item.id);
      } else {
        removeFromStore(item.id);
      }
    } catch (error: any) {
      console.error("[MealCard] Error checking favorite status:", error);
      // Don't show alert for check errors
    }
  };

  /**
   * Toggle favorite status
   * Adds or removes item from favorites in Supabase
   */
  const toggleFavorite = async () => {
    if (!user?.id) {
      console.warn("[MealCard] User not authenticated, cannot add favorite");
      Alert.alert("Error", "Please login to add favorites");
      return;
    }

    try {
      console.log("[MealCard] Toggling favorite for item:", item.id, "Current:", favorite);

      if (favorite) {
        console.log("[MealCard] Removing favorite...");
        await removeFavorite(user.id, item.id);
        setFavorite(false);
        removeFromStore(item.id);
        console.log("[MealCard] Favorite removed successfully");
      } else {
        console.log("[MealCard] Adding favorite...");
        await addFavorite(user.id, item.id);
        setFavorite(true);
        addToStore(item.id);
        console.log("[MealCard] Favorite added successfully");
      }
    } catch (error: any) {
      console.error("[MealCard] Error toggling favorite:", error);
      
      // Log to Sentry
      Sentry.captureException(error, {
        tags: { component: "MealCard", action: "toggleFavorite" },
        extra: { itemId: item.id, userId: user.id, errorMessage: error?.message },
      });

      Alert.alert("Error", error.message || "Failed to update favorite. Please try again.");
    }
  };

  /**
   * Handle navigation to item details
   */
  const handlePress = () => {
    try {
      console.log("[MealCard] Navigating to item details:", item.id);
      router.push(`/MenuItemDetail?id=${item.id}`);
    } catch (error: any) {
      console.error("[MealCard] Error navigating:", error);
      Sentry.captureException(error, {
        tags: { component: "MealCard", action: "handlePress" },
        extra: { itemId: item.id },
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
    >
      <Image
        source={{ uri: item.image || images.placeholder }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={toggleFavorite}
      >
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={24}
          color={favorite ? "#EF4444" : "#fff"}
        />
      </TouchableOpacity>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>R {item.price?.toFixed(2)}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFA500" />
            <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 6,
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    marginBottom: 8,
    height: 32,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
});

export default MealCard;