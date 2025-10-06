import { Colors } from "@/utils/Colors";
import { addUser } from "@/utils/virtualUsers";
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

export default function SignupScreen() {
  const [isVisible, setisVisible] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});
  const router = useRouter();

  const validate = () => {
    let valid = true;
    let errs: { username?: string; email?: string; password?: string } = {};
    if (!username || username.length < 3) {
      errs.username = "Username must be at least 3 characters.";
      valid = false;
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
      valid = false;
    }
    if (!password || password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
      valid = false;
    }
    setErrors(errs);
    return valid;
  };

  const handleRegister = () => {
    if (validate()) {
      // Default new users to 'user' role
      const success = addUser({ username, email, password, role: "user" });
      if (success) {
        Toast.show({
          type: "success",
          text1: `Welcome back, ${username}!`,
          text2: "Your account has been created.",
        });
        router.replace("/(tabs)");
      } else {
        setErrors({ username: "Username or email already exists." });
        Toast.show({
          type: "error",
          text1: "Registration failed",
          text2: "Username or email already exists.",
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
            Register
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              color: "gray",
              marginTop: 10,
            }}
          >
            Enter your credentials to continue
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

          {/* email */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "gray",
              marginTop: 30,
            }}
          >
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{
              borderColor: Colors.primary,
              borderBottomWidth: 2,
              borderRadius: 5,
              fontSize: 16,
              marginTop: 8,
            }}
          />
          {errors.email && (
            <Text style={{ color: "red", marginTop: 4 }}>{errors.email}</Text>
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
            numberOfLines={2}
            style={{
              fontSize: 15,
              fontWeight: "400",
              color: Colors.default,
              marginTop: 15,
              letterSpacing: 0.7,
              lineHeight: 25,
              width: "85%",
              opacity: 0.7,
            }}
          >
            By continuing you agree to our Terms of Service and Privacy Policy.
          </Text>

          {/* button */}
          <TouchableOpacity
            onPress={handleRegister}
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
              Register
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
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.navigate("/login");
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
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
