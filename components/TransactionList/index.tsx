import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { TransactionsListProps } from "@/types";

import { Transaction } from "@/types";
import { AdjustTypesNames } from "@/utils/adjustTypesName";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { getMonthName } from "@/utils/getMonthName";

const ITEMS_PER_LOAD = 5;

const TransactionsList = ({
  transactions,
  title,
  onEditClick,
  onDeleteClick,
}: TransactionsListProps) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const visibleTransactions = transactions.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [transactions]);

  const loadMore = () => {
    if (visibleCount < transactions.length) {
      setVisibleCount((prev) =>
        Math.min(prev + ITEMS_PER_LOAD, transactions.length),
      );
    }
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
      </View>
    );
  }

  const renderItem = ({
    item: transaction,
  }: ListRenderItemInfo<Transaction>) => {
    const descriptionLabel = transaction.description || "sem descrição";
    const transactionDate = transaction.createdAt;

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionMonth}>
            {/* {getMonthName(transaction.date)} */}
            {getMonthName(transactionDate)}
          </Text>

          <View style={styles.transactionActions}>
            {!!onEditClick && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEditClick(transaction)}
                accessibilityLabel={`Editar transação: ${descriptionLabel}`}
              >
                <Image
                  style={styles.icon}
                  source={require("@/assets/edit.png")}
                />
              </TouchableOpacity>
            )}

            {!!onDeleteClick && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDeleteClick(transaction)}
                accessibilityLabel={`Excluir transação: ${descriptionLabel}`}
              >
                <Image
                  style={styles.icon}
                  source={require("@/assets/delete-icon.png")}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>
            {AdjustTypesNames(transaction.type)}
          </Text>
          <Text style={styles.transactionDate}>
            {/* {formatDate(transaction.date)} */}
            {formatDate(transactionDate)}
          </Text>
        </View>

        <View style={styles.transactionValueAndDesc}>
          <Text style={styles.transactionDesc}>
            {transaction.description || ""}
          </Text>
          <Text style={[
            styles.transactionValue,
            transaction.type === "deposito"
              ? styles.positiveValue
              : styles.negativeValue,
          ]}>
            {transaction.type === "deposito" ? "+" : "-"} {formatCurrency(transaction.value)}
          </Text>
        </View>
        {!!transaction.receipt?.downloadURL && (
          <TouchableOpacity
            style={styles.receiptButton}
            onPress={() => handleOpenReceipt(transaction.receipt?.downloadURL)}
          >
            <Text style={styles.receiptButtonText}>Ver recibo</Text>
          </TouchableOpacity>
        )}

      </View>
    );
  };

  const renderFooter = () => {
    if (visibleCount >= transactions.length) return null;
    return <Text style={styles.loading}>Carregando mais...</Text>;
  };

  async function handleOpenReceipt(url?: string) {
    if (!url) return;

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    }
  }

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {/* <Text style={styles.title}>{title}</Text> */}

      <FlatList
        data={visibleTransactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /* padding: 20,
    width: "100%", */
    backgroundColor: "#F4F6FA",
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionMonth: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0c6779",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  transactionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 14,
    color: "#555",
  },
  transactionDate: {
    fontSize: 14,
    color: "#888",
  },
  transactionValueAndDesc: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionDesc: {
    fontSize: 14,
    flex: 1,
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  loading: {
    textAlign: "center",
    paddingVertical: 16,
    color: "#666",
  },
  positiveValue: {
    color: "#118C4F",
  },
  negativeValue: {
    color: "#C62828",
  },
  receiptButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#EEF3FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  receiptButtonText: {
    color: "#1F3C88",
    fontWeight: "700",
    fontSize: 13,
  },
});

export default TransactionsList;
