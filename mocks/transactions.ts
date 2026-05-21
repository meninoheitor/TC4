import type { Transaction } from "@/core/domain/entities/Transaction";

/** Dados fictícios apenas para desenvolvimento offline (não usados em produção). */
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "mock-user",
    type: "deposito",
    value: 5000,
    createdAt: new Date("2023-10-01"),
    description: "Salário",
  },
  {
    id: "2",
    userId: "mock-user",
    type: "transferencia",
    value: 150,
    createdAt: new Date("2023-10-02"),
    description: "Conta de Luz",
  },
];
