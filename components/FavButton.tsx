import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {useFavoritesStore} from "@/store/favorite.store";
import {Ionicons} from "@expo/vector-icons";

const FavButton = () => {
  const totalFavorites = useFavoritesStore((state) => state.getTotalFavorites());

  return (
    <TouchableOpacity style={styles.cartButton} onPress={() => router.push("/favorite")}>  
      <Ionicons 
          name={"heart"} 
          size={24} 
          color={"#fff"} 
        /> 

      {totalFavorites > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalFavorites}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FavButton;

const styles = StyleSheet.create({
  cartButton: {
    position: "relative",
    backgroundColor: "#FE8C00",
    padding: 10,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, 
  },
  icon: {
    width: 20,  
    height: 20, 
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12, 
    fontFamily: "Quicksand-Bold",
    color: "#FFFFFF", 
  },
});