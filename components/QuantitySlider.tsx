import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../utils/Colors";

export default function QuantitySlider({
  value,
  setValue,
  min = 1,
  max = 15,
}: {
  value: number;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <View style={styles.sliderRow}>
      <TouchableOpacity
        style={[styles.btn, value <= min && styles.disabled]}
        onPress={() => value > min && setValue(value - 1)}
        disabled={value <= min}
      >
        <Text style={styles.btnText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity
        style={[styles.btn, value >= max && styles.disabled]}
        onPress={() => value < max && setValue(value + 1)}
        disabled={value >= max}
      >
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f3f2",
    borderRadius: 10,
    padding: 6,
    marginVertical: 8,
    minWidth: 90,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.4,
  },
});
