import AddButton from "@/components/AddButton";
import {images, menu} from "@/constants";
import {getCategories, getMenu} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import useAuthStore from "@/store/auth.store";
import {router} from "expo-router";
import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import {FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Index() {
  const { user } = useAuthStore();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );

  console.log("AuthStore", JSON.stringify(user, null, 2));

  // Fetch all menus using useAppwrite (no category, high limit to get everything)
  const {
    data: allMenus,
    loading,
    error,
  } = useAppwrite({
    fn: getMenu,
    params: { category: "", query: "", limit: 10000 }, // Fetch all, adjust limit as needed
  });

  const { data: categoriesData } = useAppwrite({
    fn: getCategories,
  });

  console.log("allMenus data:", JSON.stringify(allMenus, null, 2));
  console.log("loading state:", loading);

  useEffect(() => {
    if (allMenus && categoriesData && !loading) {
      const categoryIdToNameMap: Record<string, string> = {};
      categoriesData.forEach((cat) => {
        categoryIdToNameMap[cat.$id] = cat.name.toUpperCase();
      });

      const counts: Record<string, number> = {};

      allMenus.forEach((m) => {
        const categoryName = categoryIdToNameMap[m.category];
        if (categoryName) {
          counts[categoryName] = (counts[categoryName] || 0) + 1;
        }
      });

      console.log(
        "Raw counts from DB categories (using names):",
        JSON.stringify(counts, null, 2)
      );

      const finalCategoryCounts = menu.reduce((acc, item) => {
        acc[item.title] = counts[item.title] || 0;
        return acc;
      }, {} as Record<string, number>);

      // Create a map from category title to category ID for navigation
      const categoryNameToIdMap: Record<string, string> = {};
      categoriesData.forEach((cat) => {
        categoryNameToIdMap[cat.name.toUpperCase()] = cat.$id;
      });
      // Store this map if needed elsewhere, or use it directly in the onPress
      (Index as any).categoryNameToIdMap = categoryNameToIdMap;

      console.log(
        "Final categoryCounts for UI:",
        JSON.stringify(finalCategoryCounts, null, 2)
      );
      setCategoryCounts(finalCategoryCounts);
    }
  }, [allMenus, loading, categoriesData]);

  if (error) {
    console.error("Error fetching menus:", error);
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
                  const categoryId = (Index as any).categoryNameToIdMap[item.title];
                  router.push(`/(screens)/CategoryMeals?category=${item.title}&categoryId=${categoryId}`);
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
                  <View style={[isEven ? styles.left : styles.right,]}>
                    <Text style={{
                      color: "#fff"
                    }}>
                      Meal Counter:
                    </Text>
                  <Text style={{
                    backgroundColor: "#FE8C00",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    fontSize: 18,
                    fontWeight: "bold",
                    borderRadius: 9999,
                    marginTop: 5,
                    color: "#fff"
                  }}>{categoryCounts[item.title] || 0} Meals</Text>
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
    borderRadius: 9999
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
