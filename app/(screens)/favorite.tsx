import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import MealCard from "@/components/MealCard";
import { StatusBar } from "expo-status-bar";
import { images } from "@/constants";
import useAppwrite from "@/lib/useAppwrite";
import { getFavorites } from "@/lib/appwrite";
import { useFavoritesStore } from "@/store/favorite.store";

export default function Favorites() {
  const { favorites } = useFavoritesStore();

  const { data: items, refetch, loading } = useAppwrite({
    fn: getFavorites,
    params: { ids: favorites },
    skip: favorites.length === 0,
  });

  useEffect(() => {
    if (favorites.length > 0) {
      refetch({ ids: favorites });
    }
  }, [favorites, refetch]);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
      <StatusBar style="dark" />
      <FlatList
        data={items}
        renderItem={({ item }) => <MealCard item={item} />}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        ListHeaderComponent={() => <CustomHeader title="Your Favorites" />}
        ListEmptyComponent={() =>
          !loading && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Image
                source={images.emptyState}  
                resizeMode="contain"
                style={{
                  marginTop: 60,
                  marginBottom: 20,
                  width: 400,
                  height: 400
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  fontFamily: "Quicksand-Bold",
                  color: "#1A1A1A",
                }}
              >
                Oops!! Your favorites are empty
              </Text>
              <Text 
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  marginTop: 10,
                  fontWeight: "bold",
                  fontFamily: "Quicksand-Bold",
                  color: "#b4ababff",
                }}>
                  Add items to favorites
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#E5E7EB",
  },
  value: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
});