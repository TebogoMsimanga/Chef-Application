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

export default function AdminProfileScreen() {
  const router = useRouter();
  const { users } = useAdminStore();

  const admin = users.find((user) => user.role === "admin");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Profile</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        {admin ? (
          <>
            {/* Profile Info */}
            <View style={styles.profileSection}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {admin.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.username}>{admin.username}</Text>
                <View style={styles.adminBadge}>
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={styles.adminText}>Administrator</Text>
                </View>
              </View>

              {/* Contact Information */}
              <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Ionicons name="mail" size={20} color={Colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Email</Text>
                      <Text style={styles.infoValue}>{admin.email}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.actionsContainer}>
                <Text style={styles.sectionTitle}>Management</Text>
                <View style={styles.actionsGrid}>
                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() =>
                      router.push({
                        pathname: "/admin/users",
                      })
                    }
                  >
                    <View style={styles.actionIcon}>
                      <Ionicons
                        name="people"
                        size={24}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={styles.actionTitle}>Manage Users</Text>
                    <Text style={styles.actionDesc}>
                      Edit user accounts and permissions
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() =>
                      router.push({
                        pathname: "/admin/menu",
                      })
                    }
                  >
                    <View style={styles.actionIcon}>
                      <Ionicons
                        name="restaurant"
                        size={24}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={styles.actionTitle}>Manage Menu</Text>
                    <Text style={styles.actionDesc}>
                      Update menu items and categories
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() =>
                      router.push({
                        pathname: "/admin/analytics",
                      })
                    }
                  >
                    <View style={styles.actionIcon}>
                      <Ionicons
                        name="analytics"
                        size={24}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={styles.actionTitle}>Analytics</Text>
                    <Text style={styles.actionDesc}>
                      View sales and performance data
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() =>
                      router.push({
                        pathname: "/profile/settings",
                      })
                    }
                  >
                    <View style={styles.actionIcon}>
                      <Ionicons
                        name="settings"
                        size={24}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={styles.actionTitle}>Settings</Text>
                    <Text style={styles.actionDesc}>
                      Configure system preferences
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={Colors.primary} />
            <Text style={styles.errorText}>Admin profile not found</Text>
          </View>
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
  },
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "600",
    color: "#fff",
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  adminText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  infoContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
    paddingHorizontal: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  actionDesc: {
    fontSize: 12,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 12,
  },
});
