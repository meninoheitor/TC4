import type { ReceiptRepository } from "../../repositories/ReceiptRepository";
import type { TransactionRepository } from "../../repositories/TransactionRepository";

export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly receiptRepository: ReceiptRepository,
  ) {}

  async execute(transactionId: string, receiptStoragePath?: string): Promise<void> {
    if (receiptStoragePath) {
      try {
        await this.receiptRepository.deleteByPath(receiptStoragePath);
      } catch {
        // Falha no storage não impede exclusão do documento
      }
    }

    await this.transactionRepository.remove(transactionId);
  }
}
