import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "./CustomHeader";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { CreateMenuItemParams, CreateMenuItemProps } from "@/type";
import * as ImagePicker from "expo-image-picker";
import { createMenuItem, storage, appwriteConfig } from "@/lib/appwrite"; 
import { ID } from "react-native-appwrite";

const CreateMenuItem = ({ onSuccess }: CreateMenuItemProps) => {
  const [selectedAsset, setSelectedAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateMenuItemParams>({
    name: "",
    price: 0,
    image_id: "",
    description: "",
    calories: 0,
    protein: 0,
    rating: 0,
    type: "",
    category: "",
  });

  const handleInputChange = (
    field: keyof CreateMenuItemParams,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need photo library access to select images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedAsset(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Basic validation
    if (!formData.name || formData.price <= 0) {
      Alert.alert("Error", "Name and a valid price are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageId = "";

      if (selectedAsset) {
        const file = {
          uri: selectedAsset.uri,
          name: selectedAsset.fileName || "menu-image.jpg",
          type: selectedAsset.type || "image/jpeg", // Fallback to jpeg
          size: selectedAsset.fileSize || 0,
        };

        const uploadedFile = await storage.createFile(
          appwriteConfig.bucketId,
          ID.unique(),
          file
        );

        imageId = uploadedFile.$id;
      }

      const updatedFormData = { ...formData, image_id: imageId };
      await createMenuItem(updatedFormData);

      // Reset form
      setFormData({
        name: "",
        price: 0,
        image_id: "",
        description: "",
        calories: 0,
        protein: 0,
        rating: 0,
        type: "",
        category: "",
      });
      setSelectedAsset(null);

      onSuccess?.();
      Alert.alert("Success", "Menu item added!");
    } catch (error: any) {
      console.error("Submit error details:", JSON.stringify(error, null, 2)); // Enhanced logging
      Alert.alert("Error", error.message || "Failed to add menu item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <CustomHeader title="Edit Menu Item" />

            <View style={styles.inputsContainer}>
              <CustomInput
                label="Name"
                placeholder="e.g., Grilled Salmon"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
              <CustomInput
                label="Category"
                placeholder="e.g., Supper"
                value={formData.category}
                onChangeText={(text) => handleInputChange("category", text)}
              />
              <CustomInput
                label="Type"
                placeholder="e.g., Main Course"
                value={formData.type}
                onChangeText={(text) => handleInputChange("type", text)}
              />
              <CustomInput
                label="Price (R)"
                placeholder="0.00"
                value={formData.price.toString()}
                onChangeText={(text) =>
                  handleInputChange("price", parseFloat(text) || 0)
                }
                keyboardType="numeric"
              />
              <CustomInput
                label="Description"
                placeholder="Brief description..."
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                multiline // Now typed properly
              />
              <CustomInput
                label="Calories"
                placeholder="0"
                value={formData.calories.toString()}
                onChangeText={(text) =>
                  handleInputChange("calories", parseFloat(text) || 0)
                }
                keyboardType="numeric"
              />
              <CustomInput
                label="Protein (g)"
                placeholder="0"
                value={formData.protein.toString()}
                onChangeText={(text) =>
                  handleInputChange("protein", parseFloat(text) || 0)
                }
                keyboardType="numeric"
              />
              <CustomInput
                label="Rating (1–5)"
                placeholder="0"
                value={formData.rating.toString()}
                onChangeText={(text) =>
                  handleInputChange("rating", parseFloat(text) || 0)
                }
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {selectedAsset ? (
                <Image
                  source={{ uri: selectedAsset.uri }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    Tap to select image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <CustomButton
              title={isSubmitting ? "Adding..." : "Add Menu Item"}
              onPress={handleSubmit}
              isLoading={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateMenuItem;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16, // same as space-y-4
    marginTop: 12,
  },
  imagePicker: {
    height: 200,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    marginTop: 24,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 15,
    color: "#9CA3AF",
    fontFamily: "Quicksand-Medium",
  },
  submitButton: {
    backgroundColor: "#FE8C00",
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 20,
  },
});
