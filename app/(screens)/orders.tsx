/**
 * Orders Screen
 * 
 * Displays user's order history with:
 * - Order details (date, status, total)
 * - Order items with images and quantities
 * - Order status badges
 * - Delivery information
 * 
 * @component
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import CustomHeader from "@/components/CustomHeader";
import { getOrders } from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menu_item: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  customizations?: any[];
}

interface Order {
  id: string;
  total: number;
  status: string;
  delivery_address: string;
  phone: string;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
}

export default function Orders() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to sign-in if not authenticated
  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !isAuthenticated) {
        console.log("[Orders] User not authenticated, redirecting to sign-in");
        router.replace("/(auth)/sign-in");
      }
    }, [isAuthenticated, isLoading])
  );

  // Show loading or redirect if not authenticated
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FE8C00" />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useFocusEffect
  }

  console.log("[Orders] Screen rendered");

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user]);

  /**
   * Load user's orders from database
   */
  const loadOrders = async () => {
    try {
      console.log("[Orders] Loading orders for user:", user?.id);
      setLoading(true);

      if (!user?.id) {
        console.warn("[Orders] No user ID, cannot load orders");
        setLoading(false);
        return;
      }

      const ordersData = await getOrders(user.id);
      console.log("[Orders] Orders loaded:", ordersData.length);
      setOrders(ordersData || []);
    } catch (error: any) {
      console.error("[Orders] Error loading orders:", error);
      Sentry.captureException(error, {
        tags: { component: "Orders", action: "loadOrders" },
        extra: { userId: user?.id, errorMessage: error?.message },
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle pull to refresh
   */
  const handleRefresh = async () => {
    try {
      console.log("[Orders] Refreshing orders...");
      setRefreshing(true);
      await loadOrders();
    } catch (error: any) {
      console.error("[Orders] Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#F59E0B";
      case "preparing":
        return "#3B82F6";
      case "ready":
        return "#10B981";
      case "delivered":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "time-outline";
      case "preparing":
        return "restaurant-outline";
      case "ready":
        return "checkmark-circle-outline";
      case "delivered":
        return "checkmark-done-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return "Today";
      } else if (diffDays === 2) {
        return "Yesterday";
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
      }
    } catch (error) {
      return dateString;
    }
  };

  /**
   * Render order item
   */
  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItemContainer}>
      <Image
        source={{
          uri: item.menu_item?.image || images.placeholder,
        }}
        style={styles.orderItemImage}
        defaultSource={images.placeholder}
      />
      <View style={styles.orderItemInfo}>
        <Text style={styles.orderItemName} numberOfLines={2}>
          {item.menu_item?.name || "Unknown Item"}
        </Text>
        <Text style={styles.orderItemQuantity}>
          Quantity: {item.quantity}
        </Text>
        {item.customizations && item.customizations.length > 0 && (
          <Text style={styles.orderItemCustomizations}>
            {item.customizations.length} customization
            {item.customizations.length > 1 ? "s" : ""}
          </Text>
        )}
      </View>
      <Text style={styles.orderItemPrice}>
        R {(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  /**
   * Render order card
   */
  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <View style={styles.orderIdContainer}>
            <Ionicons name="receipt-outline" size={18} color="#FE8C00" />
            <Text style={styles.orderId}>Order #{item.id.substring(0, 8)}</Text>
          </View>
          <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={14}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.status?.toUpperCase() || "UNKNOWN"}
          </Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.orderItemsContainer}>
        {item.order_items?.map((orderItem) => (
          <View key={orderItem.id} style={styles.orderItemRow}>
            <Image
              source={{
                uri: orderItem.menu_item?.image || images.placeholder,
              }}
              style={styles.orderItemImageSmall}
              defaultSource={images.placeholder}
            />
            <View style={styles.orderItemDetails}>
              <Text style={styles.orderItemNameSmall} numberOfLines={1}>
                {orderItem.menu_item?.name || "Unknown Item"}
              </Text>
              <Text style={styles.orderItemMeta}>
                {orderItem.quantity}x • R {orderItem.price.toFixed(2)} each
              </Text>
            </View>
            <Text style={styles.orderItemPriceSmall}>
              R {(orderItem.price * orderItem.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Delivery Info */}
      {item.delivery_address && (
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryInfoRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.deliveryInfoText} numberOfLines={2}>
              {item.delivery_address}
            </Text>
          </View>
          {item.phone && (
            <View style={styles.deliveryInfoRow}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.deliveryInfoText}>{item.phone}</Text>
            </View>
          )}
        </View>
      )}

      {/* Order Footer */}
      <View style={styles.orderFooter}>
        <View style={styles.orderTotalContainer}>
          <Text style={styles.orderTotalLabel}>Total</Text>
          <Text style={styles.orderTotal}>R {item.total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <CustomHeader title="My Orders" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FE8C00" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <CustomHeader title="My Orders" />
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Your order history will appear here
            </Text>
            <Text
              style={styles.emptyButton}
              onPress={() => router.push("/")}
            >
              Start Shopping
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FE8C00"]}
            tintColor="#FE8C00"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  orderDate: {
    fontSize: 13,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Quicksand-Bold",
  },
  orderItemsContainer: {
    marginBottom: 16,
  },
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  orderItemImageSmall: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemNameSmall: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  orderItemMeta: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  orderItemPriceSmall: {
    fontSize: 14,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  orderItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 15,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 13,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  orderItemCustomizations: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#FE8C00",
    marginTop: 4,
  },
  orderItemPrice: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  deliveryInfo: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  deliveryInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  deliveryInfoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 16,
  },
  orderTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotalLabel: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  orderTotal: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  emptyButton: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FE8C00",
  },
});

