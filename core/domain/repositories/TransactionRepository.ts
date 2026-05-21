import type { Observable } from "rxjs";
import type {
  CreateTransactionInput,
  ReceiptMetadata,
  Transaction,
  UpdateTransactionInput,
} from "../entities/Transaction";

export interface TransactionRepository {
  create(input: CreateTransactionInput): Promise<string>;
  update(id: string, input: UpdateTransactionInput): Promise<void>;
  remove(id: string): Promise<void>;
  getById(id: string): Promise<Transaction>;
  attachReceipt(id: string, receipt: ReceiptMetadata): Promise<void>;
  observeUserTransactions(): Observable<Transaction[]>;
}
