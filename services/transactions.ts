/**
 * @deprecated Prefira container.useCases ou useTransactions()
 */
import type { Transaction } from "@/core/domain/entities/Transaction";
import { container } from "@/core/di/container";
import { calculateBalance } from "@/core/domain/services/FinanceCalculator";

export type FirestoreTransaction = Transaction;

export async function addTransaction(
  input: Parameters<
    typeof container.repositories.transactions.create
  >[0],
) {
  return container.repositories.transactions.create(input);
}

export function subscribeToUserTransactions(
  callback: (transactions: Transaction[]) => void,
) {
  const subscription = container.repositories.transactions
    .observeUserTransactions()
    .subscribe({
      next: callback,
      error: () => callback([]),
    });

  return () => subscription.unsubscribe();
}

export async function removeTransaction(transactionId: string) {
  return container.useCases.transactions.delete.execute(transactionId);
}

export async function updateTransaction(
  transactionId: string,
  input: Parameters<
    typeof container.repositories.transactions.update
  >[1],
) {
  return container.repositories.transactions.update(transactionId, input);
}

export { calculateBalance };

export async function attachReceiptToTransaction(
  transactionId: string,
  receipt: Parameters<
    typeof container.repositories.transactions.attachReceipt
  >[1],
) {
  return container.repositories.transactions.attachReceipt(
    transactionId,
    receipt,
  );
}

export async function getTransactionById(transactionId: string) {
  return container.useCases.transactions.getById.execute(transactionId);
}
