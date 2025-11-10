import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { images } from "@/constants";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { addFavorite, removeFavorite } from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";

interface MealCardProps {
  item: any;
  isFavorite?: boolean;
}

const MealCard = ({ item, isFavorite = false }: MealCardProps) => {
  const { user } = useAuthStore();
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleFavorite = async () => {
    if (!user?.id) {
      Alert.alert("Error", "Please login to add favorites");
      return;
    }

    try {
      if (favorite) {
        await removeFavorite(user.id, item.id);
        setFavorite(false);
      } else {
        await addFavorite(user.id, item.id);
        setFavorite(true);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/MenuItemDetail?id=${item.id}`)}
    >
      <Image
        source={{ uri: item.image || images.placeholder }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={toggleFavorite}
      >
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={24}
          color={favorite ? "#EF4444" : "#fff"}
        />
      </TouchableOpacity>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>R {item.price?.toFixed(2)}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFA500" />
            <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 6,
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    marginBottom: 8,
    height: 32,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
});

export default MealCard;