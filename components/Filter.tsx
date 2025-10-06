import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { filterOptions } from "../utils/data";

const styles = StyleSheet.create({
  horizontalScroll: {
    maxHeight: 60,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  chip: {
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  chipSelected: {
    backgroundColor: "#f16e03ff",
    borderColor: "#f16e03ff",
  },
  chipText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  chipTextSelected: {
    color: "#fff",
  },
});

export default function Filter({
  selected,
  setSelected,
  onFilterChange,
}: {
  selected: string;
  setSelected: (key: string) => void;
  onFilterChange?: (key: string) => void;
}) {
  return (
    <ScrollView
      style={[styles.horizontalScroll, { marginTop: 4 }]}
      contentContainerStyle={styles.horizontalContainer}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {filterOptions.map((opt) => (
        <TouchableOpacity
          key={opt.key}
          style={[styles.chip, selected === opt.key && styles.chipSelected]}
          onPress={() => {
            setSelected(opt.key);
            onFilterChange?.(opt.key);
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              selected === opt.key && styles.chipTextSelected,
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
