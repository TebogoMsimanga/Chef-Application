import { TouchableOpacity, StyleSheet, Image, View, Text } from "react-native";
import React from "react";
import { images } from "@/constants";

export default function AddButton() {
  return (
    <TouchableOpacity style={styles.cartBtn} onPress={() => {}}>
      <Image
        source={images.plus}
        style={styles.cartIcon}
        resizeMode="contain"
      />

      {/* <View style={styles.cartIcon}>
        <Text>Add to menu</Text>
      </View> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FE8C00",
    backgroundColor: "#fff",
  },
  cartIcon: {
    width: 20,
    height: 20,
    position: "relative",
    top: 0,
    left: 0,
  },
});
