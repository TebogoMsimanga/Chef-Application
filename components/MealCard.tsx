import {useCartStore} from "@/store/cart.store";
import {useFavoritesStore} from "@/store/favorite.store";
import {MenuItem} from "@/type";
import React from "react";
import {Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";

const MealCard = ({ item }: { item: MenuItem }) => {
  
  const placeholderImage = require("@/assets/images/placeholder.png");

  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();  
  console.log(
    `Menu item data for ${item.name}:`,
    JSON.stringify(item, null, 2)
  );

  
  let imageSource: ImageSourcePropType = placeholderImage;

  try {
    if (item.image_url) {
      console.log(`Setting image URL for ${item.name}:`, item.image_url);
      imageSource = { uri: item.image_url };
    } else {
      console.log(`No valid image URL for ${item.name}, using placeholder`);
    }
  } catch (error) {
    console.error(`Error processing image URL for ${item.name}:`, error);
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => {
      console.log("Attempting to navigate to MenuItemDetail with ID:", item.$id);
      router.push(`/(screens)/MenuItemDetail?id=${item.$id}`);
    }}>
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="contain"
        defaultSource={placeholderImage}
      />

      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>

     
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>{item.rating.toFixed(1)} ⭐</Text>
        <Text style={styles.detailText}>{item.calories} cal</Text>
        <Text style={styles.detailText}>{item.protein}g protein</Text>
      </View>

      <Text style={styles.price}>From R{item.price.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => addItem({
        id: item.$id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        customizations: []
      })}>
        <View style={styles.addToCart}>
          <Text style={styles.addText}>Add to Cart +</Text>
        </View>
      </TouchableOpacity>
       <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.$id)}
      >
        <Ionicons 
          name={isFavorite(item.$id) ? "heart" : "heart-outline"} 
          size={24} 
          color={isFavorite(item.$id) ? "#EF4444" : "#5D5F6D"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MealCard;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingVertical: 40,  
    paddingHorizontal: 16,
    paddingTop: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 32, 
    borderWidth: 1,
    borderColor: "#FE8C00",
    alignItems: "center",
    justifyContent: "flex-end",
    shadowColor: "rgba(0,0,0,0.15)",  
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,  
  },
  image: {
    width: 140,  
    height: 140,
    position: "absolute",
    top: -50,
    alignSelf: "center",
    borderRadius: 70,  
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
  },
  name: {
    fontSize: 18,  
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#5D5F6D",
  },
  price: {
    fontSize: 16,  
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
    marginBottom: 16,
  },
  addToCart: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FE8C00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
  },
  addText: {
    color: "#FFFFFF",
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
  },
  addIcon: {
    width: 16,
    height: 16,
    tintColor: "#FFFFFF",
  },
});