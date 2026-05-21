import { container } from "@/core/di/container";
import type { Transaction } from "@/core/domain/entities/Transaction";
import {
  calculateBalance,
  calculateTotalDeposits,
  calculateTotalTransfers,
} from "@/core/domain/services/FinanceCalculator";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { catchError, of, shareReplay } from "rxjs";
import { useAuthContext } from "./AuthProvider";

type TransactionsContextValue = {
  transactions: Transaction[];
  balance: number;
  totalDeposits: number;
  totalTransfers: number;
  loading: boolean;
  fromCache: boolean;
  refresh: () => void;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(
  null,
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      setFromCache(false);
      return;
    }

    let active = true;
    setLoading(true);

    container.cache.transactions.load().then((cached) => {
      if (!active || !cached) {
        return;
      }

      setTransactions(cached);
      setFromCache(true);
      setLoading(false);
    });

    const subscription = container.repositories.transactions
      .observeUserTransactions()
      .pipe(
        catchError(() => of([] as Transaction[])),
        shareReplay({ bufferSize: 1, refCount: true }),
      )
      .subscribe({
        next: async (items) => {
          if (!active) {
            return;
          }

          setTransactions(items);
          setFromCache(false);
          setLoading(false);

          if (items.length > 0) {
            await container.cache.transactions.save(items);
          }
        },
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [user?.uid, refreshKey]);

  const value = useMemo(() => {
    const balance = calculateBalance(transactions);
    const totalDeposits = calculateTotalDeposits(transactions);
    const totalTransfers = calculateTotalTransfers(transactions);

    return {
      transactions,
      balance,
      totalDeposits,
      totalTransfers,
      loading,
      fromCache,
      refresh: () => setRefreshKey((prev) => prev + 1),
    };
  }, [transactions, loading, fromCache]);

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext(): TransactionsContextValue {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      "useTransactionsContext deve ser usado dentro de TransactionsProvider",
    );
  }

  return context;
}
