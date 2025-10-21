import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  Image,
} from "react-native";
import React, { Component } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { images } from "@/constants";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";

export default class AuthLayout extends Component {
  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{
            backgroundColor: "#ffffff",
            height: "100%",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              position: "relative",
              width: "100%",
              height: Dimensions.get("screen").height / 2.25,
            }}
          >
            <ImageBackground
              source={images.loginGraphic}
              style={{
                width: "100%",
                height: "100%",
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
              resizeMode="stretch"
            />
            <Image
              source={images.logo}
              style={{
                alignSelf: "center",
                width: 192,
                height: 192,
                position: "absolute",
                bottom: -64,
                zIndex: 10,
              }}
            />
          </View>
          <Slot />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
