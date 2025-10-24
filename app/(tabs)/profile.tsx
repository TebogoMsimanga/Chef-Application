import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      {/* profile image */}
      <View style={styles.imageContainer}>
        <Image source={{}} style={styles.profileImage} />
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* info card */}
      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={20} color="#f7931a" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>Adrian Hajdin</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={20} color="#f7931a" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>adrian@jsmastery.com</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="call-outline" size={20} color="#f7931a" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Phone number</Text>
            <Text style={styles.value}>+1 555 123 4567</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={20} color="#f7931a" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Address 1 - (Home)</Text>
            <Text style={styles.value}>
              123 Main Street, Springfield, IL 62704
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={20} color="#f7931a" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>About Me</Text>
            <Text style={styles.value}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
              officiis enim possimus sed. .
            </Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 50
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
