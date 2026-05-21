import type { CreateTransactionInput } from "../../entities/Transaction";
import type { TransactionRepository } from "../../repositories/TransactionRepository";

export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(input: CreateTransactionInput): Promise<string> {
    return this.transactionRepository.create(input);
  }
}
