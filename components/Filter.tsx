import {FlatList, StyleSheet, Text, TouchableOpacity,} from "react-native";
import React, {useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import { Category } from "@/type";

const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();

  const [active, setActive] = useState(searchParams.category || "");

  const handlePress = (id: string) => {
    setActive(id);

    if(id === "all") router.setParams({ category: undefined});
    else router.setParams({ category: id});
  };

  const filterData: (Category | { id: string; name: string })[] = categories
    ? [{ id: "all", name: "All" }, ...categories]
    : [{ id: "all", name: "All" }];

  return (
    <FlatList
      data={filterData}
      keyExtractor={(file) => file.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity

          style={[
            styles.filter,
            active === item.id ? styles.active : styles.notActive,
          ]}
          onPress={() => handlePress(item.id)}
        >
          <Text
            style={[
              styles.name,
              active === item.id ? styles.nameActive : styles.nameNotActive,
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default Filter;

const styles = StyleSheet.create({
  filter: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#8a88864f",
    marginRight: 8,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  active: {
    backgroundColor: "#FF6B00",
  },
  notActive: {
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 12,
    fontFamily: "Quicksand-Bold",
  },
  nameActive: {
    color: "#fff",
  },
  nameNotActive: {
    color: "#645c5cff",
  },
});