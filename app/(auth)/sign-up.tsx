import { View, Text, Button, Alert } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { StyleSheet } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async () => {
    if (!form.name || !form.email || !form.password)
      return Alert.alert("Error", "Please enter a valid details");

    setIsSubmitting(true);

    try {
      Alert.alert("Success", "User signed up successfully");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
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
