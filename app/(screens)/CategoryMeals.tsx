import CustomHeader from "@/components/CustomHeader";
import MealCard from "@/components/MealCard";
import useAppwrite from "@/lib/useAppwrite";
import {getMenu} from "@/lib/appwrite";
import {useLocalSearchParams} from "expo-router";
import React, {useEffect} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

export default function CategoryMeals() {
  const { category, categoryId } = useLocalSearchParams();

  console.log("CategoryMeals screen - category param:", category);
  console.log("CategoryMeals screen - categoryId param:", categoryId);

  const {
    data: meals,
    loading,
    refetch,
  } = useAppwrite({
    fn: getMenu,
    params: { category: categoryId as string, query: "", limit: 100 },
  });

  useEffect(() => {
    refetch();
  }, [categoryId]);

  console.log("CategoryMeals screen - meals data:", JSON.stringify(meals, null, 2));

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Meals...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar style="dark" />
      <CustomHeader title={category as string} />
      <FlatList
        data={meals}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <MealCard item={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meals found for this category.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16, // Add spacing between items
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});