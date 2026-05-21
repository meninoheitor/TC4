import type { CreateTransactionInput } from "../../entities/Transaction";
import type { ReceiptRepository, UploadReceiptInput } from "../../repositories/ReceiptRepository";
import type { TransactionRepository } from "../../repositories/TransactionRepository";

export class CreateTransactionWithReceiptUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly receiptRepository: ReceiptRepository,
  ) {}

  async execute(
    input: CreateTransactionInput,
    receipt?: Omit<UploadReceiptInput, "transactionId">,
  ): Promise<string> {
    const transactionId = await this.transactionRepository.create(input);

    if (receipt) {
      const receiptData = await this.receiptRepository.upload({
        transactionId,
        ...receipt,
      });

      await this.transactionRepository.attachReceipt(transactionId, receiptData);
    }

    return transactionId;
  }
}
