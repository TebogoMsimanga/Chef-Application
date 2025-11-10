/**
 * Menu Item Detail Screen
 * 
 * Displays detailed information about a menu item including:
 * - Item details (name, description, price, rating, nutrition)
 * - Available customizations (sides, toppings)
 * - Quantity selector
 * - Add to cart functionality
 * 
 * @component
 */

import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import {images} from "@/constants";
import {getMenuItem, getSides, getToppings} from "@/lib/supabase";
import {useCartStore} from "@/store/cart.store";
import {CartCustomization} from "@/type";
import * as Sentry from "@sentry/react-native";
import {router, useLocalSearchParams} from "expo-router";
import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  calories: number;
  protein: number;
  category: { name: string };
}

interface CustomizationItem {
  id: string;
  name: string;
  price: number;
  type: string;
  image: string;
}

const MenuItemDetail = () => {
  const { id } = useLocalSearchParams();
  const addToCart = useCartStore((state) => state.addItem);

  const [item, setItem] = useState<MenuItem | null>(null);
  const [sides, setSides] = useState<CustomizationItem[]>([]);
  const [toppings, setToppings] = useState<CustomizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustoms, setSelectedCustoms] = useState<CartCustomization[]>([]);
  const [quantity, setQuantity] = useState(1);

  console.log("[MenuItemDetail] Screen rendered with ID:", id);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  /**
   * Load menu item data, sides, and toppings
   */
  const loadData = async () => {
    try {
      console.log("[MenuItemDetail] Loading data for item:", id);
      setLoading(true);
      
      const [menuItem, sidesData, toppingsData] = await Promise.all([
        getMenuItem(id as string),
        getSides(),
        getToppings()
      ]);

      console.log("[MenuItemDetail] Data loaded:", {
        item: menuItem?.name,
        sides: sidesData?.length || 0,
        toppings: toppingsData?.length || 0,
      });

      setItem(menuItem);
      setSides(sidesData || []);
      setToppings(toppingsData || []);
    } catch (error: any) {
      console.error("[MenuItemDetail] Error loading data:", error);
      Sentry.captureException(error, {
        tags: { component: "MenuItemDetail", action: "loadData" },
        extra: { itemId: id, errorMessage: error?.message },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FE8C00" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Item not found</Text>
      </SafeAreaView>
    );
  }

  const groupedCustoms: Record<string, CustomizationItem[]> = {};
  
  [...sides, ...toppings].forEach((cust) => {
    if (!groupedCustoms[cust.type]) {
      groupedCustoms[cust.type] = [];
    }
    groupedCustoms[cust.type].push(cust);
  });

  /**
   * Toggle customization selection
   * Adds or removes customization from selected list
   */
  const toggleCustom = (cust: CustomizationItem) => {
    try {
      const exists = selectedCustoms.find((s) => s.id === cust.id);
      if (exists) {
        console.log("[MenuItemDetail] Removing customization:", cust.name);
        setSelectedCustoms(selectedCustoms.filter((s) => s.id !== cust.id));
      } else {
        console.log("[MenuItemDetail] Adding customization:", cust.name);
        setSelectedCustoms([
          ...selectedCustoms,
          { id: cust.id, name: cust.name, price: cust.price, type: cust.type },
        ]);
      }
    } catch (error: any) {
      console.error("[MenuItemDetail] Error toggling customization:", error);
      Sentry.captureException(error, {
        tags: { component: "MenuItemDetail", action: "toggleCustom" },
        extra: { customizationId: cust.id },
      });
    }
  };

  const customTotal = selectedCustoms.reduce((sum, c) => sum + c.price, 0);
  const totalPrice = (item.price + customTotal) * quantity;

  /**
   * Handle adding item to cart
   * Adds item with selected customizations and quantity to cart
   */
  const handleAddToCart = () => {
    try {
      console.log("[MenuItemDetail] Adding to cart:", {
        item: item.name,
        quantity,
        customizations: selectedCustoms.length,
        totalPrice,
      });

      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image,
        customizations: selectedCustoms,
      });

      console.log("[MenuItemDetail] Item added to cart successfully");
      router.back();
    } catch (error: any) {
      console.error("[MenuItemDetail] Error adding to cart:", error);
      Sentry.captureException(error, {
        tags: { component: "MenuItemDetail", action: "handleAddToCart" },
        extra: { itemId: item.id, itemName: item.name },
      });
    }
  };

  const renderCustomItem = ({ item: cust }: { item: CustomizationItem }) => {
    const isSelected = selectedCustoms.some((s) => s.id === cust.id);
    return (
      <View style={styles.customItem}>
        <Image
          source={{ uri: cust.image || images.placeholder }}
          style={styles.customImage}
        />
        <Text style={styles.customName}>{cust.name}</Text>
        <Text style={styles.customPrice}>R {cust.price.toFixed(2)}</Text>
        <TouchableOpacity
          style={[styles.addButton, isSelected && styles.addButtonSelected]}
          onPress={() => toggleCustom(cust)}
        >
          <Text style={styles.addButtonText}>{isSelected ? "-" : "+"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <CustomHeader title={item.name} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={{ uri: item.image || images.placeholder }}
          style={styles.itemImage}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>
              {"★".repeat(Math.floor(item.rating))}
            </Text>
            <Text style={styles.ratingText}> {item.rating}/5</Text>
          </View>
          <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.nutrition}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{item.calories} Cal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{item.protein}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Category</Text>
              <Text style={styles.nutritionValue}>{item.category?.name || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTag}>Free Delivery</Text>
            <Text style={styles.deliveryTag}>20 - 30 mins</Text>
            <Text style={styles.deliveryTag}>★ {item.rating}</Text>
          </View>

          {Object.keys(groupedCustoms).map((type) => (
            <View key={type} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </Text>
              <FlatList
                data={groupedCustoms[type]}
                renderItem={renderCustomItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(cust) => cust.id}
                contentContainerStyle={styles.customListContainer}
              />
            </View>
          ))}

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => {
                const newQty = Math.max(1, quantity - 1);
                console.log("[MenuItemDetail] Decreasing quantity:", newQty);
                setQuantity(newQty);
              }}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                const newQty = quantity + 1;
                console.log("[MenuItemDetail] Increasing quantity:", newQty);
                setQuantity(newQty);
              }}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            title={`Add to cart (R ${totalPrice.toFixed(2)})`}
            onPress={handleAddToCart}
            style={styles.cartButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  itemImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -20, // Overlap with image
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#5D5F6D",
    marginLeft: 4,
  },
  price: {
    fontSize: 24,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: "Quicksand-Regular",
    color: "#5D5F6D",
    lineHeight: 24,
    marginBottom: 20,
  },
  nutrition: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    marginBottom: 20,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionLabel: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#5D5F6D",
  },
  nutritionValue: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginTop: 4,
  },
  deliveryInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E6F7FF",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  deliveryTag: {
    backgroundColor: "#CCEEFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#007BFF",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  customListContainer: {
    paddingVertical: 5,
  },
  customItem: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  customImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  customName: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 4,
  },
  customPrice: {
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
    textAlign: "center",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonSelected: {
    backgroundColor: "#FE8C00",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    marginTop: 20,
  },
  qtyButton: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 15,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 22,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  cartButton: {
    marginTop: 20,
    backgroundColor: "#FE8C00",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MenuItemDetail;