import { useAuth } from "@/hooks/useAuth";
import { AppProviders } from "@/presentation/providers/AppProviders";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
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

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
