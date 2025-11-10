/**
 * Success Screen
 * 
 * Displays order confirmation after successful checkout.
 * Shows success message and delivery information.
 * 
 * @component
 */

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { images } from "@/constants";

export default function Success() {
  console.log("[Success] Screen rendered");

  useEffect(() => {
    console.log("[Success] Order placed successfully");
    
    // Log success event to Sentry
    Sentry.captureMessage("Order placed successfully", {
      level: "info",
      tags: { component: "Success", action: "orderPlaced" },
    });
  }, []);

  /**
   * Handle navigation back to home
   */
  const handleGoHome = () => {
    try {
      console.log("[Success] Navigating to home");
      router.replace("/");
    } catch (error: any) {
      console.error("[Success] Error navigating to home:", error);
      Sentry.captureException(error, {
        tags: { component: "Success", action: "handleGoHome" },
      });
    }
  };

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
          onPress={handleGoHome}
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
