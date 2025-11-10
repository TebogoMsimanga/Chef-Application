import {FlatList, Image, Text, View} from "react-native";
import React, {useEffect, useState} from "react"; // Added useState for optimistic data
import {SafeAreaView} from "react-native-safe-area-context";
import {useFavoritesStore} from "@/store/favorite.store";
import CustomHeader from "@/components/CustomHeader";
import {StatusBar} from "expo-status-bar";
import {images} from "@/constants";
import useAppwrite from "@/lib/useAppwrite";
import {getFavorites} from "@/lib/appwrite";
import FavoriteItem from "@/components/FavoriteItem";
import {MenuItem} from "@/type";

export default function Favorites() {
  const { favorites } = useFavoritesStore();
  const [localData, setLocalData] = useState<MenuItem[]>([]);

  const {
    data: fetchedItems,
    refetch,
    loading,
  } = useAppwrite({
    fn: getFavorites,
    params: { ids: favorites },
    skip: favorites.length === 0,
  });

  useEffect(() => {
    if (favorites.length > 0) {
      refetch({ ids: favorites });
    }
  }, [favorites, refetch]);

  useEffect(() => {
    if (favorites.length === 0 && localData.length > 0) {
      setLocalData([]);
    }
  }, [favorites, localData.length]);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
      <StatusBar style="dark" />
      <FlatList
        data={localData}
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            onRemove={(id) =>
              setLocalData((prev) => prev.filter((i) => i.$id !== id))
            }
          />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        ListHeaderComponent={() => <CustomHeader title="Your Favorites" />}
        ListEmptyComponent={() =>
          !loading && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
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
                }}
              >
                Add items to favorites
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

