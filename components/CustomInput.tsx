import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { CustomInputProps } from "@/type";

const CustomInput = ({
  placeholder = "Enter text...",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false, // ✅ new prop
}: CustomInputProps & { multiline?: boolean }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"} // ✅ important for multiline
        style={[
          styles.textInput,
          isFocused ? styles.borderActive : styles.borderInactive,
          multiline && styles.multilineInput, // ✅ better padding & height
        ]}
      />
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontFamily: "Quicksand-Medium",
    color: "#6B7280",
    marginBottom: 6,
    paddingLeft: 4,
  },
  textInput: {
    borderRadius: 8,
    padding: 12,
    width: "100%",
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
    color: "#18181B",
    borderBottomWidth: 1,
    lineHeight: 20,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  borderActive: {
    borderColor: "#0A26A0",
  },
  borderInactive: {
    borderColor: "#E5E7EB",
  },
});
