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
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MealCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 48,
    height: 160,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 128,
    height: 128,
    position: "absolute",
    top: -40,
    alignSelf: "center",
  },
  content: {
    marginTop: 64,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  price: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
  },
});
