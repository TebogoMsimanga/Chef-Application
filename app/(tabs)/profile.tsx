/**
 * Profile Screen
 * 
 * Displays user profile information including:
 * - User avatar
 * - Name, email, phone, address, about
 * - Orders button (to be implemented)
 * - Logout functionality
 * 
 * @component
 */

import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert} from "react-native";
import React, {useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {InfoItemProps} from "@/type";
import useAuthStore from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";
import {StatusBar} from "expo-status-bar";
import {images} from "@/constants";
import {router} from "expo-router";

/**
 * Info Item Component
 * Displays a label-value pair with icon
 */
const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <View style={styles.infoItem}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon as any} size={20} color="#f7931a" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Not provided"}</Text>
    </View>
  </View>
);

export default function Profile() {
  const { user, isLoading, logout, fetchAuthenticatedUser } = useAuthStore();

  console.log("[Profile] Screen rendered");

  useEffect(() => {
    if (!user && !isLoading) {
      console.log("[Profile] No user found, fetching...");
      fetchAuthenticatedUser();
    }
  }, [user, isLoading, fetchAuthenticatedUser]);

  /**
   * Handle logout
   * Logs out user and navigates to auth screen
   */
  const handleLogout = async () => {
    try {
      console.log("[Profile] Logging out user...");
      
      await logout();
      
      console.log("[Profile] User logged out successfully");
      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      console.error("[Profile] Error logging out:", error);
      
      // Log to Sentry
      Sentry.captureException(error, {
        tags: { component: "Profile", action: "handleLogout" },
        extra: { userId: user?.id, errorMessage: error?.message },
      });
      
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  /**
   * Handle orders navigation
   * Navigates to orders screen (to be implemented)
   */
  const handleOrders = () => {
    try {
      console.log("[Profile] Navigating to orders...");
      // TODO: Implement orders screen
      Alert.alert("Coming Soon", "Orders feature will be available soon!");
    } catch (error: any) {
      console.error("[Profile] Error navigating to orders:", error);
      Sentry.captureException(error, {
        tags: { component: "Profile", action: "handleOrders" },
      });
    }
  };

  // Show loading state
  if (isLoading) {
    console.log("[Profile] Loading user data...");
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FE8C00" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // Show error state if no user
  if (!user) {
    console.warn("[Profile] No user found");
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Not authenticated. Please log in.</Text>
      </SafeAreaView>
    );
  }

  console.log("[Profile] User data loaded:", user.email);

  // Build info data from user profile
  const infoData: InfoItemProps[] = [
    {
      icon: "person-outline",
      label: "Full Name",
      value: user.name || "Not provided",
    },
    {
      icon: "mail-outline",
      label: "Email",
      value: user.email || "Not provided",
    },
    {
      icon: "call-outline",
      label: "Phone number",
      value: user.phone || "Not provided",
    },
    {
      icon: "location-outline",
      label: "Address",
      value: user.address || "Not provided",
    },
    {
      icon: "person",
      label: "About Me",
      value: user.about || "No description provided",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* <CustomHeader /> */}
      <FlatList
        data={infoData}
        renderItem={({ item }) => <InfoItem {...item} />}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={() => (
          <View style={styles.imageContainer}>
            <Image
              source={user.avatar ? { uri: user.avatar } : images.avatar}
              style={styles.profileImage}
              defaultSource={images.avatar}
            />
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => {
                console.log("[Profile] Edit profile clicked");
                // TODO: Implement profile edit functionality
                Alert.alert("Coming Soon", "Profile editing will be available soon!");
              }}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.infoCard}
        ListFooterComponent={() => (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handleOrders}>
              <Ionicons name="analytics" size={18} color="#e74c3c" />
              <Text style={styles.editText}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 50,
    marginTop: 0
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Quicksand-Medium",
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontFamily: "Quicksand-Medium",
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "#f7931a",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 130,
    backgroundColor: "#f7931a",
    padding: 6,
    borderRadius: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconCircle: {
    backgroundColor: "#fff3e0",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: "QuicksandMedium",
    color: "#9c9c9c",
    fontSize: 14,
  },
  value: {
    fontFamily: "QuicksandBold",
    fontSize: 16,
    color: "#1e1e1e",
  },
  editButton: {
    backgroundColor: "#fff7f0",
    borderWidth: 1,
    borderColor: "#f7931a",
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 25,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  editText: {
    color: "#f7931a",
    fontSize: 16,
    fontFamily: "QuicksandBold",
  },
  logoutButton: {
    backgroundColor: "#fff0f0",
    borderWidth: 1,
    borderColor: "#fdd",
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 18,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#e74c3c",
    fontSize: 16,
    fontFamily: "QuicksandBold",
  },
});
