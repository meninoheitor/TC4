import { useAuth } from "@/hooks/useAuth";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthRoute =
      segments[0] === "login" || segments[0] === "register";

    if (!user && !inAuthRoute) {
      router.replace("/login");
    } else if (user && inAuthRoute) {
      router.replace("/(tabs)");
    }

    SplashScreen.hideAsync();
  }, [user, loading, segments]);

  if (loading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}