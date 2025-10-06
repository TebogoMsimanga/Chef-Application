import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../utils/Colors";
import { Meal } from "../utils/data";
import { MealCard } from "./Meal";
import SadMealSVG from "./SadMealSVG";

// Simple in-memory favorite store (replace with context or redux for real app)
export const favoriteStore: {
  favorites: Meal[];
  setFavorites: (meals: Meal[]) => void;
} = {
  favorites: [],
  setFavorites: () => {},
};

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<Meal[]>(favoriteStore.favorites);
  const [searchQuery, setSearchQuery] = useState("");

  // Keep store in sync for other components
  useEffect(() => {
    favoriteStore.favorites = favorites;
    favoriteStore.setFavorites = setFavorites;
  }, [favorites]);

  // Filter favorites based on search query
  const filteredFavorites = favorites.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Favorites</Text>
        {favorites.length > 0 && (
          <Text style={styles.count}>{favorites.length} saved</Text>
        )}
      </View>

      {/* Search Bar */}
      {favorites.length > 0 && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your favorites..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite meals yet</Text>
          <SadMealSVG size={160} />
          <Text style={styles.emptySubtext}>
            Tap the heart icon on any meal to save it here
          </Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No matches found</Text>
          <SadMealSVG size={120} />
          <Text style={styles.emptySubtext}>
            Try a different search term or browse all favorites
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.browseButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <MealCard meal={item} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
  },
  count: {
    fontSize: 15,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  emptySubtext: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
    marginHorizontal: 20,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 32,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: 12,
  },
  cardContainer: {
    flex: 1,
    maxWidth: "48%",
  },
});
