import React from "react";
import { AuthProvider } from "./AuthProvider";
import { TransactionsProvider } from "./TransactionsProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TransactionsProvider>{children}</TransactionsProvider>
    </AuthProvider>
  );
}
