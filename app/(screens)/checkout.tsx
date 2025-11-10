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
import { Ionicons } from "@expo/vector-icons";

export default function Checkout() {
  const { user } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: user?.address || "",
    phone: user?.phone || "",
    notes: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
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
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
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

      // For development: Accept any card details (dummy validation)
      // In production, this would validate actual card details
      if (!form.cardNumber || !form.cardName || !form.expiryDate || !form.cvv) {
        console.warn("[Checkout] Validation failed: missing payment details");
        Alert.alert("Error", "Please fill in all payment details");
        return;
      }

      // Dummy card validation for development
      // Accept any card number, name, expiry (MM/YY), and CVV
      console.log("[Checkout] Payment details (dummy validation):", {
        cardNumber: form.cardNumber.replace(/\s/g, "").substring(0, 4) + "****",
        cardName: form.cardName,
        expiryDate: form.expiryDate,
        cvv: "***",
      });

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
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={24} color="#FE8C00" />
            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>
          <View style={styles.devNotice}>
            <Ionicons name="information-circle-outline" size={16} color="#3B82F6" />
            <Text style={styles.devNoticeText}>
              Development Mode: Any card details will be accepted
            </Text>
          </View>

          <Text style={styles.label}>Card Number *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputWithIcon]}
              value={form.cardNumber}
              onChangeText={(text) => {
                // Format card number with spaces every 4 digits
                const formatted = text.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
                setForm({ ...form, cardNumber: formatted });
              }}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <Text style={styles.label}>Cardholder Name *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputWithIcon]}
              value={form.cardName}
              onChangeText={(text) => setForm({ ...form, cardName: text })}
              placeholder="John Doe"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Expiry Date *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={form.expiryDate}
                  onChangeText={(text) => {
                    // Format as MM/YY
                    let formatted = text.replace(/\D/g, "");
                    if (formatted.length >= 2) {
                      formatted = formatted.substring(0, 2) + "/" + formatted.substring(2, 4);
                    }
                    setForm({ ...form, expiryDate: formatted });
                  }}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>CVV *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={form.cvv}
                  onChangeText={(text) => {
                    const formatted = text.replace(/\D/g, "").substring(0, 3);
                    setForm({ ...form, cvv: formatted });
                  }}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={24} color="#FE8C00" />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Subtotal</Text>
              <Text style={styles.rowValue}>R {totalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowLabelContainer}>
                <Ionicons name="car-outline" size={16} color="#666" />
                <Text style={styles.rowLabel}>Delivery Fee</Text>
              </View>
              <Text style={styles.rowValue}>R {deliveryFee.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowLabelContainer}>
                <Ionicons name="pricetag-outline" size={16} color="#10B981" />
                <Text style={styles.rowLabel}>Discount</Text>
              </View>
              <Text style={[styles.rowValue, styles.discount]}>
                -R {discount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R {finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <CustomButton
          title={loading ? "Processing Order..." : `Place Order - R ${finalTotal.toFixed(2)}`}
          onPress={handleCheckout}
          disabled={loading}
          style={styles.button}
          leftIcon={
            !loading && (
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            )
          }
          isLoading={loading}
        />
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  devNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  devNoticeText: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#3B82F6",
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  rowLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    color: "#10B981",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  loader: {
    marginTop: 20,
  },
});
