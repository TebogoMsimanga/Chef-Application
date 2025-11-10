import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { seedDatabase } from "@/lib/seed";
import { StatusBar } from "expo-status-bar";

export default function SeedScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    try {
      setLoading(true);
      setMessage("Seeding database...");
      await seedDatabase();
      setMessage("✅ Database seeded successfully!");
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>Database Seeder</Text>
        <Text style={styles.subtitle}>
          Click the button below to populate the database with initial data
        </Text>

        {loading && <ActivityIndicator size="large" color="#FE8C00" />}

        {message && (
          <View style={styles.messageBox}>
            <Text style={styles.message}>{message}</Text>
          </View>
        )}

        <CustomButton
          title="Seed Database"
          onPress={handleSeed}
          disabled={loading}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  messageBox: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 8,
    width: "100%",
  },
  message: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#1A1A1A",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
});
