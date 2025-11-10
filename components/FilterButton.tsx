/**
 * Filter Button Component
 * 
 * Button to navigate to the filter screen.
 * Styled similar to AddButton with filter icon.
 * 
 * @component
 */

import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import CustomButton from "./CustomButton";
import { Ionicons } from "@expo/vector-icons";

const FilterButton = () => {
  return (
    <CustomButton
      title="Filter"
      onPress={() => router.push("/(screens)/filter")}
      leftIcon={<Ionicons name="filter-outline" size={20} color="#fff" style={styles.icon} />}
      style={styles.button}
    />
  );
};

export default FilterButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "auto",
    minWidth: 120,
  },
  icon: {
    marginRight: 6,
  },
});

