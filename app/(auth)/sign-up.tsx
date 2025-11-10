/**
 * Sign Up Screen
 * 
 * Allows new users to create an account with email and password.
 * Handles registration with Supabase and error tracking with Sentry.
 * 
 * @component
 */

import {Alert, StyleSheet, Text, View} from "react-native";
import React, {useState} from "react";
import {Link, router} from "expo-router";
import * as Sentry from "@sentry/react-native";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { signUp } from "@/lib/supabase";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    about: "",
  });

  /**
   * Handle sign up submission
   * Validates form, creates user account, and navigates to home
   */
  const submit = async () => {
    console.log("[SignUp] Sign up attempt started");
    
    // Validate required fields
    if (!form.name || !form.email || !form.password) {
      console.warn("[SignUp] Validation failed: missing required fields");
      Alert.alert("Error", "Please enter valid details");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("[SignUp] Creating user account:", form.email);
      
      await signUp({
        email: form.email,
        password: form.password,
        name: form.name,
      });

      console.log("[SignUp] Sign up successful, navigating to home");
      router.replace("/");
    } catch (error: any) {
      console.error("[SignUp] Sign up error:", error);
      
      // Log to Sentry with context
      Sentry.captureException(error, {
        tags: {
          component: "SignUp",
          action: "signUp",
        },
        extra: {
          email: form.email,
          name: form.name,
          errorMessage: error?.message,
          errorCode: error?.code,
        },
      });
      
      Alert.alert("Error", error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log("[SignUp] Sign up attempt completed");
    }
  };

  return (
    <View style={styles.container}>
      {/* Name */}
      <CustomInput
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label="Name"
        keyboardType="default"
      />

      {/* Email */}
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />

      {/* password */}
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
          flexDirection: "row",
          gap: 4,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#7e7b7bff",
          }}
        >
          Already have an account?
        </Text>
        <Link
          href={"/sign-in"}
          style={{
            fontWeight: "bold",
            color: "#1807acff",
          }}
        >
          Sign In
        </Link>
      </View>
    </View>
  );
};
export default SignUp;

const styles = StyleSheet.create({
  container: {
    gap: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
  },
});