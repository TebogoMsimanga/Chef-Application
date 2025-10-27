import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { images } from "@/constants";

const CartItem = ({ item }: { item: CartItemType }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>R{item.price}</Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              onPress={() => decreaseQty(item.id, item.customizations!)}
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
              onPress={() => increaseQty(item.id, item.customizations!)}
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
        onPress={() => removeItem(item.id, item.customizations!)}
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
