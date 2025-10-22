import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const { setIsAuthenticated, setUser } = useAuthStore();

  const submit = async () => {
    if (!form.email || !form.password)
      return Alert.alert(
        "Error",
        "Please enter valid email address & password."
      );

    setIsSubmitting(true);

    try {
      const { userData } = await signIn({
        email: form.email,
        password: form.password,
      });

      // Update auth store with user data
      setIsAuthenticated(true);
      setUser(userData);

      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
      Sentry.captureEvent(error);
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
      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />
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
        <Link
          href="/sign-up"
          style={{ fontWeight: "bold", color: "#1807acff" }}
        >
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
