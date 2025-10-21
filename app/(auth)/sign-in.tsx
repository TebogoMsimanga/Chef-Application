import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { signIn } from "@/lib/appwrite";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    if (!form.email || !form.password) {
      return Alert.alert("Error", "Please enter a valid email and password");
    }

    // Prevent multiple submissions
    if (isSubmitting) return; 

    setIsSubmitting(true);

    try {
      const user = await signIn({
        email: form.email,
        password: form.password,
      });

      if (user) {
        router.replace("/");
      } else {
        Alert.alert("Error", "Unexpected login response");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submit}
      />
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
          flexDirection: "row",
          gap: 4,
        }}
      >
        <Text style={{ fontSize: 14, color: "#7e7b7bff" }}>
          Don&apos;t have an account?
        </Text>
        <Link href="/sign-up" style={{ fontWeight: "bold", color: "#1807acff" }}>
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    gap: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
  },
});