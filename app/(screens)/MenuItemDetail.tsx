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
import {getMenuItem, getSides, getToppings, addFavorite, removeFavorite, getFavorites} from "@/lib/supabase";
import {useCartStore} from "@/store/cart.store";
import {useFavoritesStore} from "@/store/favorite.store";
import useAuthStore from "@/store/auth.store";
import {CartCustomization} from "@/type";
import * as Sentry from "@sentry/react-native";
import {router, useLocalSearchParams} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, Alert} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  calories: number;
  protein: number;
  ingredients?: string[];
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
  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { addFavorite: addToStore, removeFavorite: removeFromStore } = useFavoritesStore();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [sides, setSides] = useState<CustomizationItem[]>([]);
  const [toppings, setToppings] = useState<CustomizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustoms, setSelectedCustoms] = useState<CartCustomization[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Subscribe to favorites store for real-time updates
  const isFavoriteInStore = useFavoritesStore((state) => state.isFavorite(item?.id || ""));

  // Sync local state with store
  useEffect(() => {
    if (item?.id) {
      setIsFavorite(isFavoriteInStore);
    }
  }, [isFavoriteInStore, item?.id]);

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

      // Check favorite status
      if (user?.id && menuItem?.id) {
        checkFavoriteStatus(menuItem.id);
      }
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

  /**
   * Check if item is in user's favorites
   */
  const checkFavoriteStatus = async (itemId: string) => {
    try {
      if (!user?.id) return;

      console.log("[MenuItemDetail] Checking favorite status for item:", itemId);
      const favorites = await getFavorites(user.id);
      const isFav = favorites.some((fav: any) => fav.menu_item_id === itemId || fav.menu_item?.id === itemId);
      
      console.log("[MenuItemDetail] Favorite status:", isFav);
      setIsFavorite(isFav);
      
      // Update store
      if (isFav) {
        addToStore(itemId);
      } else {
        removeFromStore(itemId);
      }
    } catch (error: any) {
      console.error("[MenuItemDetail] Error checking favorite status:", error);
      // Don't show alert for check errors
    }
  };

  /**
   * Toggle favorite status
   */
  const toggleFavorite = async () => {
    if (!user?.id || !item?.id) {
      Alert.alert("Error", "Please login to add favorites");
      return;
    }

    try {
      console.log("[MenuItemDetail] Toggling favorite for item:", item.id, "Current:", isFavorite);

      if (isFavorite) {
        console.log("[MenuItemDetail] Removing favorite...");
        // Update database first
        await removeFavorite(user.id, item.id);
        // Then update local store (this will trigger re-renders everywhere)
        removeFromStore(item.id);
        setIsFavorite(false);
        console.log("[MenuItemDetail] Favorite removed successfully");
      } else {
        console.log("[MenuItemDetail] Adding favorite...");
        // Update database first
        await addFavorite(user.id, item.id);
        // Then update local store (this will trigger re-renders everywhere)
        addToStore(item.id);
        setIsFavorite(true);
        console.log("[MenuItemDetail] Favorite added successfully");
      }
    } catch (error: any) {
      console.error("[MenuItemDetail] Error toggling favorite:", error);
      
      Sentry.captureException(error, {
        tags: { component: "MenuItemDetail", action: "toggleFavorite" },
        extra: { itemId: item.id, userId: user.id, errorMessage: error?.message },
      });

      Alert.alert("Error", error.message || "Failed to update favorite. Please try again.");
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
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image with Dark Overlay */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || images.placeholder }}
            style={styles.itemImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          
          {/* Header Content on Image */}
          <View style={styles.imageHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#EF4444" : "#fff"} 
              />
            </TouchableOpacity>
          </View>

          {/* Rating Badge on Image */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color="#FFA500" />
            <Text style={styles.ratingBadgeText}>{item.rating?.toFixed(1) || "4.5"}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          {/* Title and Price */}
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.categoryBadge}>
                <Ionicons name="restaurant-outline" size={14} color="#FE8C00" />
                <Text style={styles.categoryText}>{item.category?.name || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{item.description}</Text>

          {/* Ingredients Section */}
          {item.ingredients && item.ingredients.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list-outline" size={20} color="#FE8C00" />
                <Text style={styles.sectionTitle}>Ingredients</Text>
              </View>
              <View style={styles.ingredientsContainer}>
                {item.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientTag}>
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Nutrition Info */}
          <View style={styles.nutrition}>
            <View style={styles.nutritionItem}>
              <View style={styles.nutritionIcon}>
                <Ionicons name="flame-outline" size={20} color="#FE8C00" />
              </View>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{item.calories || 0} Cal</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <View style={styles.nutritionIcon}>
                <Ionicons name="barbell-outline" size={20} color="#FE8C00" />
              </View>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{item.protein || 0}g</Text>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryItem}>
              <Ionicons name="car-outline" size={18} color="#10B981" />
              <Text style={styles.deliveryText}>Free Delivery</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Ionicons name="time-outline" size={18} color="#3B82F6" />
              <Text style={styles.deliveryText}>20-30 mins</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Ionicons name="star" size={18} color="#FFA500" />
              <Text style={styles.deliveryText}>{item.rating?.toFixed(1) || "4.5"}</Text>
            </View>
          </View>

          {/* Customizations Section */}
          {Object.keys(groupedCustoms).length > 0 && (
            <>
              {Object.keys(groupedCustoms).map((type) => (
                <View key={type} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons 
                      name={type === 'side' ? 'restaurant-outline' : 'add-circle-outline'} 
                      size={20} 
                      color="#FE8C00" 
                    />
                    <Text style={styles.sectionTitle}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}s
                    </Text>
                  </View>
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
            </>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => {
                  const newQty = Math.max(1, quantity - 1);
                  console.log("[MenuItemDetail] Decreasing quantity:", newQty);
                  setQuantity(newQty);
                }}
                style={[styles.qtyButton, quantity === 1 && styles.qtyButtonDisabled]}
                disabled={quantity === 1}
              >
                <Ionicons name="remove" size={20} color={quantity === 1 ? "#999" : "#1A1A1A"} />
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
                <Ionicons name="add" size={20} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Price Display */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>R {totalPrice.toFixed(2)}</Text>
          </View>

          {/* Add to Cart Button */}
          <CustomButton
            title={`Add to Cart - R ${totalPrice.toFixed(2)}`}
            onPress={handleAddToCart}
            style={styles.cartButton}
            leftIcon={<Ionicons name="cart-outline" size={20} color="#fff" style={{ marginRight: 8 }} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginTop: 12,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  // Hero Image Section
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 350,
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  imageHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 40,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    zIndex: 1,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  // Details Container
  detailsContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  // Title Section
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 8,
    lineHeight: 34,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFF5E6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#999",
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  description: {
    fontSize: 16,
    fontFamily: "Quicksand-Regular",
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  // Section Styles
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  // Ingredients Section
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ingredientText: {
    fontSize: 13,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
  },
  // Nutrition Section
  nutrition: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  nutritionItem: {
    alignItems: "center",
    flex: 1,
  },
  nutritionIcon: {
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  nutritionDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  // Delivery Info
  deliveryInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  deliveryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deliveryText: {
    fontSize: 13,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  // Customizations
  customListContainer: {
    paddingVertical: 5,
  },
  customItem: {
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  customImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  customName: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 4,
  },
  customPrice: {
    fontSize: 11,
    fontFamily: "Quicksand-SemiBold",
    color: "#FE8C00",
    textAlign: "center",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonSelected: {
    backgroundColor: "#FE8C00",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
  },
  // Quantity Section
  quantitySection: {
    marginTop: 24,
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  qtyButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 20,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  qtyButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    minWidth: 40,
    textAlign: "center",
  },
  // Total Price
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  totalPrice: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  // Cart Button
  cartButton: {
    marginTop: 8,
  },
});

export default MenuItemDetail;