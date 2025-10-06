import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { meals } from "../utils/data";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f3f2",
    height: 40,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 8,
  },
  suggestionList: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    maxHeight: 180,
    zIndex: 10,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 15,
    color: "#222",
    marginLeft: 10,
  },
  clockIcon: {
    marginRight: 4,
  },
});

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  // Optimistic search: filter meals as user types
  const suggestions =
    query.length > 0
      ? meals.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
      : [];

  // Show up to 5 previous searches
  const historyToShow = history.slice(-5).reverse();

  const handleSearch = (text: string) => {
    setQuery(text);
    setShowSuggestions(true);
  };

  // Navigate to MealView if meal found

  const handleSelect = (mealOrName: any) => {
    let meal = mealOrName;
    let name = typeof mealOrName === "string" ? mealOrName : mealOrName.name;

    if (typeof mealOrName === "string") {
      meal = meals.find(
        (m) => m.name.toLowerCase() === mealOrName.toLowerCase()
      );
    }

    setQuery(name);
    setShowSuggestions(false);
    Keyboard.dismiss();
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== name);
      return [...filtered, name].slice(-5);
    });

    if (meal) {
      (navigation as any).navigate("MealView", { meal });
    }
  };

  // Use @jamsch/expo-speech-recognition for real voice input
  const handleMic = () => {
    // Suggest a random meal name for demo
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    setQuery(randomMeal.name);
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  // Focus input and search on icon press
  const handleSearchIcon = () => {
    inputRef.current?.focus();
    if (query.trim()) {
      handleSelect(query.trim());
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleSearchIcon}>
          <Feather name="search" size={20} color={"black"} />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={{ flex: 1 }}
          placeholder="search for a meal"
          value={query}
          onChangeText={handleSearch}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            setTimeout(() => {
              if (!inputRef.current?.isFocused()) {
                setShowSuggestions(false);
              }
            }, 150);
          }}
          returnKeyType="search"
          onSubmitEditing={handleSearchIcon}
        />
        <TouchableOpacity onPress={handleMic}>
          <Feather name="mic" size={20} color={"black"} />
        </TouchableOpacity>
      </View>
      {showSuggestions &&
        (suggestions.length > 0 || historyToShow.length > 0) && (
          <View style={styles.suggestionList}>
            {suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelect(item)}
                  >
                    <Feather name="search" size={16} color="#888" />
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              historyToShow.map((item, idx) => (
                <TouchableOpacity
                  key={item + idx}
                  style={styles.suggestionItem}
                  onPress={() => handleSelect(item)}
                >
                  <Feather
                    name="clock"
                    size={16}
                    color="#888"
                    style={styles.clockIcon}
                  />
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
    </>
  );
}
