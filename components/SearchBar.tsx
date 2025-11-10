import {Image, StyleSheet, TextInput, TouchableOpacity, View,} from "react-native";
import React, {useState, useEffect} from "react";
import {router, useLocalSearchParams} from "expo-router";
import {images} from "@/constants";
import {Ionicons} from "@expo/vector-icons";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query || "");

  // Update query when params change
  useEffect(() => {
    if (params.query !== query) {
      setQuery(params.query || "");
    }
  }, [params.query]);

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  const handleSubmit = () => {
    if (query?.trim()) {
      console.log("[SearchBar] Submitting search:", query);
      router.setParams({ query: query.trim() });
    } else {
      console.log("[SearchBar] Clearing search");
      router.setParams({ query: undefined });
    }
  };

  const handleClear = () => {
    console.log("[SearchBar] Clearing search");
    setQuery("");
    router.setParams({ query: undefined });
  };

  return (
    <View style={styles.search}>
      <View style={styles.searchIconContainer}>
        <Ionicons name="search-outline" size={20} color="#666" />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search for drinks, sandwiches..."
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        placeholderTextColor={"#A0A0A0"}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {query ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
        >
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSubmit}
        >
          <Ionicons name="search" size={20} color="#FE8C00" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  search: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FE8C00",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
  },
  searchIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 15,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
  },
  searchButton: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  clearButton: {
    paddingRight: 16,
    paddingLeft: 8,
  },
});
