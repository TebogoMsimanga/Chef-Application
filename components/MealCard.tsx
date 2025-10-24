import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MealCard = ({ item }: { item: MenuItem }) => {
  // Default to placeholder image
  const placeholderImage = require("@/assets/images/placeholder.png");

  const { addItem } = useCartStore();

  // Log the entire item for debugging
  console.log(
    `Menu item data for ${item.name}:`,
    JSON.stringify(item, null, 2)
  );

  // Handle different types of image_url values
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
    <TouchableOpacity style={styles.container}>
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="contain"
        defaultSource={placeholderImage}
      />

      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.price}>From R{item.price.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => addItem({
        id: item.$id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        customizations: []
      })}>
        <Text style={styles.name}>Add to Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MealCard;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingVertical: 36,
    paddingHorizontal: 14,
    paddingTop: 96,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FE8C00",
    alignItems: "center",
    justifyContent: "flex-end",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: 128,
    height: 128,
    position: "absolute",
    top: -40,
    alignSelf: "center",
  },
  name: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
    marginBottom: 20,
  },
});
