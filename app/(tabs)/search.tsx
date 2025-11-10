/**
 * Search Screen
 *
 * Allows users to search and filter menu items by category and query.
 * Displays results in a grid layout with meal cards.
 *
 * @component
 */

import FavButton from "@/components/FavButton";
import Filter from "@/components/Filter";
import MealCard from "@/components/MealCard";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants";
import { getCategories, getMenu } from "@/lib/supabase";
import useSupabase from "@/lib/useSupabase";
import * as Sentry from "@sentry/react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  console.log("[Search] Screen rendered with params:", { category, query });

  const { data, refetch, loading, error } = useSupabase({
    fn: getMenu,
    params: {
      category: (category as string) || "",
      query: (query as string) || "",
      limit: 6,
    },
    skip: true,
    showErrorAlert: false,
  });

  const { data: categories } = useSupabase({
    fn: getCategories,
    showErrorAlert: false,
  });

  useEffect(() => {
    console.log("[Search] Refetching with params:", { category, query });
    refetch({
      category: (category as string) || "",
      query: (query as string) || "",
      limit: 6,
    });
  }, [category, query, refetch]);

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

              <FavButton />
            </View>

            {/* <SearchBar /> */}
            <SearchBar />
            <Filter categories={categories || []} />
            {/* <Button
              title="seed"
              onPress={() =>
                seed().catch((error) => console.log("failed to seed", error))
              }
            /> */}
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={images.emptyState}
                resizeMode="contain"
                style={{
                  width: 300,
                  height: 300,
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
                Oops!! Nothing matched your search
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  marginTop: 10,
                  fontWeight: "bold",
                  fontFamily: "Quicksand-Bold",
                  color: "#b4ababff",
                }}
              >
                Try a different search term or check for typos.
              </Text>
            </View>
          )
        }
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
    paddingBottom: 128,
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
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: "Quicksand-Bold",
    textTransform: "uppercase",
    color: "#FF6B00",
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
});
