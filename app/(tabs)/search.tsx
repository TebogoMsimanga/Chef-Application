/**
 * Search Screen
 *
 * Allows users to search and filter menu items by category and query.
 * Displays results in a grid layout with meal cards.
 *
 * @component
 */

import FavButton from "@/components/FavButton";
import FilterButton from "@/components/FilterButton";
import MealCard from "@/components/MealCard";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants";
import { getMenu, getCategories } from "@/lib/supabase";
import useSupabase from "@/lib/useSupabase";
import * as Sentry from "@sentry/react-native";
import { useLocalSearchParams, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  const [searchQuery, setSearchQuery] = useState<string>((query as string) || "");
  const [activeCategory, setActiveCategory] = useState<string>((category as string) || "");

  console.log("[Search] Screen rendered with params:", { category, query });

  const { data, refetch, loading, error } = useSupabase({
    fn: getMenu,
    params: {
      category: activeCategory || "",
      query: searchQuery || "",
      limit: 100,
    },
    skip: true,
    showErrorAlert: false,
  });

  // Fetch categories to get category name for display
  const { data: categories } = useSupabase({
    fn: getCategories,
    showErrorAlert: false,
  });

  // Get category name from ID
  const getCategoryName = (categoryId: string) => {
    if (!categoryId || categoryId === "all") return "All";
    const category = categories?.find((cat: any) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // Update state when URL params change
  useEffect(() => {
    const newQuery = (query as string) || "";
    const newCategory = (category as string) || "";
    
    if (newQuery !== searchQuery) {
      setSearchQuery(newQuery);
    }
    
    if (newCategory !== activeCategory) {
      setActiveCategory(newCategory);
    }
  }, [category, query]);

  // Refetch when search query or category changes
  useEffect(() => {
    console.log("[Search] Refetching with params:", { category: activeCategory, query: searchQuery });
    refetch({
      category: activeCategory || "",
      query: searchQuery || "",
      limit: 100,
    });
  }, [activeCategory, searchQuery, refetch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("[Search] Error fetching menu items:", error);
      Sentry.captureException(new Error(error), {
        tags: { component: "Search", action: "fetchMenu" },
        extra: { category, query },
      });
    }
  }, [error, category, query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;

          return (
            <View
              style={[
                styles.menuItem,
                { marginTop: !isFirstRightColItem ? 40 : 0 }, // mt-10 = 40px
              ]}
            >
              {/* Meal Cards*/}
              <MealCard item={item} />
            </View>
          );
        }}
        keyExtractor={(item) => item.id || item.$id || `item-${item.name}`}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Search</Text>
                <View style={styles.headerSubtitleRow}>
                  <Text style={styles.headerSubtitle}>
                    Find your favorite food
                  </Text>
                  <Image
                    source={images.arrowDown}
                    style={styles.arrowDownIcon}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View style={styles.headerButtons}>
                <FilterButton />
                <View style={styles.buttonSpacer} />
                <FavButton />
              </View>
            </View>

            <SearchBar />

            {/* Active Filters Display */}
            {(activeCategory || searchQuery) && (
              <View style={styles.activeFiltersContainer}>
                <Text style={styles.activeFiltersLabel}>Active Filters:</Text>
                <View style={styles.activeFiltersRow}>
                  {activeCategory && (
                    <TouchableOpacity
                      style={styles.activeFilterTag}
                      onPress={() => {
                        router.setParams({ category: undefined });
                        setActiveCategory("");
                      }}
                    >
                      <Ionicons name="close-circle" size={16} color="#FE8C00" />
                      <Text style={styles.activeFilterText}>
                        {getCategoryName(activeCategory)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {searchQuery && (
                    <TouchableOpacity
                      style={styles.activeFilterTag}
                      onPress={() => {
                        router.setParams({ query: undefined });
                        setSearchQuery("");
                      }}
                    >
                      <Ionicons name="close-circle" size={16} color="#FE8C00" />
                      <Text style={styles.activeFilterText}>
                        Search: {searchQuery}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Results Count */}
            {!loading && data && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsText}>
                  {data.length} {data.length === 1 ? "result" : "results"} found
                </Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyImageContainer}>
                <Ionicons name="search-outline" size={80} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>
                {searchQuery || activeCategory
                  ? "No results found"
                  : "Start searching"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || activeCategory
                  ? "Try adjusting your search or filter criteria"
                  : "Search for your favorite meals or use filters to browse"}
              </Text>
              {(searchQuery || activeCategory) && (
                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={() => {
                    router.setParams({ query: undefined, category: undefined });
                    setSearchQuery("");
                    setActiveCategory("");
                  }}
                >
                  <Ionicons name="refresh-outline" size={18} color="#FE8C00" />
                  <Text style={styles.clearAllButtonText}>Clear All Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        ListFooterComponent={() => loading && (
          <View style={styles.loadingFooter}>
            <ActivityIndicator size="large" color="#FE8C00" />
            <Text style={styles.loadingFooterText}>Loading results...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
export default Search;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
    height: "100%",
  },
  menuItem: {
    flex: 1,
    maxWidth: "48%",
  },
  columnWrapper: {
    gap: 28,
  },
  arrowDownIcon: {
    width: 12,
    height: 12,
    marginTop: 4,
  },
  contentContainer: {
    gap: 28,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  headerContainer: {
    marginVertical: 20,
    gap: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  headerLeft: {
    alignItems: "flex-start",
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonSpacer: {
    width: 8,
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: "Quicksand-Bold",
    textTransform: "uppercase",
    color: "#FE8C00",
  },
  headerSubtitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginTop: 2,
    justifyContent: "center",
    alignContent: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  activeFiltersContainer: {
    backgroundColor: "#FFF5E6",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FFE5CC",
  },
  activeFiltersLabel: {
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
    marginBottom: 8,
  },
  activeFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  activeFilterTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FE8C00",
  },
  activeFilterText: {
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
  },
  resultsContainer: {
    marginTop: 12,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyImageContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FE8C00",
    backgroundColor: "#fff",
  },
  clearAllButtonText: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
  },
  loadingFooter: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingFooterText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
});
