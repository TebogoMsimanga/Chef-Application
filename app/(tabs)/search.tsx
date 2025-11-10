/**
 * Search Screen
 *
 * Enhanced search screen with:
 * - Real-time search functionality
 * - Category filtering
 * - Quick filter chips
 * - Search suggestions
 * - Sort options
 * - Pull to refresh
 * - Better empty states
 * - Visual feedback
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
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type SortOption = "name" | "price_low" | "price_high" | "rating";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  const [searchQuery, setSearchQuery] = useState<string>((query as string) || "");
  const [activeCategory, setActiveCategory] = useState<string>((category as string) || "");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [refreshing, setRefreshing] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

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

  // Animate header on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Get category name from ID
  const getCategoryName = (categoryId: string) => {
    if (!categoryId || categoryId === "all") return "All";
    const category = categories?.find((cat: any) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // Track previous values to prevent unnecessary refetches
  const prevCategoryRef = useRef<string>("");
  const prevQueryRef = useRef<string>("");

  // Update state when URL params change (only if different)
  useEffect(() => {
    const newQuery = (query as string) || "";
    const newCategory = (category as string) || "";

    if (newQuery !== searchQuery) {
      setSearchQuery(newQuery);
    }

    if (newCategory !== activeCategory) {
      setActiveCategory(newCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query]);

  // Refetch when search query or category changes (only if actually changed)
  useEffect(() => {
    const categoryChanged = activeCategory !== prevCategoryRef.current;
    const queryChanged = searchQuery !== prevQueryRef.current;

    if (categoryChanged || queryChanged) {
      console.log("[Search] Refetching with params:", { category: activeCategory, query: searchQuery });
      
      // Update refs
      prevCategoryRef.current = activeCategory;
      prevQueryRef.current = searchQuery;

      // Refetch with new params
      refetch({
        category: activeCategory || "",
        query: searchQuery || "",
        limit: 100,
      }).catch((error) => {
        console.error("[Search] Error refetching:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery]);

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

  /**
   * Handle pull to refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch({
        category: activeCategory || "",
        query: searchQuery || "",
        limit: 100,
      });
    } catch (error) {
      console.error("[Search] Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  }, [activeCategory, searchQuery, refetch]);

  /**
   * Sort menu items
   */
  const sortedData = React.useMemo(() => {
    if (!data) return [];

    const sorted = [...data];

    switch (sortOption) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "price_low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price_high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  }, [data, sortOption]);

  /**
   * Handle quick category filter
   */
  const handleQuickFilter = (categoryId: string) => {
    if (categoryId === "all") {
      router.setParams({ category: undefined });
      setActiveCategory("");
    } else {
      router.setParams({ category: categoryId });
      setActiveCategory(categoryId);
    }
  };

  /**
   * Clear all filters
   */
  const handleClearAll = () => {
    router.setParams({ query: undefined, category: undefined });
    setSearchQuery("");
    setActiveCategory("");
    setSortOption("name");
  };

  /**
   * Render quick filter chips
   */
  const renderQuickFilters = () => {
    if (!categories || categories.length === 0) return null;

    const quickCategories = [{ id: "all", name: "All" }, ...categories.slice(0, 5)];

    return (
      <View style={styles.quickFiltersContainer}>
        <Text style={styles.quickFiltersLabel}>Quick Filters:</Text>
        <FlatList
          data={quickCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersList}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.id || (!activeCategory && item.id === "all");
            return (
              <TouchableOpacity
                style={[styles.quickFilterChip, isActive && styles.quickFilterChipActive]}
                onPress={() => handleQuickFilter(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.id === "all" ? "grid-outline" : "restaurant-outline"}
                  size={14}
                  color={isActive ? "#fff" : "#FE8C00"}
                />
                <Text
                  style={[styles.quickFilterText, isActive && styles.quickFilterTextActive]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  /**
   * Render sort options
   */
  const renderSortOptions = () => {
    const sortOptions: { value: SortOption; label: string; icon: string }[] = [
      { value: "name", label: "Name", icon: "text-outline" },
      { value: "price_low", label: "Price: Low to High", icon: "arrow-up-outline" },
      { value: "price_high", label: "Price: High to Low", icon: "arrow-down-outline" },
      { value: "rating", label: "Rating", icon: "star-outline" },
    ];

    return (
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-vertical-outline" size={18} color="#FE8C00" />
          <Text style={styles.sortButtonText}>
            Sort: {sortOptions.find((opt) => opt.value === sortOption)?.label || "Name"}
          </Text>
          <Ionicons
            name={showSortOptions ? "chevron-up" : "chevron-down"}
            size={18}
            color="#666"
          />
        </TouchableOpacity>

        {showSortOptions && (
          <View style={styles.sortOptionsList}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortOptionItem,
                  sortOption === option.value && styles.sortOptionItemActive,
                ]}
                onPress={() => {
                  setSortOption(option.value);
                  setShowSortOptions(false);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon as any}
                  size={16}
                  color={sortOption === option.value ? "#FE8C00" : "#666"}
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    sortOption === option.value && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {sortOption === option.value && (
                  <Ionicons name="checkmark" size={16} color="#FE8C00" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <FlatList
          data={sortedData}
          renderItem={({ item, index }) => {
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
          }}
          keyExtractor={(item) => item.id || item.$id || `item-${item.name}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FE8C00"]}
              tintColor="#FE8C00"
            />
          }
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              {/* Header Top Row */}
              <View style={styles.headerTopRow}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerTitleRow}>
                    <Ionicons name="search" size={20} color="#FE8C00" />
                    <Text style={styles.headerTitle}>Search</Text>
                  </View>
                  <View style={styles.headerSubtitleRow}>
                    <Text style={styles.headerSubtitle}>Find your favorite food</Text>
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

              {/* Search Bar */}
              <View style={styles.searchBarContainer}>
                <SearchBar />
              </View>

              {/* Quick Filters */}
              {renderQuickFilters()}

              {/* Active Filters Display */}
              {(activeCategory || searchQuery) && (
                <View style={styles.activeFiltersContainer}>
                  <View style={styles.activeFiltersHeader}>
                    <Ionicons name="funnel-outline" size={16} color="#FE8C00" />
                    <Text style={styles.activeFiltersLabel}>Active Filters</Text>
                    <TouchableOpacity onPress={handleClearAll} style={styles.clearAllIconButton}>
                      <Ionicons name="close-circle" size={18} color="#FE8C00" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.activeFiltersRow}>
                    {activeCategory && (
                      <TouchableOpacity
                        style={styles.activeFilterTag}
                        onPress={() => {
                          router.setParams({ category: undefined });
                          setActiveCategory("");
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="restaurant" size={14} color="#FE8C00" />
                        <Text style={styles.activeFilterText}>
                          {getCategoryName(activeCategory)}
                        </Text>
                        <Ionicons name="close-circle" size={14} color="#FE8C00" />
                      </TouchableOpacity>
                    )}
                    {searchQuery && (
                      <TouchableOpacity
                        style={styles.activeFilterTag}
                        onPress={() => {
                          router.setParams({ query: undefined });
                          setSearchQuery("");
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="search" size={14} color="#FE8C00" />
                        <Text style={styles.activeFilterText} numberOfLines={1}>
                          {searchQuery}
                        </Text>
                        <Ionicons name="close-circle" size={14} color="#FE8C00" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {/* Sort and Results Count */}
              <View style={styles.resultsHeader}>
                {!loading && sortedData && sortedData.length > 0 && (
                  <View style={styles.resultsCountContainer}>
                    <Ionicons name="list-outline" size={16} color="#666" />
                    <Text style={styles.resultsText}>
                      {sortedData.length} {sortedData.length === 1 ? "result" : "results"}
                    </Text>
                  </View>
                )}
                {sortedData && sortedData.length > 1 && renderSortOptions()}
              </View>
            </View>
          )}
          ListEmptyComponent={() =>
            !loading && (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyImageContainer}>
                  <Ionicons
                    name={searchQuery || activeCategory ? "search-outline" : "restaurant-outline"}
                    size={100}
                    color="#D1D5DB"
                  />
                </View>
                <Text style={styles.emptyTitle}>
                  {searchQuery || activeCategory ? "No results found" : "Start searching"}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery || activeCategory
                    ? "Try adjusting your search or filter criteria"
                    : "Search for your favorite meals or use filters to browse"}
                </Text>
                {(searchQuery || activeCategory) && (
                  <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
                    <Ionicons name="refresh-outline" size={18} color="#FE8C00" />
                    <Text style={styles.clearAllButtonText}>Clear All Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          }
          ListFooterComponent={() =>
            loading && (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="large" color="#FE8C00" />
                <Text style={styles.loadingFooterText}>Loading results...</Text>
              </View>
            )
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
    height: "100%",
  },
  container: {
    flex: 1,
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
    gap: 16,
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  headerSubtitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  searchBarContainer: {
    marginTop: 4,
  },
  quickFiltersContainer: {
    marginTop: 8,
  },
  quickFiltersLabel: {
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
    color: "#666",
    marginBottom: 10,
  },
  quickFiltersList: {
    gap: 10,
    paddingRight: 20,
  },
  quickFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickFilterChipActive: {
    backgroundColor: "#FE8C00",
    borderColor: "#FE8C00",
  },
  quickFilterText: {
    fontSize: 13,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  quickFilterTextActive: {
    color: "#fff",
  },
  activeFiltersContainer: {
    backgroundColor: "#FFF5E6",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#FFE5CC",
    shadowColor: "#FE8C00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeFiltersHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  activeFiltersLabel: {
    fontSize: 13,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
    flex: 1,
  },
  clearAllIconButton: {
    padding: 4,
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
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#FE8C00",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilterText: {
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
    maxWidth: 120,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  resultsCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#666",
  },
  sortContainer: {
    position: "relative",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sortButtonText: {
    fontSize: 13,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  sortOptionsList: {
    position: "absolute",
    top: 45,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    minWidth: 180,
    paddingVertical: 4,
  },
  sortOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sortOptionItemActive: {
    backgroundColor: "#FFF5E6",
  },
  sortOptionText: {
    fontSize: 13,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    flex: 1,
  },
  sortOptionTextActive: {
    color: "#FE8C00",
    fontFamily: "Quicksand-SemiBold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
    minHeight: 400,
  },
  emptyImageContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#F9FAFB",
    borderRadius: 70,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FE8C00",
    backgroundColor: "#fff",
    shadowColor: "#FE8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  clearAllButtonText: {
    fontSize: 15,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  loadingFooter: {
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingFooterText: {
    marginTop: 16,
    fontSize: 15,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
});
