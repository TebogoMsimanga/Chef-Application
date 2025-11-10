/**
 * Filter Screen
 * 
 * Allows users to filter menu items by category.
 * Displays all available categories with selection.
 * Applies filter and navigates back to search screen.
 * 
 * @component
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import CustomHeader from "@/components/CustomHeader";
import CustomButton from "@/components/CustomButton";
import { getCategories } from "@/lib/supabase";
import useSupabase from "@/lib/useSupabase";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/type";

export default function Filter() {
  const { category: currentCategory } = useLocalSearchParams<{
    category?: string;
  }>();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentCategory || "all"
  );

  console.log("[Filter] Screen rendered with current category:", currentCategory);

  const {
    data: categories,
    loading,
    error,
  } = useSupabase({
    fn: getCategories,
    showErrorAlert: false,
  });

  // Update selected category when currentCategory changes
  useEffect(() => {
    if (currentCategory) {
      setSelectedCategory(currentCategory);
    } else {
      setSelectedCategory("all");
    }
  }, [currentCategory]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("[Filter] Error fetching categories:", error);
      Sentry.captureException(new Error(error), {
        tags: { component: "Filter", action: "fetchCategories" },
      });
    }
  }, [error]);

  /**
   * Handle category selection
   */
  const handleCategorySelect = (categoryId: string) => {
    console.log("[Filter] Category selected:", categoryId);
    setSelectedCategory(categoryId);
  };

  /**
   * Handle apply filter
   * Navigates back to search screen with selected category
   */
  const handleApplyFilter = () => {
    try {
      console.log("[Filter] Applying filter with category:", selectedCategory);
      
      if (selectedCategory === "all") {
        router.setParams({ category: undefined });
      } else {
        router.setParams({ category: selectedCategory });
      }
      
      router.back();
    } catch (error: any) {
      console.error("[Filter] Error applying filter:", error);
      Sentry.captureException(error, {
        tags: { component: "Filter", action: "handleApplyFilter" },
        extra: { selectedCategory },
      });
    }
  };

  /**
   * Handle clear filter
   * Resets to "All" category
   */
  const handleClearFilter = () => {
    console.log("[Filter] Clearing filter");
    setSelectedCategory("all");
  };

  // Prepare filter data with "All" option
  const filterData: (Category | { id: string; name: string })[] = categories
    ? [{ id: "all", name: "All Categories" }, ...categories]
    : [{ id: "all", name: "All Categories" }];

  /**
   * Render category item
   */
  const renderCategory = ({ item }: { item: Category | { id: string; name: string } }) => {
    const isSelected = selectedCategory === item.id;
    const isAll = item.id === "all";

    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          isSelected && styles.categoryCardSelected,
        ]}
        onPress={() => handleCategorySelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryContent}>
          <View
            style={[
              styles.categoryIconContainer,
              isSelected && styles.categoryIconContainerSelected,
            ]}
          >
            <Ionicons
              name={isAll ? "grid-outline" : "restaurant-outline"}
              size={24}
              color={isSelected ? "#fff" : "#FE8C00"}
            />
          </View>
          <View style={styles.categoryInfo}>
            <Text
              style={[
                styles.categoryName,
                isSelected && styles.categoryNameSelected,
              ]}
            >
              {item.name}
            </Text>
            {!isAll && "description" in item && item.description && (
              <Text
                style={[
                  styles.categoryDescription,
                  isSelected && styles.categoryDescriptionSelected,
                ]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}
          </View>
          {isSelected && (
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <CustomHeader title="Filter by Category" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FE8C00" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <CustomHeader title="Filter by Category" />
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Select Category</Text>
          <Text style={styles.headerSubtitle}>
            Choose a category to filter menu items
          </Text>
        </View>

        <FlatList
          data={filterData}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No categories available</Text>
              <Text style={styles.emptySubtitle}>
                Categories will appear here once they are added
              </Text>
            </View>
          )}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearFilter}
            disabled={selectedCategory === "all"}
          >
            <Ionicons
              name="refresh-outline"
              size={20}
              color={selectedCategory === "all" ? "#999" : "#666"}
            />
            <Text
              style={[
                styles.clearButtonText,
                selectedCategory === "all" && styles.clearButtonTextDisabled,
              ]}
            >
              Clear
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="Apply Filter"
            onPress={handleApplyFilter}
            style={styles.applyButton}
            leftIcon={
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  listContent: {
    paddingBottom: 20,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryCardSelected: {
    backgroundColor: "#FE8C00",
    borderColor: "#FE8C00",
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  categoryNameSelected: {
    color: "#fff",
  },
  categoryDescription: {
    fontSize: 13,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    lineHeight: 18,
  },
  categoryDescriptionSelected: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#fff",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    gap: 8,
    minWidth: 100,
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
    color: "#666",
  },
  clearButtonTextDisabled: {
    color: "#999",
  },
  applyButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
  },
});

