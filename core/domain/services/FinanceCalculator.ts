import type { Transaction } from "../entities/Transaction";

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "deposito") {
      return total + transaction.value;
    }
    return total - transaction.value;
  }, 0);
}

export function calculateTotalDeposits(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "deposito") {
      return total + transaction.value;
    }
    return total;
  }, 0);
}

export function calculateTotalTransfers(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "transferencia") {
      return total + transaction.value;
    }
    return total;
  }, 0);
}
