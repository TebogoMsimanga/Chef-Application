import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import CustomButton from "./CustomButton";
import CustomHeader from "./CustomHeader";
import { createMenuItem, getCategories } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

interface CreateMenuItemProps {
  onSuccess?: () => void;
}

const CreateMenuItem = ({ onSuccess }: CreateMenuItemProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string>("");
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

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
      if (data && data.length > 0) {
        setForm((prev) => ({ ...prev, category_id: data[0].id }));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !form.category_id
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

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
        rating: parseFloat(form.rating),
        calories: parseInt(form.calories) || 0,
        protein: parseInt(form.protein) || 0,
        image: imageUri || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80`,
      };

      await createMenuItem(menuItem);

      Alert.alert("Success", "Menu item created successfully!");
      
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
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomHeader title="Add Menu Item" />

      <View style={styles.form}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
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

        <Text style={styles.label}>Calories</Text>
        <TextInput
          style={styles.input}
          value={form.calories}
          onChangeText={(text) => setForm({ ...form, calories: text })}
          placeholder="0"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Protein (g)</Text>
        <TextInput
          style={styles.input}
          value={form.protein}
          onChangeText={(text) => setForm({ ...form, protein: text })}
          placeholder="0"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Rating</Text>
        <TextInput
          style={styles.input}
          value={form.rating}
          onChangeText={(text) => setForm({ ...form, rating: text })}
          placeholder="4.5"
          keyboardType="decimal-pad"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FE8C00" style={{ marginTop: 20 }} />
        ) : (
          <CustomButton
            title="Create Menu Item"
            onPress={handleSubmit}
            style={styles.button}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  form: {
    marginTop: 20,
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
  },
});

export default CreateMenuItem;