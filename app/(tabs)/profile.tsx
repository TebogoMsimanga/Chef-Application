import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserProfile from "../../components/profile/UserProfile";
import { useAuthStore } from "../../store/authStore";

export default function ProfileTab() {
  const { isAdmin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin()) {
      router.replace("/admin/profile");
    }
  }, [isAdmin, router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <UserProfile isAdmin={isAdmin()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
