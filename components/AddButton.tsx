import {StyleSheet} from "react-native";
import React from "react";
import {router} from "expo-router";
import CustomButton from "./CustomButton";
import {Ionicons} from "@expo/vector-icons";

const AddButton = () => {
  return (
    <CustomButton
      title="Edit Menu"
      onPress={() => router.push("/edit")}
      leftIcon={<Ionicons name="add" size={20} color="#fff" style={styles.icon} />}
      style={styles.button}
    />
  );
}

export default AddButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "auto",
    minWidth: 120,
  },
  icon: {
    marginRight: 6,
  },
});
