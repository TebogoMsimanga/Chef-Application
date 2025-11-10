import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import { StatusBar } from "expo-status-bar";
import { images } from "@/constants";
import FavoriteItem from "@/components/FavoriteItem";
import { getFavorites } from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";

export default function Favorite() {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await getFavorites(user.id);
      setFavorites(data || []);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    loadFavorites();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
      <StatusBar style="dark" />
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <FavoriteItem item={item.menu_item} onRemove={handleRemove} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        ListHeaderComponent={() => <CustomHeader title="Your Favorites" />}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={images.fav}
              resizeMode="contain"
              style={{
                marginTop: 60,
                marginBottom: 20,
                width: 400,
                height: 400,
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
              No favorites yet
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                marginTop: 10,
                fontWeight: "bold",
                fontFamily: "Quicksand-Bold",
                color: "#b4ababff",
              }}
            >
              Add items to your favorites
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
