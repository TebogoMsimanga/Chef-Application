import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { CustomHeaderProps } from "@/type";
import { images } from "@/constants";

const CustomHeader = ({ title }: CustomHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Image source={images.arrowBack} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>

      {/* Title */}
      {title && <Text style={styles.title}>{title}</Text>}

      {/* Search icon */}
      <Image source={images.star} style={styles.icon} resizeMode="contain" />
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
    width: 20,  
    height: 20, 
  },
  title: {
    fontSize: 16,           
    fontFamily: "Quicksand-SemiBold", 
    color: "#1A1A1A",         
    textAlign: "center",
  },
});
