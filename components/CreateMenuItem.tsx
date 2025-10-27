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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "./CustomHeader";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { CreateMenuItemParams, CreateMenuItemProps } from "@/type";

const CreateMenuItem = ({ onSuccess }: CreateMenuItemProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const handleSubmit = async () => {
    // TODO: Implement submit logic
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Keyboard handling for iOS/Android */}
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

            {/* Inputs */}
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
                multiline
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

            {/* Image Picker */}
            <TouchableOpacity style={styles.imagePicker} onPress={() => {}}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
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

            {/* Submit Button */}
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
