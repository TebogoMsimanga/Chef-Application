import { Stack } from "expo-router";
import React from "react";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="users" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ headerShown: false }} />
      <Stack.Screen name="analytics" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-menu-item"
        options={{
          headerShown: true,
          title: "Add Menu Item",
          headerTintColor: "#007AFF",
        }}
      />
      <Stack.Screen
        name="edit-menu-item"
        options={{
          headerShown: true,
          title: "Edit Menu Item",
          headerTintColor: "#007AFF",
        }}
      />
    </Stack>
  );
}
