import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { CustomInputProps } from "@/type";

const CustomInput = ({
  placeholder = "Enter text....",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ width: "100%" }}>
      <Text
        style={{
          fontSize: 16,
          textAlign: "left",
          width: "100%",
          fontFamily: "Quicksand-Medium",
          color: "#6B7280",
          paddingLeft: 8,
        }}
      >
        {label}
      </Text>
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
        placeholderTextColor={"#888"}
        style={[
          styles.textInput,
          isFocused ? styles.borderBlue : styles.borderGray,
        ]}
      />
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
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
  borderBlue: {
    borderColor: "#0a26a0ff",
  },
  borderGray: {
    borderColor: "#3c3d3fff",
  },
});
