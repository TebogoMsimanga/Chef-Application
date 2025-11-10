/**
 * Favorite Item Component
 * 
 * Displays a favorite menu item with:
 * - Item image, name, description, price
 * - Remove from favorites button
 * - Navigation to item details
 * 
 * @component
 */

import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { images } from "@/constants";
import { router } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { removeFavorite } from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";
import { useFavoritesStore } from "@/store/favorite.store";

interface FavoriteItemProps {
  item: any;
  onRemove?: () => void;
}

const FavoriteItem = ({ item, onRemove }: FavoriteItemProps) => {
  const { user } = useAuthStore();
  const { removeFavorite: removeFromStore } = useFavoritesStore();

  /**
   * Handle removing item from favorites
   * Removes from Supabase and updates local state
   */
  const handleRemove = async () => {
    try {
      if (!user?.id) {
        console.warn("[FavoriteItem] User not authenticated");
        return;
      }

      if (!item?.id) {
        console.error("[FavoriteItem] Item ID missing");
        return;
      }

      console.log("[FavoriteItem] Removing favorite:", item.id);

      await removeFavorite(user.id, item.id);
      
      // Update local store
      removeFromStore(item.id);
      
      console.log("[FavoriteItem] Favorite removed successfully");
      
      Alert.alert("Success", "Removed from favorites");
      
      // Call onRemove callback to refresh list
      if (onRemove) {
        onRemove();
      }
    } catch (error: any) {
      console.error("[FavoriteItem] Error removing favorite:", error);
      
      // Log to Sentry
      Sentry.captureException(error, {
        tags: { component: "FavoriteItem", action: "handleRemove" },
        extra: { itemId: item.id, userId: user?.id, errorMessage: error?.message },
      });

      Alert.alert("Error", error.message || "Failed to remove favorite. Please try again.");
    }
  };

  /**
   * Handle navigation to item details
   */
  const handlePress = () => {
    try {
      console.log("[FavoriteItem] Navigating to item details:", item.id);
      router.push(`/MenuItemDetail?id=${item.id}`);
    } catch (error: any) {
      console.error("[FavoriteItem] Error navigating:", error);
      Sentry.captureException(error, {
        tags: { component: "FavoriteItem", action: "handlePress" },
        extra: { itemId: item.id },
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
      >
        <Image
          source={{ uri: item.image || images.placeholder }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.price}>R {item.price?.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
        <Image
          source={images.trash}
          style={styles.removeIcon}
          tintColor="#EF4444"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
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
  },
  price: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  removeButton: {
    padding: 8,
  },
  removeIcon: {
    width: 24,
    height: 24,
  },
});

export default FavoriteItem;