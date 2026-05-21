import type { UpdateTransactionInput } from "../../entities/Transaction";
import type { TransactionRepository } from "../../repositories/TransactionRepository";

export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(id: string, input: UpdateTransactionInput): Promise<void> {
    return this.transactionRepository.update(id, input);
  }
}
