import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAdminStore } from "../../store/adminStore";
import { Colors } from "../../utils/Colors";

export default function AnalyticsScreen() {
  const router = useRouter();
  const { analytics } = useAdminStore();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewCard}>
            <Ionicons name="cart" size={24} color={Colors.primary} />
            <Text style={styles.overviewValue}>{analytics.totalOrders}</Text>
            <Text style={styles.overviewLabel}>Total Orders</Text>
          </View>

          <View style={styles.overviewCard}>
            <Ionicons name="cash" size={24} color={Colors.primary} />
            <Text style={styles.overviewValue}>
              R{analytics.totalRevenue.toFixed(2)}
            </Text>
            <Text style={styles.overviewLabel}>Total Revenue</Text>
          </View>
        </View>

        {/* Popular Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          {analytics.popularItems.length > 0 ? (
            analytics.popularItems.map((item, index) => (
              <View key={item.mealId} style={styles.popularItem}>
                <Text style={styles.itemRank}>#{index + 1}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Item {item.mealId}</Text>
                  <Text style={styles.itemOrders}>{item.count} orders</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No data available</Text>
          )}
        </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  overviewContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginVertical: 8,
  },
  overviewLabel: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  popularItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemRank: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemOrders: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
});
