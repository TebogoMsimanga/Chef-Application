import {useRouter} from "expo-router";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CustomHeaderProps} from "@/type";
import {images} from "@/constants";
import {Ionicons} from "@expo/vector-icons";

const CustomHeader = ({ title, showLogout, onLogout }: CustomHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Back button */}
      {router.canGoBack() && (
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
      )}
      {!router.canGoBack() && <View style={styles.iconPlaceholder} />}

      {/* Title */}
      {title && <Text style={styles.title}>{title}</Text>}

      {/* Right side - Logout button or dots icon */}
      {showLogout && onLogout ? (
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      ) : (
        <Image source={images.dots} style={styles.icon} resizeMode="contain" />
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999, 
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 16,           
    fontFamily: "Quicksand-SemiBold", 
    color: "#1A1A1A",         
    textAlign: "center",
  },
  logoutButton: {
    padding: 4,
  },
});
