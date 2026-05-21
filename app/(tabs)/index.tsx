import { Suspense, lazy } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FinancialDashboard = lazy(
  () => import("@/components/FinancialDashboard"),
);

function DashboardFallback() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#1F3C88" />
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Suspense fallback={<DashboardFallback />}>
          <FinancialDashboard />
        </Suspense>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  loader: {
    padding: 40,
    alignItems: "center",
  },
});
