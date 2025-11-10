import {images} from "@/constants";
import {useCartStore} from "@/store/cart.store";
import {TabBarIconProps} from "@/type";
import {Tabs} from "expo-router";
import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => {

  const totalItems = useCartStore((state) => state.getTotalItems());

  const renderBadge = () => {
    if (title === "Cart" && totalItems > 0) {
      return (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.tabIcon}>
      <Image
        source={icon}
        style={styles.icon}
        resizeMode="contain"
        tintColor={focused ? "#FE8C00" : "#5D5F6D"}
      />
      <Text
        style={[
          styles.text,
          focused ? styles.textFocused : styles.textUnfocused,
        ]}
      >
        {title}
      </Text>
      {renderBadge()}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 20,
          height: 80,
          position: "absolute",
          bottom: 40,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          borderTopWidth: 0,
          zIndex: 1000,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Home" icon={images.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Search" icon={images.search} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Cart" icon={images.bag} focused={focused} /> 
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Profile"
              icon={images.person}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    minHeight: "100%",
    gap: 4,
    marginTop: 48,
    position: "relative",
  },
  icon: {
    width: 28,
    height: 28,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
  },
  textFocused: {
    color: "#FE8C00",
  },
  textUnfocused: {
    color: "#5D5F6D",
  },
  badge: {
    position: "absolute",
    top: -10,
    right: 11,
    backgroundColor: "#EF4444",
    borderRadius: 9999,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Quicksand-Bold",
    color: "#FFFFFF",
  },
});
