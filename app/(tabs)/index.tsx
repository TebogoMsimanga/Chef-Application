/**
 * Home Screen
 *
 * Enhanced home screen displaying:
 * - Image slider showcasing different meals
 * - Total menu items count
 * - Average prices by category/course
 * - Menu items grid
 * - Category cards
 *
 * @component
 */

import AddButton from "@/components/AddButton";
import MealCard from "@/components/MealCard";
import { images } from "@/constants";
import { getCategories, getMenu } from "@/lib/supabase";
import useSupabase from "@/lib/useSupabase";
import { getAvatarColor, getUserInitials } from "@/lib/utils";
import useAuthStore from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDER_HEIGHT = 280;
const SLIDER_ITEM_WIDTH = SCREEN_WIDTH - 40;

export default function Index() {
  const { user } = useAuthStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const sliderScrollRef = useRef<FlatList>(null);
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
  const [categoryStats, setCategoryStats] = useState<
    Array<{ name: string; count: number; avgPrice: number }>
  >([]);

  console.log("[Home] Rendering home screen");

  // Fetch all menus
  const {
    data: allMenus,
    loading: menusLoading,
    error: menusError,
  } = useSupabase({
    fn: getMenu,
    params: { category: "", query: "", limit: 10000 },
    showErrorAlert: false,
  });

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSupabase({
    fn: getCategories,
    showErrorAlert: false,
  });

  // Calculate statistics
  useEffect(() => {
    if (allMenus && categoriesData && !menusLoading && !categoriesLoading) {
      try {
        console.log("[Home] Calculating statistics...");

        const stats: Array<{ name: string; count: number; avgPrice: number }> =
          [];

        categoriesData.forEach((cat: any) => {
          const categoryItems = allMenus.filter(
            (m: any) => (m.category_id || m.category?.id) === cat.id
          );

          const count = categoryItems.length;
          const totalPrice = categoryItems.reduce(
            (sum: number, item: any) => sum + (item.price || 0),
            0
          );
          const avgPrice = count > 0 ? totalPrice / count : 0;

          stats.push({
            name: cat.name,
            count,
            avgPrice,
          });
        });

        console.log("[Home] Statistics calculated:", stats);
        setCategoryStats(stats);
      } catch (error: any) {
        console.error("[Home] Error calculating statistics:", error);
        Sentry.captureException(error, {
          tags: { component: "Home", action: "calculateStats" },
        });
      }
    }
  }, [allMenus, menusLoading, categoriesData, categoriesLoading]);

  // Get featured meals for slider (first 5 with images)
  const featuredMeals = useMemo(() => {
    if (!allMenus) return [];
    return allMenus.filter((item: any) => item.image).slice(0, 5);
  }, [allMenus]);

  // Auto-scroll slider
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    if (!featuredMeals || featuredMeals.length === 0 || isUserScrolling) return;

    const interval = setInterval(() => {
      setCurrentSliderIndex((prev) => {
        const next = (prev + 1) % featuredMeals.length;
        const offset = next * (SLIDER_ITEM_WIDTH + 20);

        sliderScrollRef.current?.scrollToOffset({
          offset,
          animated: true,
        });

        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredMeals, isUserScrolling]);

  // Total menu items count
  const totalMenuItems = allMenus?.length || 0;

  // Handle errors
  useEffect(() => {
    if (menusError) {
      console.error("[Home] Error fetching menus:", menusError);
      Sentry.captureException(new Error(menusError), {
        tags: { component: "Home", action: "fetchMenus" },
      });
    }
    if (categoriesError) {
      console.error("[Home] Error fetching categories:", categoriesError);
      Sentry.captureException(new Error(categoriesError), {
        tags: { component: "Home", action: "fetchCategories" },
      });
    }
  }, [menusError, categoriesError]);

  // Show loading state
  if (menusLoading || categoriesLoading) {
    console.log("[Home] Loading data...");
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FE8C00" />
        <Text style={{ marginTop: 10, fontFamily: "Quicksand-Medium" }}>
          Loading menu...
        </Text>
      </SafeAreaView>
    );
  }

  /**
   * Render image slider item
   */
  const renderSliderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.sliderItem}
        onPress={() => router.push(`/MenuItemDetail?id=${item.id}`)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.image || images.placeholder }}
          style={styles.sliderImage}
          resizeMode="cover"
        />
        {/* Gradient Overlay */}
        <View style={styles.sliderGradientOverlay} />
        <View style={styles.sliderOverlay}>
          <View style={styles.sliderContent}>
            <Text style={styles.sliderTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.sliderInfo}>
              <View style={styles.sliderPriceContainer}>
                <Text style={styles.sliderPriceLabel}>Price</Text>
                <Text style={styles.sliderPrice}>
                  R {item.price?.toFixed(2)}
                </Text>
              </View>
              {item.rating && (
                <View style={styles.sliderRating}>
                  <Ionicons name="star" size={16} color="#FFA500" />
                  <Text style={styles.sliderRatingText}>
                    {item.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Render statistics card
   */
  const renderStatsCard = () => {
    return (
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Ionicons name="restaurant" size={24} color="#FE8C00" />
          <Text style={styles.statsTitle}>Menu Overview</Text>
        </View>
        <View style={styles.statsContent}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalMenuItems}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{categoriesData?.length || 0}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Render average prices by category
   */
  const renderCategoryPrices = () => {
    if (categoryStats.length === 0) return null;

    return (
      <View style={styles.categoryPricesCard}>
        <View style={styles.categoryPricesHeader}>
          <Ionicons name="pricetag" size={20} color="#FE8C00" />
          <Text style={styles.categoryPricesTitle}>
            Average Prices by Course
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPricesList}
        >
          {categoryStats.map((stat, index) => (
            <View key={index} style={styles.categoryPriceItem}>
              <Text style={styles.categoryPriceName} numberOfLines={1}>
                {stat.name}
              </Text>
              <Text style={styles.categoryPriceValue}>
                R {stat.avgPrice.toFixed(2)}
              </Text>
              <Text style={styles.categoryPriceCount}>
                {stat.count} {stat.count === 1 ? "item" : "items"}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
                resizeMode="cover"
                defaultSource={images.avatar}
              />
            ) : user?.name ? (
              <View
                style={[
                  styles.avatar,
                  styles.avatarInitials,
                  { backgroundColor: getAvatarColor(user.name) },
                ]}
              >
                <Text style={styles.avatarInitialsText}>
                  {getUserInitials(user.name)}
                </Text>
              </View>
            ) : (
              <Image
                source={images.avatar}
                style={styles.avatar}
                resizeMode="cover"
              />
            )}
            <View style={styles.userInfoTextContainer}>
              <TouchableOpacity style={styles.userNameRow}>
                <Text style={styles.userName}>{user?.name || "Guest"}</Text>
                <Image
                  source={images.arrowDown}
                  style={styles.arrowDownIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.userRole}>Head Chef</Text>
            </View>
            <AddButton />
          </View>
        </View>

        {/* Image Slider */}
        {featuredMeals.length > 0 && (
          <View style={styles.sliderContainer}>
            <FlatList
              ref={sliderScrollRef}
              data={featuredMeals}
              renderItem={renderSliderItem}
              keyExtractor={(item) => item.id || `slider-${item.name}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={SLIDER_ITEM_WIDTH + 20}
              snapToAlignment="start"
              decelerationRate="fast"
              getItemLayout={(data, index) => ({
                length: SLIDER_ITEM_WIDTH + 20,
                offset: (SLIDER_ITEM_WIDTH + 20) * index,
                index,
              })}
              onScrollBeginDrag={() => {
                setIsUserScrolling(true);
              }}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (SLIDER_ITEM_WIDTH + 20)
                );
                const clampedIndex = Math.max(
                  0,
                  Math.min(index, featuredMeals.length - 1)
                );
                setCurrentSliderIndex(clampedIndex);
                setIsUserScrolling(false);
              }}
              onScrollToIndexFailed={(info) => {
                console.warn("[Home] Scroll to index failed:", info);
                // Fallback: scroll to offset instead
                const offset = info.index * (SLIDER_ITEM_WIDTH + 20);
                setTimeout(() => {
                  sliderScrollRef.current?.scrollToOffset({
                    offset,
                    animated: true,
                  });
                }, 100);
              }}
              contentContainerStyle={styles.sliderContentContainer}
            />
            {/* Slider Indicators */}
            <View style={styles.sliderIndicators}>
              {featuredMeals.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.sliderIndicator,
                    index === currentSliderIndex &&
                      styles.sliderIndicatorActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Statistics Card */}
        {renderStatsCard()}

        {/* Category Prices */}
        {renderCategoryPrices()}

        {/* Menu Items Section */}
        <View style={styles.menuSection}>
          <View style={styles.menuSectionHeader}>
            <Ionicons name="grid" size={24} color="#FE8C00" />
            <Text style={styles.menuSectionTitle}>Chef's Menu</Text>
          </View>
          {allMenus && allMenus.length > 0 ? (
            <FlatList
              data={allMenus}
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
              keyExtractor={(item) => item.id || `menu-${item.name}`}
              numColumns={2}
              columnWrapperStyle={styles.menuColumnWrapper}
              contentContainerStyle={styles.menuListContent}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyMenu}>
              <Ionicons name="restaurant-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyMenuText}>No menu items yet</Text>
              <Text style={styles.emptyMenuSubtext}>
                Add items to start building your menu
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FE8C00",
  },
  avatarInitials: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitialsText: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#fff",
  },
  userInfoTextContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  userRole: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  arrowDownIcon: {
    width: 12,
    height: 12,
  },
  sliderContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sliderContentContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  sliderItem: {
    width: SLIDER_ITEM_WIDTH,
    height: SLIDER_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  sliderImage: {
    width: "100%",
    height: "100%",
  },
  sliderGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sliderOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
    zIndex: 1,
  },
  sliderContent: {
    gap: 8,
  },
  sliderTitle: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sliderInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sliderPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  sliderPriceLabel: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "rgba(255,255,255,0.9)",
  },
  sliderPrice: {
    fontSize: 28,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sliderRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  sliderRatingText: {
    fontSize: 14,
    fontFamily: "Quicksand-Bold",
    color: "#fff",
  },
  sliderIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  sliderIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  sliderIndicatorActive: {
    width: 24,
    backgroundColor: "#FE8C00",
  },
  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  statsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 32,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  categoryPricesCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryPricesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  categoryPricesTitle: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  categoryPricesList: {
    gap: 12,
    paddingRight: 20,
  },
  categoryPriceItem: {
    backgroundColor: "#FFF5E6",
    borderRadius: 12,
    padding: 16,
    minWidth: 140,
    borderWidth: 1.5,
    borderColor: "#FFE5CC",
  },
  categoryPriceName: {
    fontSize: 14,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
    marginBottom: 8,
  },
  categoryPriceValue: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  categoryPriceCount: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  menuSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  menuSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 22,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  menuColumnWrapper: {
    gap: 28,
  },
  menuItem: {
    flex: 1,
    maxWidth: "48%",
  },
  menuListContent: {
    gap: 28,
    paddingBottom: 20,
  },
  emptyMenu: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyMenuText: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyMenuSubtext: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
  },
});
