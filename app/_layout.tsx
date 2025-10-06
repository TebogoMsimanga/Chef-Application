import { Stack } from "expo-router";
import Toast from "../components/Toast";

export default function RootLayout() {
  return (
    <>
      <Stack
        initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="splash" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        {/* Home now points to the tab navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="Checkout"
          options={{ headerShown: true, title: "Checkout" }}
        />
      </Stack>
      <Toast />
    </>
  );
}
