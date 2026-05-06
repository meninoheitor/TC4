import { Transaction } from "@/types";

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "deposito",
    value: 5000,
    date: "2023-10-01",
    description: "Salário",
  },
  {
    id: 2,
    type: "transferencia",
    value: 150,
    date: "2023-10-02",
    description: "Conta de Luz",
  },
  {
    id: 3,
    type: "transferencia",
    value: 80,
    date: "2023-10-02",
    description: "Internet",
  },
  {
    id: 4,
    type: "deposito",
    value: 200,
    date: "2023-10-04",
    description: "Venda freela",
  },
  {
    id: 5,
    type: "transferencia",
    value: 600,
    date: "2023-10-05",
    description: "Aluguel",
  },
  {
    id: 6,
    type: "transferencia",
    value: 120,
    date: "2023-10-07",
    description: "Mercado",
  },
  {
    id: 7,
    type: "deposito",
    value: 1500,
    date: "2023-10-08",
    description: "Bônus",
  },
];
