/**
 * Filter Screen
 * 
 * Allows users to filter menu items by category.
 * Displays categories and filtered results on the same screen.
 * Results update automatically when a category is selected.
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
import MealCard from "@/components/MealCard";
import { getCategories, getMenu } from "@/lib/supabase";
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

  // Fetch categories
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSupabase({
    fn: getCategories,
    showErrorAlert: false,
  });

  // Fetch menu items based on selected category
  const {
    data: menuItems,
    loading: menuLoading,
    error: menuError,
    refetch: refetchMenu,
  } = useSupabase({
    fn: getMenu,
    params: {
      category: selectedCategory === "all" ? "" : selectedCategory,
      query: "",
      limit: 100,
    },
    skip: true,
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

  // Refetch menu items when category changes
  useEffect(() => {
    console.log("[Filter] Refetching menu for category:", selectedCategory);
    refetchMenu({
      category: selectedCategory === "all" ? "" : selectedCategory,
      query: "",
      limit: 100,
    });
  }, [selectedCategory, refetchMenu]);

  // Handle errors
  useEffect(() => {
    if (categoriesError) {
      console.error("[Filter] Error fetching categories:", categoriesError);
      Sentry.captureException(new Error(categoriesError), {
        tags: { component: "Filter", action: "fetchCategories" },
      });
    }
    if (menuError) {
      console.error("[Filter] Error fetching menu items:", menuError);
      Sentry.captureException(new Error(menuError), {
        tags: { component: "Filter", action: "fetchMenu" },
        extra: { selectedCategory },
      });
    }
  }, [categoriesError, menuError, selectedCategory]);

  /**
   * Handle category selection
   */
  const handleCategorySelect = (categoryId: string) => {
    console.log("[Filter] Category selected:", categoryId);
    setSelectedCategory(categoryId);
  };

  /**
   * Handle apply filter to search screen
   * Navigates back to search screen with selected category
   */
  const handleApplyToSearch = () => {
    try {
      console.log("[Filter] Applying filter to search screen:", selectedCategory);
      
      if (selectedCategory === "all") {
        router.setParams({ category: undefined });
      } else {
        router.setParams({ category: selectedCategory });
      }
      
      router.back();
    } catch (error: any) {
      console.error("[Filter] Error applying filter:", error);
      Sentry.captureException(error, {
        tags: { component: "Filter", action: "handleApplyToSearch" },
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
    ? [{ id: "all", name: "All" }, ...categories]
    : [{ id: "all", name: "All" }];

  /**
   * Get category name from ID
   */
  const getCategoryName = (categoryId: string) => {
    if (!categoryId || categoryId === "all") return "All Categories";
    const category = categories?.find((cat: any) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  /**
   * Render category item (horizontal scroll)
   */
  const renderCategory = ({ item }: { item: Category | { id: string; name: string } }) => {
    const isSelected = selectedCategory === item.id;
    const isAll = item.id === "all";

    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isSelected && styles.categoryChipSelected,
        ]}
        onPress={() => handleCategorySelect(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isAll ? "grid-outline" : "restaurant-outline"}
          size={16}
          color={isSelected ? "#fff" : "#FE8C00"}
          style={styles.categoryIcon}
        />
        <Text
          style={[
            styles.categoryChipText,
            isSelected && styles.categoryChipTextSelected,
          ]}
        >
          {item.name}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  /**
   * Render menu item (grid layout)
   */
  const renderMenuItem = ({ item, index }: { item: any; index: number }) => {
    const isFirstRightColItem = index % 2 === 0;

    return (
      <View
        style={[
          styles.menuItem,
          { marginTop: !isFirstRightColItem ? 40 : 0 },
        ]}
      >
        <MealCard item={item} />
      </View>
    );
  };

  if (categoriesLoading) {
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
        {/* Category Selection Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryHeaderTitle}>Select Category</Text>
            {selectedCategory !== "all" && (
              <TouchableOpacity
                style={styles.clearChipButton}
                onPress={handleClearFilter}
              >
                <Ionicons name="close-circle" size={16} color="#FE8C00" />
                <Text style={styles.clearChipText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <FlatList
            data={filterData}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContent}
          />
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <View style={styles.resultsHeaderLeft}>
              <Ionicons name="restaurant-outline" size={20} color="#FE8C00" />
              <Text style={styles.resultsHeaderTitle}>
                {getCategoryName(selectedCategory)}
              </Text>
            </View>
            {!menuLoading && menuItems && (
              <Text style={styles.resultsCount}>
                {menuItems.length} {menuItems.length === 1 ? "item" : "items"}
              </Text>
            )}
          </View>

          {menuLoading ? (
            <View style={styles.menuLoadingContainer}>
              <ActivityIndicator size="large" color="#FE8C00" />
              <Text style={styles.menuLoadingText}>Loading menu items...</Text>
            </View>
          ) : (
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id || item.$id || `item-${item.name}`}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.menuListContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Ionicons name="restaurant-outline" size={80} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>No items found</Text>
                  <Text style={styles.emptySubtitle}>
                    {selectedCategory === "all"
                      ? "Select a category to view items"
                      : `No items available in ${getCategoryName(selectedCategory)}`}
                  </Text>
                </View>
              )}
            />
          )}
        </View>

        {/* Apply to Search Button */}
        {selectedCategory !== "all" && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyToSearchButton}
              onPress={handleApplyToSearch}
            >
              <Ionicons name="arrow-back-outline" size={20} color="#fff" />
              <Text style={styles.applyToSearchText}>Apply to Search</Text>
            </TouchableOpacity>
          </View>
        )}
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
  categorySection: {
    marginTop: 20,
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryHeaderTitle: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  clearChipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFF5E6",
    borderWidth: 1,
    borderColor: "#FE8C00",
  },
  clearChipText: {
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
  },
  categoryListContent: {
    gap: 12,
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipSelected: {
    backgroundColor: "#FE8C00",
    borderColor: "#FE8C00",
  },
  categoryIcon: {
    marginRight: 0,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  categoryChipTextSelected: {
    color: "#fff",
  },
  checkIcon: {
    marginLeft: 4,
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#F0F0F0",
  },
  resultsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resultsHeaderTitle: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  menuLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  menuLoadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  menuListContent: {
    gap: 28,
    paddingBottom: 100,
  },
  menuItem: {
    flex: 1,
    maxWidth: "48%",
  },
  columnWrapper: {
    gap: 28,
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
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  applyToSearchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FE8C00",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#FE8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  applyToSearchText: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#fff",
  },
});
