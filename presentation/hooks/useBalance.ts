import { useTransactionsContext } from "@/presentation/providers/TransactionsProvider";

export function useBalance() {
  const { balance, transactions, loading } = useTransactionsContext();

  return { balance, transactions, loading };
}
