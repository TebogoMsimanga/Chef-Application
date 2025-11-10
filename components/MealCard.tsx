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

import React, { useState, useEffect, useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { images } from "@/constants";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { addFavorite, removeFavorite, getFavorites } from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";
import { useFavoritesStore } from "@/store/favorite.store";
import { useCartStore } from "@/store/cart.store";

interface MealCardProps {
  item: any;
  isFavorite?: boolean;
}

const MealCard = ({ item, isFavorite = false }: MealCardProps) => {
  const { user } = useAuthStore();
  const { addFavorite: addToStore, removeFavorite: removeFromStore } = useFavoritesStore();
  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const [favorite, setFavorite] = useState(isFavorite);

  // Get quantity of this item in cart (sum of all quantities for this item ID)
  const getItemQuantity = () => {
    return cartItems
      .filter((cartItem) => cartItem.id === item.id)
      .reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  const itemQuantity = getItemQuantity();

  // Subscribe to favorites store for real-time updates
  const isFavoriteInStore = useFavoritesStore((state) => state.isFavorite(item?.id || ""));

  // Sync local state with store
  useEffect(() => {
    setFavorite(isFavoriteInStore);
  }, [isFavoriteInStore]);

  // Check if item is favorite on mount and sync with store (only once per item)
  const hasCheckedFavorite = useRef<string | null>(null);
  useEffect(() => {
    // Only check if we haven't checked this specific item yet
    if (user?.id && item?.id && hasCheckedFavorite.current !== item.id) {
      hasCheckedFavorite.current = item.id;
      checkFavoriteStatus();
    }
  }, [user?.id, item?.id]);

  /**
   * Check if item is in user's favorites
   */
  const checkFavoriteStatus = async () => {
    try {
      if (!user?.id || !item?.id) return;

      // First check the store - if already checked, skip API call
      const storeIsFavorite = useFavoritesStore.getState().isFavorite(item.id);
      if (storeIsFavorite) {
        setFavorite(true);
        return;
      }

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
        // Update database first
        await removeFavorite(user.id, item.id);
        // Then update local store (this will trigger re-renders everywhere)
        removeFromStore(item.id);
        setFavorite(false);
        console.log("[MealCard] Favorite removed successfully");
      } else {
        console.log("[MealCard] Adding favorite...");
        // Update database first
        await addFavorite(user.id, item.id);
        // Then update local store (this will trigger re-renders everywhere)
        addToStore(item.id);
        setFavorite(true);
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

  /**
   * Handle add to cart
   * Adds item to cart without customizations
   */
  const handleAddToCart = () => {
    try {
      console.log("[MealCard] Adding item to cart:", item.id, item.name);
      
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image || images.placeholder,
        customizations: [],
      });

      console.log("[MealCard] Item added to cart successfully");
    } catch (error: any) {
      console.error("[MealCard] Error adding to cart:", error);
      Sentry.captureException(error, {
        tags: { component: "MealCard", action: "handleAddToCart" },
        extra: { itemId: item.id, itemName: item.name },
      });
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || images.placeholder }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={20}
            color={favorite ? "#EF4444" : "#fff"}
          />
        </TouchableOpacity>

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#FFA500" />
          <Text style={styles.ratingBadgeText}>
            {item.rating != null ? item.rating.toFixed(1) : "4.5"}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item?.name ? String(item.name) : "Unnamed Item"}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item?.description ? String(item.description) : "No description available"}
        </Text>
        
        {/* Nutrition Info */}
        {(item.calories != null || item.protein != null) && (
          <View style={styles.nutritionInfo}>
            {item.calories != null && (
              <View style={styles.nutritionItem}>
                <Ionicons name="flame-outline" size={12} color="#666" />
                <Text style={styles.nutritionText}>{item.calories} cal</Text>
              </View>
            )}
            {item.protein != null && (
              <View style={styles.nutritionItem}>
                <Ionicons name="barbell-outline" size={12} color="#666" />
                <Text style={styles.nutritionText}>{item.protein}g</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>R {item.price != null ? item.price.toFixed(2) : "0.00"}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            {itemQuantity > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemQuantity}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  ratingBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
    minHeight: 32,
  },
  nutritionInfo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  nutritionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nutritionText: {
    fontSize: 11,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: "Quicksand-Medium",
    color: "#999",
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  addButton: {
    backgroundColor: "#FE8C00",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FE8C00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cartBadgeText: {
    fontSize: 11,
    fontFamily: "Quicksand-Bold",
    color: "#fff",
  },
});

export default MealCard;