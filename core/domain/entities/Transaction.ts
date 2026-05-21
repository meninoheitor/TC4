export type TransactionType = "deposito" | "transferencia";

export interface TransactionReceipt {
  fileName: string;
  storagePath: string;
  downloadURL: string;
  contentType: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  value: number;
  description: string;
  createdAt: Date;
  receipt?: TransactionReceipt;
}

export interface CreateTransactionInput {
  type: TransactionType;
  value: number;
  description: string;
}

export interface UpdateTransactionInput {
  type: TransactionType;
  value: number;
  description: string;
}

export interface ReceiptMetadata {
  storagePath: string;
  downloadURL: string;
  fileName: string;
  contentType: string;
}
