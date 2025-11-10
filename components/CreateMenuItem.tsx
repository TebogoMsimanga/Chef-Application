/**
 * Create Menu Item Component
 *
 * Allows users to:
 * - Create new menu items with image upload to Supabase storage
 * - View existing menu items
 * - Delete menu items
 * - Initialize categories if needed
 *
 * @component
 */

import { images } from "@/constants";
import { verifyStorageBucket } from "@/lib/setup-storage";
import {
  createMenuItem,
  deleteMenuItem,
  getCategories,
  getMenu,
  initializeCategories,
  uploadImage,
} from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Sentry from "@sentry/react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "./CustomButton";
import CustomHeader from "./CustomHeader";

interface CreateMenuItemProps {
  onSuccess?: () => void;
}

const CreateMenuItem = ({ onSuccess }: CreateMenuItemProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageUri, setImageUri] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    ingredients: "",
    rating: "4.5",
    calories: "",
    protein: "",
  });

  console.log("[CreateMenuItem] Component rendered");

  useEffect(() => {
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initialize categories and load data
   */
  const initializeData = async () => {
    try {
      console.log("[CreateMenuItem] Initializing data...");

      // Initialize categories first
      await initializeCategories();

      // Verify storage bucket exists
      const bucketExists = await verifyStorageBucket("menu-images");
      if (!bucketExists) {
        console.warn(
          "[CreateMenuItem] Storage bucket 'menu-images' not found. Please create it via Supabase Dashboard."
        );
        // Don't show alert here, just log - user can still use the form
      }

      // Load categories and menu items
      await Promise.all([loadCategories(), loadMenuItems()]);
    } catch (error: any) {
      console.error("[CreateMenuItem] Error initializing data:", error);
      Sentry.captureException(error, {
        tags: { component: "CreateMenuItem", action: "initializeData" },
      });
      // Don't show alert for initialization errors, just log
    }
  };

  /**
   * Load categories from Supabase
   */
  const loadCategories = async () => {
    try {
      console.log("[CreateMenuItem] Loading categories...");
      const data = await getCategories();
      setCategories(data || []);

      if (data && data.length > 0 && !form.category_id) {
        setForm((prev) => ({ ...prev, category_id: data[0].id }));
      }

      console.log("[CreateMenuItem] Categories loaded:", data?.length || 0);
    } catch (error: any) {
      console.error("[CreateMenuItem] Error loading categories:", error);
      Sentry.captureException(error, {
        tags: { component: "CreateMenuItem", action: "loadCategories" },
      });
    }
  };

  /**
   * Load menu items from Supabase
   */
  const loadMenuItems = async () => {
    try {
      console.log("[CreateMenuItem] Loading menu items...");
      setLoadingItems(true);

      const data = await getMenu({ limit: 1000 });
      setMenuItems(data || []);

      console.log("[CreateMenuItem] Menu items loaded:", data?.length || 0);
    } catch (error: any) {
      console.error("[CreateMenuItem] Error loading menu items:", error);
      Sentry.captureException(error, {
        tags: { component: "CreateMenuItem", action: "loadMenuItems" },
      });
    } finally {
      setLoadingItems(false);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMenuItems();
    setRefreshing(false);
  };

  /**
   * Pick image from device
   */
  const pickImage = async () => {
    try {
      console.log("[CreateMenuItem] Requesting image picker permissions...");

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        console.warn("[CreateMenuItem] Image picker permission denied");
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions"
        );
        return;
      }

      console.log("[CreateMenuItem] Launching image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log("[CreateMenuItem] Image selected:", result.assets[0].uri);
        setImageUri(result.assets[0].uri);
      } else {
        console.log("[CreateMenuItem] Image picker canceled");
      }
    } catch (error: any) {
      console.error("[CreateMenuItem] Error picking image:", error);
      Sentry.captureException(error, {
        tags: { component: "CreateMenuItem", action: "pickImage" },
      });
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  /**
   * Handle form submission
   * Uploads image to Supabase storage and creates menu item
   */
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!form.name || !form.description || !form.price || !form.category_id) {
        console.warn(
          "[CreateMenuItem] Validation failed: missing required fields"
        );
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      console.log("[CreateMenuItem] Starting menu item creation...");
      setLoading(true);
      setUploading(true);

      let imageUrl =
        imageUri ||
        `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80`;

      // Upload image to Supabase storage if local image is selected
      if (imageUri && !imageUri.startsWith("http")) {
        try {
          console.log(
            "[CreateMenuItem] Uploading image to Supabase storage..."
          );
          const fileName = `${form.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}.jpg`;
          imageUrl = await uploadImage(imageUri, fileName);
          console.log(
            "[CreateMenuItem] Image uploaded successfully:",
            imageUrl
          );
        } catch (uploadError: any) {
          console.error("[CreateMenuItem] Image upload failed:", uploadError);
          Sentry.captureException(uploadError, {
            tags: { component: "CreateMenuItem", action: "uploadImage" },
          });

          // Ask user if they want to continue without image
          const shouldContinue = await new Promise<boolean>((resolve) => {
            Alert.alert(
              "Image Upload Failed",
              "Failed to upload image. Would you like to continue with a default image?",
              [
                {
                  text: "Cancel",
                  onPress: () => resolve(false),
                  style: "cancel",
                },
                { text: "Continue", onPress: () => resolve(true) },
              ]
            );
          });

          if (!shouldContinue) {
            setLoading(false);
            setUploading(false);
            return;
          }

          imageUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80`;
        }
      }

      setUploading(false);

      // Prepare menu item data
      const ingredientsArray = form.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);

      const menuItem = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category_id: form.category_id,
        ingredients: ingredientsArray,
        rating: parseFloat(form.rating) || 4.5,
        calories: parseInt(form.calories) || 0,
        protein: parseInt(form.protein) || 0,
        image: imageUrl,
      };

      console.log("[CreateMenuItem] Creating menu item:", menuItem.name);
      await createMenuItem(menuItem);

      console.log("[CreateMenuItem] Menu item created successfully");
      Alert.alert("Success", "Menu item created successfully!");

      // Reset form
      setForm({
        name: "",
        description: "",
        price: "",
        category_id: categories[0]?.id || "",
        ingredients: "",
        rating: "4.5",
        calories: "",
        protein: "",
      });
      setImageUri("");

      // Reload menu items
      await loadMenuItems();

      // Switch to list tab
      setActiveTab("list");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("[CreateMenuItem] Error creating menu item:", error);
      Sentry.captureException(error, {
        tags: { component: "CreateMenuItem", action: "handleSubmit" },
        extra: { form, errorMessage: error?.message },
      });
      Alert.alert(
        "Error",
        error.message || "Failed to create menu item. Please try again."
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  /**
   * Handle delete menu item
   */
  const handleDelete = async (id: string, name: string) => {
    try {
      console.log("[CreateMenuItem] Deleting menu item:", id, name);

      // Confirm deletion
      const confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          "Delete Menu Item",
          `Are you sure you want to delete "${name}"? This action cannot be undone.`,
          [
            { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
            {
              text: "Delete",
              onPress: () => resolve(true),
              style: "destructive",
            },
          ]
        );
      });

      if (!confirmed) {
        console.log("[CreateMenuItem] Delete canceled");
        return;
      }

      setLoading(true);
      await deleteMenuItem(id);

      console.log("[CreateMenuItem] Menu item deleted successfully");
      Alert.alert("Success", "Menu item deleted successfully!");

      // Reload menu items
      await loadMenuItems();
    } catch (error: any) {
      console.error("[CreateMenuItem] Error deleting menu item:", error);
      Sentry.captureException(error, {
        tags: { component: "CreateMenuItem", action: "handleDelete" },
        extra: { itemId: id, itemName: name, errorMessage: error?.message },
      });
      Alert.alert(
        "Error",
        error.message || "Failed to delete menu item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render menu item in list
   */
  const renderMenuItem = ({ item }: { item: any }) => {
    const categoryName = item.category?.name || "Unknown";

    return (
      <View style={styles.menuItemCard}>
        <Image
          source={{ uri: item.image || images.placeholder }}
          style={styles.menuItemImage}
          defaultSource={images.placeholder}
        />
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemCategory}>{categoryName}</Text>
          <Text style={styles.menuItemPrice}>R {item.price?.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
          disabled={loading}
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <CustomHeader title="Menu Items" />

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "create" && styles.activeTab]}
          onPress={() => setActiveTab("create")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "create" && styles.activeTabText,
            ]}
          >
            Create New
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.activeTab]}
          onPress={() => setActiveTab("list")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "list" && styles.activeTabText,
            ]}
          >
            View All ({menuItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "create" ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>
                    Tap to add image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Enter item name"
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Price (R) *</Text>
            <TextInput
              style={styles.input}
              value={form.price}
              onChangeText={(text) => setForm({ ...form, price: text })}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.category_id}
                onValueChange={(value) =>
                  setForm({ ...form, category_id: value })
                }
                style={styles.picker}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Ingredients (comma separated)</Text>
            <TextInput
              style={styles.input}
              value={form.ingredients}
              onChangeText={(text) => setForm({ ...form, ingredients: text })}
              placeholder="e.g. cheese, tomato, lettuce"
            />

            {/* Nutrition Info Row - Calories, Protein, Rating in one line */}
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>Calories</Text>
                <TextInput
                  style={styles.nutritionInput}
                  value={form.calories}
                  onChangeText={(text) => setForm({ ...form, calories: text })}
                  placeholder="0"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.label}>Protein (g)</Text>
                <TextInput
                  style={styles.nutritionInput}
                  value={form.protein}
                  onChangeText={(text) => setForm({ ...form, protein: text })}
                  placeholder="0"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.label}>Rating</Text>
                <TextInput
                  style={styles.nutritionInput}
                  value={form.rating}
                  onChangeText={(text) => setForm({ ...form, rating: text })}
                  placeholder="4.5"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Single loading state - show button with loading indicator inside */}
            <CustomButton
              title={
                loading
                  ? uploading
                    ? "Uploading image..."
                    : "Creating menu item..."
                  : "Add to Menu"
              }
              onPress={handleSubmit}
              style={[
                styles.button,
                (loading || uploading) && styles.buttonDisabled,
              ]}
              isLoading={loading || uploading}
              disabled={loading || uploading}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.listContainer}>
          {loadingItems ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FE8C00" />
              <Text style={styles.loadingText}>Loading menu items...</Text>
            </View>
          ) : (
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={["#FE8C00"]}
                />
              }
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="restaurant-outline"
                    size={64}
                    color="#9CA3AF"
                  />
                  <Text style={styles.emptyText}>No menu items yet</Text>
                  <Text style={styles.emptySubtext}>
                    Create your first menu item to get started
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Extra padding to ensure button isn't hidden
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FE8C00",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#FE8C00",
    fontFamily: "Quicksand-Bold",
  },
  form: {
    marginTop: 20,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  menuItemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  menuItemCategory: {
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    color: "#6B7280",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#FE8C00",
  },
  deleteButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  imagePicker: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#9CA3AF",
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  button: {
    marginTop: 24,
    marginBottom: 20, // Extra margin at bottom
    backgroundColor: "#FE8C00", // Ensure orange color
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  nutritionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  nutritionItem: {
    flex: 1,
  },
  nutritionInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
  },
});

export default CreateMenuItem;
