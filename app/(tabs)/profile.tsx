/**
 * Profile Screen
 * 
 * Displays user profile information including:
 * - User avatar with upload functionality
 * - Name, email, phone, address, about
 * - Edit profile functionality
 * - Orders navigation
 * - Logout functionality with confirmation
 * 
 * @component
 */

import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, TextInput, ScrollView, Modal} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {InfoItemProps} from "@/type";
import useAuthStore from "@/store/auth.store";
import { getUserInitials, getAvatarColor } from "@/lib/utils";
import * as Sentry from "@sentry/react-native";
import {StatusBar} from "expo-status-bar";
import {images} from "@/constants";
import {router} from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { uploadImage, updateProfile } from "@/lib/supabase";
import CustomHeader from "@/components/CustomHeader";

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
  const { user, isLoading, logout, fetchAuthenticatedUser, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    about: "",
  });

  console.log("[Profile] Screen rendered");

  useEffect(() => {
    if (!user && !isLoading) {
      console.log("[Profile] No user found, fetching...");
      fetchAuthenticatedUser();
    } else if (user) {
      // Initialize edit form with user data
      setEditForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        about: user.about || "",
      });
    }
  }, [user, isLoading, fetchAuthenticatedUser]);

  /**
   * Handle image upload
   * Allows user to select and upload profile image
   */
  const handleImageUpload = async () => {
    try {
      console.log("[Profile] Requesting image picker permissions...");
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant camera roll permissions to upload images.");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        console.log("[Profile] Image picker cancelled");
        return;
      }

      if (!result.assets || !result.assets[0]) {
        console.warn("[Profile] No image selected");
        return;
      }

      const imageUri = result.assets[0].uri;
      console.log("[Profile] Image selected, uploading...", imageUri);

      setUploading(true);

      // Upload image to Supabase storage
      const fileName = `profile-${user?.id}-${Date.now()}.jpg`;
      const imageUrl = await uploadImage(imageUri, fileName, "menu-images");

      console.log("[Profile] Image uploaded, updating profile...", imageUrl);

      // Update profile with new image URL
      if (user?.id) {
        await updateProfile(user.id, { avatar: imageUrl });
        
        // Update local state
        setUser({ ...user, avatar: imageUrl });
        
        console.log("[Profile] Profile image updated successfully");
        Alert.alert("Success", "Profile image updated successfully!");
      }
    } catch (error: any) {
      console.error("[Profile] Error uploading image:", error);
      
      Sentry.captureException(error, {
        tags: { component: "Profile", action: "handleImageUpload" },
        extra: { userId: user?.id, errorMessage: error?.message },
      });
      
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle edit profile
   * Opens edit mode
   */
  const handleEdit = () => {
    console.log("[Profile] Entering edit mode");
    setIsEditing(true);
  };

  /**
   * Handle save profile
   * Saves edited profile data
   */
  const handleSave = async () => {
    try {
      if (!user?.id) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      console.log("[Profile] Saving profile changes...");
      setSaving(true);

      // Update profile in database
      await updateProfile(user.id, editForm);
      
      // Update local state
      setUser({ ...user, ...editForm });
      
      console.log("[Profile] Profile updated successfully");
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      console.error("[Profile] Error saving profile:", error);
      
      Sentry.captureException(error, {
        tags: { component: "Profile", action: "handleSave" },
        extra: { userId: user?.id, errorMessage: error?.message },
      });
      
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle cancel edit
   * Cancels edit mode and resets form
   */
  const handleCancel = () => {
    console.log("[Profile] Cancelling edit mode");
    setIsEditing(false);
    // Reset form to original user data
    if (user) {
      setEditForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        about: user.about || "",
      });
    }
  };

  /**
   * Handle logout with confirmation
   * Logs out user and navigates to auth screen
   */
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
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
          },
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Handle orders navigation
   * Navigates to orders screen
   */
  const handleOrders = () => {
    try {
      console.log("[Profile] Navigating to orders...");
      router.push("/(screens)/orders");
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
      <CustomHeader 
        title="Profile" 
        showLogout={true}
        onLogout={handleLogout}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            onPress={handleImageUpload}
            disabled={uploading}
            activeOpacity={0.8}
          >
            {user.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.profileImage}
                defaultSource={images.avatar}
              />
            ) : user.name ? (
              <View
                style={[
                  styles.profileImage,
                  styles.profileImageInitials,
                  { backgroundColor: getAvatarColor(user.name) },
                ]}
              >
                <Text style={styles.profileImageInitialsText}>
                  {getUserInitials(user.name)}
                </Text>
              </View>
            ) : (
              <Image
                source={images.avatar}
                style={styles.profileImage}
                resizeMode="cover"
              />
            )}
            {uploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color="#FE8C00" />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
            onPress={handleImageUpload}
            disabled={uploading}
          >
            <Ionicons name="camera-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Info Card */}
        <View style={styles.infoCard}>
          {isEditing ? (
            <View style={styles.editContainer}>
              <View style={styles.editHeader}>
                <Text style={styles.editTitle}>Edit Profile</Text>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.cancelButton}
                    disabled={saving}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    style={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Full Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editForm.name}
                    onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editForm.phone}
                    onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Address</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    value={editForm.address}
                    onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                    placeholder="Enter your address"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>About Me</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    value={editForm.about}
                    onChangeText={(text) => setEditForm({ ...editForm, about: text })}
                    placeholder="Tell us about yourself"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>Profile Information</Text>
                <TouchableOpacity
                  onPress={handleEdit}
                  style={styles.editIconButton}
                >
                  <Ionicons name="pencil-outline" size={20} color="#FE8C00" />
                </TouchableOpacity>
              </View>

              <View style={styles.infoList}>
                {infoData.map((item, index) => (
                  <InfoItem key={index} {...item} />
                ))}
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        {!isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.ordersButton}
              onPress={handleOrders}
              activeOpacity={0.8}
            >
              <View style={styles.buttonIconContainer}>
                <Ionicons name="receipt-outline" size={22} color="#FE8C00" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.ordersButtonText}>My Orders</Text>
                <Text style={styles.ordersButtonSubtext}>View order history</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 140,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontFamily: "Quicksand-Medium",
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontFamily: "Quicksand-Medium",
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FE8C00",
  },
  profileImageInitials: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageInitialsText: {
    fontSize: 40,
    fontFamily: "Quicksand-Bold",
    color: "#fff",
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#FE8C00",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  editIconButton: {
    padding: 8,
  },
  infoList: {
    gap: 4,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  iconCircle: {
    backgroundColor: "#FFF5E6",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: "Quicksand-Medium",
    color: "#666",
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    fontFamily: "Quicksand-SemiBold",
    fontSize: 15,
    color: "#1A1A1A",
  },
  editContainer: {
    gap: 20,
  },
  editHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  editTitle: {
    fontSize: 20,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#666",
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#FE8C00",
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#fff",
  },
  formContainer: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: "Quicksand-SemiBold",
    color: "#1A1A1A",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
    backgroundColor: "#FAFAFA",
  },
  formTextArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  ordersButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextContainer: {
    flex: 1,
  },
  ordersButtonText: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  ordersButtonSubtext: {
    fontSize: 13,
    fontFamily: "Quicksand-Medium",
    color: "#666",
  },
});
