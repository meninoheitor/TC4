import type { Transaction } from "@/core/domain/entities/Transaction";
import {
  calculateBalance,
  calculateTotalDeposits,
  calculateTotalTransfers,
} from "@/core/domain/services/FinanceCalculator";

export { calculateBalance, calculateTotalDeposits, calculateTotalTransfers };

export type { Transaction };
