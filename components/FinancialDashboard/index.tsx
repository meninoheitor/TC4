import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";

/*import { Transaction } from "@/types"; */
import { useTransactions } from "@/hooks/useTransactions";
import { calculateBalance } from "@/services/transactions";
import {
  calculateTotalDeposits,
  calculateTotalTransfers,
} from "@/utils/financeUtils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateMini } from "@/utils/formatters";

/* interface FinancialDashboardProps {
  transaction: Transaction[];
}
 */
export const FinancialDashboard: React.FC = () => {
  const { transactions, loading } = useTransactions();
  const [showDonut, setShowDonut] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animValue.setValue(0);

    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [transactions, animValue]);

  const currentBalance = calculateBalance(transactions);
  const totalDeposits = calculateTotalDeposits(transactions);
  const totalTransfers = calculateTotalTransfers(transactions);

  const chartAnalysis = useMemo(() => {
    const dailyData: Record<
      string,
      { date: string; deposito: number; transferencia: number }
    > = {};

    transactions.forEach((t) => {
      const dateKey = t.createdAt.toISOString().slice(0, 10);

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, deposito: 0, transferencia: 0 };
      }
      if (t.type === "deposito") dailyData[dateKey].deposito += t.value;
      else if (t.type === "transferencia")
        dailyData[dateKey].transferencia += t.value;
    });

    const chartData = Object.values(dailyData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const maxDailyValue = Math.max(
      ...chartData.map((d) => Math.max(d.deposito, d.transferencia)),
      1,
    );

    const totalVolume = totalDeposits + totalTransfers;
    const depositPct =
      totalVolume > 0 ? (totalDeposits / totalVolume) * 100 : 0;
    const transferPct =
      totalVolume > 0 ? (totalTransfers / totalVolume) * 100 : 0;

    const MIN_DISPLAY_PCT = 2;
    let displayDepositPct = depositPct;
    let displayTransferPct = transferPct;

    if (depositPct > 0 && depositPct < MIN_DISPLAY_PCT) {
      displayDepositPct = MIN_DISPLAY_PCT;
    }

    if (transferPct > 0 && transferPct < MIN_DISPLAY_PCT) {
      displayTransferPct = MIN_DISPLAY_PCT;
    }

    if (displayDepositPct + displayTransferPct > 100) {
      const scale = 100 / (displayDepositPct + displayTransferPct);
      displayDepositPct *= scale;
      displayTransferPct *= scale;
    }

    return {
      chartData,
      maxDailyValue,
      depositPct,
      transferPct,
      displayDepositPct,
      displayTransferPct,
    };
  }, [transactions, totalDeposits, totalTransfers]);

  const radius = 40;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const depositDash =
    ((chartAnalysis.displayDepositPct ?? chartAnalysis.depositPct) / 100) *
    circumference;
  const transferDash =
    ((chartAnalysis.displayTransferPct ?? chartAnalysis.transferPct) / 100) *
    circumference;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.summaryTitle}>Carregando análise...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.summaryTitle}>Análise Financeira</Text>

      <View style={styles.summaryGrid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Saldo Atual</Text>
          <Text
            style={[
              styles.cardValue,
              currentBalance >= 0 ? styles.neutral : styles.negativeText,
            ]}
          >
            {formatCurrency(currentBalance)}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Entradas</Text>
          <Text style={[styles.cardValue, styles.positiveText]}>
            {formatCurrency(totalDeposits)}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Saídas</Text>
          <Text style={[styles.cardValue, styles.negativeText]}>
            {formatCurrency(totalTransfers)}
          </Text>
        </View>
      </View>

      <View style={styles.chartsGrid}>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Fluxo Diário</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.barChartContainer}
          >
            {chartAnalysis.chartData.length === 0 ? (
              <Text style={styles.noData}>Sem dados</Text>
            ) : (
              chartAnalysis.chartData.map((data) => {
                const depHeight =
                  (data.deposito / chartAnalysis.maxDailyValue) * 100;
                const rawTransHeight =
                  (data.transferencia / chartAnalysis.maxDailyValue) * 100;
                const transHeight =
                  data.transferencia > 0
                    ? Math.max(rawTransHeight, 1) // garante visibilidade mínima
                    : 0;

                return (
                  <View key={data.date} style={styles.barGroup}>
                    <View style={styles.barsWrapper}>
                      <Animated.View
                        style={[
                          styles.bar,
                          styles.barDeposit,
                          {
                            height: animValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0%", `${depHeight}%`],
                            }),
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.bar,
                          styles.barTransfer,
                          {
                            height: animValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0%", `${transHeight}%`],
                            }),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barDate}>
                      {formatDateMini(new Date(data.date))}
                    </Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>

        <View style={[styles.chartCard, { minHeight: 250 }]}>
          <Text style={styles.chartTitle}>Distribuição</Text>
          <View style={styles.donutContainer}>
            {showDonut ? (
              <>
                <View style={styles.svgWrapper}>
                  <Svg width="120" height="120" viewBox="0 0 120 120">
                    <G rotation="-90" origin="60, 60">
                      <Circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      <Circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="#10b981"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${depositDash} ${circumference - depositDash}`}
                        strokeDashoffset={0}
                      />
                      <Circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="#ef4444"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${transferDash} ${circumference - transferDash}`}
                        strokeDashoffset={circumference - depositDash}
                      />
                    </G>
                  </Svg>
                  <View style={styles.donutHoleText}>
                    <Text style={styles.donutLabel}>Entradas</Text>
                    <Text style={styles.donutValue}>
                      {Math.round(chartAnalysis.displayDepositPct)}%
                    </Text>
                  </View>
                </View>
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.dot, { backgroundColor: "#10b981" }]}
                    />
                    <Text style={styles.legendText}>Entradas</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.dot, { backgroundColor: "#ef4444" }]}
                    />
                    <Text style={styles.legendText}>Saídas</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>
                  Informações de distribuição ocultas
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.toggleButton,
                showDonut ? styles.btnActive : styles.btnInactive,
              ]}
              onPress={() => setShowDonut(!showDonut)}
            >
              <Text style={styles.toggleButtonText}>
                {showDonut ? "Ocultar informações" : "Exibir informações"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16 },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  cardValue: { fontSize: 16, fontWeight: "bold" },
  neutral: { color: "#111827" },
  positiveText: { color: "#10b981" },
  negativeText: { color: "#ef4444" },
  chartsGrid: { gap: 16 },
  chartCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#374151",
  },
  barChartContainer: {
    flexDirection: "row",
    height: 150,
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  noData: { color: "#999", alignSelf: "center" },
  barGroup: { alignItems: "center", marginRight: 12, width: 40 },
  barsWrapper: {
    flexDirection: "row",
    height: 120,
    width: 24,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bar: { width: 10, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  barDeposit: { backgroundColor: "#10b981" },
  barTransfer: { backgroundColor: "#ef4444" },
  barDate: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 8,
    position: "absolute",
    bottom: -20,
  },
  donutContainer: { alignItems: "center", justifyContent: "center", flex: 1 },
  svgWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 120,
  },
  donutHoleText: { position: "absolute", alignItems: "center" },
  donutLabel: { fontSize: 10, color: "#6b7280" },
  donutValue: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  legend: { flexDirection: "row", marginTop: 16, gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: "#374151" },
  placeholderContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#9ca3af", fontSize: 12, fontStyle: "italic" },
  toggleButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 1,
  },
  btnInactive: { backgroundColor: "#10b981" },
  btnActive: { backgroundColor: "#6b7280" },
  toggleButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
});

export default FinancialDashboard;
