import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { cartStore } from "../store/cartStore";
import { Colors } from "../utils/Colors";
import HappySVG from "./HappySVG";

export default function CheckoutScreen() {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();

  const handleCheckout = () => {
    setSuccess(true);
    cartStore.clearCart();
    setTimeout(() => {
      setSuccess(false);
      (navigation as any).navigate("index");
    }, 2000);
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <HappySVG size={160} />
        <Text style={styles.successText}>Payment Successful!</Text>
        <Text style={styles.successSubtext}>Thank you for your order 🎉</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        value={card}
        onChangeText={setCard}
        placeholder="1234 5678 9012 3456"
        keyboardType="number-pad"
        maxLength={19}
      />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Expiry</Text>
          <TextInput
            style={styles.input}
            value={expiry}
            onChangeText={setExpiry}
            placeholder="MM/YY"
            maxLength={5}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            placeholder="123"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>
      <TouchableOpacity style={styles.payBtn} onPress={handleCheckout}>
        <Text style={styles.payBtnText}>Pay Now</Text>
      </TouchableOpacity>
      <Text style={styles.demoText}>
        (Demo: Use any card details. No real payment is processed.)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 24,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  payBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 32,
    alignItems: "center",
  },
  payBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  demoText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 18,
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  successText: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
  },
  successSubtext: {
    color: "#222",
    fontSize: 18,
    marginTop: 8,
  },
});
