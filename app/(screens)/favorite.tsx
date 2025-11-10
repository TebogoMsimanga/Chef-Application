/**
 * Favorites Screen
 * 
 * Displays user's favorite menu items.
 * Fetches favorites from Supabase and allows removal.
 * 
 * @component
 */

import { FlatList, Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";
import CustomHeader from "@/components/CustomHeader";
import { StatusBar } from "expo-status-bar";
import { images } from "@/constants";
import FavoriteItem from "@/components/FavoriteItem";
import { getFavorites } from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";

export default function Favorite() {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("[Favorites] Screen rendered");

  /**
   * Load user's favorites from Supabase
   */
  const loadFavorites = useCallback(async () => {
    if (!user?.id) {
      console.log("[Favorites] No user ID, skipping load");
      setLoading(false);
      return;
    }
    
    try {
      console.log("[Favorites] Loading favorites for user:", user.id);
      setLoading(true);
      
      const data = await getFavorites(user.id);
      
      console.log("[Favorites] Favorites loaded:", data?.length || 0, "items");
      setFavorites(data || []);
    } catch (error: any) {
      console.error("[Favorites] Error loading favorites:", error);
      
      // Log to Sentry
      Sentry.captureException(error, {
        tags: { component: "Favorites", action: "loadFavorites" },
        extra: { userId: user.id, errorMessage: error?.message },
      });
      
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  /**
   * Handle favorite removal
   * Reloads favorites after removal
   */
  const handleRemove = useCallback(() => {
    console.log("[Favorites] Favorite removed, reloading...");
    loadFavorites();
  }, [loadFavorites]);

  // Show loading state
  if (loading) {
    console.log("[Favorites] Loading favorites...");
    return (
      <SafeAreaView style={{ backgroundColor: "#fff", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FE8C00" />
        <Text style={{ marginTop: 10, fontFamily: "Quicksand-Medium" }}>Loading favorites...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
      <StatusBar style="dark" />
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <FavoriteItem item={item.menu_item} onRemove={handleRemove} />
        )}
        keyExtractor={(item) => item.id || `favorite-${item.menu_item?.id}`}
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        ListHeaderComponent={() => <CustomHeader title="Your Favorites" />}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={images.fav}
              resizeMode="contain"
              style={{
                marginTop: 60,
                marginBottom: 20,
                width: 400,
                height: 400,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: "Quicksand-Bold",
                color: "#1A1A1A",
              }}
            >
              No favorites yet
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                marginTop: 10,
                fontWeight: "bold",
                fontFamily: "Quicksand-Bold",
                color: "#b4ababff",
              }}
            >
              Add items to your favorites
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
