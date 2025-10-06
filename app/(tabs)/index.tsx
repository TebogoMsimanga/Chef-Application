import Banner from "@/components/Banner";
import Searchbar from "@/components/Searchbar";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Filter from "../../components/Filter";
import { VerticalMealList } from "../../components/Meal";
import FloatingActionButton from "../../components/common/FloatingActionButton";
import { useAuthStore } from "../../store/authStore";
import { meals } from "../../utils/data";
import { setNavigationBarColor } from "../../utils/setNavigationBar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 10,
    alignSelf: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#eee",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  userRole: {
    fontSize: 16,
    color: "#f16e03ff",
    fontWeight: "600",
    marginRight: 8,
  },
  userJob: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
});

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const filteredMeals =
    selectedFilter === "all"
      ? meals
      : meals.filter((m) => m.category.toLowerCase() === selectedFilter);

  useEffect(() => {
    // Match navigation bar color to StatusBar style
    setNavigationBarColor("#fff"); // white nav bar for dark icons
  }, []);

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      <StatusBar style="dark" />
      {/* Logo */}
      <Image
        tintColor={"#f16e03ff"}
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* User Info Row */}
      <View style={styles.userRow}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.username || "Guest"}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={styles.userRole}>{user?.role || "User"}</Text>
          </View>
        </View>
      </View>
      {/* searchbar */}
      <Searchbar />
      {/* banner */}
      <Banner />
      {/* Filter Chips */}
      <View style={{ marginTop: 5 }}>
        <Filter
          selected={selectedFilter}
          setSelected={setSelectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </View>
      {/* Meal Cards Vertical Scroll */}
      <View style={{ marginTop: 10, flex: 1 }}>
        <VerticalMealList meals={filteredMeals} />
      </View>
      {/* Floating Action Button */}
      <FloatingActionButton onPress={() => router.push("/admin/menu")} />
    </SafeAreaView>
  );
}

// Remove duplicate styles definition above
