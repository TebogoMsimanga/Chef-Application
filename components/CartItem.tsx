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
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>R{item.price.toFixed(2)}</Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              onPress={handleDecreaseQty}
              style={styles.qtyBtn}
            >
              <Image
                source={images.minus}
                style={styles.qtyIcon}
                resizeMode="contain"
                tintColor="#FF9C01"
              />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={handleIncreaseQty}
              style={styles.qtyBtn}
            >
              <Image
                source={images.plus}
                style={styles.qtyIcon}
                resizeMode="contain"
                tintColor="#FF9C01"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleRemoveItem}
        style={styles.deleteBtn}
      >
        <Image
          source={images.trash}
          style={styles.deleteIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  imageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: "rgba(255, 152, 1, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "80%",
    borderRadius: 12,
  },
  info: {
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF9C01",
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255, 152, 1, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyIcon: {
    width: 16,
    height: 16,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
});
