import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { router } from "expo-router";

const CartButton = () => {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <TouchableOpacity style={styles.cartButton} onPress={() => router.push("/cart")}>
      <Image source={images.bag} style={styles.icon} resizeMode="contain" />

      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;

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
