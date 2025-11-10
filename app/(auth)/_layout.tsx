import {Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View,} from "react-native";
import React from "react";
import {Redirect, Slot} from "expo-router";
import {images} from "@/constants";
import useAuthStore from "@/store/auth.store";

export default function AuthLayout() {
   const { isAuthenticated } = useAuthStore();

    if(isAuthenticated) return <Redirect href="/" />

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
