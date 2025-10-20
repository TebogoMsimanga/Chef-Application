import CartButton from "@/components/CartButton";
import { images, menu } from "@/constants";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <FlatList
        data={menu}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <View>
              <Pressable
                style={[
                  styles.homeCards,
                  isEven ? styles.rowReverse : styles.row,
                  { backgroundColor: item.color },
                ]}
                android_ripple={{ color: "rgba(255, 255, 255, 0.13)" }}
              >
                <View style={{ width: "50%", height: "100%" }}>
                  <Image
                    source={item.image}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={[
                    styles.homeCardsInfo,
                    isEven ? styles.left : styles.right,
                  ]}
                >
                  <Text style={styles.homeText}>{item.title}</Text>
                  <Image
                    source={images.arrowRight}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                    tintColor="#EBECFF"
                  />
                </View>
              </Pressable>
            </View>
          );
        }}
        contentContainerStyle={styles.homeSpacing}
        ListHeaderComponent={() => (
          <View style={styles.userInfo}>
            <View style={styles.userInfoRow}>
              <Image
                source={images.logo}
                style={styles.logo}
                resizeMode="contain"
                tintColor={"#EBECFF"}
              />
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                  marginRight: 12,
                }}
              >
                <Text>Christoffel</Text>
                <Image
                  source={images.arrowDown}
                  style={{ width: 12, height: 12 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text>Head Chef</Text>
            </View>
            <CartButton />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, 
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 8,
  },
  homeCards: {
    height: 192,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 6,
    overflow: "hidden",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  left: {
    paddingLeft: 10,
  },
  right: {
    paddingRight: 10,
  },
  homeCardsInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100%",
  },
  homeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 40,
  },
  homeSpacing: {
    paddingBottom: 28,
    paddingRight: 10,
    paddingLeft: 10,
  },
});
