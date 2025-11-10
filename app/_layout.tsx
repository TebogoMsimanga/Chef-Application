/**
 * Root Layout Component
 * 
 * This is the main entry point of the application. It handles:
 * - Sentry initialization for error tracking
 * - Font loading with proper error handling
 * - Splash screen management
 * - Authentication state checking
 * - Navigation routing based on auth state
 * 
 * @component
 */

import useAuthStore from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";
import {useFonts} from "expo-font";
import {SplashScreen, Stack} from "expo-router";
import {useEffect, useState} from "react";
import {View, ActivityIndicator, StyleSheet} from "react-native";

// Initialize Sentry for error tracking and monitoring
// This should be initialized as early as possible in the app lifecycle
Sentry.init({
  dsn: "https://ab3cb0b3a23d0f3eb013dca85907f4e5@o4510228277624832.ingest.us.sentry.io/4510228291125248",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs for debugging
  enableLogs: true,

  // Configure Session Replay - records user sessions for debugging
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1, // 100% of error sessions

  // Integrations for enhanced error tracking
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // Enable Spotlight in development for better debugging
  // spotlight: __DEV__,
});

console.log("[RootLayout] Sentry initialized successfully");

/**
 * RootLayout Component
 * 
 * Manages the initial app setup including:
 * - Font loading
 * - Authentication state
 * - Splash screen display
 * - Navigation routing
 */
export default Sentry.wrap(function RootLayout() {
  const { isLoading, isAuthenticated, fetchAuthenticatedUser } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
  });

  // Handle font loading errors
  useEffect(() => {
    if (fontError) {
      console.error("[RootLayout] Font loading error:", fontError);
      Sentry.captureException(fontError, {
        tags: { component: "RootLayout", issue: "font_loading" },
      });
      // Don't throw - allow app to continue with system fonts
    }
  }, [fontError]);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      console.log("[RootLayout] Fonts loaded successfully");
      SplashScreen.hideAsync().catch((error) => {
        console.error("[RootLayout] Error hiding splash screen:", error);
        Sentry.captureException(error, {
          tags: { component: "RootLayout", issue: "splash_screen" },
        });
      });
    }
  }, [fontsLoaded]);

  // Fetch authenticated user on app start
  useEffect(() => {
    console.log("[RootLayout] Fetching authenticated user...");
    fetchAuthenticatedUser()
      .then(() => {
        console.log("[RootLayout] User fetch completed");
        setAppReady(true);
      })
      .catch((error) => {
        console.error("[RootLayout] Error fetching user:", error);
        Sentry.captureException(error, {
          tags: { component: "RootLayout", issue: "user_fetch" },
        });
        setAppReady(true); // Continue even if user fetch fails
      });
  }, [fetchAuthenticatedUser]);

  // Show loading screen while fonts are loading or app is initializing
  if (!fontsLoaded || isLoading || !appReady) {
    console.log("[RootLayout] App loading - fonts:", fontsLoaded, "auth:", isLoading, "ready:", appReady);
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FE8C00" />
      </View>
    );
  }

  console.log("[RootLayout] App ready - Authenticated:", isAuthenticated);

  // Route to auth screens if not authenticated, otherwise show main app tabs
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
