import AddButton from "@/components/AddButton";
import MealCard from "@/components/MealCard";
import { getCategories, getMenu } from "@/lib/appwrite";
import seed from "@/lib/seed";
import useAppwrite from "@/lib/useAppwrite";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
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
  });

  const { data: categories } = useAppwrite({ fn: getCategories });

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
                </View>
              </View>

              <AddButton />
            </View>

            {/* <SearchBar /> */}
            <Text>Search Input</Text>
            {/* <Filter categories={categories} /> */}
            <Text>Filter</Text>
            {/* <Button
              title={loading ? "Seeding..." : "Seed Database"}
              onPress={async () => {
                try {
                  await seed();
                  refetch();
                  Alert.alert("Success", "Database seeded successfully!");
                } catch (error) {
                  console.error("Failed to seed the database", error);
                  Alert.alert(
                    "Error",
                    "Failed to seed the database. Check console for details."
                  );
                }
              }}
              disabled={loading}
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
  },
  headerSubtitle: {
    fontSize: 16, 
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A", 
  },
});
