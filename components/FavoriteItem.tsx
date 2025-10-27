import { useCartStore } from "@/store/cart.store";
import { useFavoritesStore } from "@/store/favorite.store";
import { MenuItem } from "@/type";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { images } from "@/constants";

const FavoriteItem = ({ item, onRemove }: { item: MenuItem; onRemove: (id: string) => void }) => {
  const { addItem } = useCartStore();
  const { removeFavorite } = useFavoritesStore();

  const handleRemove = () => {
    onRemove(item.$id);  // Optimistic local remove
    removeFavorite(item.$id);  // Store update, triggers refetch
  };

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
          <Text style={styles.price}>R{item.price.toFixed(2)}</Text>

          <TouchableOpacity
            onPress={() => addItem({
              id: item.$id,
              name: item.name,
              price: item.price,
              image_url: item.image_url,
              customizations: [],
            })}
            style={styles.addBtn}
          >
            <Text style={styles.addText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleRemove}
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
export default FavoriteItem;

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
  addBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FF9C01",
    borderRadius: 8,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
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