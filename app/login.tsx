import { Colors } from "@/utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../store/authStore";

export default function LoginScreen() {
  const [isVisible, setisVisible] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const router = useRouter();

  const validate = () => {
    let valid = true;
    let errs: { username?: string; password?: string } = {};
    if (!username || username.length < 3) {
      errs.username = "Username must be at least 3 characters.";
      valid = false;
    }
    if (!password || password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
      valid = false;
    }
    setErrors(errs);
    return valid;
  };

  const { login } = useAuthStore();

  const handleLogin = () => {
    if (validate()) {
      const success = login(username, password);
      if (success) {
        Toast.show({
          type: "success",
          text1: "Welcome back!",
          text2: "Login successful.",
        });
        router.replace("/(tabs)");
      } else {
        setErrors({ password: "Invalid username or password." });
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: "Invalid username or password.",
        });
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.secondary,
      }}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 30,
        }}
      >
        {/* logo */}
        <Image
          tintColor={"#f16e03ff"}
          style={{
            width: "50%",
            height: undefined,
            aspectRatio: 250 / 80,
            alignSelf: "center",
            maxWidth: 250,
            maxHeight: 80,
          }}
          source={require("../assets/images/logo.png")}
          resizeMode="contain"
        />
        {/* form */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 50,
          }}
        >
          {/* header text */}
          <Text
            style={{
              color: Colors.default,
              fontSize: 24,
              fontWeight: "500",
            }}
          >
            Login
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              color: "gray",
              marginTop: 10,
            }}
          >
            Welcome back 😃
          </Text>

          {/* username */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "gray",
              marginTop: 40,
            }}
          >
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            keyboardType="name-phone-pad"
            maxLength={12}
            style={{
              borderColor: Colors.primary,
              borderBottomWidth: 2,
              borderRadius: 5,
              fontSize: 16,
              marginTop: 8,
            }}
          />
          {errors.username && (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.username}
            </Text>
          )}

          {/* password */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "gray",
              marginTop: 30,
            }}
          >
            Password
          </Text>
          <View
            style={{
              borderColor: Colors.primary,
              borderBottomWidth: 2,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              maxLength={12}
              keyboardType="ascii-capable"
              style={{
                borderRadius: 5,
                fontSize: 16,
                marginTop: 15,
                flex: 1,
              }}
              secureTextEntry={isVisible}
            />
            <Ionicons
              onPress={() => {
                setisVisible(!isVisible);
              }}
              name={isVisible === true ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#f16e03ff"
            />
          </View>
          {errors.password && (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.password}
            </Text>
          )}
          <Text
            style={{
              fontSize: 15,
              fontWeight: "400",
              color: Colors.default,
              marginTop: 15,
              textAlign: "right",
            }}
          >
            Forgot password?
          </Text>

          {/* button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: Colors.primary,
              marginTop: 30,
              height: 70,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 19,
                fontWeight: "500",
                color: Colors.secondary,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Don&apos;t have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.navigate("/signup");
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: Colors.primary,
                  letterSpacing: 1,
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
