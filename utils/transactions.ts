import type { Transaction } from "@/core/domain/entities/Transaction";

export const sortTransactionsByDate = (
  transactions: Transaction[],
): Transaction[] => {
  return [...transactions].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
};
