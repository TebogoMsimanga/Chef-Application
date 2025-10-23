import AddButton from "@/components/AddButton";
import Filter from "@/components/Filter";
import MealCard from "@/components/MealCard";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants";
import { getCategories, getMenu } from "@/lib/appwrite";
import seed from "@/lib/seed";
import useAppwrite from "@/lib/useAppwrite";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: {
      category,
      query,
      limit: 6,
    },
    skip: true, // Skip initial fetch
  });

  const { data: categories } = useAppwrite({
    fn: getCategories,
  });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);

  return (
    <SafeAreaView style={styles.safeArea}>
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
        keyExtractor={(item) => item.$id}
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

              <AddButton />
            </View>

            {/* <SearchBar /> */}
            <SearchBar />
            {/* <Filter categories={categories} /> */}
            <Text>Filter</Text>
            <Filter categories={categories || []} />
            {/* <Button
              title="seed"
              onPress={() =>
                seed().catch((error) => console.log("failed to seed", error))
              }
            /> */}
          </View>
        )}
        ListEmptyComponent={() => !loading && <Text>No results</Text>}
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
