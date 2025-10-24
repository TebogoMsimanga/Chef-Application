import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { InfoItemProps } from "@/type";
import useAuthStore from "@/store/auth.store";

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <View style={styles.infoItem}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={20} color="#f7931a" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

export default function Profile() {
  const { user, isLoading, logout, fetchAuthenticatedUser } = useAuthStore();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchAuthenticatedUser();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>Not authenticated. Please log in.</Text>;
  }

  const infoData: InfoItemProps[] = [
    {
      icon: "person-outline",
      label: "Full Name",
      value: user.name || "Adrian Hajdin",
    },
    {
      icon: "mail-outline",
      label: "Email",
      value: user.email || "adrian@jsmastery.com",
    },
    { icon: "call-outline", label: "Phone number", value: "+1 555 123 4567" },
    {
      icon: "location-outline",
      label: "Address 1 - (Home)",
      value: "123 Main Street, Springfield, IL 62704",
    },
    {
      icon: "person",
      label: "About Me",
      value:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam officiis enim possimus sed. .",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      {/* Profile image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: user.avatar }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info card with FlatList */}
      <View style={styles.infoCard}>
        <FlatList
          data={infoData}
          renderItem={({ item }) => <InfoItem {...item} />}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false} // Disable scrolling for fixed items; enable if more fields added
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles remain unchanged from original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "#f7931a",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 130,
    backgroundColor: "#f7931a",
    padding: 6,
    borderRadius: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconCircle: {
    backgroundColor: "#fff3e0",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: "QuicksandMedium",
    color: "#9c9c9c",
    fontSize: 14,
  },
  value: {
    fontFamily: "QuicksandBold",
    fontSize: 16,
    color: "#1e1e1e",
  },
  editButton: {
    backgroundColor: "#fff7f0",
    borderWidth: 1,
    borderColor: "#f7931a",
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 25,
    paddingVertical: 14,
    alignItems: "center",
  },
  editText: {
    color: "#f7931a",
    fontSize: 16,
    fontFamily: "QuicksandBold",
  },
  logoutButton: {
    backgroundColor: "#fff0f0",
    borderWidth: 1,
    borderColor: "#fdd",
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 18,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#e74c3c",
    fontSize: 16,
    fontFamily: "QuicksandBold",
  },
});
