import {Image, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {images} from "@/constants";
import {router} from "expo-router";

const AddButton = () => {
  return (
    <TouchableOpacity style={styles.cartBtn} onPress={() => router.push("/edit")}>
      <Image
        source={images.plus}
        style={styles.cartIcon}
        resizeMode="contain"
      />

    </TouchableOpacity>
  );
}

export default AddButton;

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
