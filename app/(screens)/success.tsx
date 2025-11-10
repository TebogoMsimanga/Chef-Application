import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { images } from "@/constants";

export default function Success() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Image source={images.success} style={styles.image} resizeMode="contain" />
        
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Your order has been confirmed and will be delivered soon.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            You will receive a confirmation email shortly.
          </Text>
          <Text style={styles.infoText}>
            Estimated delivery time: 20-30 minutes
          </Text>
        </View>

        <CustomButton
          title="Back to Home"
          onPress={() => router.replace("/")}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: "#F3F4F6",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
    textAlign: "center",
    marginVertical: 4,
  },
  button: {
    width: "100%",
  },
});
