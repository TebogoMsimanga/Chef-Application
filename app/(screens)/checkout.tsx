/**
 * Checkout Screen
 * 
 * Allows users to place orders with delivery information.
 * Creates order and order items in Supabase.
 * 
 * @component
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import CustomHeader from "@/components/CustomHeader";
import CustomButton from "@/components/CustomButton";
import { useCartStore } from "@/store/cart.store";
import useAuthStore from "@/store/auth.store";
import { createOrder, getSupabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function Checkout() {
  const { user } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: user?.address || "",
    phone: user?.phone || "",
    notes: "",
  });

  console.log("[Checkout] Screen rendered");

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      console.log("[Checkout] User data loaded, updating form");
      setForm({
        address: user.address || "",
        phone: user.phone || "",
        notes: "",
      });
    }
  }, [user]);

  const totalPrice = getTotalPrice();
  const deliveryFee = 50;
  const discount = 15;
  const finalTotal = totalPrice + deliveryFee - discount;

  console.log("[Checkout] Order summary:", {
    items: items.length,
    totalPrice: totalPrice.toFixed(2),
    finalTotal: finalTotal.toFixed(2),
  });

  /**
   * Handle order placement
   * Creates order and order items in Supabase
   */
  const handleCheckout = async () => {
    try {
      console.log("[Checkout] Starting checkout process...");

      // Validate form
      if (!form.address || !form.phone) {
        console.warn("[Checkout] Validation failed: missing required fields");
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      if (!user?.id) {
        console.error("[Checkout] User not authenticated");
        Alert.alert("Error", "Please sign in to place an order");
        return;
      }

      if (items.length === 0) {
        console.warn("[Checkout] Cannot checkout with empty cart");
        Alert.alert("Error", "Your cart is empty");
        return;
      }

      setLoading(true);
      console.log("[Checkout] Creating order...");

      // Create order
      const orderData = {
        user_id: user.id,
        total: finalTotal,
        status: "pending",
        delivery_address: form.address,
        phone: form.phone,
        notes: form.notes || null,
      };

      const order = await createOrder(orderData);
      console.log("[Checkout] Order created:", order.id);

      // Create order items using Supabase client
      const supabase = getSupabase();
      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        customizations: item.customizations || [],
      }));

      console.log("[Checkout] Creating", orderItems.length, "order items...");

      // Insert all order items
      const { data: insertedItems, error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error("[Checkout] Error creating order items:", itemsError);
        throw itemsError;
      }

      console.log("[Checkout] Order items created:", insertedItems?.length || 0);
      console.log("[Checkout] Order placed successfully");

      // Clear cart
      clearCart();

      // Navigate to success screen
      router.replace("/success");
    } catch (error: any) {
      console.error("[Checkout] Error placing order:", error);
      
      // Log to Sentry
      Sentry.captureException(error, {
        tags: { component: "Checkout", action: "handleCheckout" },
        extra: {
          userId: user?.id,
          itemsCount: items.length,
          errorMessage: error?.message,
        },
      });

      Alert.alert("Error", error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
      console.log("[Checkout] Checkout process completed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <CustomHeader title="Checkout" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>

          <Text style={styles.label}>Delivery Address *</Text>
          <TextInput
            style={styles.input}
            value={form.address}
            onChangeText={(text) => setForm({ ...form, address: text })}
            placeholder="Enter your delivery address"
            multiline
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Order Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.notes}
            onChangeText={(text) => setForm({ ...form, notes: text })}
            placeholder="Any special instructions?"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Subtotal</Text>
            <Text style={styles.rowValue}>R {totalPrice.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivery Fee</Text>
            <Text style={styles.rowValue}>R {deliveryFee.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Discount</Text>
            <Text style={[styles.rowValue, styles.discount]}>
              -R {discount.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R {finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        <CustomButton
          title={loading ? "Processing..." : "Place Order"}
          onPress={handleCheckout}
          disabled={loading}
          style={styles.button}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color="#FE8C00"
            style={styles.loader}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  rowValue: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  discount: {
    color: "#16A34A",
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  button: {
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});
