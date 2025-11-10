/**
 * Cart Item Component
 * 
 * Displays a cart item with:
 * - Item image, name, price
 * - Quantity controls (increase/decrease)
 * - Remove from cart button
 * 
 * @component
 */

import {useCartStore} from "@/store/cart.store";
import {CartItemType} from "@/type";
import * as Sentry from "@sentry/react-native";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {images} from "@/constants";
import {Ionicons} from "@expo/vector-icons";

const CartItem = ({ item }: { item: CartItemType }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();

  /**
   * Handle decreasing quantity
   */
  const handleDecreaseQty = () => {
    try {
      console.log("[CartItem] Decreasing quantity for item:", item.id, "Current:", item.quantity);
      decreaseQty(item.id, item.customizations!);
      console.log("[CartItem] Quantity decreased");
    } catch (error: any) {
      console.error("[CartItem] Error decreasing quantity:", error);
      Sentry.captureException(error, {
        tags: { component: "CartItem", action: "handleDecreaseQty" },
        extra: { itemId: item.id },
      });
    }
  };

  /**
   * Handle increasing quantity
   */
  const handleIncreaseQty = () => {
    try {
      console.log("[CartItem] Increasing quantity for item:", item.id, "Current:", item.quantity);
      increaseQty(item.id, item.customizations!);
      console.log("[CartItem] Quantity increased");
    } catch (error: any) {
      console.error("[CartItem] Error increasing quantity:", error);
      Sentry.captureException(error, {
        tags: { component: "CartItem", action: "handleIncreaseQty" },
        extra: { itemId: item.id },
      });
    }
  };

  /**
   * Handle removing item from cart
   */
  const handleRemoveItem = () => {
    try {
      console.log("[CartItem] Removing item from cart:", item.id);
      removeItem(item.id, item.customizations!);
      console.log("[CartItem] Item removed from cart");
    } catch (error: any) {
      console.error("[CartItem] Error removing item:", error);
      Sentry.captureException(error, {
        tags: { component: "CartItem", action: "handleRemoveItem" },
        extra: { itemId: item.id },
      });
    }
  };

  // Calculate item total (price * quantity + customizations)
  const customizationPrice = (item.customizations || []).reduce(
    (sum, custom) => sum + custom.price,
    0
  );
  const itemTotal = (item.price + customizationPrice) * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.image_url || images.placeholder }}
            style={styles.image}
            resizeMode="cover"
            defaultSource={images.placeholder}
          />
          {item.customizations && item.customizations.length > 0 && (
            <View style={styles.customizationBadge}>
              <Ionicons name="options-outline" size={12} color="#fff" />
              <Text style={styles.customizationBadgeText}>{item.customizations.length}</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.unitPrice}>R {item.price.toFixed(2)} each</Text>
          {customizationPrice > 0 && (
            <Text style={styles.customizationText}>
              +R {customizationPrice.toFixed(2)} customizations
            </Text>
          )}

          <View style={styles.qtyRow}>
            <TouchableOpacity
              onPress={handleDecreaseQty}
              style={[styles.qtyBtn, item.quantity === 1 && styles.qtyBtnDisabled]}
              disabled={item.quantity === 1}
            >
              <Ionicons 
                name="remove" 
                size={18} 
                color={item.quantity === 1 ? "#999" : "#FE8C00"} 
              />
            </TouchableOpacity>

            <View style={styles.quantityContainer}>
              <Text style={styles.quantity}>{item.quantity}</Text>
            </View>

            <TouchableOpacity
              onPress={handleIncreaseQty}
              style={styles.qtyBtn}
            >
              <Ionicons name="add" size={18} color="#FE8C00" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.totalPrice}>R {itemTotal.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleRemoveItem}
        style={styles.deleteBtn}
      >
        <Ionicons name="trash-outline" size={22} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  left: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    flex: 1,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  customizationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(254, 140, 0, 0.9)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  customizationBadgeText: {
    fontSize: 10,
    fontFamily: "Quicksand-Bold",
    color: "#fff",
  },
  info: {
    flex: 1,
    justifyContent: "flex-start",
  },
  name: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 22,
  },
  unitPrice: {
    fontSize: 13,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    marginBottom: 2,
  },
  customizationText: {
    fontSize: 11,
    fontFamily: "Quicksand-Medium",
    color: "#FE8C00",
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE5CC",
  },
  qtyBtnDisabled: {
    opacity: 0.5,
    backgroundColor: "#F5F5F5",
    borderColor: "#E5E5E5",
  },
  quantityContainer: {
    minWidth: 30,
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
    marginTop: 4,
  },
  deleteBtn: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 8,
    marginLeft: 8,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
});
