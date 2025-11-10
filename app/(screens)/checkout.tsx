import React, { useState } from "react";
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
import CustomHeader from "@/components/CustomHeader";
import CustomButton from "@/components/CustomButton";
import { useCartStore } from "@/store/cart.store";
import useAuthStore from "@/store/auth.store";
import { createOrder } from "@/lib/supabase";
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

  const totalPrice = getTotalPrice();
  const deliveryFee = 50;
  const discount = 15;
  const finalTotal = totalPrice + deliveryFee - discount;

  const handleCheckout = async () => {
    if (!form.address || !form.phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        user_id: user?.id,
        total: finalTotal,
        status: "pending",
        delivery_address: form.address,
        phone: form.phone,
        notes: form.notes,
      };

      const order = await createOrder(orderData);

      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        customizations: item.customizations || [],
      }));

      for (const orderItem of orderItems) {
        await fetch(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/order_items`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify(orderItem),
          }
        );
      }

      clearCart();
      router.replace("/success");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
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
