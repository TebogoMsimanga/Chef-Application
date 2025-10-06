import { Colors } from "@/utils/Colors";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Image, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/signup");
    }, 2000); // 2 seconds
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View
      style={{
        backgroundColor: Colors.primary,
        flex: 1,
        justifyContent: "center",
      }}
    >
      <StatusBar style="light" />
      <View>
        <Image
          style={{
            tintColor: "white",
            width: "80%",
            height: undefined,
            aspectRatio: 450 / 130,
            alignSelf: "center",
            maxWidth: 450,
            maxHeight: 130,
          }}
          source={require("../assets/images/logo.png")}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
