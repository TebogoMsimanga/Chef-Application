import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart.store";
import CustomHeader from "@/components/CustomHeader";
import { PaymentInfoProps } from "@/type";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";
import { StatusBar } from "expo-status-bar";
import { images } from "@/constants";

const PaymentInfo = ({ label, value }: PaymentInfoProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function Cart() {
  const { items, getTotalItems, getTotalPrice } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
      <StatusBar style="dark" />
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image
              source={images.cart}
              resizeMode="contain"
              style={{
                marginTop: 60,
                marginBottom: 20,
                width: 400,
                height: 400
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: "Quicksand-Bold",
                color: "#1A1A1A",
              }}
            >
              Oops!! Your cart is empty
            </Text>
            <Text 
            style={{
                textAlign: "center",
                fontSize: 14,
                marginTop: 10,
                fontWeight: "bold",
                fontFamily: "Quicksand-Bold",
                color: "#b4ababff",
              }}>
                add items to checkout
              </Text>
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View style={{ gap: 20 }}>
              <View
                style={{
                  marginTop: 24,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    color: "#1A1A1A",
                    marginBottom: 20,
                    fontSize: 20,
                    fontFamily: "Quicksand-Bold",
                  }}
                >
                  Payment Summary
                </Text>

                <PaymentInfo
                  label={`Total Items (${totalItems})`}
                  value={`R${totalPrice.toFixed(2)}`}
                />

                <PaymentInfo label={`Delivery Fee`} value={`R50`} />

                <PaymentInfo
                  label={`Discount`}
                  value={`-R15`}
                  valueStyle={"!color: #16A34A"}
                />

                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: "#D1D5DB",
                    marginVertical: 8,
                  }}
                />

                <PaymentInfo
                  label={`Total`}
                  value={`R${(totalPrice + 5 - 0.5).toFixed(2)}`}
                  labelStyle={
                    "fontSize: 16 fontFamily: Quicksand-Bold color: #1A1A1A"
                  }
                  valueStyle="fontSize: 16 fontFamily: Quicksand-Bold color: #1A1A1A !textAlign: right"
                />
              </View>
              <CustomButton
                title="Order Now"
                style={{ backgroundColor: "#FE8C00" }}
              />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#E5E7EB",
  },
  value: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
  },
});
