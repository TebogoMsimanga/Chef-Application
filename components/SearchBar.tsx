import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { images } from "@/constants";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query);

  const handleSearch = (text: string) => {
    setQuery(text);

    if(!text) router.setParams({ query: undefined });
  };

  const handeSubmit = () => {
    if(query?.trim()) router.setParams({ query });
  }

  return (
    <View style={styles.search}>
      <TextInput
        style={{ flex: 1, padding: 20 }}
        placeholder="Search for drinks, sanwiches ...."
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handeSubmit}
        placeholderTextColor={"#A0A0A0"}
        returnKeyType="search"
      />
      <TouchableOpacity
        style={{ paddingRight: 20 }}
        onPress={() => router.setParams({ query })}
      >
        <Image
          source={images.search}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
          tintColor={"#5D5F6D"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  search: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#FF6B00",
    gap: 20,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});
