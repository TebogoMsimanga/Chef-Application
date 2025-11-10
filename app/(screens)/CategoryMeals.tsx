/**
 * Category Meals Screen
 * 
 * Displays all menu items for a specific category.
 * Fetches meals filtered by category ID from Supabase.
 * 
 * @component
 */

import CustomHeader from "@/components/CustomHeader";
import MealCard from "@/components/MealCard";
import useSupabase from "@/lib/useSupabase";
import {getMenu} from "@/lib/supabase";
import * as Sentry from "@sentry/react-native";
import {useLocalSearchParams} from "expo-router";
import React, {useEffect, useCallback} from "react";
import {FlatList, StyleSheet, Text, View, ActivityIndicator} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

export default function CategoryMeals() {
  const { category, categoryId } = useLocalSearchParams();

  console.log("[CategoryMeals] Screen rendered with params:", { category, categoryId });

  const {
    data: meals,
    loading,
    error,
    refetch,
  } = useSupabase({
    fn: getMenu,
    params: { category: (categoryId as string) || "", query: "", limit: 100 },
    showErrorAlert: false,
  });

  // Refetch when categoryId changes
  const handleRefetch = useCallback(() => {
    console.log("[CategoryMeals] Refetching meals for category:", categoryId);
    refetch({ category: (categoryId as string) || "", query: "", limit: 100 });
  }, [categoryId, refetch]);

  useEffect(() => {
    handleRefetch();
  }, [categoryId, handleRefetch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("[CategoryMeals] Error fetching meals:", error);
      Sentry.captureException(new Error(error), {
        tags: { component: "CategoryMeals", action: "fetchMeals" },
        extra: { category, categoryId },
      });
    }
  }, [error, category, categoryId]);

  // Log meals data for debugging
  useEffect(() => {
    if (meals) {
      console.log("[CategoryMeals] Meals loaded:", meals.length, "items");
    }
  }, [meals]);

  if (loading) {
    console.log("[CategoryMeals] Loading meals...");
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FE8C00" />
        <Text style={styles.loadingText}>Loading Meals...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar style="dark" />
      <CustomHeader title={category as string} />
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id || item.$id || `meal-${item.name}`}
        renderItem={({ item }) => <MealCard item={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meals found for this category.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16, // Add spacing between items
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});