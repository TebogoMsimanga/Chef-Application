import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../utils/Colors";

// Dummy data for orders
const dummyOrders = [
  {
    id: "ORD001",
    date: "2025-09-12",
    status: "Delivered",
    totalAmount: 42.97,
    items: [
      {
        id: 1,
        name: "Margherita Pizza",
        quantity: 1,
        price: 15.99,
        image: require("../../assets/images/logo.png"),
      },
      {
        id: 2,
        name: "Pepperoni Pizza",
        quantity: 1,
        price: 18.99,
        image: require("../../assets/images/logo.png"),
      },
    ],
  },
  {
    id: "ORD002",
    date: "2025-09-10",
    status: "Delivered",
    totalAmount: 33.98,
    items: [
      {
        id: 3,
        name: "Veggie Supreme Pizza",
        quantity: 2,
        price: 16.99,
        image: require("../../assets/images/logo.png"),
      },
    ],
  },
  {
    id: "ORD003",
    date: "2025-09-08",
    status: "Delivered",
    totalAmount: 55.96,
    items: [
      {
        id: 4,
        name: "BBQ Chicken Pizza",
        quantity: 2,
        price: 19.99,
        image: require("../../assets/images/logo.png"),
      },
      {
        id: 5,
        name: "Garlic Bread",
        quantity: 2,
        price: 7.99,
        image: require("../../assets/images/logo.png"),
      },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "#4CAF50";
    case "processing":
      return "#2196F3";
    case "cancelled":
      return "#F44336";
    default:
      return Colors.primary;
  }
};

export default function OrderHistory() {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        {dummyOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) + "20" },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Order Items */}
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>
                    Quantity: {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                </View>
              </View>
            ))}

            {/* Order Footer */}
            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>
                R{order.totalAmount.toFixed(2)}
              </Text>
            </View>

            {/* Reorder Button */}
            <TouchableOpacity style={styles.reorderButton}>
              <Ionicons name="repeat" size={20} color={Colors.primary} />
              <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    gap: 8,
  },
  reorderText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary,
  },
});
