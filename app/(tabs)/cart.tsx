/**
 * Cart Screen
 * 
 * Displays shopping cart with all items, quantities, and totals.
 * Shows payment summary and allows navigation to checkout.
 * 
 * @component
 */

import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useCartStore} from "@/store/cart.store";
import CustomHeader from "@/components/CustomHeader";
import {PaymentInfoProps} from "@/type";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";
import * as Sentry from "@sentry/react-native";
import {StatusBar} from "expo-status-bar";
import {images} from "@/constants";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {getDeliveryFee, getDiscount} from "@/lib/supabase";

/**
 * Payment Info Component
 * Displays a label-value pair for payment summary
 */
const PaymentInfo = ({ label, value }: PaymentInfoProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function Cart() {
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [discount, setDiscount] = useState(15);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  console.log("[Cart] Screen rendered with items:", items.length);

  // Fetch delivery fee and discount from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log("[Cart] Fetching app settings...");
        setLoadingSettings(true);
        
        const [fee, disc] = await Promise.all([
          getDeliveryFee(),
          getDiscount()
        ]);

        console.log("[Cart] Settings fetched:", { deliveryFee: fee, discount: disc });
        setDeliveryFee(fee);
        setDiscount(disc);
      } catch (error: any) {
        console.error("[Cart] Error fetching settings:", error);
        Sentry.captureException(error, {
          tags: { component: "Cart", action: "fetchSettings" },
        });
        // Keep default values on error
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  // Log cart state changes
  useEffect(() => {
    console.log("[Cart] Cart updated:", {
      items: items.length,
      totalItems,
      totalPrice: totalPrice.toFixed(2),
      deliveryFee,
      discount,
      finalTotal: (totalPrice + deliveryFee - discount).toFixed(2),
    });
  }, [items, totalItems, totalPrice, deliveryFee, discount]);

  /**
   * Handle navigation to checkout
   */
  const handleCheckout = () => {
    try {
      console.log("[Cart] Navigating to checkout with", totalItems, "items");
      
      if (totalItems === 0) {
        console.warn("[Cart] Cannot checkout with empty cart");
        return;
      }

      router.push("/checkout");
    } catch (error: any) {
      console.error("[Cart] Error navigating to checkout:", error);
      Sentry.captureException(error, {
        tags: { component: "Cart", action: "handleCheckout" },
      });
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
      <StatusBar style="dark" />
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyImageContainer}>
              <Image
                source={images.emptyState}
                resizeMode="contain"
                style={styles.emptyImage}
              />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Start adding delicious meals to your cart!
            </Text>
            <CustomButton
              title="Browse Menu"
              onPress={() => router.push("/")}
              style={styles.emptyButton}
              leftIcon={<Ionicons name="restaurant-outline" size={20} color="#fff" style={{ marginRight: 8 }} />}
            />
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View style={styles.footerContainer}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="receipt-outline" size={24} color="#FE8C00" />
                  <Text style={styles.summaryTitle}>Payment Summary</Text>
                </View>

                <View style={styles.summaryContent}>
                  <PaymentInfo
                    label={`Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`}
                    value={`R ${totalPrice.toFixed(2)}`}
                  />

                  <View style={styles.summaryRow}>
                    <View style={styles.summaryRowLeft}>
                      <Ionicons name="car-outline" size={16} color="#666" />
                      <Text style={styles.summaryLabel}>Delivery Fee</Text>
                    </View>
                    <Text style={styles.summaryValue}>
                      {loadingSettings ? "..." : `R ${deliveryFee.toFixed(2)}`}
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <View style={styles.summaryRowLeft}>
                      <Ionicons name="pricetag-outline" size={16} color="#10B981" />
                      <Text style={styles.summaryLabel}>Discount</Text>
                    </View>
                    <Text style={[styles.summaryValue, styles.discountValue]}>
                      {loadingSettings ? "..." : `-R ${discount.toFixed(2)}`}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      {loadingSettings 
                        ? "..." 
                        : `R ${(totalPrice + deliveryFee - discount).toFixed(2)}`
                      }
                    </Text>
                  </View>
                </View>
              </View>
              
              <CustomButton
                title="Proceed to Checkout"
                onPress={handleCheckout}
                style={styles.checkoutButton}
                leftIcon={<Ionicons name="arrow-forward-outline" size={20} color="#fff" style={{ marginRight: 8 }} />}
              />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyImageContainer: {
    width: 280,
    height: 280,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: "100%",
    height: "100%",
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  emptyButton: {
    width: "100%",
    maxWidth: 300,
  },
  footerContainer: {
    gap: 20,
    marginTop: 24,
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  summaryContent: {
    gap: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  summaryRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  discountValue: {
    color: "#10B981",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
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
    fontSize: 22,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  checkoutButton: {
    width: "100%",
  },
});