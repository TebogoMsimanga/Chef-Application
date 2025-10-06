import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../utils/Colors";

const STICKERS = ["Hot", "Spicy", "Mild", "Special"];

export default function Sticker({ type }: { type?: string }) {
  const label = type || STICKERS[Math.floor(Math.random() * STICKERS.length)];
  let bg = Colors.primary;
  if (label === "Hot") bg = "#ff3b30";
  else if (label === "Spicy") bg = "#ff9500";
  else if (label === "Mild") bg = "#34c759";
  else if (label === "Special") bg = Colors.primary;
  return (
    <View style={[styles.sticker, { backgroundColor: bg }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sticker: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 2,
    marginLeft: 2,
    marginRight: 2,
    elevation: 2,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 1,
  },
});
