import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { cartStore } from "../store/cartStore";
import { Colors } from "../utils/Colors";
import { Meal } from "../utils/data";
import { setNavigationBarColor } from "../utils/setNavigationBar";
import QuantitySlider from "./QuantitySlider";
import Sticker from "./Sticker";
import Toast from "./Toast";


const { width, height } = Dimensions.get("window");

export default function MealViewScreen() {
  const route = useRoute();
  const router = useRouter();
  
  const params = (route as any).params || {};
  const meal: Meal = params.meal;
  const [quantity, setQuantity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(cartStore.cart.length);

  useEffect(() => {
    setNavigationBarColor("#222");
    // Sync cart count with global store
    cartStore.setCart = (meals) => {
      cartStore.cart = meals;
      setCartCount(meals.length);
    };
    cartStore.clearCart = () => {
      cartStore.cart = [];
      setCartCount(0);
    };
    // Listen for cart changes from other screens
    const interval = setInterval(() => {
      setCartCount(cartStore.cart.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Dummy data for views (since not in Meal type)
  const views = 123;
  const rating = meal?.rating || 4.5;

  // Discount logic: hardcoded by category
  // Example: Breakfast 10%, Lunch 15%, Dinner 20%
  const categoryDiscounts: Record<string, number> = {
    Breakfast: 0.1,
    Lunch: 0.15,
    Dinner: 0.2,
  };
  const discount = categoryDiscounts[meal.category] || 0;
  const discountValue = meal ? meal.price * quantity * discount : 0;
  const discountedPrice = meal ? meal.price * quantity - discountValue : 0;

  if (!meal) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, color: Colors.primary }}>
          No meal data found.
        </Text>
      </View>
    );
  }

  // Use meal.description as subtitle, and a lengthy gray description below
  const subtitle = meal.description;
  const longDescription = `Indulge in our chef's special, crafted with the finest ingredients and a touch of love. Each bite offers a delightful blend of flavors and textures, making it a perfect choice for any time of day. Enjoy a generous portion, beautifully presented and sure to satisfy your cravings. Whether you're starting your morning or treating yourself to a cozy meal, this dish is a customer favorite for a reason. Served fresh, hot, and ready to brighten your day.\n\nAllergens: Contains gluten, dairy, and eggs. Please inform us of any allergies.`;

  const handleShare = () => {
    Share.share({
      message: `Check out this meal: ${meal.name}\n${meal.description}`,
    });
    Toast.show({ type: "info", text1: "Share link copied!" });
  };
  const handleReport = () => {
    Toast.show({ type: "success", text1: "Meal reported. Thank you!" });
  };
  // Add to cart and navigate
  const handleAddToCart = () => {
    let updated = [...cartStore.cart];
    // Only add if not already in cart
    if (!updated.some((m) => m.id === meal.id)) {
      updated.push(meal);
      cartStore.setCart([...updated]); // force re-render everywhere
      setCartCount(updated.length);
      Toast.show({
        type: "success",
        text1: "Order added to cart!",
        text2: `R ${discountedPrice.toFixed(2)}${
          discount > 0 ? ` (Discount: -R ${discountValue.toFixed(2)})` : ""
        }`,
      });
    } else {
      Toast.show({
        type: "info",
        text1: "Meal already in cart",
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Overlay to close menu when clicking outside */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.menuOverlay} />
        </TouchableWithoutFeedback>
      )}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setMenuOpen((v) => !v)}
          activeOpacity={1}
        >
          <Ionicons name="ellipsis-vertical" size={26} color={Colors.primary} />
        </TouchableOpacity>
        {menuOpen && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
              <Text style={styles.menuText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleReport}>
              <Text style={styles.menuText}>Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableWithoutFeedback onPress={() => menuOpen && setMenuOpen(false)}>
        <ImageBackground
          source={
            typeof meal.image === "string" ? { uri: meal.image } : meal.image
          }
          style={styles.image}
          imageStyle={{
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </TouchableWithoutFeedback>
      <View style={styles.drawer}>
        <View style={styles.headerRow}>
          <Text style={styles.mealName}>{meal.name}</Text>
        </View>
        <View style={styles.stickerRow}>
          <Sticker type="Special" />
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          <View style={styles.viewsRowRight}>
            <Ionicons name="eye" size={20} color={Colors.primary} />
            <Text style={styles.viewsText}>{views}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {/* Nutritional Information */}
        {meal.nutritionalInfo && (
          <View style={styles.nutritionContainer}>
            <Text style={styles.sectionTitle}>Nutritional Information</Text>
            <View style={styles.nutritionGrid}>
              {meal.nutritionalInfo.calories && (
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {meal.nutritionalInfo.calories}
                  </Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
              )}
              {meal.nutritionalInfo.protein && (
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {meal.nutritionalInfo.protein}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
              )}
              {meal.nutritionalInfo.carbs && (
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {meal.nutritionalInfo.carbs}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
              )}
              {meal.nutritionalInfo.fats && (
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {meal.nutritionalInfo.fats}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Fats</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Ingredients */}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsGrid}>
              {meal.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.descriptionTitle}>Description</Text>
        <Text
          style={styles.descriptionText}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {longDescription}
        </Text>
      {/* Cart button and quantity at the bottom */}
    <View style={styles.bottomBar}>
        <QuantitySlider
          value={quantity}
          setValue={setQuantity}
          min={1}
          max={10}
        />
        <View
          style={{
            flex: 1,
            position: "relative",
            marginLeft: 12,
            maxWidth: 260,
          }}
        >
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <Ionicons
              name="cart"
              size={28}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            {/* Cart notification bubble */}
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
            <Text style={styles.priceText}>R {discountedPrice.toFixed(2)}</Text>
          </TouchableOpacity>
          {discount > 0 && (
            <View style={styles.discountSticker}>
              <Text style={styles.discountPillText}>
                -R {discountValue.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  nutritionContainer: {
    marginTop: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  nutritionItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    maxWidth: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  ingredientsContainer: {
    marginTop: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
  },
  ingredientsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  ingredientText: {
    fontSize: 14,
    color: "#444",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  image: {
    width: width,
    height: height * 0.25, // Reduced to 1/4 of screen height
    justifyContent: "flex-end",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 38,
    paddingBottom: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  backBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 2,
    marginRight: 8,
  },
  menuBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 2,
    marginLeft: 8,
  },
  menuDropdown: {
    position: "absolute",
    top: 48,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 120,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  // priceWrap removed, priceText is now directly in cartBtn
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  // overlayFull removed, use overlay only for image
  drawer: {
    flex: 1,
    marginTop: -32,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 100, // Added more padding at bottom for content
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mealName: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    flex: 1,
  },
  stickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    gap: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginLeft: 4,
  },
  viewsRowRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 0,
    gap: 4,
  },
  viewsText: {
    fontSize: 15,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: "600",
  },
  descriptionScroll: {
    marginBottom: 18,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    gap: 16,
    marginTop: 20,
  },
  discountPill: {
    // old pill style, now used for text only
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  discountSticker: {
    position: "absolute",
    top: -16,
    right: 0,
    backgroundColor: "#34c759",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  discountPillText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    marginLeft: 12,
    flex: 1,
    justifyContent: "space-between",
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    minWidth: 180,
    maxWidth: 260,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 0,
    marginTop: 10,
    letterSpacing: 0.2,
  },
  descriptionText: {
    fontSize: 15,
    color: "#888",
    lineHeight: 22,
    marginBottom: 0,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 16,
  },
  // cartBtn style already defined above, removed duplicate
  cartBtnTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 8,
  },
  cartBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
    backgroundColor: "#34c759",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 12,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.01)",
    zIndex: 99,
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: 18,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
