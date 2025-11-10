/**
 * Home Screen
 *
 * Main screen displaying category cards with meal counts.
 * Fetches menu items and categories from Supabase to calculate counts.
 *
 * @component
 */

import AddButton from "@/components/AddButton";
import { images, menu } from "@/constants";
import { getCategories, getMenu } from "@/lib/supabase";
import useSupabase from "@/lib/useSupabase";
import useAuthStore from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useAuthStore();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );

  console.log("[Home] Rendering home screen");

  // Fetch all menus using useSupabase (no category, high limit to get everything)
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

  // Calculate category counts when data is loaded
  useEffect(() => {
    if (allMenus && categoriesData && !menusLoading && !categoriesLoading) {
      try {
        console.log("[Home] Calculating category counts...");
        console.log("[Home] Menu items:", allMenus.length);
        console.log("[Home] Categories:", categoriesData.length);

        const categoryIdToNameMap: Record<string, string> = {};
        categoriesData.forEach((cat: any) => {
          categoryIdToNameMap[cat.id] = cat.name.toUpperCase();
        });

        const counts: Record<string, number> = {};

        allMenus.forEach((m: any) => {
          // Handle both category_id and category.id structures
          const categoryId = m.category_id || m.category?.id;
          const categoryName = categoryIdToNameMap[categoryId];
          if (categoryName) {
            counts[categoryName] = (counts[categoryName] || 0) + 1;
          }
        });

        const finalCategoryCounts = menu.reduce((acc, item) => {
          acc[item.title] = counts[item.title] || 0;
          return acc;
        }, {} as Record<string, number>);

        // Create a map from category title to category ID for navigation
        const categoryNameToIdMap: Record<string, string> = {};
        categoriesData.forEach((cat: any) => {
          categoryNameToIdMap[cat.name.toUpperCase()] = cat.id;
        });
        (Index as any).categoryNameToIdMap = categoryNameToIdMap;

        console.log("[Home] Category counts calculated:", finalCategoryCounts);
        setCategoryCounts(finalCategoryCounts);
      } catch (error: any) {
        console.error("[Home] Error calculating category counts:", error);
        Sentry.captureException(error, {
          tags: { component: "Home", action: "calculateCounts" },
        });
      }
    }
  }, [allMenus, menusLoading, categoriesData, categoriesLoading]);

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
          Loading categories...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar style="dark" />
      <FlatList
        data={menu}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <View>
              <Pressable
                style={[
                  styles.homeCards,
                  isEven ? styles.rowReverse : styles.row,
                  { backgroundColor: item.color },
                ]}
                android_ripple={{ color: "rgba(255, 255, 255, 0.13)" }}
                onPress={() => {
                  try {
                    const categoryId = (Index as any).categoryNameToIdMap[
                      item.title
                    ];
                    console.log(
                      "[Home] Navigating to category:",
                      item.title,
                      "ID:",
                      categoryId
                    );

                    if (categoryId) {
                      router.push(
                        `/(screens)/CategoryMeals?category=${encodeURIComponent(
                          item.title
                        )}&categoryId=${categoryId}`
                      );
                    } else {
                      console.warn(
                        "[Home] Category ID not found for:",
                        item.title
                      );
                      Sentry.captureMessage("Category ID not found", {
                        level: "warning",
                        tags: { component: "Home", category: item.title },
                      });
                    }
                  } catch (error: any) {
                    console.error("[Home] Navigation error:", error);
                    Sentry.captureException(error, {
                      tags: { component: "Home", action: "navigateToCategory" },
                    });
                  }
                }}
              >
                <View style={{ width: "50%", height: "100%" }}>
                  <Image
                    source={item.image}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={[
                    styles.homeCardsInfo,
                    isEven ? styles.left : styles.right,
                  ]}
                >
                  <Text style={styles.homeText}>{item.title}</Text>

                  {/* Meal Count - Dynamic from DB */}
                  <View style={[isEven ? styles.left : styles.right]}>
                    <Text
                      style={{
                        color: "#fff",
                      }}
                    >
                      Meal Counter:
                    </Text>
                    <Text
                      style={{
                        backgroundColor: "#FE8C00",
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        fontSize: 18,
                        fontWeight: "bold",
                        borderRadius: 9999,
                        marginTop: 5,
                        color: "#fff",
                      }}
                    >
                      {categoryCounts[item.title] || 0} Meals
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        }}
        contentContainerStyle={styles.homeSpacing}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: user?.avatar || images.logo }}
                style={styles.logo}
                resizeMode="contain"
              />
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
            {/* <SearchBar /> */}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 9999,
  },
  userInfoTextContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userName: {
    fontSize: 16,
    color: "#000",
  },
  userRole: {
    fontSize: 14,
    color: "#666",
  },
  arrowDownIcon: {
    width: 12,
    height: 12,
  },
  homeCards: {
    height: 190,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 6,
    overflow: "hidden",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  left: {
    paddingLeft: 10,
  },
  right: {
    paddingRight: 10,
  },
  homeCardsInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100%",
  },
  homeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 40,
  },
  homeSpacing: {
    paddingRight: 10,
    paddingLeft: 10,
  },
});
