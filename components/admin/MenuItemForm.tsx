import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAdminStore } from "../../store/adminStore";
import { Colors } from "../../utils/Colors";
import { Meal } from "../../utils/data";
import Toast from "../Toast";

interface MenuItemFormProps {
  editItem?: Meal;
  isModal?: boolean;
}

export default function MenuItemForm({ editItem, isModal }: MenuItemFormProps) {
  const router = useRouter();

  // Basic Information
  const [name, setName] = useState(editItem?.name || "");
  const [subtitle, setSubtitle] = useState(editItem?.subtitle || "");
  const [category, setCategory] = useState<"Breakfast" | "Lunch" | "Dinner">(
    editItem?.category || "Breakfast"
  );
  const [description, setDescription] = useState(editItem?.description || "");

  // Pricing
  const [price, setPrice] = useState(editItem?.price.toString() || "");
  const [discountedPrice, setDiscountedPrice] = useState(
    editItem?.discountedPrice?.toString() || ""
  );

  // Image
  const [image, setImage] = useState(editItem?.image || "");
  const [uploading, setUploading] = useState(false);

  // Additional Details
  const [isSpicy, setIsSpicy] = useState(editItem?.isSpicy || false);
  const [isAvailable, setIsAvailable] = useState(editItem?.isAvailable ?? true);
  const [ingredients, setIngredients] = useState(
    editItem?.ingredients?.join(", ") || ""
  );

  // Nutritional Information
  const [calories, setCalories] = useState(
    editItem?.nutritionalInfo?.calories?.toString() || ""
  );
  const [protein, setProtein] = useState(
    editItem?.nutritionalInfo?.protein?.toString() || ""
  );
  const [carbs, setCarbs] = useState(
    editItem?.nutritionalInfo?.carbs?.toString() || ""
  );
  const [fats, setFats] = useState(
    editItem?.nutritionalInfo?.fats?.toString() || ""
  );

  // Form State
  const [errors, setErrors] = useState<string[]>([]);

  // Store Actions
  const { addMenuItem, editMenuItem } = useAdminStore();

  const pickImage = async () => {
    try {
      setUploading(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Required",
          text2: "Please grant camera roll permissions to upload images",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setImage(result.assets[0].uri);
        setErrors(errors.filter((error) => !error.includes("Image")));
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to pick image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!name) errors.push("Name is required");
    if (!price) errors.push("Price is required");
    if (!description) errors.push("Description is required");
    if (!category) errors.push("Category is required");

    if (price && isNaN(parseFloat(price))) {
      errors.push("Price must be a valid number");
    }

    if (discountedPrice && isNaN(parseFloat(discountedPrice))) {
      errors.push("Discounted price must be a valid number");
    }

    if (discountedPrice && parseFloat(discountedPrice) >= parseFloat(price)) {
      errors.push("Discounted price must be less than regular price");
    }

    if (calories && isNaN(parseInt(calories))) {
      errors.push("Calories must be a valid number");
    }

    if (protein && isNaN(parseInt(protein))) {
      errors.push("Protein must be a valid number");
    }

    if (carbs && isNaN(parseInt(carbs))) {
      errors.push("Carbs must be a valid number");
    }

    if (fats && isNaN(parseInt(fats))) {
      errors.push("Fats must be a valid number");
    }

    return errors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: validationErrors[0],
      });
      return;
    }

    const ingredientsArray = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const newItem: Meal = {
      id: Date.now().toString(),
      name,
      subtitle: subtitle || undefined,
      category,
      price: parseFloat(price),
      discountedPrice: discountedPrice
        ? parseFloat(discountedPrice)
        : undefined,
      image,
      description,
      rating: 0,
      isSpicy,
      ingredients: ingredientsArray.length > 0 ? ingredientsArray : undefined,
      nutritionalInfo: {
        calories: calories ? parseInt(calories) : undefined,
        protein: protein ? parseInt(protein) : undefined,
        carbs: carbs ? parseInt(carbs) : undefined,
        fats: fats ? parseInt(fats) : undefined,
      },
      isAvailable,
    };

    if (editItem) {
      editMenuItem(editItem.id, {
        ...newItem,
        rating: editItem.rating,
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Menu item updated successfully",
      });
    } else {
      addMenuItem(newItem);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Menu item added successfully",
      });
    }

    router.push("/admin/menu");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.form}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.includes("Name is required") && {
                  borderColor: "red",
                },
              ]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors(errors.filter((error) => !error.includes("Name")));
              }}
              placeholder="Item name"
            />
            {errors.includes("Name is required") && (
              <Text style={styles.errorText}>Name is required</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subtitle</Text>
            <TextInput
              style={styles.input}
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder="Brief tagline or subtitle"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(value: "Breakfast" | "Lunch" | "Dinner") => {
                  setCategory(value);
                  setErrors(
                    errors.filter((error) => !error.includes("Category"))
                  );
                }}
                style={styles.picker}
              >
                <Picker.Item label="Breakfast" value="Breakfast" />
                <Picker.Item label="Lunch" value="Lunch" />
                <Picker.Item label="Dinner" value="Dinner" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>

          <View style={styles.priceContainer}>
            <View style={[styles.inputGroup, styles.priceInput]}>
              <Text style={styles.label}>
                Regular Price (ZAR) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.some((e) => e.includes("Price")) && {
                    borderColor: "red",
                  },
                ]}
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  setErrors(errors.filter((error) => !error.includes("Price")));
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              {errors.some((e) => e.includes("Price")) && (
                <Text style={styles.errorText}>
                  {errors.find((e) => e.includes("Price"))}
                </Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.priceInput]}>
              <Text style={styles.label}>Discounted Price (ZAR)</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.some((e) => e.includes("Discounted")) && {
                    borderColor: "red",
                  },
                ]}
                value={discountedPrice}
                onChangeText={(text) => {
                  setDiscountedPrice(text);
                  setErrors(
                    errors.filter((error) => !error.includes("Discounted"))
                  );
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              {errors.some((e) => e.includes("Discounted")) && (
                <Text style={styles.errorText}>
                  {errors.find((e) => e.includes("Discounted"))}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Description and Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description & Image</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.includes("Description is required") && {
                  borderColor: "red",
                },
              ]}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setErrors(
                  errors.filter((error) => !error.includes("Description"))
                );
              }}
              placeholder="Item description"
              multiline
              numberOfLines={4}
            />
            {errors.includes("Description is required") && (
              <Text style={styles.errorText}>Description is required</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image</Text>
            <View style={styles.imageUploadContainer}>
              {image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickImage}
                disabled={uploading}
              >
                <MaterialCommunityIcons
                  name={uploading ? "loading" : "camera-plus"}
                  size={24}
                  color={Colors.primary}
                />
                <Text style={styles.uploadButtonText}>
                  {uploading
                    ? "Uploading..."
                    : image
                      ? "Change Image"
                      : "Upload Image"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ingredients (comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={ingredients}
              onChangeText={setIngredients}
              placeholder="e.g., Tomatoes, Cheese, Basil"
              multiline
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Spicy</Text>
            <Switch
              value={isSpicy}
              onValueChange={setIsSpicy}
              trackColor={{ false: "#767577", true: Colors.primary }}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Available</Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: "#767577", true: Colors.primary }}
            />
          </View>
        </View>

        {/* Nutritional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutritional Information</Text>

          <View style={styles.nutritionGrid}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.some((e) => e.includes("Calories")) && {
                    borderColor: "red",
                  },
                ]}
                value={calories}
                onChangeText={(text) => {
                  setCalories(text);
                  setErrors(
                    errors.filter((error) => !error.includes("Calories"))
                  );
                }}
                placeholder="kcal"
                keyboardType="numeric"
              />
              {errors.some((e) => e.includes("Calories")) && (
                <Text style={styles.errorText}>Must be a number</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.some((e) => e.includes("Protein")) && {
                    borderColor: "red",
                  },
                ]}
                value={protein}
                onChangeText={(text) => {
                  setProtein(text);
                  setErrors(
                    errors.filter((error) => !error.includes("Protein"))
                  );
                }}
                placeholder="grams"
                keyboardType="numeric"
              />
              {errors.some((e) => e.includes("Protein")) && (
                <Text style={styles.errorText}>Must be a number</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.some((e) => e.includes("Carbs")) && {
                    borderColor: "red",
                  },
                ]}
                value={carbs}
                onChangeText={(text) => {
                  setCarbs(text);
                  setErrors(errors.filter((error) => !error.includes("Carbs")));
                }}
                placeholder="grams"
                keyboardType="numeric"
              />
              {errors.some((e) => e.includes("Carbs")) && (
                <Text style={styles.errorText}>Must be a number</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Fats (g)</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.some((e) => e.includes("Fats")) && {
                    borderColor: "red",
                  },
                ]}
                value={fats}
                onChangeText={(text) => {
                  setFats(text);
                  setErrors(errors.filter((error) => !error.includes("Fats")));
                }}
                placeholder="grams"
                keyboardType="numeric"
              />
              {errors.some((e) => e.includes("Fats")) && (
                <Text style={styles.errorText}>Must be a number</Text>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {editItem ? "Update Menu Item" : "Add Menu Item"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "500",
  },
  required: {
    color: Colors.primary,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageUploadContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  imagePreviewContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    backgroundColor: "white",
  },
  uploadButtonText: {
    marginLeft: 8,
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
